/**
 * Seed menu Bistro Sezam:
 *   - 3 kategorie (pierogi-porcja, inne-przysmaki, oferta-na-kg)
 *   - 37 menuItems (placeholder ceny — uzupełnij w Studio)
 *   - Patch bistroPage: menuIntroHeading, menuIntroBody, hoursText
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
    slug: 'pierogi-porcja',
    name: ls('Pierogi — porcja 14 sztuk', 'Pierogi — 14-piece portion'),
    description: ls('', ''),
    order: 10,
    defaultPrice: 25,
  },
  {
    slug: 'inne-przysmaki',
    name: ls('Inne przysmaki', 'Other delicacies'),
    description: ls('', ''),
    order: 20,
    defaultPrice: 22,
  },
  {
    slug: 'oferta-na-kg',
    name: ls('Oferta garmażeryjna na kg', 'Deli — by the kilo'),
    description: ls('', ''),
    order: 30,
    defaultPrice: 50,
  },
]

const ITEMS: Record<string, { pl: string; en: string }[]> = {
  'pierogi-porcja': [
    { pl: 'Pierogi ruskie', en: 'Ruskie pierogi (potato & cheese)' },
    { pl: 'Pierogi z mięsem', en: 'Pierogi with meat' },
    { pl: 'Pierogi z kapustą', en: 'Pierogi with cabbage' },
    { pl: 'Pierogi z kapustą i mięsem', en: 'Pierogi with cabbage & meat' },
    { pl: 'Pierogi z kaszą i boczkiem', en: 'Pierogi with groats & bacon' },
    { pl: 'Pierogi z kaszą i pieczarką', en: 'Pierogi with groats & mushroom' },
    { pl: 'Pierogi ze szpinakiem', en: 'Pierogi with spinach' },
    { pl: 'Pierogi ze słodkim serem', en: 'Pierogi with sweet cheese' },
    { pl: 'Pierogi z jabłkiem i cynamonem', en: 'Pierogi with apple & cinnamon' },
    { pl: 'Pierogi ze śliwką', en: 'Pierogi with plum' },
    { pl: 'Pierogi z bananem', en: 'Pierogi with banana' },
  ],
  'inne-przysmaki': [
    { pl: 'Bigos (350g)', en: 'Bigos (350g)' },
    { pl: 'Barszcz czerwony z krokietem', en: 'Red borscht with croquette' },
    { pl: 'Knedle z mięsem (6 szt)', en: 'Knedle with meat (6 pcs)' },
    { pl: 'Zupa dnia', en: 'Soup of the day' },
    { pl: 'Flaki', en: 'Tripe soup' },
    { pl: 'Fasolka po bretońsku', en: 'Bretagne-style beans' },
  ],
  'oferta-na-kg': [
    { pl: 'Pierogi ruskie', en: 'Ruskie pierogi (potato & cheese)' },
    { pl: 'Pierogi z mięsem', en: 'Pierogi with meat' },
    { pl: 'Pierogi z kapustą', en: 'Pierogi with cabbage' },
    { pl: 'Pierogi z kapustą i mięsem', en: 'Pierogi with cabbage & meat' },
    { pl: 'Pierogi z kaszą i boczkiem', en: 'Pierogi with groats & bacon' },
    { pl: 'Pierogi z kaszą i pieczarką', en: 'Pierogi with groats & mushroom' },
    { pl: 'Pierogi ze szpinakiem', en: 'Pierogi with spinach' },
    { pl: 'Pierogi ze słodkim serem', en: 'Pierogi with sweet cheese' },
    { pl: 'Pierogi z jabłkiem i cynamonem', en: 'Pierogi with apple & cinnamon' },
    { pl: 'Pierogi ze śliwką suszoną', en: 'Pierogi with dried plum' },
    { pl: 'Pierogi z bananem', en: 'Pierogi with banana' },
    { pl: 'Naleśniki z serem', en: 'Pancakes with cheese' },
    { pl: 'Naleśniki z dżemem', en: 'Pancakes with jam' },
    { pl: 'Krokiet z kapustą', en: 'Croquette with cabbage' },
    { pl: 'Krokiet z kapustą i mięsem', en: 'Croquette with cabbage & meat' },
    { pl: 'Kopytka', en: 'Kopytka (potato dumplings)' },
    { pl: 'Gołąbki', en: 'Gołąbki (stuffed cabbage rolls)' },
    { pl: 'Uszka mięsne', en: 'Uszka with meat' },
    { pl: 'Uszka grzybowe', en: 'Uszka with mushroom' },
    { pl: 'Knedle', en: 'Knedle' },
    { pl: 'Knedle z mięsem', en: 'Knedle with meat' },
  ],
}

async function main() {
  console.log(`Seedowanie ${CATEGORIES.length} kategorii Bistro…`)
  for (const cat of CATEGORIES) {
    await client.createOrReplace({
      _id: `menuCategory-${cat.slug}`,
      _type: 'menuCategory',
      name: cat.name,
      slug: { _type: 'slug', current: cat.slug },
      description: cat.description,
      order: cat.order,
    })

    const items = ITEMS[cat.slug] ?? []
    console.log(`  ${cat.name.pl}: ${items.length} pozycji`)
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const slug = item.pl
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]/g, '')
      await client.createOrReplace({
        _id: `menuItem-${cat.slug}-${slug}-${i}`,
        _type: 'menuItem',
        name: item,
        price: cat.defaultPrice,
        category: { _type: 'reference', _ref: `menuCategory-${cat.slug}` },
        available: true,
        order: (i + 1) * 10,
      })
    }
  }

  console.log('Patch bistroPage (intro + hours)…')
  await client
    .patch('bistroPage')
    .set({
      menuIntroHeading: ls('Menu', 'Menu'),
      menuIntroBody: ls(
        'Oferujemy codziennie świeżą porcję garmażerki, wyrabianej z najwyższej jakości towarów.\n\nKorzystamy z produktów od lokalnych przedsiębiorców.\n\nSerwujemy ciepłe dania na miejscu i na wynos.',
        'We serve a fresh portion of homemade specialties every day, made from premium ingredients.\n\nWe source our products from local producers.\n\nWe serve warm dishes for dine-in and takeout.',
      ),
      hoursText: ls(
        'BISTRO Sezam czynne w godz. 6:00 – 18:00 od pon do pt\n6:00 – 13:00 w sobotę\nW niedzielę nieczynne',
        'SEZAM BISTRO open 6:00 – 18:00 Mon – Fri\n6:00 – 13:00 Saturday\nClosed on Sunday',
      ),
    })
    .commit()

  console.log('✓ Done')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
