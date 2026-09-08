/**
 * POST /api/ask — server-side proxy for the grounded "ask" demo.
 *
 * WHY THIS FILE EXISTS: the AskAI island runs in the browser. Calling Gemini
 * from there would ship GEMINI_API_KEY inside the JS bundle, i.e. publish it.
 * This route is the only place the key is ever read.
 *
 * Requires an SSR-capable route (`prerender = false`) and therefore an Astro
 * adapter. See docs/ask-demo.md for the per-host setup.
 *
 * Contract:
 * Stateless: one question in, one answer out. No session, no history — the
 * quota is tracked server-side per client id, never mirrored to the browser.
 *
 * Contract:
 *   Request  { question: string, locale?: 'es' | 'en' }
 *   200      { ok: true,  answer: string }
 *   4xx/5xx  { ok: false, reason: string }   // caller degrades to presets
 */
import type { APIRoute } from 'astro';
import { askGemini } from '../../lib/ask/gemini';
import { getKnowledgeContext } from '../../lib/ask/knowledge';
import {
  clientIdFrom,
  consume,
  refund,
  MAX_QUESTION_CHARS,
} from '../../lib/ask/budget';
import { isLocaleCode, defaultLocale } from '../../i18n/config';

export const prerender = false;

function json(body: unknown, status: number, extraHeaders: HeadersInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      // Answers are per-visitor and quota-metered — never let a CDN cache them.
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  });
}

// NOTE: `context` is taken whole instead of destructured. `context.clientAddress`
// is a getter that THROWS on adapters that cannot provide it, and destructuring
// would trigger it eagerly here — outside the try/catch in `clientIdFrom`.
export const POST: APIRoute = async (context) => {
  const { request } = context;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, reason: 'bad-request' }, 400);
  }

  const body = (payload ?? {}) as { question?: unknown; locale?: unknown };

  const question = typeof body.question === 'string' ? body.question.trim() : '';
  if (!question) return json({ ok: false, reason: 'bad-request' }, 400);
  if (question.length > MAX_QUESTION_CHARS) {
    return json({ ok: false, reason: 'too-long' }, 413);
  }

  const locale =
    typeof body.locale === 'string' && isLocaleCode(body.locale)
      ? body.locale
      : defaultLocale;

  // Budget is consumed only after validation, so a malformed request never
  // costs a visitor one of their attempts.
  const clientId = clientIdFrom(request.headers, () => context.clientAddress);
  const verdict = consume(clientId);
  if (!verdict.allowed) {
    return json(
      { ok: false, reason: verdict.scope === 'global' ? 'quota' : 'rate-limit' },
      429,
      { 'Retry-After': String(verdict.retryAfterSec) },
    );
  }

  const result = await askGemini(question, locale, getKnowledgeContext(locale));

  if (!result.ok) {
    // Nothing was generated, so the attempt is given back. Otherwise a visitor
    // could spend their whole allowance on our outages and never see the demo.
    refund(clientId);

    /**
     * Everything here is a 5xx: the visitor's request was valid, we failed to
     * answer it. Deliberately NOT 429 — the island reads a 429 as "your
     * allowance is gone" and zeroes the counter, which would be a lie when the
     * cause is Google throttling us for a minute.
     *
     *   no-key       -> deployment mistake; 503 so it shows up in monitoring
     *   rate-limited -> Google's free-tier ceiling; transient, retry later
     *   everything else -> genuine upstream failure
     */
    const status =
      result.reason === 'no-key' || result.reason === 'rate-limited' ? 503 : 502;
    return json({ ok: false, reason: result.reason }, status);
  }

  // `verdict.remaining` is deliberately NOT returned. The browser keeps no
  // counter, so exposing one would just be state nobody owns.
  return json({ ok: true, answer: result.answer }, 200);
};

/** Anything but POST is a mistake; answer explicitly instead of 404-ing. */
export const ALL: APIRoute = () =>
  json({ ok: false, reason: 'method-not-allowed' }, 405, { Allow: 'POST' });
