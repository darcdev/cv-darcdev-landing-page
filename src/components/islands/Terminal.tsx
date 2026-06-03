import { useState, useEffect } from 'preact/hooks';
import type { FunctionComponent } from 'preact';
import { t } from '../../i18n/translate';

interface Line {
  prompt?: string;
  cmd?: string;
  /** Translation key for the rendered output. */
  outKey?: string;
}

interface Props {
  /** Active locale code. */
  locale: string;
}

const lines: Line[] = [
  { prompt: '~/portfolio', cmd: 'whoami' },
  { outKey: 'terminal.out.whoami' },
  { prompt: '~/portfolio', cmd: 'cat focus.md' },
  { outKey: 'terminal.out.focus' },
  { prompt: '~/portfolio', cmd: 'ls --recent' },
  { outKey: 'terminal.out.ls' },
  { prompt: '~/portfolio', cmd: 'status' },
  { outKey: 'terminal.out.status' },
];

const Terminal: FunctionComponent<Props> = ({ locale }) => {
  const [shown, setShown] = useState<Line[]>([]);
  const [typing, setTyping] = useState('');
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (stage >= lines.length) return;
    const line = lines[stage];
    if (line.cmd) {
      let i = 0;
      const tick = setInterval(() => {
        i++;
        setTyping(line.cmd!.slice(0, i));
        if (i >= line.cmd!.length) {
          clearInterval(tick);
          setTimeout(() => {
            setShown((s) => [...s, line]);
            setTyping('');
            setStage(stage + 1);
          }, 300);
        }
      }, 48);
      return () => clearInterval(tick);
    } else {
      const timer = setTimeout(() => {
        setShown((s) => [...s, line]);
        setStage(stage + 1);
      }, 360);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const cur = lines[stage];

  return (
    <div class="terminal">
      <div class="terminal-head">
        <div class="lights"><span /><span /><span /></div>
        <div class="path">diego@portfolio — zsh</div>
      </div>
      <div class="terminal-body">
        {shown.map((l, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            {l.cmd && <><span class="prompt">{l.prompt} ➜</span> <span class="cmd">{l.cmd}</span></>}
            {l.outKey && (
              <div
                class="out"
                dangerouslySetInnerHTML={{ __html: t(l.outKey, undefined, locale) }}
              />
            )}
          </div>
        ))}
        {cur && cur.cmd && (
          <div style={{ marginBottom: 6 }}>
            <span class="prompt">{cur.prompt} ➜</span>{' '}
            <span class="cmd terminal-cursor">{typing}</span>
          </div>
        )}
        {stage >= lines.length && (
          <div><span class="prompt">~/portfolio ➜</span> <span class="cmd terminal-cursor"></span></div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
