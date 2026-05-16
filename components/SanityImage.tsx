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
  sizes?: string
}

type FillProps = CommonProps & { fill: true; width?: never; height?: never }
type SizedProps = CommonProps & { fill?: false; width?: number; height?: number }
type Props = FillProps | SizedProps

export function SanityImage({ image, locale, className, priority, sizes, ...rest }: Props) {
  const url = image?.asset?.url
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
        placeholder={lqip ? 'blur' : 'empty'}
        blurDataURL={lqip}
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
      className={className}
    />
  )
}
