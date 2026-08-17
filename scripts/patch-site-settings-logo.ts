/**
 * Ustawia siteSettings.defaultHeaderLogo na logo ze strony glownej.
 *
 * Pole bylo puste, wiec podstrony bez wlasnego headerLogo (Regulamin, Polityka
 * prywatnosci) rysowaly zaszyty wordmark z Logo.tsx zamiast SVG z Sanity.
 * Domyslne logo ma byc ZAWSZE tym samym assetem co homepage.headerLogo.
 *
 * W przeciwienstwie do seed-site-settings.ts (createOrReplace) NIE nadpisuje
 * calego dokumentu — patchuje tylko to jedno pole, wiec zachowuje reczne zmiany
 * ze Studio. Ten sam asset jest wpisany w seedzie, zeby przezyl re-seed.
 *
 * Uruchomienie: node --env-file=.env.local --experimental-strip-types scripts/patch-site-settings-logo.ts
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
  apiVersion: '2026-05-16',
  token,
  useCdn: false,
})

// Zrodlo prawdy: homepage.headerLogo. Czytamy je z Sanity zamiast zaszywac
// _ref, zeby default nie mogl sie rozjechac z logo strony glownej.
const homepageLogo = await client.fetch<{
  asset?: { _ref?: string }
  alt?: { pl?: string; en?: string }
} | null>(`*[_type == "homepage" && _id == "homepage"][0].headerLogo`)

if (!homepageLogo?.asset?._ref) {
  throw new Error('Brak homepage.headerLogo w Sanity — nie ma z czego ustawic domyslnego logo.')
}

const result = await client
  .patch('siteSettings')
  .set({
    defaultHeaderLogo: {
      _type: 'imageWithAlt',
      asset: { _type: 'reference', _ref: homepageLogo.asset._ref },
      alt: {
        _type: 'localeString',
        pl: homepageLogo.alt?.pl ?? 'Zajazd Sezam',
        en: homepageLogo.alt?.en ?? 'Zajazd Sezam',
      },
    },
  })
  .commit()

console.log('✓ siteSettings.defaultHeaderLogo =', homepageLogo.asset._ref)
console.log('  (skopiowane z homepage.headerLogo)', result._id)
