'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { useGSAP } from '@gsap/react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { Dialog as DialogPrimitive, VisuallyHidden } from 'radix-ui'
import { SanityImage } from '@/components/SanityImage'
import type { Locale } from '@/i18n/routing'
import { cn } from '@/lib/utils'

gsap.registerPlugin(CustomEase)

// Ease przełączania slajdów — easeInOutCubic: łagodne przyspieszenie i wyhamowanie
// (bez ostrego zrywu). Długi czas → spokojny, „premium" przesuw taśmy.
const SLIDE_EASE = CustomEase.create('lbPremium', 'M0,0 C0.65,0 0.35,1 1,1')
const SLIDE_DURATION = 1.0

type GalleryImage = Parameters<typeof SanityImage>[0]['image']

// Pojedynczy slajd taśmy. Traktowanie zależne od urządzenia i orientacji:
//  - mobile (<lg): zdjęcie w naturalnych wymiarach (object-contain), oba orientacje,
//  - desktop poziome → object-cover na cały ekran (nadmiar przycięty),
//  - desktop pionowe → kadr 9:16 wyśrodkowany (object-cover), a reszta ekranu to
//    to samo zdjęcie rozjechane z mocnym blurem.
// Blur-up: dopóki zdjęcie się nie załaduje, jest rozmyte w swoich kolorach (LQIP);
// po załadowaniu blur schodzi do zera. Kadr startowy (priority) startuje jako
// załadowany — dzięki temu wejście galerii jest czystym fade, bez blura.
function LightboxSlide({
  image,
  locale,
  active,
  priority,
}: {
  image: GalleryImage
  locale: Locale
  active: boolean
  priority: boolean
}) {
  const [loaded, setLoaded] = useState(priority)
  const dims = image?.asset?.metadata?.dimensions
  const isPortrait = !!dims && (dims.height ?? 0) > (dims.width ?? 0)

  const fitClass = (fit: 'object-cover' | 'object-contain') =>
    cn(
      fit,
      'transition-[filter,scale] duration-700 ease-out motion-reduce:transition-none',
      loaded ? 'blur-0 scale-100' : 'scale-105 blur-2xl',
    )

  // overflow-hidden — blur-2xl doładowującego się sąsiada nie wylewa się poza
  // swój slajd (inaczej widać go na krawędzi bieżącego kadru).
  return (
    <div className="relative h-full w-full flex-none overflow-hidden" aria-hidden={!active}>
      {/* Rozmyte tło z tego samego zdjęcia — wypełnia miejsce, którego nie zajmuje
          kadr. Widoczne na mobile (zawsze) i na desktopie dla pionowych; na
          desktopowych poziomych ukryte (object-cover i tak wypełnia ekran). */}
      <div
        className={cn('absolute inset-0 overflow-hidden', !isPortrait && 'lg:hidden')}
        aria-hidden
      >
        <SanityImage
          image={image}
          locale={locale}
          fill
          sizes="100vw"
          className="scale-110 object-cover blur-2xl"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Mobile: naturalne wymiary — object-contain, oba orientacje */}
      <div className="absolute inset-0 lg:hidden">
        <SanityImage
          image={image}
          locale={locale}
          fill
          priority={priority}
          sizes="100vw"
          onLoad={() => setLoaded(true)}
          className={fitClass('object-contain')}
        />
      </div>

      {/* Desktop: poziome cover / pionowe kadr 9:16 wyśrodkowany */}
      <div className="absolute inset-0 hidden lg:block">
        {isPortrait ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative aspect-[9/16] h-full max-w-full overflow-hidden">
              <SanityImage
                image={image}
                locale={locale}
                fill
                priority={priority}
                sizes="100vw"
                onLoad={() => setLoaded(true)}
                className={fitClass('object-cover')}
              />
            </div>
          </div>
        ) : (
          <SanityImage
            image={image}
            locale={locale}
            fill
            priority={priority}
            sizes="100vw"
            onLoad={() => setLoaded(true)}
            className={fitClass('object-cover')}
          />
        )}
      </div>
    </div>
  )
}

type Props = {
  images: GalleryImage[]
  locale: Locale
  /** Tryb kontrolowany — open + onOpenChange. Pomiń, gdy używasz `trigger`. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Tryb z triggerem — element otwierający galerię (Radix zarządza stanem sam). */
  trigger?: React.ReactNode
  /** Kadr, od którego startuje galeria po otwarciu. */
  initialIndex?: number
  /** Etykieta dla czytników ekranu (Dialog.Title). */
  title?: string
}

// Wnętrze galerii — montowane dopiero po otwarciu (Radix odmontowuje Content
// przy zamknięciu). Dzięki temu index i stan wejścia startują świeże przy każdym
// otwarciu, bez ręcznego resetowania stanu w efekcie.
function LightboxContent({
  images,
  locale,
  initialIndex,
}: {
  images: GalleryImage[]
  locale: Locale
  initialIndex: number
}) {
  const total = images.length
  const hasClones = total > 1
  const [index, setIndex] = useState(initialIndex)

  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const isFirstSlide = useRef(true)
  const prevIndex = useRef(initialIndex)
  const lastNav = useRef<'next' | 'prev' | 'jump'>('jump')
  // Gdy trwa animacja zawinięcia przez klon — pozycja do „docanonizowania"
  // taśmy (na wypadek przerwania kolejnym kliknięciem przed onComplete).
  const pendingReset = useRef<number | null>(null)

  // Pozycja slajdu realnego #i na taśmie: z klonami-bookendami przesunięta o 1.
  const posOf = (i: number) => (hasClones ? i + 1 : i)

  // Ustaw pozycję startową taśmy GSAP-em już w ref-callbacku (biegnie przed
  // pierwszym malowaniem). Dzięki temu nie miga klon ostatniego (pozycja 0),
  // a transformem włada wyłącznie GSAP — bez konfliktu z inline stylem React.
  const setTrackRef = useCallback(
    (node: HTMLDivElement | null) => {
      trackRef.current = node
      if (node) gsap.set(node, { xPercent: -(hasClones ? initialIndex + 1 : initialIndex) * 100 })
    },
    [hasClones, initialIndex],
  )

  const goNext = useCallback(() => {
    lastNav.current = 'next'
    setIndex((i) => (i + 1) % total)
  }, [total])
  const goPrev = useCallback(() => {
    lastNav.current = 'prev'
    setIndex((i) => (i - 1 + total) % total)
  }, [total])

  // Klawiatura: strzałki przełączają, ESC obsługuje Radix.
  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [goNext, goPrev])

  // Taśma: track i slajdy mają szerokość kontenera (w-full), więc xPercent = -pos*100
  // przesuwa o pełny kadr (bez 100vw → bez problemu ze znikającym scrollbarem).
  // Nieskończona rolka: klony-bookendy (kopia ostatniego z przodu, pierwszego z tyłu)
  // pozwalają zawinąć last↔first płynnie „w kółko" — animujemy przez klon, po czym
  // niewidocznie snapujemy na kadr realny.
  useGSAP(
    () => {
      const track = trackRef.current
      if (!track || !total) return
      const cur = index
      const prev = prevIndex.current
      const nav = lastNav.current
      prevIndex.current = cur

      const reduce =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (isFirstSlide.current || reduce) {
        gsap.set(track, { xPercent: -posOf(cur) * 100 })
        isFirstSlide.current = false
        return
      }

      // Docanonizuj taśmę, jeśli poprzednie zawinięcie zostało przerwane.
      if (pendingReset.current !== null) {
        gsap.set(track, { xPercent: pendingReset.current })
        pendingReset.current = null
      }

      const tween = (xPercent: number, onComplete?: () => void) =>
        gsap.to(track, {
          xPercent,
          duration: SLIDE_DURATION,
          ease: SLIDE_EASE,
          overwrite: true,
          onComplete,
        })

      if (hasClones && nav === 'next' && prev === total - 1 && cur === 0) {
        // Do przodu przez klon pierwszego (pozycja total+1), potem snap na pozycję 1.
        pendingReset.current = -1 * 100
        tween(-(total + 1) * 100, () => {
          gsap.set(track, { xPercent: -1 * 100 })
          pendingReset.current = null
        })
      } else if (hasClones && nav === 'prev' && prev === 0 && cur === total - 1) {
        // Do tyłu przez klon ostatniego (pozycja 0), potem snap na pozycję total.
        pendingReset.current = -total * 100
        tween(0, () => {
          gsap.set(track, { xPercent: -total * 100 })
          pendingReset.current = null
        })
      } else {
        tween(-posOf(cur) * 100)
      }
    },
    { dependencies: [index], scope: rootRef },
  )

  // Rozszerzona lista slajdów z klonami-bookendami (dla płynnego zawinięcia).
  const slides = hasClones
    ? [
        { image: images[total - 1], real: total - 1, clone: true },
        ...images.map((image, i) => ({ image, real: i, clone: false })),
        { image: images[0], real: 0, clone: true },
      ]
    : images.map((image, i) => ({ image, real: i, clone: false }))

  const closeLabel = locale === 'pl' ? 'Zamknij galerię' : 'Close gallery'
  const prevLabel = locale === 'pl' ? 'Poprzednie zdjęcie' : 'Previous image'
  const nextLabel = locale === 'pl' ? 'Następne zdjęcie' : 'Next image'

  return (
    <div ref={rootRef} className="relative h-full w-full">
      {/* Taśma slajdów — track i slajdy mają szerokość kontenera (w-full);
          xPercent = -pos*100 przesuwa o pełny kadr. Skrajne slajdy to klony
          (bookendy) dla płynnego zawinięcia „w kółko". Pozycję startową ustawia
          setTrackRef (GSAP przed paintem) — bez inline transformu React. */}
      <div ref={setTrackRef} className="flex h-full w-full will-change-transform">
        {slides.map((s, i) => (
          <LightboxSlide
            key={i}
            image={s.image}
            locale={locale}
            active={!s.clone && s.real === index}
            priority={s.clone || s.real === initialIndex}
          />
        ))}
      </div>

      {/* X — prawy górny róg */}
      <DialogPrimitive.Close
        aria-label={closeLabel}
        className="absolute top-5 right-5 z-10 flex size-12 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
      >
        <X className="size-6" aria-hidden />
      </DialogPrimitive.Close>

      {/* Stała winieta w prawym dolnym rogu ekranu — ogólne przyciemnienie
          narożnika sugerujące, że pasek miniatur można przewijać (nie jest
          doklejona do samego slidera). */}
      {total > 1 && (
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 bottom-0 z-10 h-56 w-64 bg-[radial-gradient(120%_120%_at_100%_100%,rgba(0,0,0,0.75),transparent_65%)]"
        />
      )}

      {/* Miniatury — dół, środek (bez radiusa; aktywna = jaśniejsza, bez ramki).
          Scrollbar ukryty. */}
      {total > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex max-w-[calc(100%-1.5rem)] -translate-x-1/2 [scrollbar-width:none] gap-2 overflow-x-auto px-1 lg:max-w-[calc(100%-9rem)] [&::-webkit-scrollbar]:hidden">
          {images.map((image, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                lastNav.current = 'jump'
                setIndex(i)
              }}
              aria-label={`${i + 1}`}
              aria-current={i === index}
              className={cn(
                'relative size-18 flex-none cursor-pointer overflow-hidden transition-opacity duration-200 md:size-22',
                i === index ? 'opacity-100' : 'opacity-40 hover:opacity-80',
              )}
            >
              <SanityImage
                image={image}
                locale={locale}
                fill
                sizes="88px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Nasze strzałki — prawy dolny róg */}
      {total > 1 && (
        <div className="absolute right-6 bottom-6 z-10 hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={goPrev}
            aria-label={prevLabel}
            className="flex size-12 cursor-pointer items-center justify-center rounded-full border-2 border-white/60 text-white transition-colors hover:bg-white hover:text-black md:size-14"
          >
            <ArrowLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label={nextLabel}
            className="flex size-12 cursor-pointer items-center justify-center rounded-full border-2 border-white/60 text-white transition-colors hover:bg-white hover:text-black md:size-14"
          >
            <ArrowRight className="size-5" aria-hidden />
          </button>
        </div>
      )}
    </div>
  )
}

// Generyczny lightbox galerii — do wielokrotnego użytku w różnych kontekstach.
// Dwa tryby: kontrolowany (open + onOpenChange) albo z `trigger` (Radix sam
// zarządza stanem). Zasilany dowolną listą zdjęć z Sanity.
//  - full-screen: poziome → object-cover na cały ekran; pionowe → kadr 9:16
//    wyśrodkowany + rozmyte tło z tego samego zdjęcia.
//  - przełączanie slajdów animowane GSAP-em jak taśma (poziomy track, jedno
//    zdjęcie wypycha kolejne).
//  - blur-up per zdjęcie: rozmyte dopóki się nie załaduje (kadr startowy bez blura).
//  - wejście/wyjście galerii: delikatny fade (samo opacity).
//  - X w prawym górnym rogu, miniatury na dole-środku (bez radiusa), nasze
//    okrągłe strzałki w prawym dolnym rogu. Miniatury i strzałki przełączają kadr.
export function Lightbox({
  images,
  locale,
  open,
  onOpenChange,
  trigger,
  initialIndex = 0,
  title,
}: Props) {
  const dialogTitle = title ?? (locale === 'pl' ? 'Galeria zdjęć' : 'Photo gallery')

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=open]:animate-lb-fade-in data-[state=closed]:animate-lb-fade-out fixed inset-0 z-50 bg-black" />
        <DialogPrimitive.Content
          aria-label={dialogTitle}
          className="data-[state=open]:animate-lb-fade-in data-[state=closed]:animate-lb-fade-out fixed inset-0 z-50 overflow-hidden bg-black outline-none"
        >
          <VisuallyHidden.Root asChild>
            <DialogPrimitive.Title>{dialogTitle}</DialogPrimitive.Title>
          </VisuallyHidden.Root>
          {images.length > 0 && (
            <LightboxContent images={images} locale={locale} initialIndex={initialIndex} />
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
