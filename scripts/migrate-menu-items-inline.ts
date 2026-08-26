/**
 * Migracja menu: pozycje z osobnych dokumentow `menuItem` -> tablica
 * `menuCategory.items` (obiekty inline).
 *
 * Kolejnosc w tablicy bierze sie z dotychczasowego pola `order`, wiec strona
 * renderuje sie identycznie jak przed migracja. `_key` liczymy deterministycznie
 * z ID zrodlowego dokumentu — dzieki temu ponowne uruchomienie skryptu nadpisuje
 * te same pozycje zamiast dublowac.
 *
 * Skrypt NIE kasuje starych dokumentow — to osobny krok, dopiero po weryfikacji
 * (patrz --delete-legacy nizej).
 *
 * Uruchomienie:
 *   npx tsx --env-file=.env.local scripts/migrate-menu-items-inline.ts
 *   npx tsx --env-file=.env.local scripts/migrate-menu-items-inline.ts --delete-legacy
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
if (!token) throw new Error('Missing SANITY_API_TOKEN in .env.local')

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false })

const deleteLegacy = process.argv.includes('--delete-legacy')

type LegacyItem = {
  _id: string
  name?: unknown
  description?: unknown
  price?: number
  diet?: string[]
  image?: unknown
  available?: boolean
}

type Category = {
  _id: string
  cuisine?: string
  nameP?: string
  items: LegacyItem[]
}

// Sanity wymaga unikalnego `_key` w tablicy. ID dokumentu jest juz unikalne w
// obrebie kategorii, wystarczy oczyscic je ze znakow spoza [A-Za-z0-9_-].
const keyFor = (id: string) => id.replace(/[^A-Za-z0-9_-]/g, '-')

async function main() {
  const categories = await client.fetch<Category[]>(`
    *[_type == "menuCategory"] | order(cuisine asc, order asc) {
      _id,
      cuisine,
      "nameP": name.pl,
      "items": *[_type == "menuItem" && references(^._id)] | order(order asc) {
        _id, name, description, price, diet, image, available
      }
    }
  `)

  let migrated = 0
  const tx = client.transaction()

  for (const category of categories) {
    const items = category.items.map((item) => ({
      _type: 'menuItem',
      _key: keyFor(item._id),
      ...(item.name ? { name: item.name } : {}),
      ...(item.description ? { description: item.description } : {}),
      ...(typeof item.price === 'number' ? { price: item.price } : {}),
      ...(item.diet?.length ? { diet: item.diet } : {}),
      ...(item.image ? { image: item.image } : {}),
      available: item.available !== false,
    }))

    tx.patch(category._id, (p) => p.set({ items }))
    migrated += items.length
    console.log(
      `${(category.cuisine ?? '?').padEnd(11)} ${String(items.length).padStart(3)} poz.  ${category.nameP}`,
    )
  }

  await tx.commit()
  console.log(`\nPrzeniesiono ${migrated} pozycji do ${categories.length} kategorii.`)

  if (!deleteLegacy) {
    console.log(
      'Stare dokumenty menuItem zostaly nietkniete (uzyj --delete-legacy po weryfikacji).',
    )
    return
  }

  const legacyIds = await client.fetch<string[]>(`*[_type == "menuItem"]._id`)
  if (legacyIds.length === 0) {
    console.log('Brak starych dokumentow menuItem do usuniecia.')
    return
  }

  const del = client.transaction()
  for (const id of legacyIds) del.delete(id)
  await del.commit()
  console.log(`Usunieto ${legacyIds.length} starych dokumentow menuItem.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
