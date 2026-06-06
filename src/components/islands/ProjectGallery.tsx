/**
 * ProjectGallery — keyboard-navigable image gallery shown inside the project modal.
 *
 * Consumes ResolvedImage[] (already optimized by SSG via getImage()) and renders
 * a primary <img> with prev/next controls when multiple images exist.
 *
 * Behaviour contract: specs/006-project-blog-images/contracts/image-api.md §4.
 *   - Length 0 → caller MUST NOT render this component (renders SVG cover instead).
 *   - Length 1 → only the primary, no controls.
 *   - Length ≥ 2 → primary with prev/next buttons and a slide counter.
 *   - Keyboard: ←/→ moves the active image (wraps).
 *   - Esc is NOT handled here — the parent modal owns Esc.
 *   - Touch targets ≥ 44×44 px on viewports ≤ 768px (FR-024).
 */
import { useState, useEffect, useRef } from 'preact/hooks';
import type { FunctionComponent } from 'preact';
import type { ResolvedImage } from '../../lib/imageTypes';

interface Props {
  /** Pre-resolved primary-size images. MUST have length ≥ 1. */
  images: ResolvedImage[];
  /** "{n} / {total}" — placeholders are replaced internally. */
  counterLabel: string;
  prevLabel: string;
  nextLabel: string;
}

function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ''));
}

const ProjectGallery: FunctionComponent<Props> = ({
  images,
  counterLabel,
  prevLabel,
  nextLabel,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const total = images.length;
  const hasMultiple = total >= 2;

  // Reset when the project changes (images array identity changes).
  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  // Keyboard navigation: only when the gallery is in the DOM and visible.
  useEffect(() => {
    if (!hasMultiple) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActiveIndex((i) => (i - 1 + total) % total);
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((i) => (i + 1) % total);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [hasMultiple, total]);

  const active = images[activeIndex];

  return (
    <div class="project-gallery" ref={rootRef}>
      <div class="project-gallery-primary">
        <img
          key={active.src}
          src={active.src}
          srcset={active.srcset || undefined}
          sizes={active.sizes || undefined}
          width={active.width}
          height={active.height}
          alt={active.alt}
          loading="lazy"
          decoding="async"
        />
        {hasMultiple && (
          <>
            <button
              type="button"
              class="project-gallery-arrow project-gallery-arrow-prev"
              aria-label={prevLabel}
              onClick={() => setActiveIndex((i) => (i - 1 + total) % total)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              class="project-gallery-arrow project-gallery-arrow-next"
              aria-label={nextLabel}
              onClick={() => setActiveIndex((i) => (i + 1) % total)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            <p
              class="project-gallery-counter"
              aria-live="polite"
              aria-label={format(counterLabel, { n: activeIndex + 1, total })}
            >
              <span class="project-gallery-counter-current">{activeIndex + 1}</span>
              <span class="project-gallery-counter-sep">/</span>
              <span class="project-gallery-counter-total">{total}</span>
            </p>
          </>
        )}
      </div>
      {active.caption && <p class="project-gallery-caption">{active.caption}</p>}
    </div>
  );
};

export default ProjectGallery;
