import { useState, useMemo, useRef, useEffect } from 'preact/hooks';
import type { ComponentChildren, FunctionComponent } from 'preact';
import type { PostMeta, CoverPattern } from '../../content/loadPosts';
import { t } from '../../i18n/translate';

interface Props {
  /** Posts already filtered to the active locale, sorted by pubDate desc. */
  posts: PostMeta[];
  /** Localized "All" label (e.g. "Todos", "All"). */
  allLabel: string;
  /** Active locale code (used for translating UI strings). */
  locale: string;
}

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
          class={`chip ${value === o ? 'active' : ''}`}
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
    <div ref={ref} class={`reveal ${seen ? 'in' : ''}`}>
      {children}
    </div>
  );
}

function MagCard({ post, variant, locale }: { post: PostMeta; variant: 'big' | 'side' | 'base'; locale: string }) {
  const isBig = variant === 'big';
  return (
    <a href={`/${locale}/blog/${post.id}`} class={`mag-card mag-${variant}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div class="mag-cover">
        <Cover kind={post.cover} label={post.category} />
        {isBig && <span class="mag-feat-tag">★ {t('blog.most_recent', undefined, locale)}</span>}
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
              {post.tags.slice(0, 3).map((tg) => <span key={tg} class="skill-chip">{tg}</span>)}
            </div>
          )}
          <span class="mag-read">{post.readMin} {t('blog.min_read', undefined, locale)} →</span>
        </div>
      </div>
    </a>
  );
}

const BlogSection: FunctionComponent<Props> = ({ posts, allLabel, locale }) => {
  const [cat, setCat] = useState(allLabel);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(posts.map((p) => p.category)));
    return [allLabel, ...cats];
  }, [posts, allLabel]);

  const filtered = useMemo(() =>
    cat === allLabel ? posts : posts.filter((p) => p.category === cat),
    [posts, cat, allLabel]
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
              <div class="eyebrow">
                <span class="idx">05</span>
                <span> · {t('blog.eyebrow', undefined, locale)} · {posts.length} {t('blog.posts_label', undefined, locale)}</span>
              </div>
              <h2 class="sect-title" style={{ marginTop: 18 }}
                  dangerouslySetInnerHTML={{ __html: t('blog.title', undefined, locale) }} />
              <p style={{ color: 'var(--muted)', maxWidth: 540, marginTop: 22, fontSize: 17, lineHeight: 1.55 }}>
                {t('blog.lede', undefined, locale)}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <Filters options={categories} value={cat} onChange={setCat} />
        </Reveal>

        {ordered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--muted)' }}>
            {t('blog.empty', undefined, locale)}
          </div>
        ) : (
          <div class="blog-mag">
            {big && (
              <Reveal>
                <div class="mag-top">
                  <MagCard post={big} variant="big" locale={locale} />
                  {side.length > 0 && (
                    <div class="mag-side-col">
                      {side.map((p) => (
                        <MagCard key={p.id} post={p} variant="side" locale={locale} />
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
                    <MagCard key={p.id} post={p} variant="base" locale={locale} />
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
