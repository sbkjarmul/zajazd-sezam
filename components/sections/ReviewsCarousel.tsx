'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Locale } from '@/i18n/routing'
import type { GoogleReview } from '@/lib/googleReviews'

type Props = {
  reviews: GoogleReview[]
  locale: Locale
  placeholderLabel: string
}

// Karuzela opinii.
//
// Desktop (md+): placeholder-card przyklejony po lewej (sticky left-0) z
// dużym cudzysłowem, labelem i strzałkami; recenzje scrollują się poziomo
// za nim i znikają.
//
// Mobile: placeholder ukryty (sticky 280px zżerało cały ekran zostawiając
// kilka pikseli na recenzję). Karty recenzji rozciągnięte do pełnej
// szerokości containera, snap-x. Pod scrollerem dwa okrągłe ciemne
// przyciski prev/next.
//
// LEFT (←) = previous → scroll w prawo. RIGHT (→) = next → scroll w lewo.
// Pierwsza opinia (scrollLeft = 0) → LEFT disabled.
// Ostatnia opinia (scrollLeft = max) → RIGHT disabled.
export function ReviewsCarousel({ reviews, locale, placeholderLabel }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [isFirst, setIsFirst] = useState(true)
  const [isLast, setIsLast] = useState(false)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const update = () => {
      setIsFirst(el.scrollLeft <= 4)
      setIsLast(Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth - 4)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  // Krok scrolla mierzony z aktualnych kart — szerokość różni się na mobile
  // (w-full) vs desktop (w-[406px]), więc hardcode się nie sprawdzał.
  const cardStep = () => {
    const el = scrollerRef.current
    if (!el) return 0
    const cards = el.querySelectorAll<HTMLElement>('[data-card]')
    if (cards.length >= 2) {
      const dist = cards[1].offsetLeft - cards[0].offsetLeft
      if (dist > 0) return dist
    }
    if (cards.length === 1) return cards[0].offsetWidth + 16
    return el.clientWidth
  }

  const handleLeft = () =>
    scrollerRef.current?.scrollBy({ left: -cardStep(), behavior: 'smooth' })
  const handleRight = () =>
    scrollerRef.current?.scrollBy({ left: cardStep(), behavior: 'smooth' })

  const prevAria = locale === 'pl' ? 'Poprzednia opinia' : 'Previous review'
  const nextAria = locale === 'pl' ? 'Następna opinia' : 'Next review'

  return (
    <div className="flex flex-col gap-10 md:gap-0">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] md:-mr-16 md:w-[calc(100%+4rem)] md:scroll-pl-[346px] [&::-webkit-scrollbar]:hidden"
      >
        <PlaceholderCard
          label={placeholderLabel}
          locale={locale}
          onLeft={handleLeft}
          onRight={handleRight}
          leftDisabled={isFirst}
          rightDisabled={isLast}
        />
        {reviews.map((review, i) => (
          <ReviewCard key={i} review={review} locale={locale} />
        ))}
      </div>

      {/* Mobile: okrągłe ciemne strzałki pod scrollerem */}
      <div className="flex items-center justify-center gap-4 md:hidden">
        <button
          type="button"
          onClick={handleLeft}
          disabled={isFirst}
          aria-label={prevAria}
          className="bg-primary text-primary-foreground hover:bg-primary-hover flex size-14 cursor-pointer items-center justify-center rounded-full transition-colors disabled:bg-gray disabled:cursor-not-allowed disabled:hover:bg-gray"
        >
          <ChevronLeft className="size-6" aria-hidden />
        </button>
        <button
          type="button"
          onClick={handleRight}
          disabled={isLast}
          aria-label={nextAria}
          className="bg-primary text-primary-foreground hover:bg-primary-hover flex size-14 cursor-pointer items-center justify-center rounded-full transition-colors disabled:bg-gray disabled:cursor-not-allowed disabled:hover:bg-gray"
        >
          <ChevronRight className="size-6" aria-hidden />
        </button>
      </div>
    </div>
  )
}

function PlaceholderCard({
  label,
  locale,
  onLeft,
  onRight,
  leftDisabled,
  rightDisabled,
}: {
  label: string
  locale: Locale
  onLeft: () => void
  onRight: () => void
  leftDisabled: boolean
  rightDisabled: boolean
}) {
  const leftAria = locale === 'pl' ? 'Poprzednia opinia' : 'Previous review'
  const rightAria = locale === 'pl' ? 'Następna opinia' : 'Next review'
  return (
    <div className="bg-bg sticky left-0 z-10 hidden h-[353px] w-[280px] shrink-0 flex-col justify-between px-4 py-2 md:flex md:w-[330px] md:px-8">
      <Image
        src="/images/icons/sezam-quote.svg"
        alt=""
        width={118}
        height={121}
        className="h-auto w-[60px] md:w-[80px]"
        aria-hidden
      />
      <p className="text-text text-2xl leading-[1.2] md:text-[32px]">{label}</p>
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={onLeft}
          disabled={leftDisabled}
          aria-label={leftAria}
          className={cn(
            'transition-colors',
            leftDisabled
              ? 'text-gray cursor-not-allowed'
              : 'text-text hover:text-accent cursor-pointer',
          )}
        >
          <ArrowLeft className="size-5" />
        </button>
        <span aria-hidden className="bg-border-subtle h-px w-12" />
        <button
          type="button"
          onClick={onRight}
          disabled={rightDisabled}
          aria-label={rightAria}
          className={cn(
            'transition-colors',
            rightDisabled
              ? 'text-gray cursor-not-allowed'
              : 'text-text hover:text-accent cursor-pointer',
          )}
        >
          <ArrowRight className="size-5" />
        </button>
      </div>
    </div>
  )
}

function ReviewCard({
  review,
  locale,
}: {
  review: GoogleReview
  locale: Locale
}) {
  const text = review.text[locale]
  const time = review.relativeTimeDescription[locale]
  return (
    <article
      data-card
      className="flex h-[353px] w-full shrink-0 snap-start flex-col justify-between p-8 md:w-[406px]"
    >
      <p className="text-text line-clamp-[8] text-base leading-[1.4]">{text}</p>
      <div className="flex items-start gap-3">
        <Avatar name={review.authorName} photoUrl={review.profilePhotoUrl} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {review.authorUrl ? (
            <a
              href={review.authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text text-base font-bold underline-offset-2 hover:underline"
            >
              {review.authorName}
            </a>
          ) : (
            <span className="text-text text-base font-bold">{review.authorName}</span>
          )}
          <span className="text-gray text-xs">{time}</span>
        </div>
      </div>
    </article>
  )
}

function Avatar({ name, photoUrl }: { name: string; photoUrl?: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={name}
        width={40}
        height={40}
        className="size-10 shrink-0 rounded-full object-cover"
      />
    )
  }
  return (
    <span
      aria-hidden
      className="bg-secondary text-text-inverse inline-flex size-10 shrink-0 items-center justify-center rounded-full text-base font-bold"
    >
      {initial}
    </span>
  )
}
