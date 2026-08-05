'use client'

import { useRef, type ElementType, type ReactNode, type Ref } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText)

type Props = {
  children: ReactNode
  /** Tag renderowany, np. 'h1' | 'h2' | 'p'. Default 'div'. */
  as?: ElementType
  className?: string
  /**
   * 'lines' → maskowany reveal linia po linii (SplitText + stagger) — jak na
   * stronie referencyjnej. 'fade' → całość wjeżdża fade + rise (dla elementów,
   * których nie chcemy dzielić, np. hero h1 z dwoma wariantami spanów).
   */
  mode?: 'lines' | 'fade'
  /** ScrollTrigger start. Default 'top 85%'. */
  start?: string
  delay?: number
}

/**
 * Reveal tekstu w stylu premium studio: nagłówek odsłania się liniami spod
 * maski (overflow-hidden) z translateY, ze staggerem, gdy sekcja wchodzi w
 * viewport. Treść jest w DOM od SSR (SEO), a SplitText ustawia aria-label na
 * oryginalny tekst — bez utraty dostępności.
 *
 * `prefers-reduced-motion` → brak animacji, tekst od razu widoczny (nie
 * dodajemy tweenów, więc DOM zostaje w stanie naturalnym).
 */
export function RevealText({
  children,
  as: Tag = 'div',
  className,
  mode = 'lines',
  start = 'top 85%',
  delay = 0,
}: Props) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (mode === 'fade') {
          gsap.from(el, {
            yPercent: 40,
            autoAlpha: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay,
            scrollTrigger: { trigger: el, start },
          })
          return
        }

        // SplitText: dzielimy na linie z maską (overflow-clip wrapper). Stan
        // schowany wymuszamy przez gsap.set, a reveal robi gsap.to na
        // ScrollTrigger.
        //
        // KLUCZOWE: SplitText mierzy łamanie linii w BIEŻĄCYM `display` hosta.
        // Nasz reveal ustawia na hoście `display:flex; flex-direction:column`
        // (patrz niżej — zapobiega collapse marginesów masek). Gdyby SplitText
        // mierzył przy już ustawionym flex-column, każde SŁOWO trafiłoby jako
        // osobny flex-item do osobnej linii → tytuł łamany po słowie. Dlatego
        // `rebuild()` NAJPIERW `teardown()` (reset display) — pomiar zawsze w bloku.
        //
        // ResizeObserver: re-split przy zmianie szerokości (responsywność ORAZ
        // dojście layoutu do finalnej szerokości po ewentualnym wyścigu przy
        // montażu) — chwilowo zwężona szerokość przy pierwszym pomiarze sama się
        // koryguje. reduceWhiteSpace:false — twarde spacje (nbsp) przeżyją split.
        const GLYPH_PAD = '0.2em'
        let split: SplitText | null = null
        let tween: gsap.core.Tween | null = null
        let ro: ResizeObserver | null = null
        let lastWidth = -1

        const teardown = () => {
          tween?.scrollTrigger?.kill()
          tween?.kill()
          tween = null
          split?.revert()
          split = null
          el.style.display = ''
          el.style.flexDirection = ''
        }

        const rebuild = () => {
          if (!ref.current) return
          teardown() // reset display → SplitText mierzy w bloku (nie flex-column)
          split = SplitText.create(el, { type: 'lines', mask: 'lines', reduceWhiteSpace: false })
          // Kontener flex-column: maski to flex-items, których marginesy NIE
          // collapse'ują (inaczej -0.2em góra/dół zwijały się do -0.2em zamiast
          // -0.4em i między liniami zostawał ~0.2em nadmiarowego odstępu). Maska
          // (`overflow: clip`) ma wysokość line-box; przy `leading-none` ascendery/
          // diakrytyki (Ł, Ś) i descendery (y, j, ą, ę) wystają → padding powiększa
          // maskę o miejsce na glify, a ujemny margines kompensuje go 1:1.
          el.style.display = 'flex'
          el.style.flexDirection = 'column'
          gsap.set(split.lines, { yPercent: 110, paddingTop: GLYPH_PAD, paddingBottom: GLYPH_PAD })
          const masks = (split as SplitText & { masks?: Element[] }).masks
          if (masks?.length) gsap.set(masks, { marginTop: `-${GLYPH_PAD}`, marginBottom: `-${GLYPH_PAD}` })
          tween = gsap.to(split.lines, {
            yPercent: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
            delay,
            scrollTrigger: { trigger: el, start },
          })
        }

        const startObserving = () => {
          if (!ref.current) return
          rebuild()
          lastWidth = el.getBoundingClientRect().width
          ro = new ResizeObserver(() => {
            const w = el.getBoundingClientRect().width
            if (Math.abs(w - lastWidth) < 1) return // ignoruj zmiany samej wysokości
            lastWidth = w
            rebuild()
          })
          ro.observe(el)
        }

        // Split po załadowaniu fontów, żeby linie łamały się poprawnie.
        if (document.fonts?.status === 'loaded') startObserving()
        else void document.fonts?.ready.then(startObserving)

        return () => {
          ro?.disconnect()
          ro = null
          teardown()
        }
      })

      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref as Ref<HTMLElement>} className={className}>
      {children}
    </Tag>
  )
}
