import { useState, useEffect } from 'preact/hooks';

interface Line {
  prompt?: string;
  cmd?: string;
  out?: preact.JSX.Element;
}

const lines: Line[] = [
  { prompt: "~/portfolio", cmd: "whoami" },
  { out: <><b>Diego Cabrera</b> · Tech Lead · IA Aplicada al Desarrollo</> },
  { prompt: "~/portfolio", cmd: "cat focus.md" },
  { out: <>Construyo agentes <b>RAG</b>, plataformas con <b>MCP</b> y workflows de <b>Spec-Driven Development</b>.</> },
  { prompt: "~/portfolio", cmd: "ls --recent" },
  { out: <>rag-agent/&nbsp;&nbsp;spec-driven/&nbsp;&nbsp;ai-pr-review/&nbsp;&nbsp;trip-planner/</> },
  { prompt: "~/portfolio", cmd: "status" },
  { out: <><b style={{ color: "var(--accent)" }}>● disponible</b> para proyectos Q3/Q4 2026</> },
];

export default function Terminal() {
  const [shown, setShown] = useState<Line[]>([]);
  const [typing, setTyping] = useState("");
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (stage >= lines.length) return;
    const line = lines[stage];
    if (line.cmd) {
      let i = 0;
      const t = setInterval(() => {
        i++;
        setTyping(line.cmd!.slice(0, i));
        if (i >= line.cmd!.length) {
          clearInterval(t);
          setTimeout(() => {
            setShown((s) => [...s, line]);
            setTyping("");
            setStage(stage + 1);
          }, 300);
        }
      }, 48);
      return () => clearInterval(t);
    } else {
      const t = setTimeout(() => {
        setShown((s) => [...s, line]);
        setStage(stage + 1);
      }, 360);
      return () => clearTimeout(t);
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
            {l.out && <div class="out">{l.out}</div>}
          </div>
        ))}
        {cur && cur.cmd && (
          <div style={{ marginBottom: 6 }}>
            <span class="prompt">{cur.prompt} ➜</span>{" "}
            <span class="cmd terminal-cursor">{typing}</span>
          </div>
        )}
        {stage >= lines.length && (
          <div><span class="prompt">~/portfolio ➜</span> <span class="cmd terminal-cursor"></span></div>
        )}
      </div>
    </div>
  );
}
