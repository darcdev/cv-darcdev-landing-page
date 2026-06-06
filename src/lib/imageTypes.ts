/**
 * Types-only module for resolved image descriptors.
 *
 * Split from src/lib/images.ts so Preact islands can `import type` it without
 * pulling Astro server-only APIs (getImage()) into the client bundle.
 *
 * Contract: contracts/image-api.md §1 / data-model.md §5.
 */

/**
 * A render-ready image descriptor produced at SSG by `src/lib/images.ts` and
 * passed as a serializable prop into Astro components and Preact islands.
 *
 * Invariants enforced by the resolver:
 *   - `src` is non-empty.
 *   - `width` and `height` are positive integers (used to reserve aspect ratio
 *     and prevent CLS — FR-023).
 *   - `alt` is non-empty (default-locale fallback already applied by the resolver).
 */
export interface ResolvedImage {
  /** Final URL for the largest variant (used as <img src>). */
  src: string;
  /** Responsive srcset string ("url 480w, url 768w, …"). Empty for external URLs. */
  srcset: string;
  /** Sizes attribute hint matching the rendering context. */
  sizes: string;
  /** Intrinsic width in pixels (positive integer). */
  width: number;
  /** Intrinsic height in pixels (positive integer). */
  height: number;
  /** Final format. Only meaningful for local images. */
  format?: 'avif' | 'webp' | 'png' | 'jpeg';
  /** Resolved alt text in the requested locale (with fallback already applied). */
  alt: string;
  /** Optional caption (only meaningful for project images). */
  caption?: string;
}
