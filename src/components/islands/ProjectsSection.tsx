import { useState, useMemo, useEffect } from 'preact/hooks';
import type { FunctionComponent } from 'preact';
import { getProjectTypes, getAllLabel, getStatusLabel, type Project } from '../../data/projects';
import type { ResolvedImage } from '../../lib/imageTypes';
import ProjectGallery from './ProjectGallery';
import { t } from '../../i18n/translate';

/**
 * A project enriched with images already resolved at SSG via getImage().
 * The page resolves card + modal contexts up-front so the island can render
 * the right size without invoking server-only APIs.
 */
export interface ProjectWithImages extends Project {
  resolvedImages: {
    card: ResolvedImage[];
    modal: ResolvedImage[];
  };
}

export interface GalleryStrings {
  counterLabel: string;
  prevLabel: string;
  nextLabel: string;
}

interface Props {
  /** Active locale code. */
  locale: string;
  /** Projects pre-resolved at SSG with optimized image descriptors. */
  projects: ProjectWithImages[];
  /** Pre-translated strings for the gallery island. */
  galleryStrings: GalleryStrings;
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
          class={`chip ${value === o ? 'active' : ''}`}
          onClick={() => onChange(o)}
        >{o}</button>
      ))}
    </div>
  );
}

function ProjectModal({
  project,
  lang,
  galleryStrings,
  onClose,
}: {
  project: ProjectWithImages;
  lang: string;
  galleryStrings: GalleryStrings;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, []);

  const modalImages = project.resolvedImages.modal;
  const hasImages = modalImages.length > 0;

  return (
    <div class="modal-backdrop" onClick={onClose}>
      <div class="modal" onClick={(e) => e.stopPropagation()}>
        <button class="modal-close" onClick={onClose} aria-label={t('projects.modal.close', undefined, lang)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
        <div class="eyebrow">{t('projects.modal.eyebrow', undefined, lang)} · {project.year}</div>
        <h2>{project.title}</h2>
        <div class="modal-tagline">{project.tagline}</div>
        {project.liveUrl && (
          <a class="modal-live-btn" href={project.liveUrl} target="_blank" rel="noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>
            <span>{t('projects.modal.live', undefined, lang)}</span>
            <span class="modal-live-host">{project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
          </a>
        )}
        {hasImages ? (
          <div class="modal-gallery-wrap">
            <ProjectGallery
              images={modalImages}
              counterLabel={galleryStrings.counterLabel}
              prevLabel={galleryStrings.prevLabel}
              nextLabel={galleryStrings.nextLabel}
            />
          </div>
        ) : (
          <div class="modal-cover">
            <Cover kind={project.cover} />
          </div>
        )}
        <div class="modal-cols">
          <div>
            <div class="modal-section">
              <h4>{t('projects.modal.summary', undefined, lang)}</h4>
              <p>{project.summary}</p>
            </div>
            <div class="modal-section">
              <h4>{t('projects.modal.problem', undefined, lang)}</h4>
              <p>{project.problem}</p>
            </div>
            <div class="modal-section">
              <h4>{t('projects.modal.solution', undefined, lang)}</h4>
              <p>{project.solution}</p>
            </div>
            <div class="modal-section">
              <h4>{t('projects.modal.impact', undefined, lang)}</h4>
              <ul>
                {project.impact.map((i, idx) => <li key={idx}>{i}</li>)}
              </ul>
            </div>
          </div>
          <aside class="modal-side">
            <div class="modal-section">
              <h4>{t('projects.modal.role', undefined, lang)}</h4>
              <p style={{ fontSize: 14 }}>{project.role}</p>
            </div>
            <div class="modal-section">
              <h4>{t('projects.modal.client', undefined, lang)}</h4>
              <p style={{ fontSize: 14 }}>{project.client}</p>
            </div>
            <div class="modal-section">
              <h4>{t('projects.modal.status', undefined, lang)}</h4>
              <p style={{ fontSize: 14 }}>{getStatusLabel(project.status, lang)}</p>
            </div>
            <div class="modal-section" style={{ marginBottom: 0 }}>
              <h4>{t('projects.modal.stack', undefined, lang)}</h4>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                {project.stack.map((s) => <span key={s} class="skill-chip">{s}</span>)}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

const ProjectsSection: FunctionComponent<Props> = ({ locale, projects, galleryStrings }) => {
  const lang = locale;
  const allLabel = getAllLabel(lang);
  const [filter, setFilter] = useState<string>(allLabel);
  const [search, setSearch] = useState('');
  const [modalId, setModalId] = useState<string | null>(null);

  const projectTypes = useMemo(() => getProjectTypes(lang), [lang]);

  const filtered = useMemo(() => {
    let r = projects;
    if (filter !== allLabel) r = r.filter((p) => p.type === filter);
    if (search.trim()) {
      const s = search.toLowerCase();
      r = r.filter((p) =>
        p.title.toLowerCase().includes(s) ||
        p.tagline.toLowerCase().includes(s) ||
        p.tags.some((tg) => tg.toLowerCase().includes(s))
      );
    }
    return r;
  }, [projects, filter, search, allLabel]);

  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const modalProject = modalId ? projects.find((p) => p.id === modalId) ?? null : null;

  return (
    <section id="projects" class="section section-divider" data-screen-label="03 projects">
      <div class="container">
        <div class="reveal in">
          <div class="sect-head">
            <div>
              <div class="eyebrow">
                <span class="idx">03</span>
                <span> · {t('projects.eyebrow', undefined, lang)}</span>
              </div>
              <h2 class="sect-title" style={{ marginTop: 18 }}
                  dangerouslySetInnerHTML={{ __html: t('projects.title', undefined, lang) }} />
            </div>
            <div class="search-wrap" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div class="search-wrap" style={{ position: 'relative' }}>
                <input
                  class="search-input"
                  placeholder={t('projects.search.placeholder', undefined, lang)}
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
            {featured.map((p) => {
              const cardImg = p.resolvedImages.card[0];
              return (
                <div key={p.id} class="feat-card" onClick={() => setModalId(p.id)}>
                  <div class="feat-cover">
                    {cardImg ? (
                      <img
                        src={cardImg.src}
                        srcset={cardImg.srcset || undefined}
                        sizes={cardImg.sizes || undefined}
                        width={cardImg.width}
                        height={cardImg.height}
                        alt={cardImg.alt}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <Cover kind={p.cover} />
                    )}
                    <span class="feat-num">★ {t('projects.featured', undefined, lang)}</span>
                    {p.liveUrl && (
                      <a
                        class="feat-live"
                        href={p.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>
                        <span>{t('projects.view_site', undefined, lang)}</span>
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
              );
            })}
          </div>
        </div>

        <div class="reveal in">
          <Filters options={projectTypes} value={filter} onChange={setFilter} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
            {t('projects.showing', { count: filtered.length, total: projects.length }, lang)}
          </div>
        </div>

        <div class="proj-list">
          {filtered.map((p, i) => (
            <div key={p.id} class="reveal in">
              <div class="proj-row" onClick={() => setModalId(p.id)}>
                <div class="proj-num">{String(i + 1).padStart(2, '0')}</div>
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
                        <span>{t('projects.view_site', undefined, lang)}</span>
                      </a>
                    )}
                  </div>
                  <div class="proj-tags">
                    {p.tags.slice(0, 4).map((tg) => <span key={tg} class="proj-tag">{tg}</span>)}
                  </div>
                </div>
                <div class="proj-tagline">{p.tagline}</div>
                <div class="proj-meta-col">
                  <div class="year">{p.year}</div>
                  <div>{p.role}</div>
                  <div>{getStatusLabel(p.status, lang)}</div>
                </div>
                <div class="proj-arrow">→</div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 80, color: 'var(--muted)' }}>
              {t('projects.empty', undefined, lang)}
            </div>
          )}
        </div>
      </div>

      {modalProject && (
        <ProjectModal
          project={modalProject}
          lang={lang}
          galleryStrings={galleryStrings}
          onClose={() => setModalId(null)}
        />
      )}
    </section>
  );
};

export default ProjectsSection;
