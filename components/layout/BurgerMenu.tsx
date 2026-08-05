'use client'

import { Fragment, useCallback, useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useLenis } from 'lenis/react'
import { Link, useRouter, usePathname } from '@/i18n/navigation'
import { useUI } from '@/components/providers/UIProvider'
import { routing, type Locale, type Pathname } from '@/i18n/routing'
import { cn } from '@/lib/utils'

type NavItem = {
  href: Pathname
  label: { pl: string; en: string }
}

// Krótkie etykiety dla burger menu (Figma 773:110). Footer używa pełnych
// nazw z `nav.*`, więc nie nadpisujemy globalnych translations.
const NAV_ITEMS: NavItem[] = [
  { href: '/', label: { pl: 'Strona główna', en: 'Home' } },
  { href: '/hotel', label: { pl: 'Hotel', en: 'Hotel' } },
  { href: '/restauracja', label: { pl: 'Restauracja', en: 'Restaurant' } },
  { href: '/bistro', label: { pl: 'Bistro', en: 'Bistro' } },
  { href: '/imprezy-okolicznosciowe', label: { pl: 'Imprezy', en: 'Events' } },
  { href: '/kontakt', label: { pl: 'Kontakt', en: 'Contact' } },
]

// Wspólny czas i krzywa dla wjazdu panelu i pushu <main> — muszą być „sklejone".
const SLIDE_MS = 650
const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)'

// Blur-in dla tekstów w menu: przy otwieraniu wychodzą z rozmycia (filter) +
// fade, ze staggerem przez per-element `transition-delay`. Bez ruchu translate.
// motion-reduce → brak animacji (snap).
const REVEAL =
  'transition-[opacity,filter] duration-[600ms] ease-out motion-reduce:transition-none'
const REVEAL_WITH_COLOR =
  'transition-[color,opacity,filter] duration-[600ms] ease-out motion-reduce:transition-none'
const REVEAL_IN = 'opacity-100 blur-[0px]'
const REVEAL_OUT = 'opacity-0 blur-[10px]'

// Menu pełnoekranowe w stylu annnimate „Fullscreen Slide Menu": panel wjeżdża
// z góry, a cała aplikacja (<main>) zjeżdża o 100dvh w dół — oba ruchy z tą
// samą krzywą/czasem, więc wyglądają jak jeden pionowy stos przesuwany w dół.
//
// Menu jest rodzeństwem <main> w layoucie, więc transform/inert nakładane na
// <main> nie dotykają panelu. Fixed nagłówek strony żyje wewnątrz <main>: jego
// pozycja przy transformie <main> bywa „nieprawidłowa", ale panel (wyższy
// z-index, nieprzezroczysty, pełnoekranowy) zawsze go zasłania → bez glitcha.
//
// Świadomie bez Radixa: jego animacja klatkowa nie zsynchronizuje się co do
// klatki z tranzycją <main>. A11y (Escape, focus-trap, inert tła, scroll-lock,
// przywrócenie focusa) obsługujemy ręcznie.
export function BurgerMenu() {
  const t = useTranslations()
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const router = useRouter()
  const { burgerOpen, closeBurger } = useUI()

  const panelRef = useRef<HTMLDivElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)
  // Instancja globalnego Lenis (root smooth-scroll). Może być null przy
  // prefers-reduced-motion (wtedy SmoothScroll nie montuje Lenis).
  const lenis = useLenis()

  // Zamknięcie przy NAWIGACJI (klik w link / zmiana języka): reset pushu <main>
  // NATYCHMIAST, bez 650ms tranzycji powrotnej. Inaczej nowa strona montuje się
  // w transformowanym <main> i przez czas animacji jest przesunięta + glitchuje
  // fixed-header. Snap → nowa strona od razu na miejscu (y:0).
  const closeForNavigation = useCallback(() => {
    const main = document.querySelector('main')
    if (main) {
      main.style.transition = 'none'
      main.style.transform = ''
      main.removeAttribute('inert')
    }
    document.documentElement.style.overflow = ''
    // Scroll do góry: klik w link do BIEŻĄCEJ trasy (np. „Strona główna" będąc
    // na home) nie wywoła nawigacji Next.js, więc scroll nie zostałby zresetowany
    // i strona zostałaby przewinięta. Lenis (root) trzyma własną pozycję, więc
    // resetujemy przez jego API; fallback na natywny scroll (reduced-motion).
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    else window.scrollTo(0, 0)
    closeBurger()
  }, [closeBurger, lenis])

  function switchLocale(target: Locale) {
    if (target === locale) return
    router.replace(pathname, { locale: target })
    closeForNavigation()
  }

  // Push aplikacji (<main> zjeżdża o 100dvh w dół, sklejone z wjazdem panelu) +
  // scroll-lock, inert tła i zarządzanie focusem zależnie od stanu.
  useEffect(() => {
    const main = document.querySelector('main')
    const html = document.documentElement
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (burgerOpen) {
      restoreFocusRef.current = document.activeElement as HTMLElement | null
      html.style.overflow = 'hidden'
      if (main) {
        main.style.transition = reduce ? 'none' : `transform ${SLIDE_MS}ms ${EASE}`
        main.style.transform = 'translateY(100dvh)'
        main.setAttribute('inert', '') // tło poza tab-orderem i czytnikiem
      }
      const id = window.setTimeout(() => {
        panelRef.current?.querySelector<HTMLElement>('[data-menu-close]')?.focus()
      }, 0)
      return () => window.clearTimeout(id)
    }

    // Zamknięcie: cofnij push, odblokuj scroll, zdejmij inert, przywróć focus.
    html.style.overflow = ''
    if (main) {
      main.style.transform = ''
      main.removeAttribute('inert')
    }
    restoreFocusRef.current?.focus?.()
  }, [burgerOpen])

  // Sprzątanie stylów <main> / scroll-locka / inert przy odmontowaniu.
  useEffect(
    () => () => {
      document.documentElement.style.overflow = ''
      const main = document.querySelector('main')
      if (main) {
        main.style.transform = ''
        main.style.transition = ''
        main.removeAttribute('inert')
      }
    },
    [],
  )

  // Escape zamyka; Tab zapętla focus wewnątrz panelu (focus-trap).
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeBurger()
        return
      }
      if (e.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    },
    [closeBurger],
  )

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="burger-menu-title"
      aria-hidden={!burgerOpen}
      // `inert` gdy zamknięte → panel poza tab-orderem mimo obecności w DOM.
      inert={!burgerOpen}
      onKeyDown={onKeyDown}
      style={{ transitionTimingFunction: EASE, transitionDuration: `${SLIDE_MS}ms` }}
      className={cn(
        'bg-surface fixed inset-x-0 top-0 z-[60] h-[100dvh] w-full',
        // overflow-y-auto: nadmiar treści (duże linki na niskim ekranie) scrolluje
        // się w obrębie panelu i jest przycięty do jego boxa — nic nie wystaje
        // poza panel, więc w stanie zamkniętym nie „wygląda" u góry viewportu.
        'flex flex-col overflow-y-auto will-change-transform',
        // Wjazd z góry, sklejony z pushem <main> (ten sam czas/krzywa).
        'transition-transform motion-reduce:transition-none',
        burgerOpen ? 'translate-y-0' : '-translate-y-full',
      )}
    >
      <div className="layout-container flex min-h-full flex-col py-8 md:py-10">
        <div className="flex items-start justify-between">
          <Image
            src="/images/icons/sezam-brandmark.svg"
            alt="Sezam"
            width={100}
            height={52}
            className="h-auto w-[60px] md:w-[76px]"
            priority
          />
          <button
            type="button"
            data-menu-close
            onClick={closeBurger}
            aria-label={t('common.close')}
            className="text-text hover:border-accent hover:text-accent inline-flex aspect-square h-12 cursor-pointer items-center justify-center rounded-full border-2 border-current/30 transition-colors md:h-[60px]"
          >
            <X className="size-6 md:size-7" />
          </button>
        </div>

        {/* Układ wg referencji: wielkie „Menu" po lewej, kolumna nawigacji
            po prawej. Na mobile stackowane (Menu nad listą). */}
        <div className="flex flex-1 flex-col justify-center gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
          <h2
            id="burger-menu-title"
            style={{ transitionDelay: burgerOpen ? '120ms' : '0ms' }}
            className={cn(
              // Rozmiar + line-height w JEDNEJ klasie — patrz uwaga niżej o tailwind-merge.
              // font-accent = Westbourne Serif, italic (jak akcenty hero).
              'font-accent text-text font-normal italic tracking-tight text-[clamp(3rem,9vw,7.5rem)]/[0.95]',
              REVEAL,
              burgerOpen ? REVEAL_IN : REVEAL_OUT,
            )}
          >
            {t('burgerMenu.title')}
          </h2>

          <nav className="flex flex-col items-start gap-1 md:min-w-[18rem]">
            {NAV_ITEMS.map((item, i) => {
              const isActive = item.href === pathname
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeForNavigation}
                  aria-current={isActive ? 'page' : undefined}
                  // Stagger: linki wjeżdżają po tytule, jeden po drugim.
                  style={{ transitionDelay: burgerOpen ? `${240 + i * 55}ms` : '0ms' }}
                  className={cn(
                    // Rozmiar + line-height w JEDNEJ klasie (`text-[…]/[…]`) — osobne
                    // `leading-[…]` obok arbitralnego `text-[…]` jest wycinane przez
                    // tailwind-merge (traktuje text-[…] jak potencjalny font/leading).
                    'block font-medium tracking-tight',
                    'text-[clamp(1.75rem,3.2vw,2.75rem)]/[1.25]',
                    // `color` w liście tranzycji, żeby hover nadal płynnie zmieniał kolor.
                    REVEAL_WITH_COLOR,
                    burgerOpen ? REVEAL_IN : REVEAL_OUT,
                    isActive ? 'text-accent' : 'text-text hover:text-accent',
                  )}
                >
                  {item.label[locale]}
                </Link>
              )
            })}
          </nav>
        </div>

        <div
          style={{ transitionDelay: burgerOpen ? '560ms' : '0ms' }}
          className={cn(
            'flex w-full items-center justify-start md:justify-end',
            REVEAL,
            burgerOpen ? REVEAL_IN : REVEAL_OUT,
          )}
        >
          <div
            role="group"
            aria-label={t('languageSwitcher.ariaLabel')}
            className="flex items-center gap-2 text-base md:text-lg"
          >
            {routing.locales.map((loc, i) => {
              const active = loc === locale
              return (
                <Fragment key={loc}>
                  {i > 0 && (
                    <span className="text-text-muted" aria-hidden>
                      /
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => switchLocale(loc)}
                    aria-current={active ? 'true' : undefined}
                    className={cn(
                      'cursor-pointer font-medium uppercase transition-colors',
                      active ? 'text-accent' : 'text-gray hover:text-text',
                    )}
                  >
                    {loc}
                  </button>
                </Fragment>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
