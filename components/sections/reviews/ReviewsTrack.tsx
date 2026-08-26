'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { GuestReview } from '@/lib/reviews'
import type { Locale } from '@/i18n/routing'

// Predkosc dryfu tasmy opinii (px/s) - spokojny, ciagly ruch.
const SPEED = 40
// Ile zestawow opinii sklejonych w tasme (>=2 dla bezszwowej petli).
const COPIES = 3

type Props = {
  reviews: GuestReview[]
  locale: Locale
}

// Tasma opinii - karty same przesuwaja sie w LEWO (z prawej do lewej) w
// nieskonczonej, bezszwowej petli (GSAP). Wspolny wzorzec dla wszystkich stron
// (home / hotel / imprezy).
// Pauza na hover (desktop) i dotkniecie (mobile) - mozna doczytac opinie.
// `prefers-reduced-motion: reduce` -> bez animacji (statyczny rzad).
export function ReviewsTrack({ reviews, locale }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useGSAP(
    () => {
      const track = trackRef.current
      if (!track) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      // Kazda karta ma margin-right (nie flex-gap), wiec jeden zestaw =
      // scrollWidth / COPIES dokladnie -> bezszwowa petla przy zawinieciu.
      const setWidth = track.scrollWidth / COPIES
      if (!setWidth) return

      // Ruch w LEWO (z prawej do lewej, jak reszta poziomych animacji): start 0,
      // animacja do -setWidth, powrot do 0 (identyczny zestaw sklejony COPIES
      // razy) -> bezszwowa petla przesuwajaca tresc w lewo.
      const tween = gsap.fromTo(
        track,
        { x: 0 },
        { x: -setWidth, duration: setWidth / SPEED, ease: 'none', repeat: -1 },
      )
      tweenRef.current = tween
      return () => {
        tween.kill()
        tweenRef.current = null
      }
    },
    { scope: rootRef, dependencies: [reviews.length] },
  )

  const pause = () => tweenRef.current?.pause()
  const resume = () => tweenRef.current?.resume()

  if (reviews.length === 0) return null
  const sets = Array.from({ length: COPIES })

  return (
    <div
      ref={rootRef}
      className="overflow-hidden"
      onPointerEnter={pause}
      onPointerLeave={resume}
      onPointerDown={pause}
      onPointerUp={resume}
      onPointerCancel={resume}
    >
      <div
        ref={trackRef}
        className="flex w-max [transform:translateZ(0)] px-4 will-change-transform"
      >
        {sets.map((_, s) =>
          reviews.map((review, i) => (
            <ReviewCard key={`${s}-${i}`} review={review} locale={locale} aria-hidden={s > 0} />
          )),
        )}
      </div>
    </div>
  )
}

function ReviewCard({
  review,
  locale,
  ...rest
}: {
  review: GuestReview
  locale: Locale
} & React.HTMLAttributes<HTMLElement>) {
  const text = review.text[locale]
  const time = review.relativeTimeDescription[locale]
  return (
    <article
      className="mr-[10px] flex h-[353px] w-[338px] shrink-0 flex-col justify-between rounded-2xl border border-white bg-transparent p-8 md:w-[406px]"
      {...rest}
    >
      <p className="text-text line-clamp-[8] text-base">{text}</p>
      <div className="flex items-start gap-3">
        <Avatar name={review.authorName} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {review.authorUrl ? (
            <a
              href={review.authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text text-base font-normal underline-offset-2 hover:underline"
            >
              {review.authorName}
            </a>
          ) : (
            <span className="text-text text-base font-normal">{review.authorName}</span>
          )}
          <span className="text-gray text-xs">{time}</span>
        </div>
      </div>
    </article>
  )
}

function Avatar({ name }: { name: string }) {
  // Inicjal zamiast zdjecia profilowego z Google: awatary recenzentow to
  // hotlink do googleusercontent.com — znikaja, gdy autor zmieni zdjecie,
  // i wymagaja wpuszczenia obcego hosta do `next/image`. Litera jest stabilna
  // i nie dociaga niczego z zewnatrz.
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <span
      aria-hidden
      className="bg-secondary text-text-inverse inline-flex size-10 shrink-0 items-center justify-center rounded-full text-base font-bold"
    >
      {initial}
    </span>
  )
}
