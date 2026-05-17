import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { Link } from '@/i18n/navigation'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['restaurantBlock']
  locale: Locale
}

// Sekcja na dark-ruby. Desktop: 800px wysokości, 80px góra/dół. Obraz 50% szerokości
// przyklejony do prawej krawędzi kontenera (NIE viewportu), wysokości 640px.
// Mobile: stacked.
export function RestaurantBlock({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)

  return (
    <section
      className="text-text-inverse py-20 md:h-[800px]"
      style={{ background: 'var(--color-dark-ruby)' }}
    >
      <div className="layout-container grid h-full grid-cols-1 gap-8 md:grid-cols-2 md:items-center md:gap-16 md:!pr-0">
        {/* Title block — mobile pos 1, desktop top-left */}
        <div className="flex flex-col gap-4 md:self-start">
          {eyebrow && (
            <p className="text-text-inverse wide:text-lg text-base tracking-normal uppercase">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-text-inverse text-4xl leading-none font-normal tracking-tight md:text-5xl md:tracking-[-0.03em]">
              {title}
            </h2>
          )}
        </div>

        {/* Image — mobile pos 2, desktop right col spanning both rows */}
        <div className="relative aspect-square overflow-hidden md:col-start-2 md:row-span-2 md:row-start-1 md:h-[640px] md:w-full md:self-center">
          <SanityImage
            image={data.image}
            locale={locale}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Description + CTA — mobile pos 3, desktop bottom-left */}
        <div className="flex flex-col gap-8 md:col-start-1 md:row-start-2 md:self-end">
          {description && (
            <p className="text-text-inverse/80 max-w-md text-lg leading-[1.2]">{description}</p>
          )}
          {ctaLabel && (
            <Link
              href="/restauracja/menu"
              className="bg-text-inverse text-text inline-flex h-[60px] w-full items-center justify-center rounded-full px-6 text-lg transition-opacity hover:opacity-90 md:w-fit md:min-w-[220px]"
            >
              {ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
