import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) throw new Error('Missing env')

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function main() {
  const categories = await client.fetch<
    Array<{
      _id: string
      name: { pl: string }
      slug: string
      order: number
      cuisine: string
      itemCount: number
    }>
  >(`
    *[_type == "menuCategory"] | order(order asc) {
      _id,
      name,
      "slug": slug.current,
      order,
      cuisine,
      "itemCount": count(items)
    }
  `)
  console.log('Categories:')
  for (const c of categories) {
    console.log(
      `  ${c.order ?? '?'}. [${c.cuisine}/${c.slug}] ${c.name?.pl} — ${c.itemCount} items (id=${c._id})`,
    )
  }

  const grouped = await client.fetch<
    Array<{ category: string; items: Array<{ name: string; price: number }> | null }>
  >(`
    *[_type == "menuCategory"] | order(cuisine asc, order asc) {
      "category": cuisine + "/" + slug.current,
      items[]{ "name": name.pl, price }
    }
  `)
  const items = grouped.flatMap((g) =>
    (g.items ?? []).map((it) => ({ ...it, category: g.category })),
  )
  console.log('\nTotal items:', items.length)
  const byCategory: Record<string, string[]> = {}
  for (const it of items) {
    const cat = it.category ?? 'NO_CATEGORY'
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(`${it.name} (${it.price} zł)`)
  }
  for (const [cat, list] of Object.entries(byCategory)) {
    console.log(`\n=== ${cat} (${list.length}) ===`)
    list.forEach((it) => console.log('  -', it))
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
