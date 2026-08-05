import type { EVENTS_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { Reveal } from '@/components/Reveal'
import { ColorizeText } from '@/components/ColorizeText'
import { pickLocale } from '@/lib/i18n/pickLocale'

// Dlugosc tekstu w znakach (Array.from — bezpieczne dla znakow spoza BMP).
const len = (s?: string | null) => (s ? Array.from(s).length : 0)

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
  const leadMobile = hasMobileVariant ? leadMobileOverride : lead
  const highlightMobileRendered = hasMobileVariant ? highlightMobile : highlight
  const tailMobileRendered = hasMobileVariant ? tailMobile : tail

  if (!lead && !highlight && !tail) return null

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
        <p className="text-text text-xl leading-[1.2] font-normal tracking-[-0.03em] md:hidden">
          {leadMobile && <ColorizeText text={leadMobile} />}
          {leadMobile && highlightMobileRendered ? ' ' : ''}
          {highlightMobileRendered && (
            <ColorizeText
              text={highlightMobileRendered}
              className="font-bold"
              startIndex={len(leadMobile) + 1}
            />
          )}
          {highlightMobileRendered && tailMobileRendered ? ' ' : ''}
          {tailMobileRendered && (
            <ColorizeText
              text={tailMobileRendered}
              startIndex={len(leadMobile) + 1 + len(highlightMobileRendered) + 1}
            />
          )}
        </p>
        <p className="text-text hidden text-[32px] leading-tight font-normal tracking-[-0.03em] md:block">
          {lead && <ColorizeText text={lead} />}
          {lead && highlight ? ' ' : ''}
          {highlight && (
            <ColorizeText text={highlight} className="font-bold" startIndex={len(lead) + 1} />
          )}
          {highlight && tail ? ' ' : ''}
          {tail && <ColorizeText text={tail} startIndex={len(lead) + 1 + len(highlight) + 1} />}
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
