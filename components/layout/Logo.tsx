'use client'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { SanityImage } from '@/components/SanityImage'
import type { Locale } from '@/i18n/routing'

type LogoImage = Parameters<typeof SanityImage>[0]['image']

type LogoProps = {
  variant?: 'on-dark' | 'on-light'
  // 'default' — header. 'lg' — powiększony wariant do stopki (bigBrand),
  // wycentrowany zamiast wyrównanego do lewej.
  size?: 'default' | 'lg'
  className?: string
  image?: LogoImage
  locale?: Locale
  // Logo w headerze jest nad pierwszym ekranem na kazdej podstronie, wiec ma
  // ladowac sie od razu. Domyslnie `false`, bo ten sam komponent stoi tez
  // w stopce i w menu burgera - tam leniwe ladowanie jest wlasciwe.
  priority?: boolean
}

// Logo Zajazdu Sezam — wordmark "SEZAM" + tagline (fallback) lub obraz z Sanity.
// Image override pobierany per-podstrona z Sanity (headerLogo / defaultHeaderLogo).
export function Logo({
  variant = 'on-light',
  size = 'default',
  className,
  image,
  locale = 'pl',
  priority = false,
}: LogoProps) {
  const t = useTranslations('header')
  const isOnDark = variant === 'on-dark'
  const hasImage = Boolean(image?.asset?.url)
  const isLg = size === 'lg'

  return (
    <Link
      href="/"
      // WCAG 2.5.3 "Label in Name": gdy element ma widoczny tekst, dostepna
      // nazwa musi go zawierac. Wariant tekstowy pokazuje "SEZAM" + tagline,
      // wiec sztywny aria-label je nadpisywal i rozjezdzal sie z trescia
      // (Lighthouse label-content-name-mismatch) - uzytkownik sterowania glosem
      // mowil "SEZAM", a przegladarka szukala "Zajazd Sezam - strona glowna".
      // Wariant ze zdjeciem nie ma widocznego tekstu, wiec label zostaje.
      aria-label={hasImage ? 'Zajazd Sezam — strona główna' : undefined}
      className={cn(
        'inline-flex items-center leading-none transition-colors',
        hasImage ? '' : isLg ? 'flex-col items-center' : 'flex-col items-start',
        isOnDark ? 'text-text-inverse' : 'text-text',
        className,
      )}
    >
      {hasImage ? (
        <span
          className={cn(
            'relative block',
            isLg ? 'h-20 w-[300px] md:h-28 md:w-[440px]' : 'h-12 w-[180px] md:h-14 md:w-[220px]',
          )}
        >
          <SanityImage
            image={image}
            locale={locale}
            fill
            priority={priority}
            sizes={isLg ? '440px' : '220px'}
            // Logo z Sanity to jeden ciemny asset. Na ciemnym tle (on-dark)
            // wybielamy go filtrem brightness(0) invert(1) — działa dla
            // monochromatycznego wordmarku na przezroczystym tle.
            className={cn(
              '!object-contain',
              isLg ? '!object-center' : '!object-left',
              isOnDark && '[filter:brightness(0)_invert(1)]',
            )}
          />
        </span>
      ) : (
        <>
          <span
            className={cn('font-black tracking-tight', isLg ? 'text-5xl md:text-7xl' : 'text-3xl')}
          >
            SEZAM
          </span>
          <span className={cn(isLg ? 'text-xs tracking-[0.3em]' : 'text-[0.5rem] tracking-normal')}>
            {t('tagline')}
          </span>
        </>
      )}
    </Link>
  )
}
