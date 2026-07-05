import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { RevealText } from '@/components/RevealText'
import { Link } from '@/i18n/navigation'
import { Reveal } from '@/components/Reveal'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['bistroBlock']
  locale: Locale
}

// Sekcja na ruby (--color-secondary). Bez obrazu — cała treść wyśrodkowana.
// Desktop (lg+): 800px wysokości, 80px góra/dół; wewnątrz justify-between —
// tytuł u góry, opis + CTA na dole. Button gold (accent) z białym tekstem.
// Tablet/mobile (<lg): naturalny stack, wyśrodkowany, mniejsze paddingi.
export function BistroBlock({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)

  return (
    <section
      className="text-text-inverse py-20 md:py-24 lg:h-[800px]"
      style={{ background: 'var(--color-secondary)' }}
    >
      <div className="layout-container flex h-full flex-col items-center justify-between gap-12 text-center lg:gap-8">
        {/* Title block — góra */}
        <Reveal className="flex flex-col items-center gap-4">
          {eyebrow && (
            <p className="text-text-inverse wide:text-lg text-base tracking-normal uppercase">
              {eyebrow}
            </p>
          )}
          {title && (
            <RevealText
              as="h2"
              className="text-text-inverse text-balance text-3xl leading-none font-normal tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-6xl"
            >
              {title}
            </RevealText>
          )}
        </Reveal>

        {/* Description + CTA — dół */}
        <Reveal delay={100} className="flex flex-col items-center gap-8">
          {description && (
            <p className="text-text-inverse/80 max-w-2xl text-base leading-[1.4] md:text-lg">
              {description}
            </p>
          )}
          {ctaLabel && (
            <Link
              href="/bistro"
              className="bg-accent text-text-inverse hover:bg-accent-hover inline-flex h-[60px] w-full items-center justify-center rounded-full px-6 text-lg transition-colors md:w-fit md:min-w-[220px]"
            >
              {ctaLabel}
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  )
}
