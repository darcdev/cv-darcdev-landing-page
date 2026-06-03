import { useState, useEffect } from 'preact/hooks';
import type { FunctionComponent } from 'preact';
import { t } from '../../i18n/translate';

interface Props {
  /** Active locale code. */
  locale: string;
}

const PRESET_KEYS = ['p1', 'p2', 'p3', 'p4'] as const;

const AskAI: FunctionComponent<Props> = ({ locale }) => {
  const [q, setQ] = useState('');
  const [a, setA] = useState('');
  const [src, setSrc] = useState('');

  useEffect(() => {
    setA(t('ask.default.answer', undefined, locale));
    setSrc(t('ask.default.source', undefined, locale));
  }, [locale]);

  const ask = (text: string) => {
    setQ(text);
    setA('…');
    setTimeout(() => {
      const trimmed = text.trim().toLowerCase();
      const matchedKey =
        PRESET_KEYS.find(
          (k) => t(`ask.preset.${k}.q`, undefined, locale).toLowerCase() === trimmed,
        ) ?? PRESET_KEYS[0];
      setA(t(`ask.preset.${matchedKey}.a`, undefined, locale));
      const isRagOrStack = matchedKey === 'p2' || matchedKey === 'p4';
      setSrc(
        t(isRagOrStack ? 'ask.source.rag' : 'ask.source.profile', undefined, locale),
      );
    }, 420);
  };

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
            onInput={(e) => setQ((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && q.trim()) ask(q); }}
          />
          <button
            class="ask-send"
            onClick={() => q.trim() && ask(q)}
          >
            {t('ask.input.send', undefined, locale)}
          </button>
        </div>
        <div class="ask-suggestions">
          {PRESET_KEYS.map((k) => {
            const label = t(`ask.preset.${k}.q`, undefined, locale);
            return (
              <button key={k} class="ask-sug" onClick={() => ask(label)}>{label}</button>
            );
          })}
        </div>
      </div>
      <div class="ask-output">
        <div>{a}</div>
        <div class="src">{src}</div>
      </div>
    </div>
  );
};

export default AskAI;
