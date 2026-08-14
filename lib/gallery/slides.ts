import { pickLocale } from '@/lib/i18n/pickLocale'
import type { Locale } from '@/i18n/routing'

// Strukturalny typ obrazu wystarczajacy do zbudowania slajdu YARL. Pasuja tu
// wszystkie projekcje przez IMAGE_WITH_ALT_FRAGMENT (galleryPage.images,
// eventType.gallery/image, eventHall.images) — kazda daje asset.url +
// metadata.dimensions + opcjonalny alt (localeString).
export type GallerySlideImage = {
  asset?: {
    url?: string | null
    metadata?: {
      dimensions?: { width?: number | null; height?: number | null } | null
    } | null
  } | null
  alt?: { pl?: string | null; en?: string | null } | null
}

// Slajd YARL — ksztalt zgodny z `slides` w yet-another-react-lightbox.
export type GallerySlide = {
  src: string
  width: number
  height: number
  alt: string
  srcSet: { src: string; width: number; height: number }[]
}

// Szerokosci generowane przez Sanity CDN dla srcSet — na mobile pobierany jest
// maly wariant, na desktop wiekszy; `auto=format` = AVIF/WebP gdy wspierane.
const SRCSET_WIDTHS = [640, 960, 1280, 1920, 2400] as const

// Wariant obrazu z Sanity CDN. `asset.url` (surowy, jak w SanityImage) + params
// pipeline'u obrazow — bez urlFor, ktory nie przyjmuje zdereferencjonowanego assetu.
const cdn = (url: string, w: number) => `${url}?w=${w}&q=80&auto=format&fit=max`

// Buduje slajdy YARL z dowolnej listy obrazow Sanity (galeria, sale, typy imprez).
// Wspoldzielone przez GalleryLightbox (siatka /galeria) i SanityLightbox
// (kontrolowany podglad w sekcjach imprez).
export function buildGallerySlides(
  images: readonly (GallerySlideImage | null | undefined)[],
  locale: Locale,
): GallerySlide[] {
  return images.map((img) => {
    const url = img?.asset?.url ?? ''
    const dims = img?.asset?.metadata?.dimensions
    const width = dims?.width ?? 1600
    const height = dims?.height ?? 1600
    return {
      src: cdn(url, 2400),
      width,
      height,
      alt: pickLocale(img?.alt, locale) ?? '',
      srcSet: SRCSET_WIDTHS.map((w) => ({
        src: cdn(url, w),
        width: w,
        height: Math.round((height / width) * w),
      })),
    }
  })
}
