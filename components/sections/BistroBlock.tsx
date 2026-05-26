import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { Link } from '@/i18n/navigation'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['bistroBlock']
  locale: Locale
}

// Sekcja na ruby (#1c224f). Desktop (lg+): 800px wysokości, 80px góra/dół, układ
// 2-kolumnowy — obraz 50% szerokości przyklejony do prawej krawędzi viewportu
// (brak prawego paddingu), wysokości 640px. Button gold (accent) z dark tekstem.
// Tablet/mobile (<lg): jedna kolumna, kolejność DOM — tytuł → opis+CTA → obraz
// (obraz pod tekstem).
export function BistroBlock({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)

  return (
    <section
      className="text-text-inverse py-20 lg:h-[800px]"
      style={{ background: 'var(--color-secondary)' }}
    >
      <div className="layout-container grid h-full grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:!pr-0">
        {/* Title block — stacked pos 1, desktop top-left */}
        <div className="flex flex-col gap-4 lg:self-start">
          {eyebrow && (
            <p className="text-text-inverse wide:text-lg text-base tracking-normal uppercase">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-text-inverse text-2xl leading-none font-normal tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-6xl">
              {title}
            </h2>
          )}
        </div>

        {/* Description + CTA — stacked pos 2, desktop bottom-left */}
        <div className="flex flex-col gap-8 lg:col-start-1 lg:row-start-2 lg:self-end">
          {description && (
            <p className="text-text-inverse/80 max-w-md text-base leading-[1.2] md:text-lg">{description}</p>
          )}
          {ctaLabel && (
            <Link
              href="/bistro"
              className="bg-accent text-text hover:bg-accent-hover inline-flex h-[60px] w-full items-center justify-center rounded-full px-6 text-lg transition-colors md:w-fit md:min-w-[220px]"
            >
              {ctaLabel}
            </Link>
          )}
        </div>

        {/* Image — stacked pos 3 (pod tekstem), desktop right col spanning both rows */}
        <div className="relative -mx-4 aspect-square w-[calc(100%+2rem)] overflow-hidden md:mx-0 md:w-full lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-[640px] lg:w-full lg:self-center">
          <SanityImage
            image={data.image}
            locale={locale}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
