/**
 * Astro Content Collections config.
 *
 * Posts live under `src/content/posts/{locale}/{slug}.md`. Same filename across
 * locale folders means "same post, different language". The locale folder is
 * the source of truth for which posts exist in which language; if a slug is
 * present in `es/` but missing in `en/`, the loader falls back to the default
 * locale entry at runtime.
 *
 * Adding a new language for posts:
 *   1. Add the locale code to src/i18n/config.ts.
 *   2. Drop matching markdown files under src/content/posts/<code>/.
 */
import { defineCollection, z } from 'astro:content';

const COVER_PATTERNS = ['rag', 'spec', 'mcp', 'arch', 'oss', 'pr'] as const;

const posts = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        excerpt: z.string(),
        category: z.string(),
        tags: z.array(z.string()).default([]),
        /** ISO YYYY-MM-DD — used for sorting (locale-agnostic). */
        pubDate: z.coerce.date(),
        /** Human-readable date already localized (e.g. "12 May 2026", "May 12, 2026"). */
        displayDate: z.string(),
        readMin: z.number().int().positive(),
        featured: z.boolean().default(false),
        cover: z.enum(COVER_PATTERNS),
        /**
         * Optional hero image for the post.
         * Use either `heroImage` (local file under src/assets/images/posts/)
         * OR `heroImageUrl` (absolute https URL) — never both.
         */
        heroImage: image().optional(),
        heroImageUrl: z
          .string()
          .url()
          .regex(/^https:\/\//)
          .optional(),
        /** Per-locale alt text. Default-locale (`es`) entry is REQUIRED when any hero* is set. */
        heroImageAlt: z.record(z.string()).optional(),
      })
      .refine((data) => !(data.heroImage && data.heroImageUrl), {
        message: 'heroImage and heroImageUrl are mutually exclusive — pick one',
        path: ['heroImage'],
      })
      .refine(
        (data) => {
          const hasImage = !!data.heroImage || !!data.heroImageUrl;
          if (!hasImage) return true;
          const altEs = data.heroImageAlt?.es;
          return typeof altEs === 'string' && altEs.trim().length > 0;
        },
        {
          message: 'heroImageAlt.es is required and non-empty when a hero image is set',
          path: ['heroImageAlt'],
        },
      ),
});

export const collections = { posts };
