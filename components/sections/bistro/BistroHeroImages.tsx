'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { RevealImage } from '@/components/RevealImage'
import type { BISTRO_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'

gsap.registerPlugin(ScrollTrigger)

type HeroImages = NonNullable<NonNullable<BISTRO_PAGE_QUERY_RESULT>['heroImages']>

type Props = {
  images: HeroImages
  locale: Locale
}

// Dwa przechylone zdjęcia hero (Figma 971:1214). Trzy warstwy na zdjęcie:
//  1. wrapper `[data-parallax]` — GSAP przesuwa Y na scroll (parallax: zdjęcia
//     scrollują szybciej niż tekst), wartość = frakcja wysokości kadru.
//  2. wrapper z rotacją (transform: rotate) — osobno, żeby GSAP nie kolidował
//     z transformem parallaxu.
//  3. kadr z RevealImage (clip-path unfold) — lewe niżej + późniejszy start.
// `prefers-reduced-motion` → brak parallaxu (matchMedia guard).
export function BistroHeroImages({ images, locale }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const items = gsap.utils.toArray<HTMLElement>('[data-parallax]', root)
        const tweens = items.map((el) => {
          const amount = Number(el.dataset.parallax) * 100 // % wysokości kadru
          return gsap.fromTo(
            el,
            { yPercent: amount },
            {
              yPercent: -amount,
              ease: 'none',
              scrollTrigger: {
                trigger: root,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )
        })
        return () => tweens.forEach((t) => (t.scrollTrigger?.kill(), t.kill()))
      })

      return () => mm.revert()
    },
    { scope: rootRef },
  )

  return (
    <div ref={rootRef} className="flex items-start justify-center gap-3 py-6 md:gap-4 md:py-10">
      {images.slice(0, 2).map((image, i) => {
        const isLeft = i === 0
        return (
          <div
            key={image.asset?._id ?? i}
            // Parallax + offset: lewe niżej (mt) i „lżejsze" (mniejszy dryf),
            // prawe szybsze — oba szybciej niż tekst.
            data-parallax={isLeft ? 0.12 : 0.18}
            className={isLeft ? 'mt-12 md:mt-24' : ''}
          >
            <div className={isLeft ? 'rotate-[-9.85deg]' : 'rotate-[16.63deg]'}>
              <div className="relative aspect-[377/446] w-[clamp(150px,38vw,378px)] overflow-hidden">
                {/* Oba zdjęcia wjeżdżają od razu; lewe (drugie) z opóźnieniem —
                    sekwencja: prawe → lewe. */}
                <RevealImage
                  image={image}
                  locale={locale}
                  direction="up"
                  start="top 85%"
                  delay={isLeft ? 0.35 : 0}
                  priority={!isLeft}
                  sizes="(max-width: 768px) 38vw, 378px"
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
