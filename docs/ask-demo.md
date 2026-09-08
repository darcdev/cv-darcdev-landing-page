# Ask demo — grounded Gemini Q&A

The "Demo en vivo" section (`AskSection` → `AskAI` island) answers visitor
questions about Diego using Gemini, restricted to the site's own typed data.

## Why there is a server route

`AskAI.tsx` runs in the browser. Calling Gemini from there would ship
`GEMINI_API_KEY` inside the JS bundle — i.e. publish it. `src/pages/api/ask.ts`
is the only place the key is ever read.

**A client-side API key is not an option.** Not "for now", not "it's only a
demo", not "it's the free tier".

## Pieces

| File | Job |
|------|-----|
| `src/lib/ask/knowledge.ts` | Serializes profile / experience / skills / projects into the grounding corpus. Locale-aware, memoized, token-capped. |
| `src/lib/ask/gemini.ts` | One `fetch` against the Gemini REST API. No SDK, so it runs on Node **and** Workers. Never throws — returns typed failures. |
| `src/lib/ask/budget.ts` | Per-client and per-day quota guard. |
| `src/pages/api/ask.ts` | `POST /api/ask`. Validates, spends budget, calls Gemini. |
| `src/components/islands/AskAI.tsx` | UI. Degrades to curated preset answers on any failure. |

## Quota design

The free tier is tight, and it is Google's ceiling that bites first — not ours.
An unmetered public endpoint is a self-inflicted outage: one crawler burns the
quota and the demo is dead for every real visitor. So the spend is deliberate.

**Measured against a real key (2026-09), not assumed:**

- Latency is ~3-5s typical, with occasional spikes past 20s.
- Gemini 3.x flash **always reasons and it cannot be turned off.**
  `thinkingBudget: 0` is rejected (400 INVALID_ARGUMENT), `thinkingLevel` does
  not exist on `v1`, and a positive `thinkingBudget` is treated as a hint the
  model ignores — asking for 128 produced 409 thought tokens.
- Thinking tokens are billed against `maxOutputTokens`, the same cap as the
  answer. This is the trap: at `maxOutputTokens: 220` thinking ate 208 and the
  answer got 8 tokens, returning the fragment `"Como Tech Lead en SASOFTCO"`
  with `finishReason: MAX_TOKENS`. Hence `MAX_OUTPUT_TOKENS = 1200`. **Answer
  length is controlled by the 3-sentence rule in the system instruction, never
  by this cap.**
- **The free-tier ceiling is 20 requests per minute**, measured, not assumed.
  Exceeding it returns `429 RESOURCE_EXHAUSTED`:

  ```
  Quota exceeded for metric:
    generativelanguage.googleapis.com/generate_content_free_tier_requests,
    limit: 20, model: gemini-3.6-flash
  Please retry in 9.702095259s.
  ```

  The "retry in ~10s" is what identifies it as a per-minute rolling window
  rather than a daily cap. 20 RPM is comfortable for a portfolio: it takes real
  concurrent traffic to reach it.

  We deliberately do **not** retry a 429, even though Google says when to. Making
  one visitor wait 10+ seconds is worse than handing them the curated answer
  instantly, and it would queue everyone behind them. Degradation wins.

**The knobs:**

- **4 questions per client per hour** (`MAX_PER_CLIENT`), owned by the server
  alone. The browser keeps no counter — see "Stateless by design" below.
- **150 upstream calls per UTC day** (`MAX_GLOBAL_PER_DAY`) as a courtesy guard.
  Google's own quota may well trip first; that path is handled, not prevented.
- **Failed attempts are refunded** (`refund()`). If Google throttles us or the
  call times out, the visitor did nothing wrong — charging them an attempt
  would let them burn a whole allowance on our outages without once seeing the
  demo work. The route answers `503`, the island says so and keeps the counter.
- **Truncated answers are rejected.** `finishReason: MAX_TOKENS` degrades
  instead of rendering a half-sentence as if it were real.
- **Graceful degradation** — on any failure the island falls back to the curated
  `ask.preset.*` answers and says so. The demo never renders broken.

### Known limitation

Budget state lives in module memory. On serverless it is per-instance and resets
on cold starts, so concurrent instances each keep their own counters — the
effective ceiling is `MAX_GLOBAL_PER_DAY × warm instances`, not a strict global
cap. That is a deliberate trade-off: zero infrastructure, and it stops the
realistic threat (one client hammering one warm instance).

To make it a real guarantee, move `globalDay` into durable storage (Vercel KV,
Upstash, Cloudflare KV). The `consume()` interface does not have to change.

## Grounding

There is no vector store. The corpus is small enough to fit in one prompt, so
"retrieval" is a deterministic serialization of the same typed data that renders
the page. Every answer really is grounded in `getKnowledgeContext()` output.

The system instruction forbids inventing employers, dates, metrics or clients,
and requires the model to say when something is outside the corpus. It also
ignores instructions embedded in the visitor's question (prompt injection).

The phone number is deliberately excluded from the corpus. It renders in the
contact section for humans; there is no reason to make it scrapable through the
demo.

## Setup

### 1. Get a key

<https://aistudio.google.com/apikey> → copy into `.env` (see `.env.example`).

### 2. Adapter — ALREADY DONE (Vercel)

`prerender = false` needs SSR, which needs an adapter. This is configured:

- `@astrojs/vercel@7.8.2` — pinned to 7.x on purpose. v8+ requires Astro 5.
- `output: 'hybrid'` in `astro.config.mjs` — every page is still pre-rendered to
  static HTML; only routes that explicitly `export const prerender = false`
  become functions. Today that is `src/pages/api/ask.ts` and nothing else, so
  the site is exactly as fast as it was under `output: 'static'`.

Vercel auto-detects Astro and reads the adapter's output. No `vercel.json`
needed.

<details>
<summary>Other hosts, for reference</summary>

**Netlify** — `npx astro add netlify`, then `output: 'hybrid'`, `adapter: netlify()`.

**Cloudflare Pages** — `npx astro add cloudflare`, then `output: 'hybrid'`,
`adapter: cloudflare()`. Workers have no `process`, and secrets arrive via
`context.locals.runtime.env`. `readEnv()` in `gemini.ts` feature-detects
`process`, but on Cloudflare you may need to pass the runtime env through —
check `context.locals.runtime.env.GEMINI_API_KEY` if the route reports `no-key`.

**GitHub Pages / any pure-static host** — not possible. Static hosts do not
execute server code. Deploy the endpoint separately as a Cloudflare Worker and
point the island's `fetch` at that URL instead of `/api/ask` — you will also
need CORS restricted to your origin.

</details>

### 3. Set the env var on the host

`GEMINI_API_KEY` in the project's environment settings. Redeploy.

### 4. Verify

```sh
curl -s -X POST http://localhost:4321/api/ask \
  -H 'Content-Type: application/json' \
  -d '{"question":"¿Qué stack de IA maneja?","locale":"es"}' | jq
```

Expected: `{ "ok": true, "answer": "..." }`.

Without an adapter you get a 404 — that means step 2 was skipped.

## Tuning

| Knob | File | Default |
|------|------|---------|
| Output cap (thinking + answer) | `MAX_OUTPUT_TOKENS` in `gemini.ts` | 1200 |
| Model | `GEMINI_MODEL` env / `DEFAULT_MODEL` | `gemini-3.6-flash` |
| API version | `API_VERSION` in `gemini.ts` | `v1` (NOT `v1beta`) |
| Upstream timeout | `TIMEOUT_MS` in `gemini.ts` | 20s |
| Questions per client | `MAX_PER_CLIENT` in `budget.ts` | 4 |
| Client window | `CLIENT_WINDOW_MS` in `budget.ts` | 1 hour |
| Daily ceiling | `MAX_GLOBAL_PER_DAY` in `budget.ts` | 150 |
| Question length | `MAX_QUESTION_CHARS` in `budget.ts` | 280 |

`MAX_QUESTION_CHARS` is mirrored in `AskAI.tsx` for the input's `maxLength`
attribute. That is a UI affordance, not a second authority — the server
re-validates and answers 413 regardless. `MAX_PER_CLIENT` is NOT mirrored.

## Stateless by design

Each question is completely independent. This is a constraint, not an accident:

- **No conversation history.** The request body carries only the current
  question, and `contents` is a single user turn. The model never sees a
  previous exchange, so answers cannot drift on accumulated context.
- **No browser storage.** No `sessionStorage`, no `localStorage`, no cookies.
  Reloading the page is a clean slate.
- **No client-side quota counter.** The allowance has one owner: the server.
  A mirrored counter in the island could only drift out of sync and start
  promising or refusing questions the server disagrees with. The island simply
  asks, and handles being refused (429 -> spent, 503 -> transient, retry).
- **The 200 response returns only the answer.** No `remaining`, no session id,
  nothing for the browser to keep.

The corpus itself is fixed too — `getKnowledgeContext(locale)` serializes the
same typed data on every call and never grows per visitor.

## Gotchas paid for in blood

Recorded because each one cost a debugging session, and each is invisible until
it bites:

1. **`gemini-2.5-*` is dead for new keys.** It still appears in `ListModels`,
   then `generateContent` answers
   `404 "no longer available to new users"`. Listing a model is not proof you
   can call it.
2. **Use `v1`, not `v1beta`.** The gemini-3.x models 404 or throw transient
   503s on `v1beta`.
3. **`maxOutputTokens` is shared with thinking**, and a too-low value returns a
   truncated fragment with `finishReason: MAX_TOKENS` — which a naive
   "is the string non-empty?" check happily serves as a real answer.
4. **Filter parts with `thought: true`** before concatenating `part.text`, or
   the model's internal deliberation can leak into the UI.
5. **Log the upstream response body.** Collapsing everything into an opaque 502
   is right for the visitor and useless for you; a bare `[502] POST /api/ask`
   in the dev log names no cause. One `console.error` of the real status and
   body turned a blind guess into a one-line fix, twice.
6. **`context.clientAddress` is a getter that throws** on adapters that cannot
   provide it. Destructuring it in the route signature invokes it eagerly,
   outside any try/catch.
