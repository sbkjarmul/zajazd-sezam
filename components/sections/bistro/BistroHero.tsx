import type { BISTRO_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { RevealText } from '@/components/RevealText'
import { BistroHeroImages } from '@/components/sections/bistro/BistroHeroImages'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<BISTRO_PAGE_QUERY_RESULT>
  locale: Locale
}

// Redesign wg Figma 971:1214 — hero na jasnym (kremowym) tle, wyśrodkowany:
// nagłówek ruby-light uppercase, pod nim intro, a niżej dwa przechylone zdjęcia
// dań. Zdjęcia z Sanity (bistroPage.heroImages). Animacje jak na restauracji:
// RevealText (nagłówek/intro — fade), RevealImage (rozwijanie kadru clip-path).
export function BistroHero({ data, locale }: Props) {
  const headline = pickLocale(data.heroHeadline, locale)
  const intro = pickLocale(data.menuIntroBody, locale)
  const images = (data.heroImages ?? []).filter((img) => img?.asset?.url)

  return (
    <section
      data-header-theme="light"
      className="bg-bg text-ruby-light pt-32 pb-12 md:pt-40 md:pb-20"
    >
      <div className="layout-container flex flex-col items-center gap-10 md:gap-14">
        <div className="flex flex-col items-center gap-6 text-center md:gap-8">
          {headline && (
            <RevealText
              as="h1"
              mode="fade"
              className="text-ruby-light text-[clamp(34px,6.5vw,64px)] leading-[1.05] font-black tracking-tight whitespace-pre-line uppercase md:tracking-[-0.02em]"
            >
              {headline}
            </RevealText>
          )}
          {intro && (
            <RevealText
              as="p"
              mode="fade"
              delay={0.1}
              className="text-ruby-light/90 max-w-[820px] text-base leading-[1.5] font-normal whitespace-pre-line md:text-lg"
            >
              {intro}
            </RevealText>
          )}
        </div>

        {images.length > 0 && <BistroHeroImages images={images} locale={locale} />}
      </div>
    </section>
  )
}
