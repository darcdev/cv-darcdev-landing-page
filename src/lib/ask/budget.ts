/**
 * Quota guard for the "ask" demo — CLIENT SIDE.
 *
 * READ THIS BEFORE TRUSTING IT: this is a courtesy throttle, not a security
 * control. It runs in the visitor's own browser against their own localStorage,
 * so anyone who wants to bypass it can — devtools, a private window, or just
 * calling the Gemini endpoint directly with the key from the bundle.
 *
 * It is still worth having, because it stops the realistic case rather than the
 * adversarial one: an interested visitor clicking every suggestion chip, a
 * double-submit, a reload loop. That is what actually burns a free-tier quota
 * day to day.
 *
 * What was lost by moving off the server (deliberately, see gemini.ts header):
 *   - a real global ceiling. `MAX_GLOBAL_PER_DAY` is now per-BROWSER, not per
 *     site, so the true upstream ceiling is Google's own free-tier limit.
 *   - IP-derived identity. There are no request headers here; the "client" is
 *     whatever localStorage this browser has.
 *
 * If the demo ever needs a guarantee instead of a courtesy, the call has to go
 * back behind a server route with durable storage (Vercel KV, Upstash). The
 * interface below would not have to change.
 */

/** Questions one browser may ask per rolling window. Keep it small: the goal is
 *  a taste of the demo, not a free chatbot. */
const MAX_PER_CLIENT = 4;
/** Rolling window for the per-browser allowance. */
const CLIENT_WINDOW_MS = 60 * 60 * 1000;
/** Best-effort per-browser ceiling per UTC day. */
const MAX_GLOBAL_PER_DAY = 150;
/** Cap on question length — long prompts cost tokens and are never real questions. */
export const MAX_QUESTION_CHARS = 280;

const STORAGE_KEY = 'ask.budget.v1';

interface Stored {
  /** Attempts used in the current rolling window. */
  count: number;
  /** Epoch ms when the rolling window resets. */
  resetAt: number;
  /** UTC day key the daily counter belongs to. */
  dayKey: string;
  /** Attempts used today. */
  dayCount: number;
}

const empty = (now: number): Stored => ({
  count: 0,
  resetAt: now + CLIENT_WINDOW_MS,
  dayKey: utcDayKey(now),
  dayCount: 0,
});

function utcDayKey(now: number): string {
  return new Date(now).toISOString().slice(0, 10);
}

/**
 * localStorage access is wrapped because it THROWS, not returns null, in a few
 * real situations: Safari private mode with storage disabled, and any browser
 * configured to block site data. A demo must not crash because a visitor
 * hardened their browser — every failure here degrades to "no history kept",
 * which just means the throttle is not enforced for them.
 */
function load(now: number): Stored {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty(now);
    const parsed = JSON.parse(raw) as Partial<Stored>;
    const state: Stored = {
      count: typeof parsed.count === 'number' ? parsed.count : 0,
      resetAt: typeof parsed.resetAt === 'number' ? parsed.resetAt : now + CLIENT_WINDOW_MS,
      dayKey: typeof parsed.dayKey === 'string' ? parsed.dayKey : utcDayKey(now),
      dayCount: typeof parsed.dayCount === 'number' ? parsed.dayCount : 0,
    };
    // Expire the rolling window and the day independently — a stale window must
    // not also wipe today's count, and a new day must not grant a fresh window.
    if (state.resetAt <= now) {
      state.count = 0;
      state.resetAt = now + CLIENT_WINDOW_MS;
    }
    if (state.dayKey !== utcDayKey(now)) {
      state.dayKey = utcDayKey(now);
      state.dayCount = 0;
    }
    return state;
  } catch {
    return empty(now);
  }
}

function save(state: Stored): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable or full — the throttle simply does not persist.
  }
}

export type BudgetVerdict =
  | { allowed: true; remaining: number }
  | { allowed: false; scope: 'client' | 'global'; retryAfterSec: number };

/**
 * Consumes one unit of budget for this browser.
 *
 * Call this only right before an upstream request — a rejected or preset-matched
 * question should not cost the visitor an attempt.
 */
export function consume(now: number = Date.now()): BudgetVerdict {
  const state = load(now);

  if (state.dayCount >= MAX_GLOBAL_PER_DAY) {
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

  if (state.count >= MAX_PER_CLIENT) {
    save(state);
    return {
      allowed: false,
      scope: 'client',
      retryAfterSec: Math.max(1, Math.ceil((state.resetAt - now) / 1000)),
    };
  }

  state.count += 1;
  state.dayCount += 1;
  save(state);

  return { allowed: true, remaining: MAX_PER_CLIENT - state.count };
}

/**
 * Gives back one unit of budget.
 *
 * Called when the upstream call failed for a reason that is NOT the visitor's
 * fault — Google rate-limiting us, a timeout, a truncated answer. Without this
 * a visitor with 4 attempts could burn all four on our problems and never once
 * see the demo work.
 */
export function refund(now: number = Date.now()): void {
  const state = load(now);
  if (state.count > 0) state.count -= 1;
  if (state.dayCount > 0) state.dayCount -= 1;
  save(state);
}
