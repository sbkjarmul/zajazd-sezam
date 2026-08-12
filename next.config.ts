import type { NextConfig } from 'next'
import type { Redirect } from 'next/dist/lib/load-custom-routes'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

// Mapowanie URL-i ze starej strony (Joomla) na nowa strukture (Next + next-intl).
// Stara strona miala: URL-e `index.php/...`, warianty SEF (`/restauracja`), czasem
// prefiks ID (`/index.php/10-imprezy-okolicznosciowe/16-szkolenia`) oraz wersje EN.
// Cele MUSZA byc pelne (z prefiksem locale `/pl`), inaczej next-intl dolozylby drugi
// hop (307 `/hotel` -> `/pl/hotel`). Przekierowania zyja tutaj (nie w proxy.ts), bo
// matcher proxy wyklucza sciezki z kropka (`.*\..*`), a `index.php` ma kropke.
// `permanent: true` => 308 (dla SEO rownowazne 301). Jesli potrzebny literalny 301,
// przeniesc te zrodla do vercel.json ze `statusCode: 301`.
//
// EN: crawl starej strony potwierdzil, ze `/en/` to pusty stub (~2KB, samo logo,
// brak menu/tresci EN) - angielska wersja nigdy nie powstala. Jedyny stary EN URL
// to `/en/`, ktory mapuje sie natywnie na nowy `/en` (istniejaca strona, Next sam
// normalizuje trailing slash). Brak innych sciezek EN do przekierowania.
// Lista PL ponizej pochodzi z crawla menu (kompletna).
const LEGACY_REDIRECTS: { from: string[]; to: string }[] = [
  // Strona glowna
  { from: ['/', '/index.php', '/index.php/home'], to: '/pl' },
  // Hotel (stare "Pokoje" = /zajazd)
  { from: ['/index.php/zajazd', '/zajazd'], to: '/pl/hotel' },
  // Restauracja
  { from: ['/index.php/restauracja', '/restauracja'], to: '/pl/restauracja' },
  { from: ['/index.php/restauracja/menu', '/restauracja/menu'], to: '/pl/restauracja/menu' },
  // Bistro
  { from: ['/index.php/bistro', '/bistro'], to: '/pl/bistro' },
  // Imprezy okolicznosciowe (strona glowna kategorii)
  {
    from: ['/index.php/imprezy-okolicznosciowe', '/imprezy-okolicznosciowe'],
    to: '/pl/imprezy-okolicznosciowe',
  },
  // Podtypy imprez -> jeden cel (decyzja: bez kotwic). Pelna lista z crawla
  // menu starej strony (7 podtypow + wariant z prefiksem ID dla szkolen).
  {
    from: [
      '/index.php/imprezy-okolicznosciowe/wesele',
      '/index.php/imprezy-okolicznosciowe/chrzciny',
      '/index.php/imprezy-okolicznosciowe/komunia',
      '/index.php/imprezy-okolicznosciowe/eventy',
      '/index.php/imprezy-okolicznosciowe/imprezy-rodzinne',
      '/index.php/imprezy-okolicznosciowe/stypy',
      '/index.php/imprezy-okolicznosciowe/szkolenia',
      '/index.php/10-imprezy-okolicznosciowe/16-szkolenia',
    ],
    to: '/pl/imprezy-okolicznosciowe',
  },
  // Catering (stare "atrakcje") -> imprezy
  { from: ['/index.php/atrakcje', '/atrakcje'], to: '/pl/imprezy-okolicznosciowe' },
  // Galeria (nowa strona /galeria budowana rownolegle)
  { from: ['/index.php/galeria', '/galeria'], to: '/pl/galeria' },
  // Rezerwacja (dzis drawer, nie osobna strona) -> hotel
  { from: ['/index.php/rezerwacja', '/rezerwacja'], to: '/pl/hotel' },
  // Kontakt
  { from: ['/index.php/kontakt', '/kontakt'], to: '/pl/kontakt' },
  // Strony prawne (nowe podstrony)
  { from: ['/index.php/zajazd/regulamin', '/zajazd/regulamin'], to: '/pl/regulamin' },
  { from: ['/index.php/home/rodo', '/rodo'], to: '/pl/polityka-prywatnosci' },
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
  async redirects(): Promise<Redirect[]> {
    return LEGACY_REDIRECTS.flatMap(({ from, to }) =>
      from.map((source) => ({ source, destination: to, permanent: true })),
    )
  },
}

export default withNextIntl(nextConfig)
