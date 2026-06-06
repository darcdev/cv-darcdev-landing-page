/**
 * Build-time loader for the `posts` content collection.
 *
 * Posts live under `src/content/posts/{locale}/{slug}.md`. This module groups
 * them by locale and exposes serializable metadata for client islands plus
 * helpers for the slug page.
 *
 * Used at SSG time only — never imported from client code (content collections
 * are async and tree-shaken from the browser bundle).
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { defaultLocale, supportedCodes, isLocaleCode, resolveLocale } from '../i18n/config';
import { resolvePostHero } from '../lib/images';
import type { ResolvedImage } from '../lib/imageTypes';

export type CoverPattern = 'rag' | 'spec' | 'mcp' | 'arch' | 'oss' | 'pr';

/** Listing-level data (no body). Safe to serialize into an island prop. */
export interface PostMeta {
  /** Slug without locale prefix, derived from the filename (e.g. "rag-en-produccion"). */
  id: string;
  /** Locale this entry belongs to. */
  locale: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  /** Display-formatted date for this locale. */
  date: string;
  /** ISO date — used for sorting only. */
  isoDate: string;
  readMin: number;
  featured: boolean;
  cover: CoverPattern;
  /**
   * Optional hero image, pre-resolved at SSG for the listing context (`'card'`).
   * `null` (or omitted) → caller renders the SVG cover-pattern fallback.
   */
  heroImage?: ResolvedImage | null;
}

export type PostsByLocale = Record<string, PostMeta[]>;

/** Parses an entry id like "es/rag.md" → { locale: "es", slug: "rag" }. */
function splitEntryId(entryId: string): { locale: string; slug: string } | null {
  const [locale, ...rest] = entryId.split('/');
  if (!locale || rest.length === 0) return null;
  const slug = rest.join('/').replace(/\.(md|mdx)$/, '');
  return { locale, slug };
}

function toMeta(
  entry: CollectionEntry<'posts'>,
  locale: string,
  slug: string,
  heroImage: ResolvedImage | null,
): PostMeta {
  return {
    id: slug,
    locale,
    title: entry.data.title,
    excerpt: entry.data.excerpt,
    category: entry.data.category,
    tags: entry.data.tags ?? [],
    date: entry.data.displayDate,
    isoDate: entry.data.pubDate.toISOString().slice(0, 10),
    readMin: entry.data.readMin,
    featured: entry.data.featured ?? false,
    cover: entry.data.cover,
    heroImage,
  };
}

/**
 * Loads every post grouped by locale. Each locale array is sorted by pubDate
 * descending. If a slug only exists in the default locale, it appears only in
 * that bucket — consumers decide how to fall back.
 */
export async function loadPostsByLocale(): Promise<PostsByLocale> {
  const all = await getCollection('posts');
  const byLocale: PostsByLocale = {};
  for (const code of supportedCodes) byLocale[code] = [];

  // Resolve every entry's listing-size hero in parallel.
  const resolvedEntries = await Promise.all(
    all.map(async (entry) => {
      const parsed = splitEntryId(entry.id);
      if (!parsed) return null;
      if (!isLocaleCode(parsed.locale)) return null;
      const hero = await resolvePostHero(entry, resolveLocale(parsed.locale), 'card');
      return { entry, parsed, hero };
    }),
  );

  for (const item of resolvedEntries) {
    if (!item) continue;
    byLocale[item.parsed.locale].push(
      toMeta(item.entry, item.parsed.locale, item.parsed.slug, item.hero),
    );
  }

  for (const code of Object.keys(byLocale)) {
    byLocale[code].sort((a, b) => (a.isoDate < b.isoDate ? 1 : a.isoDate > b.isoDate ? -1 : 0));
  }

  return byLocale;
}

/**
 * Returns the unique slugs known across all locales (used by the slug page to
 * generate static paths). The default-locale entry is the canonical source —
 * a slug only present in a non-default locale is ignored to keep the route
 * surface predictable.
 */
export async function loadDefaultLocaleSlugs(): Promise<string[]> {
  const all = await getCollection('posts', ({ id }: { id: string }) => id.startsWith(`${defaultLocale}/`));
  return all
    .map((e: CollectionEntry<'posts'>) => splitEntryId(e.id)?.slug)
    .filter((s: string | undefined): s is string => Boolean(s));
}

/**
 * Resolves a single post entry for a given (locale, slug). Falls back to the
 * default locale if the requested locale lacks a translation for that slug.
 */
export async function loadPostEntry(
  locale: string,
  slug: string,
): Promise<{ entry: CollectionEntry<'posts'>; locale: string } | null> {
  const tryGet = async (code: string) => {
    const entry = await getEntry('posts', `${code}/${slug}` as `${string}/${string}`);
    return entry ?? null;
  };

  const requested = await tryGet(locale);
  if (requested) return { entry: requested, locale };

  if (locale !== defaultLocale) {
    const fallback = await tryGet(defaultLocale);
    if (fallback) return { entry: fallback, locale: defaultLocale };
  }
  return null;
}
