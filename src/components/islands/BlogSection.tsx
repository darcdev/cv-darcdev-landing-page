import { useState, useMemo, useRef, useEffect } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { POSTS, CATEGORIES } from '../../data';
import type { Post, CoverPattern } from '../../data/posts';

function Cover({ kind, label }: { kind: CoverPattern; label?: string }) {
  return (
    <div class={`cover cover-${kind}`}>
      {label && <div class="cover-svg-label">{label}</div>}
    </div>
  );
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

function Reveal({ children, delay = 0 }: { children: ComponentChildren; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
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
  }, [delay]);

  return (
    <div ref={ref} class={`reveal ${seen ? "in" : ""}`}>
      {children}
    </div>
  );
}

function MagCard({ post, variant }: { post: Post; variant: 'big' | 'side' | 'base' }) {
  const isBig = variant === "big";
  return (
    <a href={`/blog/${post.id}`} class={`mag-card mag-${variant}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div class="mag-cover">
        <Cover kind={post.cover} label={post.category} />
        {isBig && <span class="mag-feat-tag">★ Más reciente</span>}
      </div>
      <div class="mag-body">
        <div class="mag-eyebrow">
          <span>{post.category}</span>
          <span>·</span>
          <span>{post.date}</span>
        </div>
        <h3 class="mag-title">{post.title}</h3>
        {isBig
          ? <p class="mag-excerpt">{post.excerpt}</p>
          : <p class="mag-excerpt-short">{post.excerpt}</p>
        }
        <div class="mag-foot">
          {isBig && (
            <div class="mag-tags">
              {post.tags.slice(0, 3).map((t) => <span key={t} class="skill-chip">{t}</span>)}
            </div>
          )}
          <span class="mag-read">{post.readMin} min lectura →</span>
        </div>
      </div>
    </a>
  );
}

export default function BlogSection() {
  const [cat, setCat] = useState("Todos");
  
  const filtered = useMemo(() => 
    cat === "Todos" ? POSTS : POSTS.filter((p) => p.category === cat),
    [cat]
  );
  
  const ordered = useMemo(() => {
    const f = filtered.find((p) => p.featured) || filtered[0];
    if (!f) return [];
    return [f, ...filtered.filter((p) => p !== f)];
  }, [filtered]);

  const big = ordered[0];
  const side = ordered.slice(1, 3);
  const bottom = ordered.slice(3);

  return (
    <section id="blog" class="section section-divider" data-screen-label="05 blog">
      <div class="container">
        <Reveal>
          <div class="sect-head">
            <div>
              <div class="eyebrow"><span class="idx">05</span> · Blog · {POSTS.length} posts</div>
              <h2 class="sect-title" style={{ marginTop: 18 }}>
                Notas de campo sobre <span class="serif-it">IA aplicada</span>.
              </h2>
              <p style={{ color: "var(--muted)", maxWidth: 540, marginTop: 22, fontSize: 17, lineHeight: 1.55 }}>
                Lo que aprendo construyendo agentes, plataformas y procesos. Sin teoría inflada — sólo lo que ya funcionó (o falló).
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <Filters options={CATEGORIES} value={cat} onChange={setCat} />
        </Reveal>

        {ordered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80, color: "var(--muted)" }}>
            Sin posts en esta categoría.
          </div>
        ) : (
          <div class="blog-mag">
            {big && (
              <Reveal>
                <div class="mag-top">
                  <MagCard post={big} variant="big" />
                  {side.length > 0 && (
                    <div class="mag-side-col">
                      {side.map((p) => (
                        <MagCard key={p.id} post={p} variant="side" />
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            )}
            {bottom.length > 0 && (
              <Reveal delay={120}>
                <div class="mag-bottom">
                  {bottom.map((p) => (
                    <MagCard key={p.id} post={p} variant="base" />
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
