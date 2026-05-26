/**
 * One-off patch: bistroPage.centralBanner + hoursText (PL + EN).
 *
 * Uruchomienie:
 *   node --env-file=.env.local --experimental-strip-types scripts/patch-bistro-banner.ts
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

const BANNER_PL = 'Czekamy na Ciebie'
const BANNER_EN = "We're waiting for you"

const HOURS_PL =
  '6.00 - 18.00 od poniedziałku do piątku\n6.00 - 13.00 w sobotę\nW niedzielę nieczynne'

const HOURS_EN =
  '6.00 - 18.00 Monday to Friday\n6.00 - 13.00 on Saturday\nClosed on Sunday'

async function main() {
  console.log('Patch bistroPage.centralBanner + hoursText…')
  const res = await client
    .patch('bistroPage')
    .set({
      centralBanner: { pl: BANNER_PL, en: BANNER_EN },
      hoursText: { pl: HOURS_PL, en: HOURS_EN },
    })
    .commit()
  console.log('✓ Done. Rev:', res._rev)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
