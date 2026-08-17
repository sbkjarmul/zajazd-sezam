/**
 * Seed strony Galeria:
 *   - galleryPage singleton (eyebrow/title/intro + images[])
 *   - images[] zbierane z ISTNIEJACYCH assetow w datasecie (pokoje, sale, imprezy)
 *     — prawdziwe zdjecia juz wgrane w Studio, nie placeholdery. Punkt startu do
 *     recznej kuracji kolejnosci/zestawu w Studio.
 *
 * Uruchomienie: node --env-file=.env.local --experimental-strip-types scripts/seed-gallery.ts
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
if (!token) throw new Error('Missing SANITY_API_TOKEN in .env.local')

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-05-16',
  token,
  useCdn: false,
})

const ls = (pl: string, en: string) => ({ _type: 'localeString', pl, en })

type LocaleString = { pl?: string | null; en?: string | null } | null
type SourceImage = {
  asset?: { _ref?: string } | null
  alt?: LocaleString
} | null

// Zbieramy surowe obiekty imageWithAlt (z asset._ref) z dokumentow, ktore maja
// najwiecej zdjec miejsca. Kolejnosc query = kolejnosc w galerii (mieszamy typy).
const RAW = await client.fetch<{
  rooms: SourceImage[]
  halls: SourceImage[]
  eventGallery: SourceImage[]
  homeLogo: { asset?: { _ref?: string } | null; alt?: LocaleString } | null
}>(`{
  "rooms": *[_type == "roomType"].images[]{ asset, alt },
  "halls": *[_type == "eventHall"].images[]{ asset, alt },
  "eventGallery": *[_type == "eventType"].gallery[]{ asset, alt },
  "homeLogo": *[_type == "homepage"][0].headerLogo{ asset, alt }
}`)

// Przeplot zrodel, zeby galeria nie byla "8 pokoi, potem 8 sal" tylko mieszana.
function interleave(...lists: SourceImage[][]): SourceImage[] {
  const out: SourceImage[] = []
  const max = Math.max(...lists.map((l) => l.length))
  for (let i = 0; i < max; i++) {
    for (const l of lists) if (l[i]) out.push(l[i])
  }
  return out
}

const combined = interleave(RAW.rooms ?? [], RAW.halls ?? [], RAW.eventGallery ?? [])

// Dedup po asset._ref, odrzuc bez refa. Bierzemy wszystkie unikalne dostepne
// (infinite scroll je porcjuje) — cap tylko jako bezpiecznik.
const MAX_IMAGES = 200
const seen = new Set<string>()
const images = combined
  .filter((img): img is NonNullable<SourceImage> => {
    const ref = img?.asset?._ref
    if (!ref || seen.has(ref)) return false
    seen.add(ref)
    return true
  })
  .slice(0, MAX_IMAGES)
  .map((img, i) => ({
    // Zwykly obraz (_type 'image') — zgodnie ze schematem galleryPage.images.
    // Alt opcjonalny: dolaczamy tylko gdy zrodlo go ma (nie wymuszamy).
    _type: 'image',
    _key: `gal-${i}`,
    asset: { _type: 'reference', _ref: img.asset!._ref },
    ...(img.alt?.pl
      ? { alt: { _type: 'localeString', pl: img.alt.pl, en: img.alt.en ?? img.alt.pl } }
      : {}),
  }))

if (images.length === 0) {
  throw new Error(
    'Brak zdjec zrodlowych w datasecie — wgraj zdjecia w Studio lub uruchom seedy sekcji.',
  )
}

// Logo headera — to samo co na stronie glownej (homepage.headerLogo). Bez tego
// galeria spadala na tekstowy fallback (defaultHeaderLogo w siteSettings = null).
const headerLogoRef = RAW.homeLogo?.asset?._ref
const headerLogo = headerLogoRef
  ? {
      _type: 'imageWithAlt',
      asset: { _type: 'reference', _ref: headerLogoRef },
      alt: {
        _type: 'localeString',
        pl: RAW.homeLogo?.alt?.pl ?? 'Zajazd Sezam',
        en: RAW.homeLogo?.alt?.en ?? RAW.homeLogo?.alt?.pl ?? 'Zajazd Sezam',
      },
    }
  : undefined

const galleryPage = {
  _id: 'galleryPage',
  _type: 'galleryPage',
  ...(headerLogo ? { headerLogo } : {}),
  eyebrow: ls('Galeria', 'Gallery'),
  title: ls('Zobacz to miejsce, zanim do nas przyjedziesz.', 'See this place before you arrive.'),
  images,
}

const result = await client.createOrReplace(galleryPage)
console.log(`✔ galleryPage zapisany z ${images.length} zdjeciami (id: ${result._id})`)
