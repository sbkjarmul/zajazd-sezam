import type { RESTAURANT_PAGE_QUERY_RESULT, SITE_SETTINGS_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { ParallaxImage } from '@/components/ParallaxImage'
import { RevealText } from '@/components/RevealText'
import { Reveal } from '@/components/Reveal'
import { AccentText } from '@/components/AccentText'
import { pickLocale } from '@/lib/i18n/pickLocale'
import { ctaClasses } from '@/lib/cta'

type Props = {
  data: NonNullable<RESTAURANT_PAGE_QUERY_RESULT>['ambianceSection']
  settings: SITE_SETTINGS_QUERY_RESULT | null
  // Numer Restauracji (fallback do settings.phone). Bezpośrednia linia stolikowa.
  phone?: string | null
  locale: Locale
}

// Ambiance (Figma 967:60): serif tytuł z akcentem kursywą po lewej, po prawej
// krótki opis + pill CTA (tel), pod spodem panoramiczne zdjęcie z parallaxem.
export function RestaurantAmbiance({ data, settings, phone: phoneOverride, locale }: Props) {
  if (!data) return null
  const title = pickLocale(data.title, locale)
  const tagline = pickLocale(data.tagline, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)
  const phone = phoneOverride ?? settings?.phone

  return (
    <section data-header-theme="light" className="bg-bg pt-32 md:pt-40 md:pb-20">
      <div className="layout-container flex flex-col gap-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            {title && (
              <RevealText
                as="h2"
                mode="fade"
                className="font-accent text-ruby text-[clamp(34px,5vw,64px)] leading-none tracking-[-0.01em] not-italic"
              >
                <AccentText text={title} />
              </RevealText>
            )}
          </div>
          <Reveal
            delay={120}
            className="flex flex-col items-start gap-6 md:col-span-5 md:items-end md:text-right"
          >
            {tagline && <p className="text-ruby max-w-sm text-lg">{tagline}</p>}
            {ctaLabel && phone && (
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className={ctaClasses('outline-ruby', 'w-full md:w-auto')}
              >
                {ctaLabel}
              </a>
            )}
          </Reveal>
        </div>

        <div className="relative -mx-4 aspect-square w-[calc(100%+2rem)] overflow-hidden md:mx-0 md:aspect-[2/1] md:w-full">
          <ParallaxImage
            image={data.image}
            locale={locale}
            sizes="100vw"
            imageClassName="object-center"
          />
        </div>
      </div>
    </section>
  )
}
