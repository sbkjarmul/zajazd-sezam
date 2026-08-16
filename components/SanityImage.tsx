import Image from 'next/image'
import { cn } from '@/lib/utils'
import { pickLocale } from '@/lib/i18n/pickLocale'
import type { Locale } from '@/i18n/routing'

type SanityImageInput =
  | {
      asset?: {
        url?: string | null
        metadata?: {
          dimensions?: { width?: number | null; height?: number | null } | null
          lqip?: string | null
        } | null
      } | null
      alt?: { pl?: string | null; en?: string | null } | null
    }
  | null
  | undefined

type CommonProps = {
  image: SanityImageInput
  locale: Locale
  className?: string
  priority?: boolean
  // 'eager' — ładuj od razu (bez native lazy). Przydatne, gdy obraz jest w
  // kontenerze z transformem (parallax), przez co lazy bywa zawodne.
  loading?: 'eager' | 'lazy'
  sizes?: string
  // Callback po pełnym załadowaniu obrazu (np. do efektu blur-up w lightboxie).
  onLoad?: () => void
}

type FillProps = CommonProps & { fill: true; width?: never; height?: never }
type SizedProps = CommonProps & { fill?: false; width?: number; height?: number }
type Props = FillProps | SizedProps

// next/image nie optymalizuje SVG - takie pliki ida do przegladarki wprost
// z cdn.sanity.io, czyli z obcej domeny. Przegladarka dokladala wtedy do
// zapytania ciasteczka Sanity (u zalogowanych do Studio - `sanitySession`),
// co Lighthouse 13 punktuje jako `third-party-cookies` + `inspector-issues`.
// Podmieniamy host na wlasny prefiks obslugiwany przez rewrite z next.config,
// dzieki czemu przegladarka w ogole nie rozmawia z Sanity. Rastry zostaja bez
// zmian - one i tak przechodza przez /_next/image na naszym origin.
const SANITY_CDN = 'https://cdn.sanity.io/'

function sameOriginIfSvg(url: string): string {
  if (!url.startsWith(SANITY_CDN)) return url
  if (!url.split('?')[0].toLowerCase().endsWith('.svg')) return url
  return `/sanity-cdn/${url.slice(SANITY_CDN.length)}`
}

export function SanityImage({
  image,
  locale,
  className,
  priority,
  loading,
  sizes,
  onLoad,
  ...rest
}: Props) {
  const rawUrl = image?.asset?.url
  const url = rawUrl ? sameOriginIfSvg(rawUrl) : rawUrl
  const alt = pickLocale(image?.alt, locale) ?? ''
  const dims = image?.asset?.metadata?.dimensions
  const lqip = image?.asset?.metadata?.lqip ?? undefined

  if (!url) {
    return <div aria-hidden className={cn('bg-muted', className)} />
  }

  if (rest.fill) {
    return (
      <Image
        src={url}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : loading}
        placeholder={lqip ? 'blur' : 'empty'}
        blurDataURL={lqip}
        onLoad={onLoad}
        className={cn('object-cover', className)}
      />
    )
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={rest.width ?? dims?.width ?? 1200}
      height={rest.height ?? dims?.height ?? 800}
      sizes={sizes}
      priority={priority}
      placeholder={lqip ? 'blur' : 'empty'}
      blurDataURL={lqip}
      onLoad={onLoad}
      className={className}
    />
  )
}
