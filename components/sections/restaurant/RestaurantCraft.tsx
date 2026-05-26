import type { RESTAURANT_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { SanityImage } from '@/components/SanityImage'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<RESTAURANT_PAGE_QUERY_RESULT>['craftSection']
  locale: Locale
}

export function RestaurantCraft({ data, locale }: Props) {
  if (!data) return null
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)

  const headingClass =
    'text-dark-ruby text-4xl leading-none font-bold tracking-tight uppercase md:text-6xl md:tracking-[-0.03em] lg:text-[80px]'
  const descriptionClass = 'text-dark-ruby text-lg leading-[1.2] md:text-xl'
  const ctaClass =
    'border-dark-ruby text-dark-ruby hover:bg-dark-ruby hover:text-text-inverse inline-flex h-[60px] w-full items-center justify-center rounded-full border-2 px-6 text-lg transition-colors md:w-auto'

  return (
    <section className="bg-bg py-10 md:py-16">
      {/* Mobile + tablet: heading → primary (mobile full-bleed) → opis → button → secondary (mobile, po buttonie) */}
      <div className="layout-container flex flex-col gap-10 md:gap-12 lg:hidden">
        {title && <h2 className={headingClass}>{title}</h2>}

        {/* Mobile: tylko primary (full-bleed). md+: oba zdjęcia w 2-col grid. */}
        <div className="md:grid md:grid-cols-2 md:gap-10">
          <div className="relative -mx-4 aspect-square w-[calc(100%+2rem)] overflow-hidden md:mx-0 md:w-full">
            <SanityImage
              image={data.primaryImage}
              locale={locale}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="relative hidden aspect-square overflow-hidden md:block">
            <SanityImage
              image={data.secondaryImage}
              locale={locale}
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex max-w-2xl flex-col gap-6">
          {description && <p className={descriptionClass}>{description}</p>}
          {ctaLabel && (
            <Link href="/restauracja/menu" className={ctaClass}>
              {ctaLabel}
            </Link>
          )}
        </div>

        {/* Secondary mobile-only — po buttonie, full-bleed */}
        <div className="relative -mx-4 aspect-square w-[calc(100%+2rem)] overflow-hidden md:hidden">
          <SanityImage
            image={data.secondaryImage}
            locale={locale}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Desktop (lg+): primary image po lewej, po prawej heading + (opis/button + secondary image) */}
      <div className="layout-container hidden grid-cols-2 gap-12 lg:grid">
        <div className="relative aspect-square overflow-hidden">
          <SanityImage
            image={data.primaryImage}
            locale={locale}
            fill
            sizes="50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-between gap-10">
          {title && <h2 className={headingClass}>{title}</h2>}

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 flex flex-col gap-6">
              {description && <p className={descriptionClass}>{description}</p>}
              {ctaLabel && (
                <Link href="/restauracja/menu" className={ctaClass}>
                  {ctaLabel}
                </Link>
              )}
            </div>
            <div className="relative aspect-square overflow-hidden">
              <SanityImage
                image={data.secondaryImage}
                locale={locale}
                fill
                sizes="16vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
