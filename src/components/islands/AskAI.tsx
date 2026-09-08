import { useState, useEffect, useCallback } from 'preact/hooks';
import type { FunctionComponent } from 'preact';
import { t } from '../../i18n/translate';

interface Props {
  /** Active locale code. */
  locale: string;
}

const PRESET_KEYS = ['p1', 'p2', 'p3', 'p4'] as const;

/** Mirrors MAX_QUESTION_CHARS in src/lib/ask/budget.ts (the server is the authority). */
const MAX_QUESTION_CHARS = 280;

type Status = 'idle' | 'loading' | 'answered';
/** Where the currently displayed answer came from. */
type Origin = 'default' | 'live' | 'preset';

/**
 * Curated answer for a question that exactly matches one of the suggestion
 * chips. Returns `null` when nothing matches — deliberately, because the old
 * behaviour (`?? PRESET_KEYS[0]`) answered "Who is Diego?" to *any* unmatched
 * question, which is worse than admitting we don't know.
 */
function presetAnswerFor(text: string, locale: string): string | null {
  const trimmed = text.trim().toLowerCase();
  const key = PRESET_KEYS.find(
    (k) => t(`ask.preset.${k}.q`, undefined, locale).toLowerCase() === trimmed,
  );
  return key ? t(`ask.preset.${key}.a`, undefined, locale) : null;
}

/**
 * One question in, one answer out.
 *
 * Deliberately STATELESS. There is no conversation history, no browser storage
 * and no client-side quota bookkeeping:
 *
 *   - Each request carries only the current question. The model never sees a
 *     previous turn, so answers cannot drift on accumulated context and one
 *     visitor's question can never leak into another's.
 *   - Nothing is persisted. Reloading the page is a clean slate.
 *   - The quota lives entirely on the server (src/lib/ask/budget.ts). Mirroring
 *     a counter here would only duplicate authority and let the two disagree —
 *     the island just asks, and handles being refused.
 */
const AskAI: FunctionComponent<Props> = ({ locale }) => {
  const [q, setQ] = useState('');
  const [answer, setAnswer] = useState('');
  const [origin, setOrigin] = useState<Origin>('default');
  const [status, setStatus] = useState<Status>('idle');
  const [note, setNote] = useState('');

  useEffect(() => {
    setAnswer(t('ask.default.answer', undefined, locale));
    setOrigin('default');
    setStatus('idle');
    setNote('');
  }, [locale]);

  /**
   * Shows the curated answer (or the intro copy) plus an explanatory note.
   *
   * `reason` is a union rather than a translation key so every `t()` call below
   * stays a literal — scripts/check-i18n.ts scans statically, and a key passed
   * through a variable shows up as a false "orphan".
   */
  const degrade = useCallback(
    (text: string, reason: 'exhausted' | 'busy' | 'error') => {
      const preset = presetAnswerFor(text, locale);
      setAnswer(preset ?? t('ask.default.answer', undefined, locale));
      setOrigin('preset');
      setNote(
        reason === 'exhausted'
          ? t('ask.meta.exhausted', undefined, locale)
          : reason === 'busy'
            ? t('ask.error.busy', undefined, locale)
            : t('ask.fallback.note', undefined, locale),
      );
      setStatus('answered');
    },
    [locale],
  );

  const ask = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || status === 'loading') return;

      setQ(question);
      setNote('');

      if (question.length > MAX_QUESTION_CHARS) {
        setAnswer(t('ask.error.too_long', undefined, locale));
        setOrigin('preset');
        setStatus('answered');
        return;
      }

      setStatus('loading');
      setAnswer(t('ask.state.thinking', undefined, locale));
      setOrigin('default');

      try {
        const res = await fetch('/api/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Only the current question. No history, by design.
          body: JSON.stringify({ question, locale }),
        });
        const data = (await res.json().catch(() => null)) as
          | { ok: true; answer: string }
          | { ok: false; reason: string }
          | null;

        if (res.ok && data && data.ok) {
          setAnswer(data.answer);
          setOrigin('live');
          setStatus('answered');
          return;
        }

        // 429 = the allowance for this visitor (or the day) is spent.
        if (res.status === 429) {
          degrade(question, 'exhausted');
          return;
        }

        if (res.status === 413) {
          setAnswer(t('ask.error.too_long', undefined, locale));
          setOrigin('preset');
          setStatus('answered');
          return;
        }

        // 503 = the server already refunded this attempt (Google throttled us,
        // or the key is missing). Transient — say so and invite a retry.
        if (res.status === 503) {
          degrade(question, 'busy');
          return;
        }

        // Upstream error, timeout, safety block, truncated answer — the visitor
        // does not need the taxonomy, just a useful answer.
        degrade(question, 'error');
      } catch {
        // Offline or the request never left the browser.
        degrade(question, 'error');
      }
    },
    [degrade, locale, status],
  );

  const busy = status === 'loading';
  // Literal keys on purpose — see the note on `degrade`.
  const source =
    origin === 'live'
      ? t('ask.source.live', undefined, locale)
      : origin === 'preset'
        ? t('ask.source.fallback', undefined, locale)
        : t('ask.default.source', undefined, locale);

  return (
    <div class="ask">
      <div>
        <div class="ask-eyebrow">{t('ask.box.eyebrow', undefined, locale)}</div>
        <h2>
          <span dangerouslySetInnerHTML={{ __html: t('ask.box.title', undefined, locale) }} />
        </h2>
        <p>{t('ask.box.lede', undefined, locale)}</p>
        <div class="ask-input-row">
          <input
            class="ask-input"
            placeholder={t('ask.input.placeholder', undefined, locale)}
            value={q}
            maxLength={MAX_QUESTION_CHARS}
            disabled={busy}
            onInput={(e) => setQ((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && q.trim()) ask(q); }}
          />
          <button
            class="ask-send"
            disabled={busy || !q.trim()}
            onClick={() => ask(q)}
          >
            {t('ask.input.send', undefined, locale)}
          </button>
        </div>
        <div class="ask-suggestions">
          {PRESET_KEYS.map((k) => {
            const label = t(`ask.preset.${k}.q`, undefined, locale);
            return (
              <button key={k} class="ask-sug" disabled={busy} onClick={() => ask(label)}>
                {label}
              </button>
            );
          })}
        </div>
      </div>
      <div class="ask-output">
        <div class={busy ? 'ask-answer is-thinking' : 'ask-answer'} aria-live="polite" aria-busy={busy}>
          {answer}
        </div>
        {note && <div class="ask-note">{note}</div>}
        <div class="src">{source}</div>
      </div>
    </div>
  );
};

export default AskAI;
