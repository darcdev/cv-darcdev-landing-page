# Ask demo — grounded Gemini Q&A

The "Demo en vivo" section (`AskSection` → `AskAI` island) answers visitor
questions about Diego using Gemini, restricted to the site's own typed data.

## Architecture: the key is public, on purpose

`AskAI.tsx` runs in the browser and calls Gemini **directly**. There is no
server route. `PUBLIC_GEMINI_API_KEY` is inlined into the JS bundle by Astro,
so anyone can read it in devtools.

This is an informed trade-off, and it is only defensible while **both** of these
hold:

1. **The key is free-tier with NO billing account linked.** Verified against
   Google's own docs: the free tier has no spend-based limits, and reaching a
   paid tier requires explicitly linking an active billing account. Worst case
   is `429 RESOURCE_EXHAUSTED` and the demo falling back to curated presets.
   **It cannot produce a bill.**
2. **The key is restricted in Google Cloud to the Generative Language API.**
   A Google API key is a *project* credential — unrestricted, it reaches every
   API enabled on that project, not just Gemini. Console → APIs & Services →
   Credentials → the key → API restrictions → Generative Language API.

**What it does cost**, accepted knowingly:

- Anyone can spend the daily quota. When they do, real visitors see presets
  until Google's window resets.
- The grounding corpus and system instruction ship to the browser. They were
  already public (the corpus renders on the page) but a visitor can now bypass
  them and call the model unconstrained with this key.
- The quota guard stopped being enforceable — see "Quota design".

**If billing is ever enabled on that Cloud project, revert this the same day:**
move the call back behind a server route reading a non-`PUBLIC_` key. Rotate the
key at <https://aistudio.google.com/apikey> if it is ever misused.

HTTP-referrer restrictions are **not** a mitigation. `Referer` is client-sent
and forgeable with one `curl` flag. Friction, not security.

## Pieces

| File | Job |
|------|-----|
| `src/lib/ask/knowledge.ts` | Serializes profile / experience / skills / projects into the grounding corpus. Locale-aware, memoized, token-capped. **Ships to the browser.** |
| `src/lib/ask/gemini.ts` | One `fetch` against the Gemini REST API. No SDK. Never throws — returns typed failures. Runs client-side. |
| `src/lib/ask/budget.ts` | localStorage courtesy throttle. Not a control. |
| `src/components/islands/AskAI.tsx` | UI. Degrades to curated preset answers on any failure. |

## Quota design

The free tier is tight, and it is Google's ceiling that bites first — not ours.

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
  rather than a daily cap.

  We deliberately do **not** retry a 429, even though Google says when to. Making
  one visitor wait 10+ seconds is worse than handing them the curated answer
  instantly. Degradation wins.

**The knobs:**

- **4 questions per browser per hour** (`MAX_PER_CLIENT`).
- **150 calls per browser per UTC day** (`MAX_GLOBAL_PER_DAY`).
- **Failed attempts are refunded** (`refund()`). If Google throttles us or the
  call times out, the visitor did nothing wrong. `blocked` is *not* refunded —
  a safety block is a response to what was actually asked.
- **Truncated answers are rejected.** `finishReason: MAX_TOKENS` degrades
  instead of rendering a half-sentence as if it were real.
- **Graceful degradation** — on any failure the island falls back to the curated
  `ask.preset.*` answers and says so. The demo never renders broken.

### Known limitation — read this before trusting the numbers above

The guard runs in the visitor's own browser against their own `localStorage`.
**It is a courtesy throttle, not a security control.** Devtools, a private
window, or simply calling the Gemini endpoint with the key from the bundle all
bypass it.

It is still worth having, because it stops the realistic case rather than the
adversarial one: an interested visitor clicking every suggestion chip, a
double-submit, a reload loop. That is what actually burns a quota day to day.

Two things were lost by moving off the server:

- **No real global ceiling.** `MAX_GLOBAL_PER_DAY` is per-*browser* now, so the
  true site-wide ceiling is Google's free-tier limit.
- **No IP-derived identity.** There are no request headers client-side; the
  "client" is whatever `localStorage` this browser has.

`localStorage` access is wrapped in try/catch because it **throws**, not returns
null, in Safari private mode and in browsers configured to block site data. Every
failure degrades to "no history kept", i.e. unthrottled for that visitor.

To make the quota a real guarantee, the call has to go back behind a server route
with durable storage (Vercel KV, Upstash). The `consume()` interface would not
have to change.

## Grounding

There is no vector store. The corpus is small enough to fit in one prompt, so
"retrieval" is a deterministic serialization of the same typed data that renders
the page. Every answer really is grounded in `getKnowledgeContext()` output.

The system instruction forbids inventing employers, dates, metrics or clients,
and requires the model to say when something is outside the corpus. It also
ignores instructions embedded in the visitor's question (prompt injection).
**Note that a client-side caller can strip the system instruction entirely** —
it constrains the demo's own UI, not the key.

The phone number is deliberately excluded from the corpus. It renders in the
contact section for humans; there is no reason to make it scrapable through the
demo.

Because the corpus is now in the JS bundle, the token-budget caps
(`MAX_HIGHLIGHTS_PER_ROLE`, `MAX_DETAILED_PROJECTS`) double as bundle-size caps.
Keep them.

## Setup

### 1. Get a key

<https://aistudio.google.com/apikey> → copy into `.env` as
`PUBLIC_GEMINI_API_KEY` (see `.env.example`).

### 2. Restrict the key — do not skip this

Console → APIs & Services → Credentials → the key → **API restrictions** →
Restrict key → **Generative Language API**. The key is public; this is what
bounds the blast radius to the one API that is meant to be reachable.

### 3. Hosting — nothing to configure

The site is `output: 'static'` with `@astrojs/vercel/static`. Every page is
pre-rendered; there are no serverless functions. Any static host works —
Vercel, Netlify, Cloudflare Pages, GitHub Pages.

`@astrojs/vercel` stays pinned to 7.x (v8+ requires Astro 5), but only the
`/static` entrypoint is used. See gotcha 7 for why that matters.

### 4. Set the env var on the host

`PUBLIC_GEMINI_API_KEY` in the project's environment settings. It is read at
**build** time, not runtime, so a value added after a build needs a redeploy to
take effect.

### 5. Verify

There is no endpoint to curl any more. Open the site, ask a question, and watch
the Network tab: you should see one `POST` straight to
`generativelanguage.googleapis.com`. On failure, `[ask]` lines in the console
name the real upstream status.

## Tuning

| Knob | File | Default |
|------|------|---------|
| Output cap (thinking + answer) | `MAX_OUTPUT_TOKENS` in `gemini.ts` | 1200 |
| Model | `PUBLIC_GEMINI_MODEL` env / `DEFAULT_MODEL` | `gemini-3.6-flash` |
| API version | `API_VERSION` in `gemini.ts` | `v1` (NOT `v1beta`) |
| Upstream timeout | `TIMEOUT_MS` in `gemini.ts` | 20s |
| Questions per browser | `MAX_PER_CLIENT` in `budget.ts` | 4 |
| Client window | `CLIENT_WINDOW_MS` in `budget.ts` | 1 hour |
| Daily ceiling | `MAX_GLOBAL_PER_DAY` in `budget.ts` | 150 |
| Question length | `MAX_QUESTION_CHARS` in `budget.ts` | 280 |

`MAX_QUESTION_CHARS` is imported by `AskAI.tsx` rather than mirrored, so the
input's `maxLength` and the guard cannot drift.

## Stateless by design

Each question is independent, as far as the model is concerned:

- **No conversation history.** `contents` is a single user turn. The model never
  sees a previous exchange, so answers cannot drift on accumulated context.
- **The corpus is fixed.** `getKnowledgeContext(locale)` serializes the same
  typed data every call and never grows per visitor.

The one thing now persisted is the quota counter, in `localStorage`, because it
has nowhere else to live. That is a change from the original design, which kept
zero browser state.

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
5. **Log the upstream response body.** Collapsing everything into an opaque
   failure is right for the visitor and useless for you. One `console.error` of
   the real status and body turned a blind guess into a one-line fix, twice.
6. **`import.meta.env` must be read as a literal member access** in client code.
   Vite only substitutes the exact expression it can see at build time, so the
   old dynamic `import.meta.env[name]` helper is not safe in a browser bundle —
   and `process.env` does not exist there at all. Hence the module-level
   `const API_KEY = import.meta.env.PUBLIC_GEMINI_API_KEY`.
7. **`@astrojs/vercel@7`'s serverless adapter picks the Node runtime from a
   hardcoded table.** `SUPPORTED_NODE_VERSIONS` in
   `dist/serverless/adapter.js` knows only 18 and 20; anything else falls
   through to `return 'nodejs18.x'`. Vercel builds on Node 24 and **no longer
   offers 18.x at all** (available: 24.x default, 22.x, 20.x), so the build
   printed `Complete!` and the *deploy* failed at "Deploying outputs…" — a
   warning in the log, not an error, which is what made it hard to read.
   `output: 'static'` sidesteps it entirely: the static adapter never touches
   Node runtimes. Pinning `engines.node` to `20.x` also works but expires —
   Vercel deprecates Node 20 on 2026-10-01.
8. **Vercel ignores `.nvmrc`.** The Node version comes from Project Settings or
   `engines.node` in `package.json`. `.nvmrc` is for nvm and Netlify.
