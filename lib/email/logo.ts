// Logo do naglowka maila. Zrodlo: `homepage.headerLogo` z Sanity - ten sam
// asset, ktory gosc widzi w headerze strony glownej (query EMAIL_LOGO_QUERY).
//
// Dwie rzeczy, ktore trzeba tu zalatwic za klienta pocztowego:
//  1. Asset jest SVG, a Gmail/Outlook SVG nie renderuja -> `fm=png` (Sanity
//     rasteryzuje po stronie CDN).
//  2. Brak retiny w mailach -> wysylamy 2x szerokosc i skalujemy atrybutami.
//
// Do tego rasteryzacja samym `w=` scina krawedzie znaku (lewy lisc i prawe "M"
// dotykaja krawedzi viewBoxa) - dlatego renderujemy w plotno `fit=fill` szersze
// od znaku o PADDING_RATIO. `fit=fill` dokleja marginesy tylko z `bg`, wiec tlo
// musi byc rowne tlu naglowka maila (BRAND.surface = #ffffff).

import type { EMAIL_LOGO_QUERY_RESULT } from '@/types/sanity'
import type { EmailLocale, EmailLogo } from './types'

// Szerokosc samego znaku w mailu (px). Karta ma 568px, wiec logo zajmuje
// mniej wiecej polowe szerokosci - odpowiednik wariantu `lg` z Logo.tsx.
const ARTWORK_WIDTH = 264
// Luz po bokach znaku na plotnie `fit=fill` (ulamek szerokosci znaku).
const PADDING_RATIO = 0.07
// Fallbackowe proporcje wordmarku (255x39) na wypadek braku metadanych.
const FALLBACK_RATIO = 255 / 39
// Tlo doklejanych marginesow = tlo naglowka maila (BRAND.surface).
const CANVAS_BG = 'ffffff'

export function buildEmailLogo(
  logo: EMAIL_LOGO_QUERY_RESULT,
  locale: EmailLocale,
): EmailLogo | undefined {
  const url = logo?.asset?.url
  if (!url) return undefined

  const dimensions = logo?.asset?.metadata?.dimensions
  const ratio =
    dimensions?.width && dimensions?.height ? dimensions.width / dimensions.height : FALLBACK_RATIO

  // Plotno jest szersze od znaku, a jego wysokosc = wysokosc znaku. Dzieki
  // proporcji plotna wiekszej niz proporcja znaku CDN skaluje znak "do wysokosci"
  // i cala nadwyzka schodzi na marginesy boczne.
  const width = Math.round(ARTWORK_WIDTH * (1 + PADDING_RATIO))
  const height = Math.round(ARTWORK_WIDTH / ratio)

  return {
    src: `${url}?w=${width * 2}&h=${height * 2}&fit=fill&bg=${CANVAS_BG}&fm=png&q=90`,
    width,
    height,
    alt: logo?.alt?.[locale] ?? 'Zajazd Sezam',
  }
}
