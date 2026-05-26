import { getTranslations } from 'next-intl/server'
import type { RESTAURANT_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { SanityImage } from '@/components/SanityImage'
import { Reveal } from '@/components/Reveal'
import { RestaurantHeroBand } from './RestaurantHeroBand'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<RESTAURANT_PAGE_QUERY_RESULT>
  locale: Locale
}

// Dwa warianty wizualne — mobilny full-bleed (Figma 676:2181 mobile) z
// headlinem na zdjęciu i pill CTA "Zobacz menu", desktop trzymamy stary
// układ (text na górze + cienki parallax band na dole).
export async function RestaurantHero({ data, locale }: Props) {
  const headline = pickLocale(data.heroHeadline, locale)
  const t = await getTranslations({ locale, namespace: 'restaurant.hero' })

  return (
    <section className="bg-bg relative w-full">
      {/* MOBILE: hero pełnoekranowy ze zdjęciem jako tło, content na dole.
          Image dostaje CSS animate-hero-zoom-out (10s scale 1.15→1.0) na load.
          Tekst + CTA z sekwencyjnym Reveal-em. `isolate` trzyma stacking context
          — bez tego obraz na `-z-20` poleciałby za tło `bg-bg` sekcji. */}
      <div className="relative isolate flex h-[800px] max-h-[100dvh] w-full flex-col justify-end overflow-hidden md:hidden">
        {data.heroImage && (
          <div className="animate-hero-zoom-out absolute inset-0 -z-20">
            <SanityImage
              image={data.heroImage}
              locale={locale}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}
        {/* Gradient żeby tekst u dołu był czytelny niezależnie od zdjęcia */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
        />

        <div className="text-text-inverse flex flex-col items-center gap-4 px-4 pb-6 text-center">
          <Reveal>
            <p className="text-text-inverse text-base wide:text-lg tracking-normal uppercase leading-[normal]">
              {t('subheadline')}
            </p>
          </Reveal>
          {headline && (
            <Reveal delay={120}>
              <h1 className="text-text-inverse text-[clamp(64px,18vw,100px)] leading-none font-black tracking-tight uppercase">
                {headline}
              </h1>
            </Reveal>
          )}
          <Reveal delay={260} className="w-full">
            <Link
              href="/restauracja/menu"
              className="bg-light text-text mt-4 inline-flex h-[60px] w-full items-center justify-center rounded-full px-8 text-lg font-normal"
            >
              {t('viewMenu')}
            </Link>
          </Reveal>
        </div>
      </div>

      {/* DESKTOP: oryginalny układ — text top, band parallax bottom */}
      <div className="hidden min-h-screen w-full flex-col md:flex">
        <div className="flex flex-1 items-end px-16 pt-48 pb-16">
          {headline && (
            <h1 className="text-dark-ruby text-[120px] leading-none font-bold tracking-tight uppercase md:tracking-[-0.03em]">
              {headline}
            </h1>
          )}
        </div>
        <RestaurantHeroBand image={data.heroImage} locale={locale} />
      </div>
    </section>
  )
}
