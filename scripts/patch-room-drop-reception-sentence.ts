/**
 * Usuwa z opisów pokoi (roomType.description) zdanie o dobieraniu konfiguracji
 * łóżek przez recepcję — PL i jego odpowiednik EN. Idempotentny: pomija pokoje,
 * które tego zdania już nie mają.
 *
 * Uruchomienie: node --env-file=.env.local --experimental-strip-types scripts/patch-room-drop-reception-sentence.ts
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

const SENTENCES = [
  'Recepcja dobierze konfigurację łóżek do liczby gości.',
  'Reception will match bed configuration to your party size.',
]

const strip = (text: string | undefined) => {
  if (!text) return text
  let out = text
  for (const sentence of SENTENCES) out = out.replace(sentence, '')
  // Zwiń spacje osierocone po wyciętym zdaniu i utnij ogon.
  return out.replace(/\s{2,}/g, ' ').trim()
}

type Room = {
  _id: string
  name?: { pl?: string }
  description?: { pl?: string; en?: string }
}

async function main() {
  const rooms = await client.fetch<Room[]>(
    `*[_type == "roomType"] | order(order asc) { _id, name, description }`,
  )

  for (const room of rooms) {
    const pl = strip(room.description?.pl)
    const en = strip(room.description?.en)
    if (pl === room.description?.pl && en === room.description?.en) {
      console.log(`- ${room.name?.pl ?? room._id}: bez zmian`)
      continue
    }
    await client
      .patch(room._id)
      .set({ description: { ...room.description, pl, en } })
      .commit()
    console.log(`✓ ${room.name?.pl ?? room._id}`)
    console.log(`    PL: ${pl}`)
    console.log(`    EN: ${en}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
