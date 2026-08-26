/**
 * Sprzatanie menu: usuwa z dokumentow pola, ktorych aplikacja nie renderuje.
 *
 *   menuCategory.slug        -> kotwica sekcji liczona z nazwy (lib/menu/categoryAnchor.ts)
 *   menuCategory.items[].diet
 *   menuCategory.items[].image
 *
 * Sciezka musi miec FILTR, nie samo `[]` — `items[_key != ""].pole` zdejmuje
 * pole ze wszystkich elementow tablicy. Wariant `items[].pole` przechodzi bez
 * bledu, ale nie usuwa niczego.
 *
 * Uruchomienie: npx tsx --env-file=.env.local scripts/strip-unused-menu-fields.ts
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
if (!token) throw new Error('Missing SANITY_API_TOKEN in .env.local')

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false })

async function main() {
  const before = await client.fetch<{ slug: number; diet: number; image: number }>(`{
    "slug": count(*[_type == "menuCategory" && defined(slug)]),
    "diet": count(*[_type == "menuCategory"].items[count(diet) > 0]),
    "image": count(*[_type == "menuCategory"].items[defined(image)])
  }`)
  console.log('przed:', before)

  const ids = await client.fetch<string[]>(`*[_type == "menuCategory"]._id`)
  const tx = client.transaction()
  for (const id of ids) {
    tx.patch(id, (p) => p.unset(['slug', 'items[_key != ""].diet', 'items[_key != ""].image']))
  }
  await tx.commit()

  const after = await client.fetch<{ slug: number; diet: number; image: number }>(`{
    "slug": count(*[_type == "menuCategory" && defined(slug)]),
    "diet": count(*[_type == "menuCategory"].items[count(diet) > 0]),
    "image": count(*[_type == "menuCategory"].items[defined(image)])
  }`)
  console.log('po:   ', after)
  console.log(
    after.slug === 0 && after.diet === 0 && after.image === 0
      ? `Wyczyszczone w ${ids.length} kategoriach.`
      : 'UWAGA: zostaly niewyczyszczone pola.',
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
