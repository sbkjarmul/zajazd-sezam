import type { RESTAURANT_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { ParallaxImage } from '@/components/ParallaxImage'
import { Reveal } from '@/components/Reveal'
import { AccentText } from '@/components/AccentText'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<RESTAURANT_PAGE_QUERY_RESULT>
  locale: Locale
}

// Hero (Figma 967:36): duży serif tytuł "Zjedz w Sezamie" na kremowym tle,
// pod nim pełnoszerokie zdjęcie. Akcent kursywą przez marker *…* w treści.
export function RestaurantHero({ data, locale }: Props) {
  const headline = pickLocale(data.heroHeadline, locale)

  return (
    <section className="bg-bg relative w-full">
      <div className="layout-container flex min-h-[60vh] flex-col justify-end pt-40 pb-10 md:min-h-[541px] md:pt-56 md:pb-12">
        {headline && (
          <Reveal>
            <h1 className="font-accent text-ruby text-[clamp(56px,13vw,160px)] leading-[0.9] tracking-[-0.01em] not-italic">
              <AccentText text={headline} />
            </h1>
          </Reveal>
        )}
      </div>

      {data.heroImage && (
        <div className="relative h-[280px] w-full overflow-hidden sm:h-[340px] md:h-[359px]">
          <ParallaxImage
            image={data.heroImage}
            locale={locale}
            priority
            loading="eager"
            sizes="100vw"
            imageClassName="object-center"
          />
        </div>
      )}
    </section>
  )
}
