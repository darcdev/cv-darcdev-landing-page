// Section views for single-page layout
const { useState: useStateV, useEffect: useEffectV, useMemo: useMemoV } = React;

function pickCover(p) {
  const map = {
    "rag-agent": "rag",
    "spec-driven": "spec",
    "ai-pr-review": "pr",
    "jackcore": "arch",
    "govcodepro": "mcp",
    "trip-planner": "oss",
    "luminara": "spec",
    "albertcts": "rag",
    "b2b-materiales": "arch",
  };
  return map[p.id] || "rag";
}

// === Project gallery: pattern cover + multiple image slots, with arrows ===
function ProjectGallery({ project, slots = 3, variant = "card" }) {
  // Total slides = 1 pattern cover + N image slots
  const total = slots + 1;
  const [idx, setIdxV] = useStateV(0);
  const stop = (fn) => (e) => { e.stopPropagation(); e.preventDefault(); fn(); };
  const go = (i) => setIdxV(((i % total) + total) % total);
  const prev = stop(() => go(idx - 1));
  const next = stop(() => go(idx + 1));
  const cover = pickCover(project);
  return (
    <div className={"gallery gallery-" + variant}>
      <div className="gallery-track">
        {/* Slide 0: pattern cover (always present, looks nice as default) */}
        <div className={"gallery-slide" + (idx === 0 ? " active" : "")} aria-hidden={idx !== 0}>
          <Cover kind={cover} />
          <span className="gallery-slide-tag">patrón</span>
        </div>
        {/* Slides 1..N: image slots */}
        {Array.from({ length: slots }).map((_, i) => {
          const active = idx === i + 1;
          return (
            <div key={i} className={"gallery-slide" + (active ? " active" : "")} aria-hidden={!active}>
              <image-slot
                id={`proj-${project.id}-img-${i + 1}`}
                placeholder={`Imagen ${i + 1} / ${slots}`}
                style={{ width: "100%", height: "100%", display: "block" }}
              ></image-slot>
            </div>
          );
        })}
      </div>

      <button className="gallery-arrow prev" onClick={prev} aria-label="Anterior" type="button">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button className="gallery-arrow next" onClick={next} aria-label="Siguiente" type="button">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>

      <div className="gallery-dots" onClick={(e) => e.stopPropagation()}>
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={"gallery-dot" + (idx === i ? " active" : "")}
            onClick={stop(() => go(i))}
            aria-label={`Ir a ${i === 0 ? "patrón" : "imagen " + i}`}
          />
        ))}
      </div>

      <div className="gallery-counter">
        {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </div>
  );
}

// ==================== HERO SECTION ====================
function HeroShapes() {
  // Subtle geometric layer — triangles, squares, circles, lines, plus.
  // Pure CSS animations, decorative, low-opacity. Sits behind hero content.
  const shapes = [
    { type: "tri", top: "12%", left: "6%",  size: 28, delay: 0,   rot: 14, dur: 22 },
    { type: "sq",  top: "62%", left: "3%",  size: 22, delay: 4,   rot: 22, dur: 26 },
    { type: "cir", top: "78%", left: "14%", size: 14, delay: 2,   rot: 0,  dur: 19 },
    { type: "ring",top: "26%", left: "44%", size: 38, delay: 6,   rot: 0,  dur: 30 },
    { type: "plus",top: "8%",  left: "82%", size: 18, delay: 1.5, rot: 0,  dur: 24 },
    { type: "tri", top: "70%", left: "60%", size: 34, delay: 3,   rot: -20,dur: 28 },
    { type: "sq",  top: "18%", left: "92%", size: 16, delay: 5,   rot: 12, dur: 21 },
    { type: "cir", top: "50%", left: "96%", size: 10, delay: 7,   rot: 0,  dur: 18 },
    { type: "line",top: "40%", left: "8%",  size: 60, delay: 2.5, rot: 30, dur: 32 },
    { type: "line",top: "85%", left: "70%", size: 80, delay: 4.5, rot: -18,dur: 34 },
    { type: "dot", top: "32%", left: "30%", size: 6,  delay: 1,   rot: 0,  dur: 16 },
    { type: "dot", top: "58%", left: "88%", size: 8,  delay: 3.5, rot: 0,  dur: 17 },
  ];
  return (
    <div className="hero-shapes" aria-hidden="true">
      {shapes.map((s, i) => (
        <span
          key={i}
          className={"hero-shape hero-shape-" + s.type}
          style={{
            top: s.top,
            left: s.left,
            "--size": s.size + "px",
            "--rot": s.rot + "deg",
            "--delay": s.delay + "s",
            "--dur": s.dur + "s",
          }}
        />
      ))}
    </div>
  );
}

function HeroSection({ scrollTo }) {
  return (
    <section id="home" className="hero" data-screen-label="01 hero">
      <HeroShapes />
      <div className="container">
        <div className="hero-grid">
          <div>
            <div className="eyebrow"><span className="idx">01</span> · Tech Lead · Bogotá</div>
            <h1 className="hero-headline" style={{marginTop: 22}}>
              Construyo<br/>
              <span className="underline">agentes</span> que llevan<br/>
              la IA a producto real.
            </h1>
            <p className="hero-sub">
              7+ años liderando full-stack para gobierno y empresa privada.
              Hoy aplico RAG, MCP y Spec-Driven Development al ciclo de
              desarrollo — desde la arquitectura hasta el commit.
            </p>
            <div className="hero-meta">
              <button className="btn btn-primary" onClick={() => scrollTo("projects")}>
                Ver proyectos
                <Icon.arrow />
              </button>
              <button className="btn btn-outline" onClick={() => scrollTo("contact")}>
                Hablemos
              </button>
              <span className="status-pill">
                <span className="pulse"></span>
                Disponible Q3/Q4 2026
              </span>
            </div>
          </div>
          <div className="hero-side">
            <AvatarSVG />
            <HeroSocial />
          </div>
        </div>

        <Terminal />
      </div>
      <StripMarquee />
    </section>
  );
}

// ==================== ABOUT SECTION ====================
function AboutSection() {
  return (
    <section id="about" className="section section-divider" data-screen-label="02 about">
      <div className="container">
        <Reveal>
          <div className="eyebrow"><span className="idx">02</span> · Sobre mí</div>
          <h2 className="sect-title" style={{marginTop: 18}}>
            Tech Lead que <span className="serif-it">codea</span>,<br/>
            arquitecto que <span className="serif-it">escucha</span>.
          </h2>
        </Reveal>

        <div className="about-grid" style={{marginTop: 56}}>
          <Reveal>
            <p className="bio-large">
              Soy <strong>Diego Cabrera</strong>. He construido sistemas para entidades del Gobierno Colombiano, alcaldías y empresas privadas durante los últimos 7 años.
              <em> Mi día se reparte entre arquitectura, código hands-on y liderar equipos que aprenden a trabajar con agentes de IA.</em>
            </p>
          </Reveal>

          <Reveal delay={150}>
            <div className="about-card">
              <h4>Información</h4>
              <div className="kv-list">
                <div className="row"><span className="k">Ubicación</span><span className="v">Bogotá, CO</span></div>
                <div className="row"><span className="k">Email</span><span className="v">diegoandresrojas2000@gmail.com</span></div>
                <div className="row"><span className="k">Teléfono</span><span className="v">+57 320 418 0598</span></div>
                <div className="row"><span className="k">Idiomas</span><span className="v">ES nativo · EN B1</span></div>
                <div className="row"><span className="k">Estado</span><span className="v" style={{color: "#2ea050"}}>● disponible</span></div>
                <div className="row"><span className="k">Modalidad</span><span className="v">remoto / híbrido</span></div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <div className="stats-grid">
            <div className="stat-cell">
              <div className="n">7+</div>
              <div className="l">años experiencia</div>
            </div>
            <div className="stat-cell">
              <div className="n">20+</div>
              <div className="l">proyectos en producción</div>
            </div>
            <div className="stat-cell">
              <div className="n">5</div>
              <div className="l">trámites MinTIC liderados</div>
            </div>
            <div className="stat-cell">
              <div className="n" style={{fontFamily: "var(--font-mono)"}}>∞</div>
              <div className="l">prompts iterados</div>
            </div>
          </div>
        </Reveal>

        {/* Experience timeline */}
        <Reveal>
          <div style={{marginTop: 90}}>
            <div className="eyebrow"><span className="idx">02.1</span> · Experiencia</div>
            <h3 className="sect-title" style={{marginTop: 16, fontSize: "clamp(28px, 3.4vw, 40px)"}}>
              Una década escribiendo software<br/>que <span className="serif-it">importa</span>.
            </h3>
          </div>
        </Reveal>
        <div className="timeline">
          {EXPERIENCE.map((e, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className={"tl-item" + (i === 0 ? " now" : "")}>
                <div className="tl-head">
                  <div className="tl-role">{e.role}</div>
                  <div className="tl-period">{e.period}</div>
                </div>
                <div className="tl-company">{e.company} · {e.location}</div>
                <ul className="tl-list">
                  {e.highlights.map((h, j) => <li key={j}>{h}</li>)}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Skills */}
        <Reveal>
          <div style={{marginTop: 90}}>
            <div className="eyebrow"><span className="idx">02.2</span> · Stack</div>
            <h3 className="sect-title" style={{marginTop: 16, fontSize: "clamp(28px, 3.4vw, 40px)"}}>
              Herramientas que uso a diario.
            </h3>
          </div>
        </Reveal>
        <div className="skills-grid">
          {SKILLS.map((s, i) => (
            <Reveal key={s.group} delay={i * 50}>
              <div className="skill-card">
                <h5>{s.group}</h5>
                <div className="skill-chips">
                  {s.items.map((x) => <span key={x} className="skill-chip">{x}</span>)}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==================== PROJECTS SECTION ====================
function ProjectsSection({ openProject }) {
  const [filter, setFilter] = useStateV("Todos");
  const [search, setSearch] = useStateV("");
  const filtered = useMemoV(() => {
    let r = PROJECTS;
    if (filter !== "Todos") r = r.filter((p) => p.type === filter);
    if (search.trim()) {
      const s = search.toLowerCase();
      r = r.filter((p) =>
        p.title.toLowerCase().includes(s) ||
        p.tagline.toLowerCase().includes(s) ||
        p.tags.some((t) => t.toLowerCase().includes(s))
      );
    }
    return r;
  }, [filter, search]);

  const featured = PROJECTS.filter((p) => p.featured).slice(0, 3);

  return (
    <section id="projects" className="section section-divider" data-screen-label="03 projects">
      <div className="container">
        <Reveal>
          <div className="sect-head">
            <div>
              <div className="eyebrow"><span className="idx">03</span> · Proyectos</div>
              <h2 className="sect-title" style={{marginTop: 18}}>
                Cosas que ya están <span className="serif-it">en producción</span>.
              </h2>
            </div>
            <div className="search-wrap" style={{display: "flex", gap: 12, alignItems: "center"}}>
              <div className="search-wrap" style={{position: "relative"}}>
                <input
                  className="search-input"
                  placeholder="Buscar proyecto, tag…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <span className="search-icon"><Icon.search /></span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Featured cards (top 3) */}
        <Reveal>
          <div className="featured-grid">
            {featured.map((p, i) => (
              <div key={p.id} className="feat-card" onClick={() => openProject(p.id)}>
                <div className="feat-cover">
                  <ProjectGallery project={p} slots={3} variant="card" />
                  <span className="feat-num">★ FEATURED</span>
                  {p.liveUrl && (
                    <a
                      className="feat-live"
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title={`Abrir ${p.liveUrl.replace(/^https?:\/\//, "")}`}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>
                      <span>ver sitio</span>
                    </a>
                  )}
                </div>
                <h3>{p.title}</h3>
                <p className="tagline">{p.tagline}</p>
                <div className="meta">
                  <span>{p.type}</span>
                  <span>{p.year}</span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Filters */}
        <Reveal>
          <Filters options={PROJECT_TYPES} value={filter} onChange={setFilter} />
          <div style={{fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14}}>
            mostrando {filtered.length} / {PROJECTS.length}
          </div>
        </Reveal>

        {/* Row list */}
        <div className="proj-list">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i, 5) * 50}>
              <div className="proj-row" onClick={() => openProject(p.id)}>
                <div className="proj-num">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <div className="proj-title">
                    {p.title}
                    {p.liveUrl && (
                      <a
                        className="proj-live"
                        href={p.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title={`Abrir ${p.liveUrl.replace(/^https?:\/\//, "")}`}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>
                        <span>ver sitio</span>
                      </a>
                    )}
                  </div>
                  <div className="proj-tags">
                    {p.tags.slice(0, 4).map((t) => <span key={t} className="proj-tag">{t}</span>)}
                  </div>
                </div>
                <div className="proj-tagline">{p.tagline}</div>
                <div className="proj-meta-col">
                  <div className="year">{p.year}</div>
                  <div>{p.role}</div>
                  <div>{p.status}</div>
                </div>
                <div className="proj-arrow">→</div>
              </div>
            </Reveal>
          ))}
          {filtered.length === 0 && (
            <div style={{textAlign: "center", padding: 80, color: "var(--muted)"}}>
              Sin resultados. Prueba con otro filtro.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ==================== ASK AI SECTION ====================
function AskSection() {
  return (
    <section className="section section-divider">
      <div className="container">
        <Reveal>
          <div className="eyebrow"><span className="idx">04</span> · Demo en vivo</div>
          <h2 className="sect-title" style={{marginTop: 18, marginBottom: 36}}>
            La idea que llevo a producción,<br/>aquí mismo.
          </h2>
        </Reveal>
        <Reveal><AskAI /></Reveal>
      </div>
    </section>
  );
}

// Single magazine card
function MagCard({ post, variant, onClick }) {
  const isBig = variant === "big";
  return (
    <article className={"mag-card mag-" + variant} onClick={onClick}>
      <div className="mag-cover">
        <Cover kind={post.cover} label={post.category} />
        {isBig && <span className="mag-feat-tag">★ Más reciente</span>}
      </div>
      <div className="mag-body">
        <div className="mag-eyebrow">
          <span>{post.category}</span>
          <span>·</span>
          <span>{post.date}</span>
        </div>
        <h3 className="mag-title">{post.title}</h3>
        {isBig
          ? <p className="mag-excerpt">{post.excerpt}</p>
          : <p className="mag-excerpt-short">{post.excerpt}</p>
        }
        <div className="mag-foot">
          {isBig && (
            <div className="mag-tags">
              {post.tags.slice(0, 3).map((t) => <span key={t} className="skill-chip">{t}</span>)}
            </div>
          )}
          <span className="mag-read">{post.readMin} min lectura →</span>
        </div>
      </div>
    </article>
  );
}

// ==================== BLOG SECTION (magazine layout) ====================
function BlogSection({ openPost }) {
  const [cat, setCat] = useStateV("Todos");
  const filtered = useMemoV(() => cat === "Todos" ? POSTS : POSTS.filter((p) => p.category === cat), [cat]);
  const ordered = useMemoV(() => {
    const f = filtered.find((p) => p.featured) || filtered[0];
    if (!f) return [];
    return [f, ...filtered.filter((p) => p !== f)];
  }, [filtered]);

  const big = ordered[0];
  const side = ordered.slice(1, 3);
  const bottom = ordered.slice(3);

  return (
    <section id="blog" className="section section-divider" data-screen-label="05 blog">
      <div className="container">
        <Reveal>
          <div className="sect-head">
            <div>
              <div className="eyebrow"><span className="idx">05</span> · Blog · {POSTS.length} posts</div>
              <h2 className="sect-title" style={{marginTop: 18}}>
                Notas de campo sobre <span className="serif-it">IA aplicada</span>.
              </h2>
              <p style={{color: "var(--muted)", maxWidth: 540, marginTop: 22, fontSize: 17, lineHeight: 1.55}}>
                Lo que aprendo construyendo agentes, plataformas y procesos. Sin teoría inflada — sólo lo que ya funcionó (o falló).
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <Filters options={CATEGORIES} value={cat} onChange={setCat} />
        </Reveal>

        {ordered.length === 0 ? (
          <div style={{textAlign: "center", padding: 80, color: "var(--muted)"}}>
            Sin posts en esta categoría.
          </div>
        ) : (
          <div className="blog-mag">
            {big && (
              <Reveal>
                <div className="mag-top">
                  <MagCard post={big} variant="big" onClick={() => openPost(big.id)} />
                  {side.length > 0 && (
                    <div className="mag-side-col">
                      {side.map((p) => (
                        <MagCard key={p.id} post={p} variant="side" onClick={() => openPost(p.id)} />
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            )}
            {bottom.length > 0 && (
              <Reveal delay={120}>
                <div className="mag-bottom">
                  {bottom.map((p) => (
                    <MagCard key={p.id} post={p} variant="base" onClick={() => openPost(p.id)} />
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// ==================== CONTACT SECTION ====================
function ContactSection() {
  const [copied, setCopied] = useStateV("");
  const copy = (txt, label) => {
    navigator.clipboard?.writeText(txt);
    setCopied(label);
    setTimeout(() => setCopied(""), 1400);
  };
  return (
    <section id="contact" className="section section-divider" data-screen-label="06 contact">
      <div className="container">
        <Reveal>
          <div className="eyebrow"><span className="idx">06</span> · Contacto</div>
        </Reveal>
        <div className="contact-grid" style={{marginTop: 30}}>
          <Reveal>
            <h2 className="contact-big">
              ¿Construimos<br/>
              <span className="it">algo juntos?</span>
            </h2>
            <p style={{color: "var(--muted)", maxWidth: 460, marginTop: 28, fontSize: 18, lineHeight: 1.55}}>
              Disponible para proyectos de <strong style={{color: "var(--ink)"}}>IA aplicada</strong>, arquitectura
              escalable y consultoría de equipos que quieren integrar agentes a su flujo.
            </p>
            <div style={{marginTop: 28, display: "flex", gap: 10, flexWrap: "wrap"}}>
              <span className="status-pill">
                <span className="pulse"></span>
                Respondo en menos de 24h
              </span>
              <a className="status-pill" href="uploads/CV_Diego_Andres_Cabrera_Rojas_CV.pdf" download="Diego_Cabrera_CV.pdf" style={{cursor: "pointer"}}>
                <Icon.download />
                Descargar CV
              </a>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="contact-links">
              {[
                { k: "Email", v: "diegoandresrojas2000@gmail.com", href: "mailto:diegoandresrojas2000@gmail.com", copy: true },
                { k: "Teléfono", v: "+57 320 418 0598", href: "tel:+573204180598", copy: true },
                { k: "LinkedIn", v: "linkedin.com/in/diego-cabrera →", href: "https://linkedin.com/in/diego-cabrera" },
                { k: "GitHub", v: "github.com/diegocabrera →", href: "https://github.com/diegocabrera" },
                { k: "Ubicación", v: "Bogotá, Colombia · GMT-5", href: null },
              ].map((it) => (
                <a
                  key={it.k}
                  className="contact-link"
                  href={it.href || "#"}
                  target={it.href && it.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  onClick={(e) => {
                    if (!it.href) { e.preventDefault(); return; }
                    if (it.copy) {
                      e.preventDefault();
                      copy(it.v.replace(/[→\s]+$/, ""), it.k);
                    }
                  }}
                >
                  <span className="k">{it.k}</span>
                  <span className="v">{copied === it.k ? "✓ copiado al portapapeles" : it.v}</span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ==================== PROJECT MODAL ====================
function ProjectModal({ project, onClose }) {
  useEffectV(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
        <div className="eyebrow">/ proyecto · {project.year}</div>
        <h2>{project.title}</h2>
        <div className="modal-tagline">{project.tagline}</div>
        {project.liveUrl && (
          <a className="modal-live-btn" href={project.liveUrl} target="_blank" rel="noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>
            <span>Ver sitio en vivo</span>
            <span className="modal-live-host">{project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
          </a>
        )}
        <div className="modal-cover">
          <ProjectGallery project={project} slots={4} variant="modal" />
        </div>
        <div className="modal-cols">
          <div>
            <div className="modal-section">
              <h4>Resumen</h4>
              <p>{project.summary}</p>
            </div>
            <div className="modal-section">
              <h4>Problema</h4>
              <p>{project.problem}</p>
            </div>
            <div className="modal-section">
              <h4>Solución</h4>
              <p>{project.solution}</p>
            </div>
            <div className="modal-section">
              <h4>Impacto</h4>
              <ul>
                {project.impact.map((i, idx) => <li key={idx}>{i}</li>)}
              </ul>
            </div>
          </div>
          <aside className="modal-side">
            <div className="modal-section">
              <h4>Rol</h4>
              <p style={{fontSize: 14}}>{project.role}</p>
            </div>
            <div className="modal-section">
              <h4>Cliente</h4>
              <p style={{fontSize: 14}}>{project.client}</p>
            </div>
            <div className="modal-section">
              <h4>Estado</h4>
              <p style={{fontSize: 14}}>{project.status}</p>
            </div>
            <div className="modal-section" style={{marginBottom: 0}}>
              <h4>Stack</h4>
              <div style={{display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8}}>
                {project.stack.map((s) => <span key={s} className="skill-chip">{s}</span>)}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ==================== POST PAGE (independent view) ====================
function PostPage({ post, onBack, openPost }) {
  const [progress, setProgress] = useStateV(0);

  useEffectV(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const onScroll = () => {
      const h = document.documentElement;
      const pct = Math.min(100, Math.max(0, (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100));
      setProgress(pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [post.id]);

  const related = POSTS.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 2);
  const morePosts = POSTS.filter((p) => p.id !== post.id).slice(0, 3);
  const headings = post.body.filter((b) => b.type === "h2");

  return (
    <div className="post-page view-fade" data-screen-label={"post: " + post.id}>
      <div className="reading-bar" style={{width: progress + "%"}} />

      <div className="container">
        <div className="post-breadcrumb">
          <button className="back-btn" onClick={onBack}>
            <span className="back-arrow">←</span>
            <span>Volver al blog</span>
          </button>
          <div className="bc-trail">
            <span>diego.cabrera</span>
            <span className="bc-sep">/</span>
            <span>blog</span>
            <span className="bc-sep">/</span>
            <span className="bc-current">{post.id}</span>
          </div>
        </div>
      </div>

      <article className="post-hero">
        <div className="container">
          <div className="post-hero-eyebrow">
            <span className="post-cat">{post.category}</span>
            <span className="post-meta-item">{post.date}</span>
            <span className="post-meta-item">{post.readMin} min lectura</span>
          </div>
          <h1 className="post-title">{post.title}</h1>
          <p className="post-lede">{post.excerpt}</p>
          <div className="post-tags">
            {post.tags.map((t) => <span key={t} className="skill-chip">{t}</span>)}
          </div>
        </div>
        <div className="container">
          <div className="post-cover">
            <Cover kind={post.cover} label={post.category} />
          </div>
        </div>
      </article>

      <div className="container">
        <div className="post-layout">
          <aside className="post-toc">
            <div className="post-toc-inner">
              <div className="toc-title">En este post</div>
              <ol>
                {headings.map((h, i) => (
                  <li key={i}>
                    <a href={"#h" + i}>{h.text}</a>
                  </li>
                ))}
              </ol>
              <div className="toc-share">
                <div className="toc-share-title">Compartir</div>
                <div className="toc-share-row">
                  <button onClick={() => navigator.clipboard?.writeText(window.location.href)} className="toc-share-btn">copy link</button>
                  <a className="toc-share-btn" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`} target="_blank" rel="noreferrer">𝕏</a>
                  <a className="toc-share-btn" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer">in</a>
                </div>
              </div>
            </div>
          </aside>

          <div className="post-main">
            <div className="tldr">
              <h4>TL;DR</h4>
              <p>{post.body.find((b) => b.type === "p")?.text}</p>
            </div>

            <div className="article-body">
              {(() => {
                let hIdx = 0;
                return post.body.map((b, i) => {
                  if (b.type === "p") return <p key={i}>{b.text}</p>;
                  if (b.type === "h2") {
                    const id = "h" + hIdx;
                    hIdx++;
                    return <h2 key={i} id={id}>{b.text}</h2>;
                  }
                  if (b.type === "quote") return <blockquote key={i}>"{b.text}"</blockquote>;
                  if (b.type === "code") return <pre key={i}><code>{b.text}</code></pre>;
                  return null;
                });
              })()}
            </div>

            <div className="post-author">
              <div className="post-author-avatar">
                <AvatarSVG />
              </div>
              <div className="post-author-info">
                <div className="post-author-eyebrow">Escrito por</div>
                <div className="post-author-name">Diego Cabrera</div>
                <div className="post-author-role">Tech Lead · IA Aplicada · Bogotá</div>
                <div className="post-author-actions">
                  <a className="hero-social-btn" href="https://linkedin.com/in/diego-cabrera" target="_blank" rel="noreferrer">
                    <Icon.linkedin />
                    <span>LinkedIn</span>
                  </a>
                  <a className="hero-social-btn" href="https://github.com/diegocabrera" target="_blank" rel="noreferrer">
                    <Icon.github />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* More posts */}
        <div className="post-more">
          <div className="eyebrow"><span className="idx">→</span> · Sigue leyendo</div>
          <h3 className="sect-title" style={{marginTop: 16, fontSize: "clamp(28px, 3.4vw, 40px)"}}>
            Más del blog
          </h3>
          <div className="mag-bottom" style={{marginTop: 36}}>
            {morePosts.map((p) => (
              <article key={p.id} className="mag-card mag-base" onClick={() => openPost(p.id)}>
                <div className="mag-cover">
                  <Cover kind={p.cover} label={p.category} />
                </div>
                <div className="mag-body">
                  <div className="mag-eyebrow">
                    <span>{p.category}</span>
                    <span>·</span>
                    <span>{p.date}</span>
                  </div>
                  <h3 className="mag-title">{p.title}</h3>
                  <p className="mag-excerpt-short">{p.excerpt}</p>
                  <div className="mag-foot">
                    <span className="mag-read">{p.readMin} min lectura →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="post-cta">
          <h3>¿Quieres construir algo similar?</h3>
          <p>Hablemos sobre tu próximo proyecto de IA aplicada.</p>
          <button className="btn btn-primary" onClick={onBack}>
            Volver al blog
            <Icon.arrow />
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== POST MODAL (kept for backwards compat — unused) ====================
function PostModal({ post, onClose, openPost }) {
  useEffectV(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);
  const related = POSTS.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 2);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{maxWidth: 800}}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>

        <div className="article-eyebrow">
          <span>{post.category}</span>
          <span>{post.date}</span>
          <span>{post.readMin} min lectura</span>
        </div>
        <h2 style={{fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1.05, marginBottom: 18}}>{post.title}</h2>
        <p className="article-lede">{post.excerpt}</p>

        <div className="modal-cover" style={{aspectRatio: "16/7"}}>
          <Cover kind={post.cover} label={post.category} />
        </div>

        <div className="tldr">
          <h4>TL;DR</h4>
          <p>{post.body.find((b) => b.type === "p")?.text}</p>
        </div>

        <div className="article-body">
          {post.body.map((b, i) => {
            if (b.type === "p") return <p key={i}>{b.text}</p>;
            if (b.type === "h2") return <h2 key={i}>{b.text}</h2>;
            if (b.type === "quote") return <blockquote key={i}>"{b.text}"</blockquote>;
            if (b.type === "code") return <pre key={i}><code>{b.text}</code></pre>;
            return null;
          })}
        </div>

        <div style={{marginTop: 50, padding: "28px 0", borderTop: "1px solid var(--ink)", borderBottom: "1px solid var(--ink)", display: "flex", gap: 18, alignItems: "center"}}>
          <div style={{width: 56, height: 56, borderRadius: "50%", overflow: "hidden", border: "1px solid var(--ink)", flexShrink: 0}}>
            <image-slot id="author-avatar" shape="circle" placeholder="Foto" style={{width: "100%", height: "100%"}}></image-slot>
          </div>
          <div style={{flex: 1}}>
            <div style={{fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)"}}>Escrito por</div>
            <div style={{fontSize: 17, fontWeight: 500, marginTop: 2}}>Diego Cabrera</div>
            <div style={{fontSize: 13, color: "var(--muted)", marginTop: 2}}>Tech Lead · IA Aplicada · Bogotá</div>
          </div>
        </div>

        {related.length > 0 && (
          <div style={{marginTop: 40}}>
            <div className="eyebrow">/ sigue leyendo</div>
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 18}}>
              {related.map((p) => (
                <div key={p.id} className="post-card" onClick={() => openPost(p.id)}>
                  <div className="cover-art" style={{aspectRatio: "21/9"}}>
                    <Cover kind={p.cover} label={p.category} />
                  </div>
                  <div className="body">
                    <h3 style={{fontSize: 16}}>{p.title}</h3>
                    <div className="post-meta"><span>{p.date}</span><span>{p.readMin} min</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, {
  HeroSection, AboutSection, ProjectsSection, AskSection, BlogSection, ContactSection,
  ProjectModal, PostModal, PostPage, pickCover, ProjectGallery,
});
