/**
 * Patch istniejących kategorii menu polem `cuisine`.
 * - Bistro: pierogi-porcja, inne-przysmaki, oferta-na-kg
 * - Restauracja: wszystkie pozostałe
 *
 * Uruchomienie: node --env-file=.env.local --experimental-strip-types scripts/patch-menu-cuisine.ts
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

const BISTRO_SLUGS = new Set(['pierogi-porcja', 'inne-przysmaki', 'oferta-na-kg'])

async function main() {
  const categories = await client.fetch<Array<{ _id: string; slug: string }>>(`
    *[_type == "menuCategory"] { _id, "slug": slug.current }
  `)

  for (const c of categories) {
    const cuisine = BISTRO_SLUGS.has(c.slug) ? 'bistro' : 'restaurant'
    await client.patch(c._id).set({ cuisine }).commit()
    console.log(`✓ ${c.slug} → ${cuisine}`)
  }
  console.log(`\nPatched ${categories.length} categories.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
