/**
 * Sprzatanie osieroconych obrazow w Sanity — assetow, do ktorych zaden dokument
 * sie nie odwoluje (pozostalosci po redesignach). NIEODWRACALNE.
 *
 * Domyslnie DRY-RUN (tylko wypisuje). Usuwanie dopiero z flaga --delete.
 * Kazdy asset jest re-sprawdzany pod katem referencji tuz przed kasowaniem
 * (podwojne zabezpieczenie — jesli cos zaczelo go uzywac, zostanie pominiety).
 *
 * Podglad:  node --env-file=.env.local --experimental-strip-types scripts/cleanup-orphan-assets.ts
 * Usuniecie: node --env-file=.env.local --experimental-strip-types scripts/cleanup-orphan-assets.ts --delete
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
if (!token) throw new Error('Missing SANITY_API_TOKEN in .env.local')

const DELETE = process.argv.includes('--delete')

const client = createClient({ projectId, dataset, apiVersion: '2026-05-16', token, useCdn: false })

async function main() {
  const orphans: Array<{ _id: string; file: string | null; kb: number }> = await client.fetch(
    `*[_type=="sanity.imageAsset" && count(*[references(^._id)])==0]{
      _id, "file": originalFilename, "kb": round(size/1024)
    } | order(kb desc)`,
  )

  const totalKb = orphans.reduce((a, b) => a + (b.kb || 0), 0)
  console.log(`Osierocone obrazy: ${orphans.length} (~${Math.round(totalKb / 1024)} MB)`)
  console.log(DELETE ? '>>> TRYB USUWANIA (--delete)\n' : '>>> DRY-RUN (bez --delete nic nie usuwam)\n')

  let deleted = 0
  let skipped = 0
  for (const a of orphans) {
    if (!DELETE) {
      console.log(`  [podglad] ${a._id}  ${a.file ?? '(bez nazwy)'}  ${a.kb}KB`)
      continue
    }
    // Re-check referencji tuz przed kasowaniem.
    const refs = await client.fetch(`count(*[references($id)])`, { id: a._id })
    if (refs > 0) {
      console.log(`  [pomijam — ${refs} ref] ${a.file ?? a._id}`)
      skipped++
      continue
    }
    await client.delete(a._id)
    console.log(`  [usunieto] ${a.file ?? a._id}  ${a.kb}KB`)
    deleted++
  }

  if (DELETE) console.log(`\nUsunieto: ${deleted}, pominieto (pojawily sie referencje): ${skipped}`)
  else console.log('\nAby usunac, uruchom ponownie z flaga --delete')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
