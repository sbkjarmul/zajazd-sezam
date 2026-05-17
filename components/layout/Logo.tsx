'use client'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { SanityImage } from '@/components/SanityImage'
import type { Locale } from '@/i18n/routing'

type LogoImage = Parameters<typeof SanityImage>[0]['image']

type LogoProps = {
  variant?: 'on-dark' | 'on-light'
  className?: string
  image?: LogoImage
  locale?: Locale
}

// Logo Zajazdu Sezam — wordmark "SEZAM" + tagline (fallback) lub obraz z Sanity.
// Image override pobierany per-podstrona z Sanity (headerLogo / defaultHeaderLogo).
export function Logo({ variant = 'on-light', className, image, locale = 'pl' }: LogoProps) {
  const t = useTranslations('header')
  const isOnDark = variant === 'on-dark'
  const hasImage = Boolean(image?.asset?.url)

  return (
    <Link
      href="/"
      aria-label="Zajazd Sezam — strona główna"
      className={cn(
        'inline-flex items-center leading-none transition-colors',
        hasImage ? '' : 'flex-col items-start',
        isOnDark ? 'text-text-inverse' : 'text-text',
        className,
      )}
    >
      {hasImage ? (
        <span className="relative block h-12 w-[180px] md:h-14 md:w-[220px]">
          <SanityImage
            image={image}
            locale={locale}
            fill
            sizes="220px"
            className="!object-contain !object-left"
          />
        </span>
      ) : (
        <>
          <span className="text-3xl font-black tracking-tight">SEZAM</span>
          <span className="text-[0.5rem] tracking-normal">{t('tagline')}</span>
        </>
      )}
    </Link>
  )
}
