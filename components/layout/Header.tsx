'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useTranslations } from 'next-intl'
import { Menu } from 'lucide-react'
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

export type HeaderNavLink = { label: string; href: Pathname } | { label: string; hash: string }

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
  // (+ opcjonalnie `data-header-surface` = własne tło, `data-header-gradient="off"`
  // = bez gradientu). Gradient znika też na samej górze strony.
  adaptive?: boolean
  // Nadpisanie CTA (domyślnie „Zarezerwuj termin" → otwiera drawer rezerwacji).
  // ctaLabel zmienia etykietę; ctaHref (np. `tel:…`) renderuje link zamiast
  // przycisku otwierającego drawer (Bistro → „Zadzwoń").
  ctaLabel?: string
  ctaHref?: string
  // Kolor akcentu headera w trybie light-contrast (jasne tło pod headerem):
  // domyślnie 'ruby' (granat). 'dark' = sezam dark (#1f1f1c) — np. strona hotelu,
  // gdzie granat kłóci się z charakterem sekcji. Nie dotyczy trybu dark-contrast
  // (tam tekst zawsze cream = text-inverse).
  lightAccent?: 'ruby' | 'dark'
  // Kolor tła headera w trybie dark-contrast (gradient nad ciemnymi sekcjami):
  // domyślnie 'ruby' (dark-ruby #111c2a). 'dark' = sezam dark (#1f1f1c) — np. hotel,
  // spójnie z lightAccent='dark'.
  darkGradient?: 'ruby' | 'dark'
}

export function Header({
  heroTheme = 'dark',
  mobileHeroTheme,
  logoImage,
  locale = 'pl',
  nav,
  animateIn = false,
  animateInDelay = 0,
  adaptive = true,
  ctaLabel,
  ctaHref,
  lightAccent = 'ruby',
  darkGradient = 'ruby',
}: Props) {
  const headerRef = useRef<HTMLElement>(null)
  const direction = useScrollDirection()
  // Realna wysokość headera (88 mobile / 108 desktop) — pas, w którym gradient
  // przykrywa treść. Hook potrzebuje jej, żeby zgasić gradient dopóki sekcja
  // odmawiająca go dotyka tego pasa. Fallback 48 do pierwszego pomiaru.
  const [headerHeight, setHeaderHeight] = useState(48)
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const measure = () => setHeaderHeight(Math.round(el.getBoundingClientRect().height))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // heroTheme = motyw startowy (fallback, gdy nic jeszcze nie wykryte / SSR) —
  // strony z ciemnym hero mają heroTheme='dark', z jasnym 'light'.
  const {
    theme: activeTheme,
    surface: activeSurface,
    gradient: activeGradient,
  } = useActiveHeaderTheme(adaptive, 48, heroTheme, headerHeight)
  const t = useTranslations('common')
  const { openReservation, openBurger } = useUI()
  const pathname = usePathname()

  // Wejscie headera robi CSS (klasa `.header-in` + keyframes w globals.css),
  // a nie GSAP. Powody:
  //  1. Wydajnosc - to byl jeden z dwoch elementow nad pierwszym ekranem, ktore
  //     zmuszaly do zaladowania i zainicjalizowania GSAP-a, zanim przegladarka
  //     zdazyla cokolwiek namalowac. Animacja CSS rusza w pierwszej klatce.
  //  2. Dostepnosc - GSAP animowal `autoAlpha`, ktore przy kryciu 0 ustawia
  //     `visibility: hidden`. Cala nawigacja i logo znikaly wtedy z drzewa
  //     dostepnosci na czas wejscia.
  // Znika tez dawny problem z `transition-all duration-300` na headerze: CSS
  // animation ma pierwszenstwo przed transition na tych samych wlasciwosciach,
  // wiec nie trzeba juz recznie wylaczac i przywracac transition.

  const isTop = direction === 'top'
  const isHidden = direction === 'down'

  // W trybie adaptacyjnym kontrast (i gradient) sterowane sekcją pod headerem —
  // jednakowo dla mobile i desktop. Inaczej — jak dotąd (solid bg po scrollu).
  const onLightContrast = adaptive ? activeTheme === 'light' : !isTop || heroTheme === 'light'
  const mobileOnLightContrast = adaptive
    ? activeTheme === 'light'
    : !isTop || (mobileHeroTheme ?? heroTheme) === 'light'
  const variantsDiffer = mobileOnLightContrast !== onLightContrast

  // Akcent trybu light-contrast (ruby|dark). Pełne literały klas, bo Tailwind nie
  // wykrywa dynamicznych `text-${x}`. Tryb dark-contrast bez zmian (zawsze cream).
  const isDarkAccent = lightAccent === 'dark'
  const lightNavActive = isDarkAccent ? 'text-dark' : 'text-ruby'
  const lightNavIdle = isDarkAccent
    ? 'text-dark/80 hover:text-dark'
    : 'text-ruby/80 hover:text-ruby'
  const lightBtn = isDarkAccent
    ? 'border-dark text-dark hover:bg-dark hover:text-text-inverse'
    : 'border-ruby text-ruby hover:bg-ruby hover:text-text-inverse'
  const lightBtnMd = isDarkAccent
    ? 'md:border-dark md:text-dark md:hover:bg-dark md:hover:text-text-inverse'
    : 'md:border-ruby md:text-ruby md:hover:bg-ruby md:hover:text-text-inverse'
  // Kolor gradientu dark-contrast (tło headera nad ciemnymi sekcjami). Sekcja
  // może go nadpisać przez `data-header-surface` — na stronie głównej sekcje
  // ciemne mają dwa różne tła (Restauracja = dark-ruby, Kontakt = sezam dark),
  // więc jeden prop na całą stronę zawsze rozjeżdżałby się z którąś z nich.
  const darkGradientFrom =
    activeSurface ?? (darkGradient === 'dark' ? 'var(--color-dark)' : 'var(--color-dark-ruby)')

  return (
    <header
      ref={headerRef}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out',
        // Tryb adaptacyjny: header ZAWSZE widoczny, bez solidnego tła — tłem jest
        // gradient (poniżej). Bez trybu adaptacyjnego — zachowanie jak dotąd.
        !adaptive && isHidden && '-translate-y-full',
        !adaptive && !isTop && 'bg-bg/85 backdrop-blur-md',
        animateIn && 'header-in',
      )}
      style={animateIn ? ({ '--header-delay': `${animateInDelay}s` } as CSSProperties) : undefined}
      data-state={direction}
    >
      {adaptive && (
        // Gradient headera (mobile + desktop) — kryje pod sobą przewijaną treść
        // na wysokości headera. Dwie warstwy (jasna/ciemna) krzyżowo wygaszane,
        // bo CSS nie animuje przejścia między gradientami. Gradient znika na
        // samej górze strony (isTop) ORAZ nad sekcjami, które go nie chcą
        // (`data-header-gradient="off"` — np. hero, gdzie przyciemnienie
        // zjadałoby pierwszą linię nagłówka przy przewijaniu w obrębie sekcji).
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out',
            isTop || !activeGradient ? 'opacity-0' : 'opacity-100',
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
            style={{ '--hdr-dark-from': darkGradientFrom } as CSSProperties}
            className={cn(
              'absolute inset-0 bg-gradient-to-b from-[var(--hdr-dark-from)] from-30% to-transparent transition-opacity duration-500 ease-out',
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
              priority
              className="md:hidden"
            />
            <Logo
              variant={onLightContrast ? 'on-light' : 'on-dark'}
              image={logoImage}
              locale={locale}
              priority
              className="hidden md:inline-flex"
            />
          </>
        ) : (
          <Logo
            variant={onLightContrast ? 'on-light' : 'on-dark'}
            image={logoImage}
            locale={locale}
            priority
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
                    ? lightNavActive
                    : lightNavIdle
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
          {(() => {
            const ctaClassName = cn(
              // Ukryty na mobile + tablet (kolidował z nav na md). Pokazujemy
              // dopiero od lg, gdy mamy dość miejsca obok nawigacji.
              'hidden cursor-pointer items-center justify-center rounded-full border-2 font-normal whitespace-nowrap transition-colors lg:inline-flex lg:h-[60px] lg:px-6 lg:text-lg',
              onLightContrast
                ? lightBtn
                : 'border-text-inverse text-text-inverse hover:bg-text-inverse hover:text-text',
            )
            const label = ctaLabel ?? t('reserve')
            // ctaHref (np. `tel:…`) → link zamiast przycisku otwierającego drawer.
            return ctaHref ? (
              <a href={ctaHref} className={ctaClassName}>
                {label}
              </a>
            ) : (
              <button
                type="button"
                onClick={() => openReservation('room')}
                className={ctaClassName}
              >
                {label}
              </button>
            )
          })()}
          <button
            type="button"
            onClick={openBurger}
            aria-label={t('openMenu')}
            className={cn(
              'inline-flex aspect-square h-12 cursor-pointer items-center justify-center rounded-full border-2 transition-colors md:h-[60px]',
              // Mobile (bazowo): zależnie od mobileHeroTheme (lub heroTheme jeśli niepodane)
              mobileOnLightContrast
                ? lightBtn
                : 'border-text-inverse text-text-inverse hover:bg-text-inverse hover:text-text',
              // Desktop (md+): override gdy warianty się różnią
              variantsDiffer &&
                (onLightContrast
                  ? lightBtnMd
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
