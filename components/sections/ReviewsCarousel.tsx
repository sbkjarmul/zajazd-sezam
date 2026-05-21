'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Locale } from '@/i18n/routing'
import type { GoogleReview } from '@/lib/googleReviews'

type Props = {
  reviews: GoogleReview[]
  locale: Locale
  placeholderLabel: string
}

const CARD_W_MOBILE = 320 + 16 // card width + gap
const CARD_W_DESKTOP = 406 + 16

// Karuzela opinii z placeholder-cardem przyklejonym po lewej (sticky left-0).
// Recenzje scrollują się poziomo i znikają za placeholderem.
// Strzałki w placeholderze przesuwają o jedną opinię:
//   - LEFT (←)  = previous → scroll w prawo (poprzednia opinia wraca)
//   - RIGHT (→) = next     → scroll w lewo (kolejna opinia pojawia się z prawej)
// Pierwsza opinia (scrollLeft = 0)         → LEFT disabled (nie ma poprzedniej).
// Ostatnia opinia (scrollLeft = max)       → RIGHT disabled (nie ma następnej).
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

  const cardStep = () => (window.matchMedia('(min-width: 768px)').matches ? CARD_W_DESKTOP : CARD_W_MOBILE)

  const handleLeft = () => {
    scrollerRef.current?.scrollBy({ left: -cardStep(), behavior: 'smooth' })
  }
  const handleRight = () => {
    scrollerRef.current?.scrollBy({ left: cardStep(), behavior: 'smooth' })
  }

  return (
    <div
      ref={scrollerRef}
      className="-mr-4 flex w-[calc(100%+1rem)] snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth scroll-pl-[296px] [scrollbar-width:none] md:-mr-16 md:w-[calc(100%+4rem)] md:scroll-pl-[346px] [&::-webkit-scrollbar]:hidden"
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
    <div className="bg-bg sticky left-0 z-10 flex h-[353px] w-[280px] shrink-0 flex-col justify-between px-4 py-2 md:w-[330px] md:px-8">
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
    <article className="flex h-[353px] w-[320px] shrink-0 snap-start flex-col justify-between p-8 md:w-[406px]">
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
