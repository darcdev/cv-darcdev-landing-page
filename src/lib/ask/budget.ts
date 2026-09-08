/**
 * Quota guard for the "ask" demo.
 *
 * The Gemini free tier is capped per minute and per day. A public endpoint with
 * no ceiling is a self-inflicted outage: one crawler burns the daily quota and
 * the demo is dead for every real visitor afterwards. So we spend the quota
 * deliberately — a few questions per visitor, a hard daily ceiling overall.
 *
 * HONEST LIMITATION: this state lives in module memory. On serverless it is
 * per-instance and resets on cold starts, so concurrent instances each keep
 * their own counters — the effective ceiling is `MAX_GLOBAL_PER_DAY x
 * warm instances`, not a strict global cap. That is a deliberate trade-off:
 * it costs nothing, needs no KV/Redis, and it stops the realistic threat
 * (one client hammering one warm instance). If this ever needs to be a real
 * guarantee, move `globalDay` into durable storage (Vercel KV, Upstash,
 * Cloudflare KV) — the interface below does not have to change.
 */

/** Questions one client may ask per rolling window. Keep it small: the goal is
 *  a taste of the demo, not a free chatbot.
 *
 *  Not exported: the browser deliberately keeps no counter, so this number has
 *  exactly one owner. A mirrored copy in the island could only ever drift and
 *  start promising or denying questions the server disagrees with. */
const MAX_PER_CLIENT = 4;
/** Rolling window for the per-client allowance. */
const CLIENT_WINDOW_MS = 60 * 60 * 1000;
/** Best-effort ceiling on upstream calls per UTC day, well under the free tier. */
const MAX_GLOBAL_PER_DAY = 150;
/** Cap on question length — long prompts cost tokens and are never real questions. */
export const MAX_QUESTION_CHARS = 280;

interface ClientState {
  count: number;
  /** Epoch ms when this client's window resets. */
  resetAt: number;
}

const clients = new Map<string, ClientState>();
let globalDay = { key: '', count: 0 };

/** Stops the Map from growing without bound on a long-lived instance. */
function sweep(now: number): void {
  if (clients.size < 500) return;
  for (const [id, state] of clients) {
    if (state.resetAt <= now) clients.delete(id);
  }
}

function utcDayKey(now: number): string {
  return new Date(now).toISOString().slice(0, 10);
}

export type BudgetVerdict =
  | { allowed: true; remaining: number }
  | { allowed: false; scope: 'client' | 'global'; retryAfterSec: number };

/**
 * Consumes one unit of budget for `clientId`.
 *
 * Call this only right before an upstream request — a rejected or cached
 * question should not cost the visitor an attempt.
 */
export function consume(clientId: string, now: number = Date.now()): BudgetVerdict {
  const dayKey = utcDayKey(now);
  if (globalDay.key !== dayKey) globalDay = { key: dayKey, count: 0 };

  if (globalDay.count >= MAX_GLOBAL_PER_DAY) {
    const midnight = Date.UTC(
      new Date(now).getUTCFullYear(),
      new Date(now).getUTCMonth(),
      new Date(now).getUTCDate() + 1,
    );
    return {
      allowed: false,
      scope: 'global',
      retryAfterSec: Math.max(1, Math.ceil((midnight - now) / 1000)),
    };
  }

  sweep(now);

  const existing = clients.get(clientId);
  const state =
    existing && existing.resetAt > now
      ? existing
      : { count: 0, resetAt: now + CLIENT_WINDOW_MS };

  if (state.count >= MAX_PER_CLIENT) {
    clients.set(clientId, state);
    return {
      allowed: false,
      scope: 'client',
      retryAfterSec: Math.max(1, Math.ceil((state.resetAt - now) / 1000)),
    };
  }

  state.count += 1;
  clients.set(clientId, state);
  globalDay.count += 1;

  return { allowed: true, remaining: MAX_PER_CLIENT - state.count };
}

/**
 * Gives back one unit of budget.
 *
 * Called when the upstream call failed for a reason that is NOT the visitor's
 * fault — Google rate-limiting us, a timeout, a truncated answer. Without this
 * a visitor with 4 attempts could burn all four on our infrastructure problems
 * and never once see the demo work. The daily counter is refunded too, since
 * no useful generation was produced.
 */
export function refund(clientId: string, now: number = Date.now()): void {
  const state = clients.get(clientId);
  if (state && state.resetAt > now && state.count > 0) {
    state.count -= 1;
    clients.set(clientId, state);
  }
  if (globalDay.key === utcDayKey(now) && globalDay.count > 0) {
    globalDay.count -= 1;
  }
}

/**
 * Derives a stable-enough client id. `clientAddress` needs an adapter and
 * throws on some of them, so the proxy headers are the fallback.
 */
export function clientIdFrom(
  headers: Headers,
  clientAddress: () => string | undefined,
): string {
  try {
    const addr = clientAddress();
    if (addr) return addr;
  } catch {
    // Adapter does not expose it — fall through to headers.
  }
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return (
    headers.get('cf-connecting-ip') ??
    headers.get('x-real-ip') ??
    'unknown'
  );
}
