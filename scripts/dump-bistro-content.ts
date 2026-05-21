import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN
if (!projectId || !token) throw new Error('Missing env')

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false })

async function main() {
  const page = await client.fetch(`*[_type == "bistroPage" && _id == "bistroPage"][0]{
    "heroHeadline": heroHeadline.pl,
    "menuIntroHeading": menuIntroHeading.pl,
    "menuIntroBody": menuIntroBody.pl,
    "centralBanner": centralBanner.pl,
    "hoursText": hoursText.pl
  }`)
  const cats = await client.fetch(`*[_type == "menuCategory" && cuisine == "bistro"] | order(order asc){
    "name": name.pl,
    "slug": slug.current,
    "description": description.pl,
    "items": *[_type == "menuItem" && references(^._id) && available == true] | order(order asc){
      "name": name.pl,
      "description": description.pl,
      price
    }
  }`)
  console.log(JSON.stringify({ page, cats }, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
