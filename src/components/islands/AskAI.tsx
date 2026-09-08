import { useState, useEffect, useCallback } from 'preact/hooks';
import type { FunctionComponent } from 'preact';
import { t } from '../../i18n/translate';
import { askGemini, type AskFailure } from '../../lib/ask/gemini';
import { getKnowledgeContext } from '../../lib/ask/knowledge';
import { consume, refund, MAX_QUESTION_CHARS } from '../../lib/ask/budget';

interface Props {
  /** Active locale code. */
  locale: string;
}

const PRESET_KEYS = ['p1', 'p2', 'p3', 'p4'] as const;

/**
 * Upstream failures that are OUR problem, not the visitor's, so the attempt is
 * given back. `blocked` is excluded on purpose: a safety block is a response to
 * what was actually asked, and refunding it would make the block free to retry.
 */
const REFUNDABLE: ReadonlySet<AskFailure> = new Set<AskFailure>([
  'no-key',
  'timeout',
  'upstream',
  'rate-limited',
  'truncated',
  'empty',
]);

/** Transient failures worth inviting a retry for, rather than a flat error. */
const TRANSIENT: ReadonlySet<AskFailure> = new Set<AskFailure>([
  'no-key',
  'timeout',
  'rate-limited',
]);

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
 * Calls Gemini DIRECTLY from the browser. There is no server route any more —
 * see the header of src/lib/ask/gemini.ts for why the API key is public and
 * what that does and does not cost.
 *
 * Still stateless as far as the MODEL is concerned:
 *   - Each call carries only the current question. The model never sees a
 *     previous turn, so answers cannot drift on accumulated context.
 *   - No conversation history is kept or persisted.
 *
 * The one thing that IS persisted is the quota counter, and only because it has
 * nowhere else to live now: src/lib/ask/budget.ts keeps it in localStorage. It
 * is a courtesy throttle against reload loops and chip-mashing, NOT a control —
 * it is trivially bypassable and the module says so.
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

      // Budget is spent only after validation, so a malformed or over-long
      // question never costs the visitor one of their attempts.
      const verdict = consume();
      if (!verdict.allowed) {
        degrade(question, 'exhausted');
        return;
      }

      setStatus('loading');
      setAnswer(t('ask.state.thinking', undefined, locale));
      setOrigin('default');

      // `askGemini` never throws — every failure path comes back as a typed
      // reason — but the corpus build and the budget write are ordinary code,
      // so the whole thing still degrades rather than blanking the island.
      try {
        const result = await askGemini(question, locale, getKnowledgeContext(locale));

        if (result.ok) {
          setAnswer(result.answer);
          setOrigin('live');
          setStatus('answered');
          return;
        }

        if (REFUNDABLE.has(result.reason)) refund();

        // The visitor does not need the taxonomy, just a useful answer: a
        // transient failure invites a retry, anything else reads as an error.
        degrade(question, TRANSIENT.has(result.reason) ? 'busy' : 'error');
      } catch {
        // Offline, or something in the call path threw unexpectedly.
        refund();
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
