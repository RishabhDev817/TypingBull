import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://typingbull.com',
  integrations: [react(), tailwind()],
  i18n: {
    // English is the default locale
    defaultLocale: 'en',

    // Supported 9 locales
    locales: ['en', 'es', 'ja', 'fr', 'de', 'pt', 'ko', 'it', 'hi'],

    // Routing strategy:
    // prefixDefaultLocale: false ensures:
    //   - English (en) is served at root: '/'
    //   - Other locales use sub-paths: '/es/', '/ja/', '/fr/', '/de/', '/pt/', '/ko/', '/it/', '/hi/'
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },

    // Fallback locale if translations are not available
    fallback: {
      es: 'en',
      ja: 'en',
      fr: 'en',
      de: 'en',
      pt: 'en',
      ko: 'en',
      it: 'en',
      hi: 'en',
    },
  },
});
