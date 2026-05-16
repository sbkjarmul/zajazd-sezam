import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['pl', 'en'],
  defaultLocale: 'pl',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/imprezy-okolicznosciowe': {
      pl: '/imprezy-okolicznosciowe',
      en: '/events',
    },
    '/restauracja': {
      pl: '/restauracja',
      en: '/restaurant',
    },
    '/restauracja/menu': {
      pl: '/restauracja/menu',
      en: '/restaurant/menu',
    },
    '/bistro': '/bistro',
    '/hotel': '/hotel',
    '/kontakt': {
      pl: '/kontakt',
      en: '/contact',
    },
  },
})

export type Locale = (typeof routing.locales)[number]
export type Pathname = keyof typeof routing.pathnames
