// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import vercel from '@astrojs/vercel/static';

export default defineConfig({
  integrations: [preact()],

  // Fully static. There is no SSR route left: the ask demo calls Gemini straight
  // from the browser with PUBLIC_GEMINI_API_KEY, so nothing needs a server.
  //
  // WHY THE STATIC ADAPTER AND NOT THE SERVERLESS ONE: @astrojs/vercel@7's
  // serverless adapter picks the function runtime from a hardcoded table that
  // only knows Node 18 and 20 (see SUPPORTED_NODE_VERSIONS in
  // dist/serverless/adapter.js). Vercel builds on Node 24, falls through to
  // `return 'nodejs18.x'`, and Vercel no longer offers 18.x at all — the build
  // succeeded and the DEPLOY failed. The static adapter never touches Node
  // runtimes, so that whole failure mode is gone rather than patched.
  output: 'static',
  adapter: vercel(),

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
});
