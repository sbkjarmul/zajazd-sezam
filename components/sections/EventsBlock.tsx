import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { Link } from '@/i18n/navigation'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['eventsBlock']
  locale: Locale
}

// Desktop (Figma 676:1557): 12-col grid items-end. Główny obraz lewo col 1-6
// row 1+2. Środek col 7-9: title row-1 (top), secondary image row-2 (bottom).
// Prawo col 10-12: description row-1 (top), CTA row-2 (bottom).
// Mobile (Figma 676:2040): flat — title → mainImage → description → secondaryImage → CTA.
export function EventsBlock({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)

  return (
    <section className="bg-bg py-16 md:py-32">
      <div className="layout-container flex flex-col gap-8 md:grid md:grid-cols-12 md:items-end md:gap-8">
        {/* Main image — mobile 2, desktop col 1-6 row 1+2 */}
        <div className="relative order-2 aspect-[662/592] overflow-hidden md:col-span-6 md:col-start-1 md:row-span-2 md:row-start-1 md:order-none">
          <SanityImage
            image={data.mainImage}
            locale={locale}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover"
          />
        </div>

        {/* Title — mobile 1, desktop col 7-9 row-1 (top) */}
        <div className="order-1 flex flex-col gap-4 md:col-span-3 md:col-start-7 md:row-start-1 md:gap-6 md:self-start md:order-none">
          {eyebrow && (
            <p className="text-text wide:text-lg text-base tracking-normal uppercase">{eyebrow}</p>
          )}
          {title && (
            <h2 className="text-text text-4xl font-normal tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-[64px] lg:leading-none">
              {title}
            </h2>
          )}
        </div>

        {/* Description (mobile 3) — desktop grupowany w jednej komórce z CTA w row-2 col 10-12 */}
        {description && (
          <p className="text-text order-3 text-base leading-[1.2] md:hidden">{description}</p>
        )}

        {/* Secondary image — mobile 4, desktop col 7-9 row-2 (bottom) */}
        {data.secondaryImage && (
          <div className="relative order-4 aspect-square overflow-hidden md:col-span-3 md:col-start-7 md:row-start-2 md:self-end md:order-none">
            <SanityImage
              image={data.secondaryImage}
              locale={locale}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover"
            />
          </div>
        )}

        {/* Description + CTA — desktop wspólna komórka row-2 col 10-12 (bottom-right) */}
        <div className="order-5 flex flex-col gap-6 md:col-span-3 md:col-start-10 md:row-start-2 md:self-end md:order-none">
          {description && (
            <p className="text-text hidden text-lg leading-[1.2] md:block">{description}</p>
          )}
          {ctaLabel && (
            <Link
              href="/imprezy-okolicznosciowe"
              className="text-text-inverse inline-flex h-[60px] w-full items-center justify-center rounded-full px-6 text-lg transition-opacity hover:opacity-90"
              style={{ background: 'var(--color-dark-ruby)' }}
            >
              {ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
