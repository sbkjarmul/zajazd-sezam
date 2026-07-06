'use client'

import { useRef } from 'react'
import { Star } from 'lucide-react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { HomeHeroBackground } from './HomeHeroBackground'
import { pickLocale } from '@/lib/i18n/pickLocale'

gsap.registerPlugin(SplitText)

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['hero']
  locale: Locale
}

const GUESTS_LABEL: Record<Locale, string> = {
  pl: '1100+ zadowolonych gości',
  en: '1100+ happy guests',
}

const RESERVE_LABEL: Record<Locale, string> = {
  pl: 'Zarezerwuj termin',
  en: 'Book your stay',
}

// Wysokość hero minimalnie 800px, poza tym proporcjonalna do wgranego w Sanity
// zdjęcia (aspect-ratio z metadata.dimensions) — hero „rośnie" razem z obrazem.
const HERO_MIN_HEIGHT = '800px'

// Dzieli nagłówek na 3 części:
//   line1     — słowa poza łącznikiem i akcentem (pierwsza linia)
//   connector — łącznik przed akcentem (np. „w"), w Inter, przenoszony do 2. linii
//   accent    — ostatnie 2 słowa („rodzinnej atmosferze") kursywą Westbourne Serif
// Wymuszony <br> gwarantuje: 1. linia = line1, 2. linia = „w " + akcent (łącznik
// nie zostaje osierocony na końcu 1. linii).
function splitHeadline(text: string): { line1: string; connector: string; accent: string } {
  const parts = text.trim().split(/\s+/).filter(Boolean)
  if (parts.length < 3) {
    return { line1: parts.slice(0, -2).join(' '), connector: '', accent: parts.slice(-2).join(' ') }
  }
  return {
    line1: parts.slice(0, -3).join(' '),
    connector: parts[parts.length - 3],
    accent: parts.slice(-2).join(' '),
  }
}

function Headline({
  line1,
  connector,
  accent,
}: {
  line1: string
  connector: string
  accent: string
}) {
  return (
    <>
      {line1}
      {line1 && <br />}
      {connector}
      {connector ? ' ' : ''}
      <em className="font-accent font-normal italic">{accent}</em>
    </>
  )
}

// 4.5 gwiazdki (4 pełne + 1 połówka). Połówka: bazowa gwiazdka-outline z
// nałożoną, przyciętą do 50% szerokości gwiazdką wypełnioną.
function StarRating() {
  return (
    <div className="text-text-inverse flex items-center gap-1" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <Star key={i} className="size-5 fill-current" strokeWidth={1.5} />
      ))}
      <span className="relative inline-flex size-5">
        <Star className="absolute inset-0 size-5" strokeWidth={1.5} />
        <span className="absolute inset-0 w-1/2 overflow-hidden">
          <Star className="size-5 fill-current" strokeWidth={1.5} />
        </span>
      </span>
    </div>
  )
}

export function HeroSection({ data, locale }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)

  // Sekwencja wejściowa (load, nie scroll — hero jest nad foldem):
  //   1. nagłówek — reveal wyraz po wyrazie (SplitText words)
  //   2. header — fade-in z góry (osobny komponent, delay HERO_HEADER_DELAY_S)
  //   3. opis (tekst) — wjazd od dołu spod maski
  //   4. button — wjazd od dołu spod maski
  //   5. eyebrow (ocena: gwiazdki + liczba gości) — fade + rise, na końcu
  // Nagłówek dzielimy tylko na WIDOCZNYM wariancie (mobile/desktop) — matchMedia,
  // bo drugi span jest display:none i SplitText by go nie zmierzył.
  // Pozycje na osi czasu współdzielone z opóźnieniem headera (HERO_HEADER_DELAY_S).
  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const mm = gsap.matchMedia()
      mm.add(
        {
          reduce: '(prefers-reduced-motion: reduce)',
          desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
        },
        (ctx) => {
          if (ctx.conditions?.reduce) return // brak animacji — treść widoczna

          const isDesktop = ctx.conditions?.desktop
          const rating = root.querySelector<HTMLElement>('[data-hero-rating]')
          const subInner = root.querySelector<HTMLElement>('[data-hero-sub]')
          const ctaInner = root.querySelector<HTMLElement>('[data-hero-cta]')
          const headlineEl = root.querySelector<HTMLElement>(
            isDesktop ? '[data-hl="desktop"]' : '[data-hl="mobile"]',
          )

          let split: SplitText | null = null
          let tl: gsap.core.Timeline | null = null

          const build = () => {
            if (!rootRef.current || !headlineEl) return
            // Nagłówek: subtelny reveal wyraz po wyrazie (fade + delikatny rise).
            // BEZ maski per-word — kursywa Westbourne ma zwisy/descendery ("j"),
            // które maska by przycięła. Maska (overflow) zarezerwowana dla opisu
            // i buttona (wjazd od dołu).
            split = SplitText.create(headlineEl, { type: 'words' })
            gsap.set(split.words, { autoAlpha: 0, yPercent: 45 })

            // Pozycje absolutne na osi czasu → deterministyczna kolejność:
            // nagłówek(0) → tekst(0.7) → button + header (~1.1) → eyebrow(1.45)
            tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
            tl.to(split.words, { autoAlpha: 1, yPercent: 0, duration: 0.6, stagger: 0.04 }, 0)
              .from(subInner, { yPercent: 110, duration: 0.7 }, 0.7)
              .from(ctaInner, { yPercent: 110, duration: 0.6 }, 1.1)
              .from(rating, { y: 16, autoAlpha: 0, duration: 0.55 }, 1.45)
          }

          // Split po załadowaniu fontów, żeby słowa (w tym akcent Westbourne)
          // łamały się i mierzyły poprawnie.
          if (document.fonts?.status === 'loaded') build()
          else void document.fonts?.ready.then(build)

          return () => {
            tl?.kill()
            split?.revert()
          }
        },
      )

      return () => mm.revert()
    },
    { scope: rootRef },
  )

  if (!data) return null
  const headlineDesktop = pickLocale(data.headline, locale)
  const headlineMobile = pickLocale(data.headlineMobile, locale) ?? headlineDesktop
  const subheadlineDesktop = pickLocale(data.subheadline, locale)
  const subheadlineMobile = pickLocale(data.subheadlineMobile, locale) ?? subheadlineDesktop
  const ctaLabel = pickLocale(data.primaryCtaLabel, locale) ?? RESERVE_LABEL[locale]

  const deskAccent = headlineDesktop ? splitHeadline(headlineDesktop) : null
  const mobAccent = headlineMobile ? splitHeadline(headlineMobile) : null

  // Wysokość sekcji: min. 800px + aspect-ratio z wymiarów zdjęcia (jeśli dostępne)
  // — hero dopasowuje wysokość do wgranego w Sanity obrazka.
  const dims = data.image?.asset?.metadata?.dimensions
  const heroStyle: React.CSSProperties = {
    minHeight: HERO_MIN_HEIGHT,
    ...(dims?.width && dims?.height ? { aspectRatio: `${dims.width} / ${dims.height}` } : {}),
  }

  return (
    <section className="relative flex w-full flex-col overflow-hidden" style={heroStyle}>
      <HomeHeroBackground
        image={data.image}
        locale={locale}
        imageClassName="object-[center_38%]"
        priority
      />

      {/* Wtopienie dołu zdjęcia w biel — miękkie przejście hero → sekcja About
          (białe tło). */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-[30%] bg-gradient-to-t from-white from-22% via-white/80 via-55% to-transparent"
      />

      <div
        ref={rootRef}
        className="text-text-inverse layout-container relative flex flex-col items-center gap-6 pt-[110px] pb-24 text-center md:gap-7 md:pt-[150px]"
      >
        {/* Ocena: 4.5 gwiazdki + liczba gości — wyśrodkowane, stack pionowy */}
        <div data-hero-rating className="flex flex-col items-center gap-2">
          <StarRating />
          <span className="text-sm md:text-base">{GUESTS_LABEL[locale]}</span>
        </div>

        {(mobAccent || deskAccent) && (
          <h1 className="text-[30px] leading-[1.1] font-normal tracking-tight md:text-[52px] lg:text-[60px] xl:text-[64px]">
            {mobAccent && (
              <span data-hl="mobile" className="md:hidden">
                <Headline
                  line1={mobAccent.line1}
                  connector={mobAccent.connector}
                  accent={mobAccent.accent}
                />
              </span>
            )}
            {deskAccent && (
              <span data-hl="desktop" className="hidden md:inline">
                <Headline
                  line1={deskAccent.line1}
                  connector={deskAccent.connector}
                  accent={deskAccent.accent}
                />
              </span>
            )}
          </h1>
        )}

        {(subheadlineMobile || subheadlineDesktop) && (
          <div className="overflow-hidden">
            <p
              data-hero-sub
              className="text-text-inverse/90 max-w-xl text-base leading-snug md:text-lg"
            >
              <span className="md:hidden">{subheadlineMobile}</span>
              <span className="hidden md:inline">{subheadlineDesktop}</span>
            </p>
          </div>
        )}

        <div className="w-full overflow-hidden pt-2 md:w-auto">
          <div data-hero-cta className="w-full md:w-auto">
            <ReservationCtaButton tab="room" variant="filled-dark" className="w-full md:w-auto">
              {ctaLabel}
            </ReservationCtaButton>
          </div>
        </div>
      </div>
    </section>
  )
}
