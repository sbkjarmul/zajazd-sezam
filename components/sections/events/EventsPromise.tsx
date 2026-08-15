import { Fragment } from 'react'
import type { EVENTS_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { Reveal } from '@/components/Reveal'
import { ColorizeText } from '@/components/ColorizeText'
import { pickLocale } from '@/lib/i18n/pickLocale'
import { noOrphansSegments } from '@/lib/typography/noOrphans'

type Props = {
  data: NonNullable<EVENTS_PAGE_QUERY_RESULT>['promiseSection']
  locale: Locale
}

export function EventsPromise({ data, locale }: Props) {
  if (!data) return null
  const lead = pickLocale(data.leadText, locale)
  const highlight = pickLocale(data.highlightedText, locale)
  const tail = pickLocale(data.tailText, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)

  // Mobile = osobny copy aktywowany przez leadTextMobile (gdy set, mobile renderuje
  // własną triadę bez fallbacku do desktop, co pozwala skrócić wersję — np.
  // zakończyć na highlight, zostawiając tailTextMobile puste).
  const leadMobileOverride = pickLocale(data.leadTextMobile, locale)
  const highlightMobile = pickLocale(data.highlightedTextMobile, locale)
  const tailMobile = pickLocale(data.tailTextMobile, locale)
  const hasMobileVariant = Boolean(leadMobileOverride)

  if (!lead && !highlight && !tail) return null

  // `noOrphansSegments` sklaja triade w jeden tekst, poprawia sieroty (takze te
  // NA GRANICY segmentow — np. "...umowe." + "Ty cieszysz...") i zwraca gotowy
  // `startIndex` dla ciaglej fali kolorowania oraz separator przed segmentem.
  const desktopSegments = noOrphansSegments([
    { text: lead },
    { text: highlight, bold: true },
    { text: tail },
  ])
  const mobileSegments = noOrphansSegments([
    { text: hasMobileVariant ? leadMobileOverride : lead },
    { text: hasMobileVariant ? highlightMobile : highlight, bold: true },
    { text: hasMobileVariant ? tailMobile : tail },
  ])

  const renderSegments = (segments: typeof desktopSegments) =>
    segments.map((segment, i) => (
      <Fragment key={i}>
        {segment.sepBefore}
        <ColorizeText
          text={segment.text}
          className={segment.bold ? 'font-semibold' : undefined}
          startIndex={segment.startIndex}
        />
      </Fragment>
    ))

  return (
    <section
      data-header-theme="light"
      data-header-surface="#ffffff"
      className="bg-surface flex min-h-[800px] w-full items-center justify-end py-20 md:py-32"
    >
      <div className="layout-container flex flex-col gap-10">
        {/* Reveal jak w AboutSection: ColorizeText — fala kolorowania znak po
            znaku (gray -> text) gdy sekcja wjezdza w viewport. Trzy segmenty
            (lead + bold highlight + tail) sklejone jedna ciagla fala przez
            `startIndex`. Na < md ColorizeText pomija animacje (pelen kolor). */}
        <p className="text-text text-xl font-normal tracking-[-0.03em] md:hidden">
          {renderSegments(mobileSegments)}
        </p>
        <p className="text-text hidden text-[32px] font-normal tracking-[-0.03em] md:block">
          {renderSegments(desktopSegments)}
        </p>
        {ctaLabel && (
          <Reveal delay={150}>
            <ReservationCtaButton tab="event" variant="outline-dark" className="w-full md:w-auto">
              {ctaLabel}
            </ReservationCtaButton>
          </Reveal>
        )}
      </div>
    </section>
  )
}
