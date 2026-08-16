function assertEnv(name: string, value: string | undefined, fallback?: string): string {
  if (value && value.length > 0) return value
  if (fallback !== undefined) return fallback
  throw new Error(`Missing environment variable: ${name}`)
}

// Pełny URL strony, bez końcowego slasha.
//
// Kolejnosc rozstrzygania:
//   1. NEXT_PUBLIC_SITE_URL - jawna, docelowa domena (https://zajazdsezam.pl).
//   2. VERCEL_PROJECT_PRODUCTION_URL - domena produkcyjna projektu, ktora Vercel
//      wstrzykuje automatycznie do KAZDEGO deploymentu (takze preview). Dzieki
//      temu deploy bez recznie ustawionej zmiennej nie generuje canonicali i
//      sitemapy wskazujacych na localhost.
//   3. localhost - praca lokalna.
//
// Punkt 2 jest zabezpieczeniem, nie docelowa konfiguracja: gdy domena
// zajazdsezam.pl bedzie podpieta, ustaw NEXT_PUBLIC_SITE_URL, inaczej canonical
// zostanie na *.vercel.app.
//
// Wszystkie miejsca uzycia SITE_URL sa server-side (robots, sitemap, metadata,
// JSON-LD, maile), wiec zmienne bez prefiksu NEXT_PUBLIC_ sa tu dostepne.
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL

  // Jawna wartosc wygrywa, ale nie wtedy gdy wskazuje localhost na deployu -
  // to zawsze pomylka konfiguracyjna, a jej skutkiem jest canonical do localhost.
  if (explicit && !(vercelProductionUrl && explicit.includes('localhost'))) {
    return explicit
  }
  if (vercelProductionUrl) return `https://${vercelProductionUrl}`

  return assertEnv('NEXT_PUBLIC_SITE_URL', explicit, 'http://localhost:3000')
}

export const SITE_URL = resolveSiteUrl().replace(/\/$/, '')

// Czy ten build jest publicznie indeksowalny. Na Vercelu deploye `preview`
// (kazdy branch/PR) MUSZA zostac zablokowane, inaczej Google zaindeksuje
// dziesiatki kopii strony. Poza Vercelem decyduje NODE_ENV + brak localhosta.
export const IS_INDEXABLE_DEPLOYMENT = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === 'production'
  : process.env.NODE_ENV === 'production' && !SITE_URL.includes('localhost')
