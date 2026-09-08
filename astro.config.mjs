// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  integrations: [preact()],

  // 'hybrid' = todo se pre-renderiza estático por defecto, y una ruta opta por
  // salir con `export const prerender = false`. Hoy la única que lo hace es
  // src/pages/api/ask.ts, que necesita servidor para leer GEMINI_API_KEY sin
  // exponerla al browser. El resto del sitio sigue siendo HTML estático, igual
  // de rápido que antes.
  output: 'hybrid',
  adapter: vercel({
    // Gemini 3.x razona antes de responder, así que una respuesta real tarda
    // varios segundos. El default de Vercel Hobby son 10s, por debajo del
    // TIMEOUT_MS de 20s en gemini.ts — sin esto Vercel mata la request antes
    // de que nuestro propio timeout pueda degradar con elegancia.
    maxDuration: 30,
  }),

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
});
