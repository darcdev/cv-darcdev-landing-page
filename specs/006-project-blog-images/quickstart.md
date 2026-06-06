# Quickstart — Project & Blog Images

**Feature**: `006-project-blog-images`

This is the verification + authoring guide for the feature. It tells the implementer how to confirm the feature works end-to-end, and tells future authors how to add images to a project or post without reading source code.

---

## Verification (after implementation lands)

Run from the repo root:

```bash
npm install            # only if dependencies changed (none planned)
npm run build          # MUST run astro check + i18n:check + images:check + astro build
```

Expected:
- All three `*:check` steps pass with exit code 0.
- `astro build` produces `dist/` with optimized image variants under `dist/_astro/`.
- Lighthouse audit on a project page with images: Performance ≥ 90, Accessibility ≥ 95 (constitution gate).

---

### Manual verification checklist

After `npm run dev`:

#### Project gallery (P1)

- [ ] Open the projects section, click a project that has images authored.
- [ ] Modal shows the **first image** as the primary visual.
- [ ] Below it, a **thumbnail strip** shows all images in authored order.
- [ ] Click a thumbnail → primary swaps to the chosen image.
- [ ] Press **→** key → next image becomes primary; thumbnail highlights it.
- [ ] Press **←** key → previous image becomes primary.
- [ ] Tab order goes: close button → live link → primary image → each thumbnail.
- [ ] Open a project with **only one** image → no thumbnail strip, no nav controls.
- [ ] Open a project with **zero** images → SVG cover pattern renders unchanged (byte-identical to today).
- [ ] Resize to 360 px width → all gallery controls remain ≥ 44×44 px and reachable.

#### Project card thumbnail (P1)

- [ ] In the project grid, projects with images show the first image as the card cover.
- [ ] Projects without images show the SVG cover pattern unchanged.
- [ ] No layout shift when scrolling the grid (aspect ratio reserved).

#### Blog post hero (P1)

- [ ] Open the blog index — posts with `heroImage` show the image in the card slot; posts without show the SVG pattern.
- [ ] Open a post detail page that has `heroImage` — image renders prominently above the article body.
- [ ] Open a post with no hero — page looks identical to before this feature shipped.

#### Locale-aware alt text (P2)

- [ ] Switch language ES → EN. Alt text on every gallery image and hero image swaps without a full reload.
- [ ] If a project image has alt only in `es`, switching to `en` falls back to the `es` text (no empty alt).
- [ ] No image anywhere has an empty `alt` attribute (use browser dev tools or run `npm run images:check`).

#### Failure modes

- [ ] Author a project with `kind: 'external'` and an unreachable URL → page still loads, that slot shows the SVG cover pattern fallback (no broken-image icon visible).
- [ ] Author a project pointing at a missing local file → `npm run build` fails with a clear error naming the project id and path.
- [ ] Author a project image with no `alt` in the default locale → `npm run build` fails with a clear error.

---

## Authoring guide

### Add images to a project

1. Drop image files under:

   ```text
   src/assets/images/projects/<project-id>/01-overview.png
   src/assets/images/projects/<project-id>/02-detail.png
   src/assets/images/projects/<project-id>/03-flow.png
   ```

   File names control nothing at runtime — they're only for human ordering inside the folder. The render order is set by the `images` array in `src/data/projects.ts`.

2. In `src/data/projects.ts`, add an `images` array to the project's shared entry:

   ```ts
   {
     id: 'rag-agent',
     // ... existing shared fields ...
     cover: 'rag',
     images: [
       { kind: 'local',    path: 'rag-agent/01-overview.png' },
       { kind: 'local',    path: 'rag-agent/02-detail.png' },
       { kind: 'external', url:  'https://docs.example.com/diagrams/rag.svg' },
     ],
   }
   ```

   `path` is relative to `src/assets/images/projects/`.

3. In **the same file**, add a matching `images` array to **every locale** under `PROJECTS_BY_LOCALE`:

   ```ts
   es: {
     'rag-agent': {
       // ... existing translated fields ...
       images: [
         { alt: 'Vista general del agente RAG en producción.' },
         { alt: 'Detalle del pipeline de embedding y reranking.', caption: 'Pipeline de embedding y reranking.' },
         { alt: 'Diagrama externo del flujo RAG.' },
       ],
     },
   },
   en: {
     'rag-agent': {
       // ... existing translated fields ...
       images: [
         { alt: 'Overview of the RAG agent in production.' },
         { alt: 'Detail of the embedding and reranking pipeline.', caption: 'Embedding and reranking pipeline.' },
         { alt: 'External diagram of the RAG flow.' },
       ],
     },
   },
   ```

   - Default locale (`es`) MUST have one entry per source image, with non-empty `alt`. Build fails otherwise.
   - Non-default locales MAY have shorter arrays; missing entries fall back to the default-locale alt.
   - `caption` is optional. Set it only when you want a visible caption under the primary image.

4. Run `npm run images:check` to confirm parity. Run `npm run dev` to preview.

### Add a hero image to a blog post

1. Drop the image under `src/assets/images/posts/<post-slug>.{png|jpg|webp|avif}`.

2. Edit the post's frontmatter:

   ```yaml
   ---
   title: "RAG en producción"
   # ... existing fields ...
   heroImage: ../../../assets/images/posts/rag-en-produccion.png
   heroImageAlt:
     es: "Diagrama del pipeline RAG en producción mostrando ingesta, embedding y rerank."
     en: "RAG production pipeline diagram showing ingestion, embedding, and rerank stages."
   ---
   ```

   Or, for an externally-hosted image:

   ```yaml
   heroImageUrl: https://example.com/diagrams/rag.svg
   heroImageAlt:
     es: "..."
     en: "..."
   ```

   `heroImage` and `heroImageUrl` are **mutually exclusive**. Set exactly one.

3. `heroImageAlt.es` is **required** when any hero is set. Build fails otherwise.

### Remove an image

- **Project**: delete the entry from the `images` array in **every locale** map AND in `PROJECTS_SHARED`. Optionally delete the file under `src/assets/images/projects/<project-id>/` if no longer referenced.
- **Post**: remove `heroImage` / `heroImageUrl` and `heroImageAlt` from the frontmatter. Optionally delete the file.

The SVG cover pattern automatically takes over the moment the array is empty / fields are absent.

### Reorder gallery images

Reorder the entries in the **shared** `images` array — that's the source of truth. Then update each locale's `images` array to match (entries are paired by index, not by id).

---

## Add a new language

Already covered by the existing i18n quickstart (`specs/005-i18n-translation/quickstart.md`). For images specifically:

1. After adding the new locale code in `src/i18n/config.ts`, TypeScript will require an entry in every per-project locale map under `PROJECTS_BY_LOCALE` — including the new `images: []` array (or, ideally, translated alt text).
2. Posts: add the new locale code as a key under each post's `heroImageAlt:` map. Missing it produces a build warning, not a failure (graceful degradation).
3. Run `npm run images:check` to see which projects/posts are missing translations for the new locale.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Build error: `images:check failed — file not found: …` | The `path` in `PROJECTS_SHARED` doesn't match a file on disk | Check spelling; remember `path` is relative to `src/assets/images/projects/` |
| Build error: `default-locale alt missing for <project-id>[2]` | Default-locale (`es`) `images` array is shorter than the shared array | Add the missing alt entry; do not silence by leaving an empty string |
| Warning: `images.alt missing for <project-id>[1] in en` | English alt text is missing for the second image of `<project-id>` | Add the missing translation (warning, not failure — site still builds) |
| Visitor sees an SVG cover instead of the expected external image | External URL failed to load (network or 404) | Open the URL in a browser; if 404, fix the URL or move the asset local |
| Lighthouse Performance dropped after adding images | Originals are huge or you used external URLs that bypass optimization | Move to local assets when possible; keep originals < 1 MB before relying on the build pipeline |
