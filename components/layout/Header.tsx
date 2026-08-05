'use client'

import { useRef, type CSSProperties } from 'react'
import { useTranslations } from 'next-intl'
import { Menu } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { useActiveHeaderTheme } from '@/hooks/useActiveHeaderTheme'
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
  // Jeśli mobile hero ma inny motyw niż desktop (np. restauracja: mobile =
  // pełnoekranowe zdjęcie/dark, desktop = jasne tło/light), przekazujemy tu
  // wariant mobilny. Domyślnie =  heroTheme.
  mobileHeroTheme?: 'dark' | 'light'
  logoImage?: LogoImage
  locale?: Locale
  nav?: HeaderNavLink[]
  // Wejściowy fade-in z góry przy montażu (np. na stronie głównej z animowanym hero).
  animateIn?: boolean
  // Opóźnienie wejścia (s) — do zsynchronizowania z sekwencją hero.
  animateInDelay?: number
  // Header „section-aware" (mobile + desktop): zawsze widoczny (bez chowania
  // przy scrollu), z gradientem, którego motyw (ciemny/jasny) i kolor śledzą
  // sekcję aktualnie pod headerem — sekcje deklarują `data-header-theme`
  // (+ opcjonalnie `data-header-surface`). Gradient znika na samej górze strony.
  adaptive?: boolean
}

export function Header({
  heroTheme = 'dark',
  mobileHeroTheme,
  logoImage,
  locale = 'pl',
  nav,
  animateIn = false,
  animateInDelay = 0,
  adaptive = false,
}: Props) {
  const direction = useScrollDirection()
  const { theme: activeTheme, surface: activeSurface } = useActiveHeaderTheme(adaptive)
  const t = useTranslations('common')
  const { openReservation, openBurger } = useUI()
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!animateIn) return
      const el = headerRef.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Header ma klasę `transition-all duration-300` (dla scroll-hide + tła).
        // Kłóci się ona z per-frame inline transform/opacity gsapa — rendered
        // wartości laggują ~300ms i header wygląda na wyblakły/„zawieszony" przez
        // cały wjazd. Wyłączamy CSS transition na czas animacji, przywracamy po.
        // clearProps → transform/opacity wracają pod kontrolę klas Tailwinda.
        el.style.transition = 'none'
        const restore = () => {
          gsap.set(el, { clearProps: 'transform,opacity,visibility' })
          el.style.transition = ''
        }
        gsap.set(el, { y: -28, autoAlpha: 0 })
        const tween = gsap.to(el, {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          delay: animateInDelay,
          ease: 'power3.out',
          onComplete: restore,
        })
        return () => {
          tween.kill()
          restore()
        }
      })
      return () => mm.revert()
    },
    // Bez `dependencies` — animateIn/animateInDelay to statyczne propsy (nie
    // zmieniają się po montażu), więc efekt uruchamiamy raz na mount.
    { scope: headerRef },
  )

  const isTop = direction === 'top'
  const isHidden = direction === 'down'

  // W trybie adaptacyjnym kontrast (i gradient) sterowane sekcją pod headerem —
  // jednakowo dla mobile i desktop. Inaczej — jak dotąd (solid bg po scrollu).
  const onLightContrast = adaptive ? activeTheme === 'light' : !isTop || heroTheme === 'light'
  const mobileOnLightContrast = adaptive
    ? activeTheme === 'light'
    : !isTop || (mobileHeroTheme ?? heroTheme) === 'light'
  const variantsDiffer = mobileOnLightContrast !== onLightContrast

  return (
    <header
      ref={headerRef}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out',
        // Tryb adaptacyjny: header ZAWSZE widoczny, bez solidnego tła — tłem jest
        // gradient (poniżej). Bez trybu adaptacyjnego — zachowanie jak dotąd.
        !adaptive && isHidden && '-translate-y-full',
        !adaptive && !isTop && 'bg-bg/85 backdrop-blur-md',
      )}
      data-state={direction}
    >
      {adaptive && (
        // Gradient headera (mobile + desktop) — kryje pod sobą przewijaną treść
        // na wysokości headera. Dwie warstwy (jasna/ciemna) krzyżowo wygaszane,
        // bo CSS nie animuje przejścia między gradientami. Cały gradient znika na
        // samej górze strony (isTop) — czysty hero bez przyciemnienia.
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out',
            isTop ? 'opacity-0' : 'opacity-100',
          )}
        >
          <div
            style={{ '--hdr-light-from': activeSurface ?? 'var(--color-light)' } as CSSProperties}
            className={cn(
              'absolute inset-0 bg-gradient-to-b from-[var(--hdr-light-from)] from-30% to-transparent transition-opacity duration-500 ease-out',
              mobileOnLightContrast ? 'opacity-100' : 'opacity-0',
            )}
          />
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-b from-[var(--color-dark-ruby)] from-30% to-transparent transition-opacity duration-500 ease-out',
              mobileOnLightContrast ? 'opacity-0' : 'opacity-100',
            )}
          />
        </div>
      )}

      <div className="layout-container relative flex items-center justify-between gap-6 py-5 md:py-6">
        {variantsDiffer ? (
          <>
            <Logo
              variant={mobileOnLightContrast ? 'on-light' : 'on-dark'}
              image={logoImage}
              locale={locale}
              className="md:hidden"
            />
            <Logo
              variant={onLightContrast ? 'on-light' : 'on-dark'}
              image={logoImage}
              locale={locale}
              className="hidden md:inline-flex"
            />
          </>
        ) : (
          <Logo
            variant={onLightContrast ? 'on-light' : 'on-dark'}
            image={logoImage}
            locale={locale}
          />
        )}

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
                    ? 'text-ruby'
                    : 'text-ruby/80 hover:text-ruby'
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
              // Ukryty na mobile + tablet (kolidował z nav na md). Pokazujemy
              // dopiero od lg, gdy mamy dość miejsca obok nawigacji.
              'hidden cursor-pointer items-center justify-center rounded-full border-2 font-normal whitespace-nowrap transition-colors lg:inline-flex lg:h-[60px] lg:px-6 lg:text-lg',
              onLightContrast
                ? 'border-ruby text-ruby hover:bg-ruby hover:text-text-inverse'
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
              // Mobile (bazowo): zależnie od mobileHeroTheme (lub heroTheme jeśli niepodane)
              mobileOnLightContrast
                ? 'border-ruby text-ruby hover:bg-ruby hover:text-text-inverse'
                : 'border-text-inverse text-text-inverse hover:bg-text-inverse hover:text-text',
              // Desktop (md+): override gdy warianty się różnią
              variantsDiffer &&
                (onLightContrast
                  ? 'md:border-ruby md:text-ruby md:hover:bg-ruby md:hover:text-text-inverse'
                  : 'md:border-text-inverse md:text-text-inverse md:hover:bg-text-inverse md:hover:text-text'),
            )}
          >
            <Menu className="size-5 md:size-6" aria-hidden />
          </button>
        </div>
      </div>
    </header>
  )
}
