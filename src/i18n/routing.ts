import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'de', 'fr'],
  defaultLocale: 'en',
  pathnames: {
    '/': {
      en: '/',
      de: '/',
      fr: '/',
    },
    '/pathnames': {
      en: '/pathnames',
      de: '/pfade',      // example translation
      fr: '/chemins',    // example translation
    }
  }
});