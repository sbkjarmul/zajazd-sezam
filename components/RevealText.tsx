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
        // schowany wymuszamy przez gsap.set (nie polegamy na immediateRender
        // `from` — przy Lenis/layout-shift bywał gubiony), a reveal robi gsap.to
        // na ScrollTrigger. Split po załadowaniu fontów, żeby linie łamały się
        // poprawnie.
        let split: SplitText | null = null
        let tween: gsap.core.Tween | null = null
        const build = () => {
          if (!ref.current) return
          // reduceWhiteSpace: false — nie zwijaj/nie normalizuj whitespace, żeby
          // twarde spacje (nbsp, np. z preventOrphans) przetrwały split i dalej
          // wiązały wyrazy (jednoliterowe spójniki nie zostają na końcu linii).
          split = SplitText.create(el, { type: 'lines', mask: 'lines', reduceWhiteSpace: false })
          // Maska (`overflow: clip`) ma wysokość line-box. Przy `leading-none`
          // (line-height 1) ascendery/diakrytyki (Ł, Ś) i descendery (y, j, ą, ę)
          // wystają poza line-box → maska je przycinała. Padding góra/dół
          // powiększa maskę o miejsce na wystające glify, a ujemny margines
          // kompensuje go 1:1 — więc odstęp linii pozostaje = line-height (100%).
          //
          // Kontener robimy flex-column: maski to flex-items, których marginesy
          // NIE collapse'ują (inaczej -0.2em góra/dół zwijały się do -0.2em zamiast
          // -0.4em i między liniami zostawał ~0.2em nadmiarowego odstępu).
          el.style.display = 'flex'
          el.style.flexDirection = 'column'
          const GLYPH_PAD = '0.2em'
          gsap.set(split.lines, {
            yPercent: 110,
            paddingTop: GLYPH_PAD,
            paddingBottom: GLYPH_PAD,
          })
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
        if (document.fonts?.status === 'loaded') build()
        else void document.fonts?.ready.then(build)

        return () => {
          tween?.scrollTrigger?.kill()
          tween?.kill()
          split?.revert()
          el.style.display = ''
          el.style.flexDirection = ''
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
