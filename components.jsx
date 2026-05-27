// Shared components
const { useState, useEffect, useRef, useMemo } = React;

// === Dot grid background with mouse glow ===
function DotGridBg() {
  const glowRef = useRef(null);
  const cursorRef = useRef(null);
  useEffect(() => {
    const glow = glowRef.current;
    const cursor = cursorRef.current;
    if (!glow || !cursor) return;
    let raf;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 3;
    let x = tx, y = ty;
    let cx = tx, cy = ty;
    const onMove = (e) => { tx = e.clientX; ty = e.clientY; };
    const tick = () => {
      x += (tx - x) * 0.07;
      y += (ty - y) * 0.07;
      cx += (tx - cx) * 0.3;
      cy += (ty - cy) * 0.3;
      glow.style.left = x + "px";
      glow.style.top = y + "px";
      cursor.style.left = cx + "px";
      cursor.style.top = cy + "px";
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);
  return (
    <>
      <div className="dot-grid" />
      <div className="dot-cursor" ref={cursorRef} />
      <div className="dot-glow" ref={glowRef} />
    </>
  );
}

// === Icons ===
const Icon = {
  github: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 .5C5.4.5.2 5.8.2 12.3c0 5.2 3.4 9.6 8 11.1.6.1.8-.2.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.4 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.9 7.9-11.1C23.8 5.8 18.6.5 12 .5z"/>
    </svg>
  ),
  linkedin: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M20.45 20.45h-3.55v-5.56c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zm1.77 13.02H3.56V9H7.1v11.45zM22.22 0H1.77C.79 0 0 .78 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .78 23.2 0 22.22 0z"/>
    </svg>
  ),
  download: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  arrow: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14M13 5l7 7-7 7"/>
    </svg>
  ),
  sun: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
  ),
  moon: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  search: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
    </svg>
  ),
};

// === Top Nav — sections + theme + language ===
function Nav({ active, scrollTo, theme, setTheme, lang, setLang, onHome }) {
  const L = lang === "en"
    ? { home: "Home", about: "About", projects: "Projects", blog: "Blog", contact: "Contact",
        themeAria: "Toggle theme", langAria: "Select language" }
    : { home: "Inicio", about: "Sobre mí", projects: "Proyectos", blog: "Blog", contact: "Contacto",
        themeAria: "Cambiar tema", langAria: "Seleccionar idioma" };
  const items = [
    { id: "home", label: L.home },
    { id: "about", label: L.about },
    { id: "projects", label: L.projects },
    { id: "blog", label: L.blog },
    { id: "contact", label: L.contact },
  ];

  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const LANGS = [
    { code: "es", name: "Español", Flag: FlagES },
    { code: "en", name: "English", Flag: FlagEN },
  ];
  const current = LANGS.find((l) => l.code === lang) || LANGS[0];

  return (
    <nav className="nav">
      <div className="nav-inner">
        <a className="nav-logo" href="#home" onClick={(e) => { e.preventDefault(); onHome ? onHome() : scrollTo("home"); }}>
          <span className="dot"></span>
          <span>diego.cabrera</span>
        </a>
        {items.map((it) => (
          <button
            key={it.id}
            className={"nav-link" + (active === it.id ? " active" : "")}
            onClick={() => scrollTo(it.id)}
          >
            {it.label}
          </button>
        ))}
        <span className="nav-divider"></span>
        <button className="nav-icon-btn theme-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={L.themeAria} title={L.themeAria}>
          {theme === "light" ? <Icon.moon /> : <Icon.sun />}
        </button>
        <div className={"nav-lang-wrap" + (open ? " open" : "")} ref={wrapRef}>
          <button
            type="button"
            className="nav-lang-btn"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={L.langAria}
            title={L.langAria}
          >
            <current.Flag />
            <span className="nav-lang-name">{current.name}</span>
            <svg className="nav-lang-caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {open && (
            <ul className="nav-lang-menu" role="listbox">
              {LANGS.map((l) => (
                <li key={l.code} role="option" aria-selected={l.code === lang}>
                  <button
                    type="button"
                    className={"nav-lang-opt" + (l.code === lang ? " active" : "")}
                    onClick={() => { setLang && setLang(l.code); setOpen(false); }}
                  >
                    <l.Flag />
                    <span>{l.name}</span>
                    {l.code === lang && (
                      <svg className="nav-lang-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

// === Tiny flag SVGs ===
function FlagES() {
  return (
    <svg className="flag" viewBox="0 0 30 20" width="20" height="14" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="30" height="20" fill="#AA151B"/>
      <rect y="5" width="30" height="10" fill="#F1BF00"/>
      <g transform="translate(8.5,10)">
        <rect x="-1.4" y="-1.6" width="2.8" height="3.2" fill="#AA151B" stroke="#AD1519" strokeWidth="0.3"/>
        <rect x="-1.6" y="-0.4" width="3.2" height="0.5" fill="#F1BF00"/>
      </g>
    </svg>
  );
}
function FlagEN() {
  return (
    <svg className="flag" viewBox="0 0 60 30" width="20" height="14" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <clipPath id="ukclip"><rect width="60" height="30"/></clipPath>
      <g clipPath="url(#ukclip)">
        <rect width="60" height="30" fill="#012169"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
        <path d="M0,0 L60,30" stroke="#C8102E" strokeWidth="2" clipPath="inset(0 0 0 50%)"/>
        <path d="M60,0 L0,30" stroke="#C8102E" strokeWidth="2" clipPath="inset(0 50% 0 0)"/>
        <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10"/>
        <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6"/>
      </g>
    </svg>
  );
}

// === Animated SVG Avatar ===
function AvatarSVG() {
  return (
    <div className="avatar-wrap">
      {/* floating decorative badges */}
      <div className="avatar-badge avatar-badge-1">
        <span className="dot"></span> ONLINE
      </div>
      <div className="avatar-badge avatar-badge-2">
        {"</>"} RAG · MCP
      </div>
      <div className="avatar-badge avatar-badge-3">
        AI · TECH LEAD
      </div>

      <svg className="avatar-svg" viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" aria-label="Avatar de Diego">
        {/* circular bg with accent */}
        <defs>
          <clipPath id="avClip">
            <circle cx="120" cy="130" r="115" />
          </clipPath>
          <linearGradient id="avBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--paper)" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        <circle cx="120" cy="130" r="115" fill="url(#avBg)" stroke="var(--ink)" strokeWidth="2" />

        <g clipPath="url(#avClip)">
          {/* shoulders / shirt */}
          <path
            d="M30 280 L30 220 Q30 200 60 195 L90 188 Q120 215 150 188 L180 195 Q210 200 210 220 L210 280 Z"
            fill="var(--ink)"
          />
          {/* shirt collar accent */}
          <path d="M95 195 L120 215 L145 195 L138 220 L120 232 L102 220 Z" fill="var(--accent)" opacity="0.9" />

          {/* neck */}
          <rect x="105" y="170" width="30" height="28" rx="6" fill="#E0B998" />

          {/* head */}
          <g className="av-head">
            <ellipse cx="120" cy="125" rx="56" ry="62" fill="#EFC7A4" />

            {/* hair top */}
            <path
              d="M70 110 Q72 70 120 65 Q170 70 172 112 Q165 96 145 92 Q132 100 120 96 Q108 100 95 92 Q75 96 70 110 Z"
              fill="var(--ink)"
            />

            {/* ears */}
            <ellipse cx="65" cy="130" rx="6" ry="9" fill="#E0B998" />
            <ellipse cx="175" cy="130" rx="6" ry="9" fill="#E0B998" />

            {/* eyebrows */}
            <rect className="av-brow av-brow-l" x="86" y="113" width="16" height="3" rx="1.5" fill="var(--ink)" />
            <rect className="av-brow av-brow-r" x="138" y="113" width="16" height="3" rx="1.5" fill="var(--ink)" />

            {/* glasses */}
            <circle cx="94" cy="128" r="13" fill="none" stroke="var(--ink)" strokeWidth="2.5" />
            <circle cx="146" cy="128" r="13" fill="none" stroke="var(--ink)" strokeWidth="2.5" />
            <line x1="107" y1="128" x2="133" y2="128" stroke="var(--ink)" strokeWidth="2.5" />
            <line x1="81" y1="128" x2="73" y2="125" stroke="var(--ink)" strokeWidth="2.5" />
            <line x1="159" y1="128" x2="167" y2="125" stroke="var(--ink)" strokeWidth="2.5" />

            {/* eyes — blink animation */}
            <g className="av-eyes">
              <ellipse cx="94" cy="129" rx="2.6" ry="3.6" fill="var(--ink)" />
              <ellipse cx="146" cy="129" rx="2.6" ry="3.6" fill="var(--ink)" />
            </g>

            {/* nose */}
            <path d="M120 138 L116 152 Q120 156 124 152 Z" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />

            {/* mouth */}
            <path className="av-mouth" d="M108 167 Q120 174 132 167" fill="none" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" />

            {/* beard hint */}
            <path d="M86 158 Q90 178 110 184 Q120 187 130 184 Q150 178 154 158 Q150 168 132 170 Q120 172 108 170 Q90 168 86 158 Z" fill="var(--ink)" opacity="0.12" />
          </g>
        </g>

        {/* floating code chip */}
        <g className="av-chip" transform="translate(180 60)">
          <rect x="-22" y="-14" width="60" height="28" rx="6" fill="var(--ink)" />
          <text x="8" y="5" textAnchor="middle" fontFamily="'Geist Mono', monospace" fontSize="11" fill="var(--accent)">{"{ai}"}</text>
        </g>

        {/* floating dot orbit */}
        <circle className="av-orbit" cx="40" cy="200" r="6" fill="var(--accent)" />
      </svg>

      <div className="avatar-meta">
        <span>DIEGO.CABRERA</span>
        <span>BOG · 4.6° N</span>
      </div>
    </div>
  );
}

// === Hero social row (replaces nav social) ===
function HeroSocial() {
  return (
    <div className="hero-social">
      <a className="hero-social-btn" href="https://github.com/diegocabrera" target="_blank" rel="noreferrer">
        <Icon.github />
        <span>GitHub</span>
        <span className="ext">↗</span>
      </a>
      <a className="hero-social-btn" href="https://linkedin.com/in/diego-cabrera" target="_blank" rel="noreferrer">
        <Icon.linkedin />
        <span>LinkedIn</span>
        <span className="ext">↗</span>
      </a>
      <a
        className="hero-social-btn primary"
        href="uploads/CV_Diego_Andres_Cabrera_Rojas_CV.pdf"
        download="Diego_Cabrera_CV.pdf"
      >
        <Icon.download />
        <span>Descargar CV</span>
      </a>
    </div>
  );
}

// === Animated terminal ===
function Terminal() {
  const lines = [
    { prompt: "~/portfolio", cmd: "whoami" },
    { out: <><b>Diego Cabrera</b> · Tech Lead · IA Aplicada al Desarrollo</> },
    { prompt: "~/portfolio", cmd: "cat focus.md" },
    { out: <>Construyo agentes <b>RAG</b>, plataformas con <b>MCP</b> y workflows de <b>Spec-Driven Development</b>.</> },
    { prompt: "~/portfolio", cmd: "ls --recent" },
    { out: <>rag-agent/&nbsp;&nbsp;spec-driven/&nbsp;&nbsp;ai-pr-review/&nbsp;&nbsp;trip-planner/</> },
    { prompt: "~/portfolio", cmd: "status" },
    { out: <><b style={{color: "var(--accent)"}}>● disponible</b> para proyectos Q3/Q4 2026</> },
  ];
  const [shown, setShown] = useState([]);
  const [typing, setTyping] = useState("");
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (stage >= lines.length) return;
    const line = lines[stage];
    if (line.cmd) {
      let i = 0;
      const t = setInterval(() => {
        i++;
        setTyping(line.cmd.slice(0, i));
        if (i >= line.cmd.length) {
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
    <div className="terminal">
      <div className="terminal-head">
        <div className="lights"><span /><span /><span /></div>
        <div className="path">diego@portfolio — zsh</div>
      </div>
      <div className="terminal-body">
        {shown.map((l, i) => (
          <div key={i} style={{marginBottom: 6}}>
            {l.cmd && <><span className="prompt">{l.prompt} ➜</span> <span className="cmd">{l.cmd}</span></>}
            {l.out && <div className="out">{l.out}</div>}
          </div>
        ))}
        {cur && cur.cmd && (
          <div style={{marginBottom: 6}}>
            <span className="prompt">{cur.prompt} ➜</span>{" "}
            <span className="cmd terminal-cursor">{typing}</span>
          </div>
        )}
        {stage >= lines.length && (
          <div><span className="prompt">~/portfolio ➜</span> <span className="cmd terminal-cursor"></span></div>
        )}
      </div>
    </div>
  );
}

// === Marquee strip ===
function StripMarquee() {
  const items = [
    "RAG", "LANGCHAIN", "MCP", "AGENT SKILLS", "SPEC-DRIVEN DEV",
    "WEAVIATE", ".NET CORE", "SPRING BOOT", "ANGULAR", "REACT", "TYPESCRIPT",
    "OPEN SOURCE", "MICROSERVICIOS", "ORACLE", "POSTGRESQL",
  ];
  const doubled = [...items, ...items];
  return (
    <div className="strip">
      <div className="strip-track">
        {doubled.map((s, i) => (
          <span key={i}>{s}<span className="dot">◆</span></span>
        ))}
      </div>
    </div>
  );
}

// === Cover art component ===
function Cover({ kind, label }) {
  return (
    <div className={"cover cover-" + kind}>
      {label && <div className="cover-svg-label">{label}</div>}
    </div>
  );
}

// === Filter chips ===
function Filters({ options, value, onChange }) {
  return (
    <div className="filters">
      {options.map((o) => (
        <button
          key={o}
          className={"chip" + (value === o ? " active" : "")}
          onClick={() => onChange(o)}
        >{o}</button>
      ))}
    </div>
  );
}

// === Reveal-on-scroll wrapper ===
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => setSeen(true), delay);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={"reveal" + (seen ? " in" : "")}>
      {children}
    </div>
  );
}

// === Ask AI demo ===
function AskAI() {
  const presets = {
    "¿Quién es Diego?":
      "Tech Lead con 7+ años construyendo soluciones full-stack para gobierno y privado. Hoy lidero la estrategia de IA en SASOFTCO: agentes RAG, Spec-Driven Development y MCP.",
    "¿Qué stack maneja en IA?":
      "Python · LangChain · Weaviate · MCP · Claude Code · Cursor. Para el código que sirve a los agentes: TypeScript, .NET Core y Java Spring Boot.",
    "¿Está disponible?":
      "Sí — disponible para colaboraciones desde Q3 2026, idealmente sobre IA aplicada, arquitecturas escalables o plataformas internas.",
    "Muéstrame un proyecto":
      "Agente RAG conversacional sobre LangChain + Weaviate. En producción interna, redujo el tiempo de respuesta a consultas técnicas en ~85% y todas las respuestas incluyen citas a la fuente original.",
  };
  const [q, setQ] = useState("");
  const [a, setA] = useState("Pregunta lo que quieras saber. Las respuestas vienen de la base de conocimiento personal de Diego (CV, proyectos, posts).");
  const [src, setSrc] = useState("fuentes: 12 documentos · cv.pdf · proyectos.md · posts/*");
  const ask = (text) => {
    setQ(text);
    setA("…");
    setTimeout(() => {
      const matched = Object.keys(presets).find((k) => k.toLowerCase() === text.toLowerCase().trim()) || Object.keys(presets)[0];
      setA(presets[matched]);
      setSrc("fuentes: cv_diego_cabrera.pdf · proyectos.md · posts/" + (matched.includes("RAG") || matched.includes("stack") ? "rag-en-produccion.md" : "perfil.md"));
    }, 420);
  };
  return (
    <div className="ask">
      <div>
        <div className="ask-eyebrow">/ ask diego — agente rag</div>
        <h2>Pregúntame lo que <em>realmente</em> hago.</h2>
        <p>
          Esta caja es un mini-RAG sobre mi CV, proyectos y posts. Es la misma idea que llevo a producción para mis clientes.
        </p>
        <div className="ask-input-row">
          <input
            className="ask-input"
            placeholder="Escribe una pregunta…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && q.trim()) ask(q); }}
          />
          <button className="ask-send" onClick={() => q.trim() && ask(q)}>Preguntar</button>
        </div>
        <div className="ask-suggestions">
          {Object.keys(presets).map((p) => (
            <button key={p} className="ask-sug" onClick={() => ask(p)}>{p}</button>
          ))}
        </div>
      </div>
      <div className="ask-output">
        <div>{a}</div>
        <div className="src">{src}</div>
      </div>
    </div>
  );
}

// === Footer ===
function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>© 2026 · Diego Cabrera · Bogotá, Colombia</div>
        <div>Construido con cuidado · React + dot grid + tu base de conocimiento</div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  DotGridBg, Nav, Icon, Terminal, StripMarquee, Cover, Filters, Reveal, AskAI, Footer,
  AvatarSVG, HeroSocial,
});
