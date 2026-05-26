import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { Link } from '@/i18n/navigation'
import { Reveal } from '@/components/Reveal'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['restaurantBlock']
  locale: Locale
}

// Sekcja na dark-ruby.
// Desktop (lg+): 800px wysokości, układ 2-kolumnowy — tekst po lewej, obraz 50%
//   szerokości przyklejony do prawej krawędzi kontenera (h-640).
// Tablet (md–lg): min. 760px wysokości, układ pionowy — obraz POD tekstem jako
//   panorama 16:9. Sekcja rośnie z treścią (min-h), więc długie copy nie ściska
//   obrazu do paska — wcześniej flex-1 oddawał obrazowi tylko resztę z h-760.
// Mobile: stacked, wysokość auto, obraz pod tekstem (aspect-square).
export function RestaurantBlock({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)

  return (
    <section
      className="text-text-inverse py-20 md:min-h-[760px] lg:h-[800px]"
      style={{ background: 'var(--color-dark-ruby)' }}
    >
      <div className="layout-container flex h-full flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:!pr-0">
        {/* Title block — pos 1, desktop top-left */}
        <Reveal className="flex flex-col gap-4 lg:self-start">
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
        </Reveal>

        {/* Description + CTA — pos 2, desktop bottom-left */}
        <Reveal
          delay={100}
          className="flex flex-col gap-8 lg:col-start-1 lg:row-start-2 lg:self-end"
        >
          {description && (
            <p className="text-text-inverse/80 max-w-md text-base leading-[1.2] md:text-lg">{description}</p>
          )}
          {ctaLabel && (
            <Link
              href="/restauracja/menu"
              className="bg-text-inverse text-text inline-flex h-[60px] w-full items-center justify-center rounded-full px-6 text-lg transition-opacity hover:opacity-90 md:w-fit md:min-w-[220px]"
            >
              {ctaLabel}
            </Link>
          )}
        </Reveal>

        {/* Image — pos 3 (pod tekstem). Tablet: flex-1 wypełnia resztę wysokości.
            Desktop: prawa kolumna spinająca oba rzędy, h-640. */}
        <Reveal
          delay={200}
          className="relative -mx-4 aspect-square w-[calc(100%+2rem)] overflow-hidden md:mx-0 md:aspect-[16/9] md:w-full lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:aspect-auto lg:h-[640px] lg:self-center"
        >
          <SanityImage
            image={data.image}
            locale={locale}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </Reveal>
      </div>
    </section>
  )
}
