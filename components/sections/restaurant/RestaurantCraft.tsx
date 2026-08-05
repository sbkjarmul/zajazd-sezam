import type { RESTAURANT_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { RevealImage } from '@/components/RevealImage'
import { RevealText } from '@/components/RevealText'
import { Reveal } from '@/components/Reveal'
import { AccentText } from '@/components/AccentText'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<RESTAURANT_PAGE_QUERY_RESULT>['craftSection']
  locale: Locale
}

// Craft (Figma 967:48): kwadratowe zdjęcie po lewej, po prawej serif tytuł
// z akcentem kursywą + opis, pill CTA i mniejsze zdjęcie. Nagłówek reveal
// (fade), zdjęcia rozwijają się kierunkowo (primary na szerokość, secondary na
// wysokość), opis/CTA fade.
export function RestaurantCraft({ data, locale }: Props) {
  if (!data) return null
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)

  const headingClass =
    'font-accent text-ruby text-[clamp(34px,5vw,64px)] leading-none not-italic tracking-[-0.01em]'
  const descriptionClass = 'text-ruby text-lg leading-normal'
  const ctaClass =
    'border-ruby text-ruby hover:bg-ruby hover:text-light inline-flex h-[64px] w-full items-center justify-center rounded-full border-2 px-6 text-lg transition-colors md:w-auto'

  return (
    <section data-header-theme="light" className="bg-bg py-10 md:py-16">
      {/* Mobile + tablet: heading → primary (mobile full-bleed) → opis → button → secondary (mobile, po buttonie) */}
      <div className="layout-container flex flex-col gap-10 md:gap-12 lg:hidden">
        {title && (
          <RevealText as="h2" mode="fade" className={headingClass}>
            <AccentText text={title} />
          </RevealText>
        )}

        {/* Mobile: tylko primary (full-bleed). md+: oba zdjęcia w 2-col grid. */}
        <div className="md:grid md:grid-cols-2 md:gap-10">
          <div className="relative -mx-4 aspect-square w-[calc(100%+2rem)] overflow-hidden md:mx-0 md:w-full">
            <RevealImage
              image={data.primaryImage}
              locale={locale}
              sizes="(max-width: 768px) 100vw, 50vw"
              direction="right"
            />
          </div>
          <div className="relative hidden aspect-square overflow-hidden md:block">
            <RevealImage image={data.secondaryImage} locale={locale} sizes="50vw" direction="up" />
          </div>
        </div>

        <Reveal className="flex max-w-2xl flex-col gap-6">
          {description && <p className={descriptionClass}>{description}</p>}
          {ctaLabel && (
            <Link href="/restauracja/menu" className={ctaClass}>
              {ctaLabel}
            </Link>
          )}
        </Reveal>

        {/* Secondary mobile-only — po buttonie, full-bleed */}
        <div className="relative -mx-4 aspect-square w-[calc(100%+2rem)] overflow-hidden md:hidden">
          <RevealImage image={data.secondaryImage} locale={locale} sizes="100vw" direction="up" />
        </div>
      </div>

      {/* Desktop (lg+): primary image po lewej, po prawej heading + (opis/button + secondary image) */}
      <div className="layout-container hidden grid-cols-2 gap-12 lg:grid">
        <div className="relative aspect-square overflow-hidden">
          <RevealImage image={data.primaryImage} locale={locale} sizes="50vw" direction="right" />
        </div>

        <div className="flex flex-col justify-between gap-10">
          {title && (
            <RevealText as="h2" mode="fade" className={headingClass}>
              <AccentText text={title} />
            </RevealText>
          )}

          <div className="grid grid-cols-3 gap-6">
            <Reveal className="col-span-2 flex flex-col gap-6">
              {description && <p className={descriptionClass}>{description}</p>}
              {ctaLabel && (
                <Link href="/restauracja/menu" className={ctaClass}>
                  {ctaLabel}
                </Link>
              )}
            </Reveal>
            <div className="relative aspect-square overflow-hidden">
              <RevealImage
                image={data.secondaryImage}
                locale={locale}
                sizes="16vw"
                direction="up"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
