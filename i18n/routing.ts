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
    '/galeria': {
      pl: '/galeria',
      en: '/gallery',
    },
    '/kontakt': {
      pl: '/kontakt',
      en: '/contact',
    },
    '/regulamin': {
      pl: '/regulamin',
      en: '/terms',
    },
    '/polityka-prywatnosci': {
      pl: '/polityka-prywatnosci',
      en: '/privacy-policy',
    },
  },
})

export type Locale = (typeof routing.locales)[number]
export type Pathname = keyof typeof routing.pathnames
