/**
 * Seed menu Bistro Sezam — wg tablic kredowych w lokalu.
 *   - 6 kategorii (danie-dnia, zupy, zapiekanki, pierogi-porcja, kuchnia-domowa, napoje)
 *   - Bistro serwuje SAME LISTY dań — bez cen (price pomijamy)
 *   - Danie dnia jako pierwsza sekcja (najniższy order)
 *   - Czyści poprzednie kategorie/pozycje Bistro przed ponownym seedem
 *
 * Uruchomienie: node --env-file=.env.local --experimental-strip-types scripts/seed-bistro-menu.ts
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
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const ls = (pl: string, en: string) => ({ pl, en })

const CATEGORIES = [
  {
    slug: 'polecamy',
    name: ls('Polecamy', 'Recommended'),
    order: 10,
  },
  {
    slug: 'zupy',
    name: ls('Zupy', 'Soups'),
    order: 20,
  },
  {
    slug: 'zapiekanki',
    name: ls('Zapiekanki', 'Baked baguettes'),
    order: 30,
  },
  {
    slug: 'pierogi-porcja',
    name: ls('Pierogi — porcja 14 sztuk', 'Pierogi — 14-piece portion'),
    order: 40,
  },
  {
    slug: 'kuchnia-domowa',
    name: ls('Kuchnia domowa', 'Home cooking'),
    order: 50,
  },
  {
    slug: 'napoje',
    name: ls('Napoje', 'Drinks'),
    order: 60,
  },
]

const ITEMS: Record<string, { pl: string; en: string }[]> = {
  polecamy: [
    { pl: 'Danie dnia', en: 'Dish of the day' },
    { pl: 'Zestaw dnia', en: 'Set meal of the day' },
  ],
  zupy: [
    { pl: 'Zupa gulaszowa', en: 'Goulash soup' },
    { pl: 'Barszcz czerwony z krokietem', en: 'Red borscht with croquette' },
  ],
  zapiekanki: [
    { pl: 'Zapiekanka tradycyjna', en: 'Traditional baked baguette' },
    { pl: 'Zapiekanka z boczkiem', en: 'Baked baguette with bacon' },
    { pl: 'Zapiekanka z kurczakiem', en: 'Baked baguette with chicken' },
    { pl: 'Zapiekanka z salami', en: 'Baked baguette with salami' },
    { pl: 'Tortilla', en: 'Tortilla wrap' },
  ],
  'pierogi-porcja': [
    { pl: 'Ruskie', en: 'Ruskie (potato & cheese)' },
    { pl: 'Z kapustą', en: 'With cabbage' },
    { pl: 'Z kapustą i mięsem', en: 'With cabbage & meat' },
    { pl: 'Ze szpinakiem', en: 'With spinach' },
    { pl: 'Z mięsem', en: 'With meat' },
    { pl: 'Ze słodkim serem', en: 'With sweet cheese' },
    { pl: 'Z jabłkiem i cynamonem', en: 'With apple & cinnamon' },
    { pl: 'Z kaszą i boczkiem', en: 'With groats & bacon' },
    { pl: 'Z płuckami', en: 'With lung (offal)' },
    { pl: 'Z truskawkami', en: 'With strawberries' },
  ],
  'kuchnia-domowa': [
    { pl: 'Bigos', en: "Bigos (hunter's stew)" },
    { pl: 'Knedle', en: 'Knedle (dumplings)' },
    { pl: 'Gołąbki', en: 'Gołąbki (stuffed cabbage rolls)' },
  ],
  napoje: [
    { pl: 'Kawa', en: 'Coffee' },
    { pl: 'Herbata', en: 'Tea' },
    { pl: 'Kompot', en: 'Compote' },
  ],
}

// ID kategorii/pozycji Bistro są namespace'owane prefiksem `-bistro-`, żeby
// nigdy nie kolidować z kategoriami Restauracji o tym samym slugu (np. "zupy").
const catId = (slug: string) => `menuCategory-bistro-${slug}`

async function cleanup() {
  // Kasujemy wyłącznie kategorie Bistro (cuisine == "bistro") i ich pozycje —
  // Restauracji nie dotykamy.
  const catIds: string[] = await client.fetch(
    `*[_type == "menuCategory" && cuisine == "bistro"]._id`,
  )
  if (!catIds.length) {
    console.log('Brak istniejących kategorii Bistro do usunięcia.')
    return
  }
  console.log(`Usuwam ${catIds.length} kategorii Bistro (pozycje siedzą w nich inline)…`)
  let tx = client.transaction()
  for (const id of catIds) tx = tx.delete(id)
  await tx.commit()
}

async function main() {
  await cleanup()

  console.log(`Seedowanie ${CATEGORIES.length} kategorii Bistro…`)
  for (const cat of CATEGORIES) {
    const items = ITEMS[cat.slug] ?? []
    console.log(`  ${cat.name.pl}: ${items.length} pozycji`)

    await client.createOrReplace({
      _id: catId(cat.slug),
      _type: 'menuCategory',
      cuisine: 'bistro',
      name: cat.name,
      slug: { _type: 'slug', current: cat.slug },
      order: cat.order,
      // Pozycje inline — kolejnosc w tablicy = kolejnosc na stronie.
      items: items.map((item, i) => ({
        _type: 'menuItem',
        _key: `${cat.slug}-${i}`,
        name: item,
        available: true,
      })),
    })
  }

  console.log('✓ Done')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
