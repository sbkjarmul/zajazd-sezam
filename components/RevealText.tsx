'use client'

import { useEffect, useRef, type ElementType, type ReactNode, type Ref } from 'react'

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

// Animujemy tylko od md (768px) w gore i tylko bez `prefers-reduced-motion`.
// Ponizej progu reveal liminami mial znikoma wartosc, a SplitText + ScrollTrigger
// na kazdym naglowku kosztuje realny layout: re-split lecial takze przy zmianie
// wysokosci viewportu (pasek adresu w mobilnej przegladarce).
const ANIMATE_QUERY = '(prefers-reduced-motion: no-preference) and (min-width: 768px)'

// Maska (`overflow: clip`) ma wysokosc line-boxa; przy `leading-none` ascendery/
// diakrytyki (L, S) i descendery (y, j, a, e) wystaja -> padding powieksza maske
// o miejsce na glify, a ujemny margines kompensuje go 1:1.
const GLYPH_PAD = '0.2em'

/**
 * Reveal tekstu w stylu premium studio: nagłówek odsłania się liniami spod
 * maski (overflow-hidden) z translateY, ze staggerem, gdy sekcja wchodzi w
 * viewport. Treść jest w DOM od SSR (SEO), a SplitText ustawia aria-label na
 * oryginalny tekst — bez utraty dostępności.
 *
 * `prefers-reduced-motion` oraz ekrany < md (768px) → brak animacji, tekst od
 * razu widoczny (nie dodajemy tweenów, więc DOM zostaje w stanie naturalnym).
 * GSAP jest wtedy dodatkowo NIE ŁADOWANY: import jest dynamiczny i wykonuje się
 * dopiero po sprawdzeniu media query, więc na mobile do przeglądarki nie leci ani
 * SplitText, ani (jeśli strona nie ma parallaxu) rdzeń gsapa.
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

  useEffect(() => {
    const mq = window.matchMedia(ANIMATE_QUERY)
    let disposed = false
    // Sprzatanie aktywnej animacji; null = animacja nie jest uruchomiona.
    let teardown: (() => void) | null = null

    const stop = () => {
      teardown?.()
      teardown = null
    }

    const play = async () => {
      if (disposed || teardown || !mq.matches || !ref.current) return

      // Dynamiczny import PO sprawdzeniu media query — to jedyny powód, dla
      // którego nie używamy tu `useGSAP` ani `gsap.matchMedia()`: oba wymagają
      // statycznego `import gsap`, który wciągnąłby bibliotekę do bundle'a także
      // na mobile. SplitText ładujemy wyłącznie w trybie 'lines'.
      const [{ default: gsap }, { ScrollTrigger }, splitMod] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        mode === 'lines' ? import('gsap/SplitText') : Promise.resolve(null),
      ])

      // Warunki mogły się zmienić w trakcie ładowania chunków (unmount, resize
      // poniżej progu) — wtedy nic nie animujemy.
      const el = ref.current
      if (disposed || !mq.matches || !el) return

      gsap.registerPlugin(ScrollTrigger)
      if (splitMod) gsap.registerPlugin(splitMod.SplitText)

      if (mode === 'fade') {
        const tween = gsap.from(el, {
          yPercent: 40,
          // `opacity`, NIE `autoAlpha`. autoAlpha przy krycia 0 ustawia takze
          // `visibility: hidden`, co USUWA element z drzewa dostepnosci -
          // czytnik ekranu nie widzial naglowkow sekcji, dopoki uzytkownik do
          // nich nie przewinal. Osoba niewidoma nawiguje wlasnie po naglowkach,
          // wiec byla to bledna petla; axe raportowal to jako `heading-order`
          // (po h1 pierwszym WIDOCZNYM naglowkiem byl dopiero h3).
          // Wizualnie bez roznicy - samo krycie animuje sie tak samo.
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay,
          scrollTrigger: { trigger: el, start },
        })
        teardown = () => {
          tween.scrollTrigger?.kill()
          tween.kill()
        }
        return
      }

      const SplitTextCtor = splitMod?.SplitText
      if (!SplitTextCtor) return

      // SplitText: dzielimy na linie z maską (overflow-clip wrapper). Stan
      // schowany wymuszamy przez gsap.set, a reveal robi gsap.to na
      // ScrollTrigger.
      //
      // KLUCZOWE: SplitText mierzy łamanie linii w BIEŻĄCYM `display` hosta.
      // Nasz reveal ustawia na hoście `display:flex; flex-direction:column`
      // (patrz niżej — zapobiega collapse marginesów masek). Gdyby SplitText
      // mierzył przy już ustawionym flex-column, każde SŁOWO trafiłoby jako
      // osobny flex-item do osobnej linii → tytuł łamany po słowie. Dlatego
      // `rebuild()` NAJPIERW `teardownSplit()` (reset display) — pomiar zawsze w bloku.
      //
      // ResizeObserver: re-split przy zmianie szerokości (responsywność ORAZ
      // dojście layoutu do finalnej szerokości po ewentualnym wyścigu przy
      // montażu) — chwilowo zwężona szerokość przy pierwszym pomiarze sama się
      // koryguje. reduceWhiteSpace:false — twarde spacje (nbsp) przeżyją split.
      let split: SplitText | null = null
      let tween: gsap.core.Tween | null = null
      let ro: ResizeObserver | null = null
      let lastWidth = -1

      const teardownSplit = () => {
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
        teardownSplit() // reset display → SplitText mierzy w bloku (nie flex-column)
        // aria:'none' — patrz HeroSection: domyslny aria-label ladowal na
        // <span> bez roli (aria-prohibited-attr). Podzial na LINIE zachowuje
        // pelny tekst w DOM, wiec AT czyta go bez labela.
        split = SplitTextCtor.create(el, {
          type: 'lines',
          mask: 'lines',
          reduceWhiteSpace: false,
          aria: 'none',
        })
        // Kontener flex-column: maski to flex-items, których marginesy NIE
        // collapse'ują (inaczej -0.2em góra/dół zwijały się do -0.2em zamiast
        // -0.4em i między liniami zostawał ~0.2em nadmiarowego odstępu).
        el.style.display = 'flex'
        el.style.flexDirection = 'column'
        gsap.set(split.lines, { yPercent: 110, paddingTop: GLYPH_PAD, paddingBottom: GLYPH_PAD })
        const masks = (split as SplitText & { masks?: Element[] }).masks
        if (masks?.length)
          gsap.set(masks, { marginTop: `-${GLYPH_PAD}`, marginBottom: `-${GLYPH_PAD}` })
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
        if (disposed || !mq.matches || !ref.current) return
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

      teardown = () => {
        ro?.disconnect()
        ro = null
        teardownSplit()
      }
    }

    // Przekroczenie progu w obie strony (resize, obrót tabletu, zmiana
    // preferencji ruchu) — odpowiednik `gsap.matchMedia()`, ale bez statycznego
    // importu gsapa.
    const onChange = () => {
      if (mq.matches) void play()
      else stop()
    }
    mq.addEventListener('change', onChange)
    void play()

    return () => {
      disposed = true
      mq.removeEventListener('change', onChange)
      stop()
    }
  }, [mode, start, delay])

  return (
    <Tag ref={ref as Ref<HTMLElement>} className={className}>
      {children}
    </Tag>
  )
}
