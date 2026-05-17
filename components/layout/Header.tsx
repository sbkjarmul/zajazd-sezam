'use client'

import { useTranslations } from 'next-intl'
import { Menu } from 'lucide-react'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { useUI } from '@/components/providers/UIProvider'
import { Logo } from './Logo'
import { SanityImage } from '@/components/SanityImage'
import { Link } from '@/i18n/navigation'
import { usePathname } from '@/i18n/navigation'
import type { Locale, Pathname } from '@/i18n/routing'
import { cn } from '@/lib/utils'

type LogoImage = Parameters<typeof SanityImage>[0]['image']

export type HeaderNavLink =
  | { label: string; href: Pathname }
  | { label: string; hash: string }

type Props = {
  // 'dark' (default) — ciemne hero → header light contrast (cream)
  // 'light' — jasne hero → header dark contrast (ruby/dark)
  heroTheme?: 'dark' | 'light'
  logoImage?: LogoImage
  locale?: Locale
  nav?: HeaderNavLink[]
}

export function Header({ heroTheme = 'dark', logoImage, locale = 'pl', nav }: Props) {
  const direction = useScrollDirection()
  const t = useTranslations('common')
  const { openReservation, openBurger } = useUI()
  const pathname = usePathname()

  const isTop = direction === 'top'
  const isHidden = direction === 'down'

  const onLightContrast = !isTop || heroTheme === 'light'

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out',
        isHidden && '-translate-y-full',
        !isTop && 'bg-bg/85 backdrop-blur-md',
      )}
      data-state={direction}
    >
      <div className="layout-container relative flex items-center justify-between gap-6 py-5 md:py-6">
        <Logo
          variant={onLightContrast ? 'on-light' : 'on-dark'}
          image={logoImage}
          locale={locale}
        />

        {nav && nav.length > 0 && (
          <nav
            aria-label="Nawigacja podstrony"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0 lg:flex"
          >
            {nav.map((link) => {
              const isAnchor = 'hash' in link
              const isActive = !isAnchor && link.href === pathname
              const classes = cn(
                'p-[10px] text-base uppercase tracking-normal transition-colors',
                isActive ? 'font-bold' : 'font-normal',
                onLightContrast
                  ? isActive
                    ? 'text-primary'
                    : 'text-primary/80 hover:text-primary'
                  : isActive
                    ? 'text-text-inverse'
                    : 'text-text-inverse/80 hover:text-text-inverse',
              )
              return isAnchor ? (
                <a key={link.label} href={`#${link.hash}`} className={classes}>
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} href={link.href} className={classes}>
                  {link.label}
                </Link>
              )
            })}
          </nav>
        )}

        <div className="flex items-center gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => openReservation('room')}
            className={cn(
              'hidden cursor-pointer items-center justify-center rounded-full border-2 font-normal whitespace-nowrap transition-colors md:inline-flex md:h-[60px] md:px-6 md:text-lg',
              onLightContrast
                ? 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                : 'border-text-inverse text-text-inverse hover:bg-text-inverse hover:text-text',
            )}
          >
            {t('reserve')}
          </button>
          <button
            type="button"
            onClick={openBurger}
            aria-label={t('openMenu')}
            className={cn(
              'inline-flex aspect-square h-12 cursor-pointer items-center justify-center rounded-full border-2 transition-colors md:h-[60px]',
              onLightContrast
                ? 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                : 'border-text-inverse text-text-inverse hover:bg-text-inverse hover:text-text',
            )}
          >
            <Menu className="size-5 md:size-6" aria-hidden />
          </button>
        </div>
      </div>
    </header>
  )
}
