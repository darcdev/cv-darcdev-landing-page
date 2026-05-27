import { useState, useMemo, useEffect } from 'preact/hooks';
import { PROJECTS, PROJECT_TYPES } from '../../data';
import type { Project } from '../../data/projects';

function pickCover(p: Project): string {
  const map: Record<string, string> = {
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

function Cover({ kind }: { kind: string }) {
  return <div class={`cover cover-${kind}`} />;
}

function Filters({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div class="filters">
      {options.map((o) => (
        <button
          key={o}
          class={`chip ${value === o ? "active" : ""}`}
          onClick={() => onChange(o)}
        >{o}</button>
      ))}
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div class="modal-backdrop" onClick={onClose}>
      <div class="modal" onClick={(e) => e.stopPropagation()}>
        <button class="modal-close" onClick={onClose} aria-label="Cerrar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
        <div class="eyebrow">/ proyecto · {project.year}</div>
        <h2>{project.title}</h2>
        <div class="modal-tagline">{project.tagline}</div>
        {project.liveUrl && (
          <a class="modal-live-btn" href={project.liveUrl} target="_blank" rel="noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>
            <span>Ver sitio en vivo</span>
            <span class="modal-live-host">{project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
          </a>
        )}
        <div class="modal-cover">
          <Cover kind={pickCover(project)} />
        </div>
        <div class="modal-cols">
          <div>
            <div class="modal-section">
              <h4>Resumen</h4>
              <p>{project.summary}</p>
            </div>
            <div class="modal-section">
              <h4>Problema</h4>
              <p>{project.problem}</p>
            </div>
            <div class="modal-section">
              <h4>Solución</h4>
              <p>{project.solution}</p>
            </div>
            <div class="modal-section">
              <h4>Impacto</h4>
              <ul>
                {project.impact.map((i, idx) => <li key={idx}>{i}</li>)}
              </ul>
            </div>
          </div>
          <aside class="modal-side">
            <div class="modal-section">
              <h4>Rol</h4>
              <p style={{ fontSize: 14 }}>{project.role}</p>
            </div>
            <div class="modal-section">
              <h4>Cliente</h4>
              <p style={{ fontSize: 14 }}>{project.client}</p>
            </div>
            <div class="modal-section">
              <h4>Estado</h4>
              <p style={{ fontSize: 14 }}>{project.status}</p>
            </div>
            <div class="modal-section" style={{ marginBottom: 0 }}>
              <h4>Stack</h4>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                {project.stack.map((s) => <span key={s} class="skill-chip">{s}</span>)}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [modalProject, setModalProject] = useState<Project | null>(null);

  const filtered = useMemo(() => {
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

  const openProject = (id: string) => {
    const p = PROJECTS.find((proj) => proj.id === id);
    if (p) setModalProject(p);
  };

  return (
    <section id="projects" class="section section-divider" data-screen-label="03 projects">
      <div class="container">
        <div class="reveal in">
          <div class="sect-head">
            <div>
              <div class="eyebrow"><span class="idx">03</span> · Proyectos</div>
              <h2 class="sect-title" style={{ marginTop: 18 }}>
                Cosas que ya están <span class="serif-it">en producción</span>.
              </h2>
            </div>
            <div class="search-wrap" style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div class="search-wrap" style={{ position: "relative" }}>
                <input
                  class="search-input"
                  placeholder="Buscar proyecto, tag…"
                  value={search}
                  onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
                />
                <span class="search-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="reveal in">
          <div class="featured-grid">
            {featured.map((p) => (
              <div key={p.id} class="feat-card" onClick={() => openProject(p.id)}>
                <div class="feat-cover">
                  <Cover kind={pickCover(p)} />
                  <span class="feat-num">★ FEATURED</span>
                  {p.liveUrl && (
                    <a
                      class="feat-live"
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>
                      <span>ver sitio</span>
                    </a>
                  )}
                </div>
                <h3>{p.title}</h3>
                <p class="tagline">{p.tagline}</p>
                <div class="meta">
                  <span>{p.type}</span>
                  <span>{p.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div class="reveal in">
          <Filters options={PROJECT_TYPES} value={filter} onChange={setFilter} />
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>
            mostrando {filtered.length} / {PROJECTS.length}
          </div>
        </div>

        <div class="proj-list">
          {filtered.map((p, i) => (
            <div key={p.id} class="reveal in">
              <div class="proj-row" onClick={() => openProject(p.id)}>
                <div class="proj-num">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <div class="proj-title">
                    {p.title}
                    {p.liveUrl && (
                      <a
                        class="proj-live"
                        href={p.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>
                        <span>ver sitio</span>
                      </a>
                    )}
                  </div>
                  <div class="proj-tags">
                    {p.tags.slice(0, 4).map((t) => <span key={t} class="proj-tag">{t}</span>)}
                  </div>
                </div>
                <div class="proj-tagline">{p.tagline}</div>
                <div class="proj-meta-col">
                  <div class="year">{p.year}</div>
                  <div>{p.role}</div>
                  <div>{p.status}</div>
                </div>
                <div class="proj-arrow">→</div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 80, color: "var(--muted)" }}>
              Sin resultados. Prueba con otro filtro.
            </div>
          )}
        </div>
      </div>

      {modalProject && (
        <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />
      )}
    </section>
  );
}
