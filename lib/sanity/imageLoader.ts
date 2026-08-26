/**
 * Custom loader dla `next/image` — podpiety globalnie przez `images.loaderFile`
 * w next.config.ts.
 *
 * PO CO: domyslnie kazde zdjecie szlo przez `/_next/image`, czyli optymalizator
 * Vercela. Zeby zrobic miniature 640px, Vercel musial najpierw SCIAGNAC Z SANITY
 * CALY ORYGINAL — a w tym projekcie oryginaly maja do 11 MB (5450x8171 px),
 * lacznie 223 pliki / 627 MB. Kazdy nowy wariant (szerokosc x format x jakosc)
 * to kolejne pobranie oryginalu, a `formats: ['image/avif','image/webp']`
 * mnozylo to jeszcze przez dwa. Ten ruch Vercel liczy jako **Fast Origin
 * Transfer**, ktorego plan Hobby daje 10 GB/mies — i to on sie wyczerpal, przy
 * praktycznie zerowym ruchu uzytkownikow.
 *
 * JAK DZIALA: zamiast Vercela miniature robi CDN Sanity, ktory ma transformacje
 * w cenie planu. Do URL-a assetu dokladamy parametry, a przegladarka dostaje
 * gotowy plik (~150 kB zamiast 11 MB) prosto z brzegu Sanity:
 *   ?w=<szerokosc>&q=<jakosc>&auto=format&fit=max
 *   - auto=format  -> Sanity sam wybiera AVIF/WebP wg naglowka Accept
 *                     (znika mnoznik x2 za dwa formaty po naszej stronie)
 *   - fit=max      -> nigdy nie powieksza ponad oryginal
 *
 * Efekt: pozycje Image Optimization i Fast Origin Transfer u Vercela schodza
 * do zera, a Sanity wysyla przeskalowane pliki zamiast oryginalow.
 *
 * WAZNE: loader jest GLOBALNY, wiec dostaje tez zrodla spoza Sanity (lokalne
 * ikony SVG z /public, logo przez rewrite /sanity-cdn/). Takie src zwracamy
 * bez zmian — Next poda je przegladarce w oryginalnej postaci.
 */

type LoaderArgs = { src: string; width: number; quality?: number }

const SANITY_HOSTS = ['https://cdn.sanity.io/', '/sanity-cdn/']
const DEFAULT_QUALITY = 75

export default function sanityImageLoader({ src, width, quality }: LoaderArgs): string {
  const isSanity = SANITY_HOSTS.some((host) => src.startsWith(host))
  if (!isSanity) return src

  // SVG (logo w headerze) — transformacja rastrowa zniszczylaby wektor.
  const pathname = src.split('?')[0].toLowerCase()
  if (pathname.endsWith('.svg')) return src

  const params = new URLSearchParams({
    w: String(width),
    q: String(quality ?? DEFAULT_QUALITY),
    auto: 'format',
    fit: 'max',
  })
  const separator = src.includes('?') ? '&' : '?'
  return `${src}${separator}${params.toString()}`
}
