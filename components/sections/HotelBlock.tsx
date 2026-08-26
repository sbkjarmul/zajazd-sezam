import type { HOMEPAGE_QUERY_RESULT, HOME_ROOM_TYPES_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { RevealText } from '@/components/RevealText'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { Reveal } from '@/components/Reveal'
import { HomeHotelCarousel } from '@/components/sections/hotel/HomeHotelCarousel'
import { HomeHotelMobileSlider } from '@/components/sections/hotel/HomeHotelMobileSlider'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['hotelBlock']
  rooms: HOME_ROOM_TYPES_QUERY_RESULT
  locale: Locale
}

// Blok Hotel na stronie glownej. Oba warianty renderuja te same dane z Sanity:
// naglowek/opis/CTA z homepage.hotelBlock + liste pokoi (roomType).
//
// Mobile (Figma 1091:2) - jasna sekcja: naglowek do lewej, pod nim slider
// pokoi (kadr 4:3 + wysrodkowana nazwa i opis), na dole outline CTA.
// Desktop (Figma 1184:20) - jasna sekcja: naglowek + opis w jednym rzedzie,
// pod nim pelnoekranowa karuzela kadrow pokoi ze strzalkami i CTA.
export function HotelBlock({ data, rooms, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)

  return (
    <>
      {/* MOBILE (Figma 1091:2) - jasna sekcja. `lg:hidden!` bije
          `.snap-panels > section { display:flex }`. */}
      <section
        data-header-theme="light"
        className="bg-bg text-text relative w-full overflow-hidden lg:hidden!"
      >
        <div className="layout-container relative z-10 mb-auto flex flex-col gap-8 pt-[120px] pb-20">
          <Reveal className="flex flex-col gap-4">
            {eyebrow && <p className="text-base tracking-normal uppercase">{eyebrow}</p>}
            {title && (
              <h2 className="text-3xl leading-none font-normal tracking-tight text-balance">
                {title}
              </h2>
            )}
          </Reveal>
          {description && <p className="text-text text-base">{description}</p>}

          {/* Slider pokoi - zapetlony, patrz HomeHotelMobileSlider. Ujemny
              margines musi znosic CALY padding layout-container (16 px mobile,
              64 px od md), zeby scrollport siegal krawedzi ekranu - inaczej na
              tablecie sasiednie karty sa przycinane 48 px przed krawedzia.
              Slider oddaje sobie ten padding wlasnym `px-4 md:px-16`. */}
          {rooms.length > 0 && (
            <Reveal delay={100} className="-mx-4 md:-mx-16">
              <HomeHotelMobileSlider rooms={rooms} locale={locale} />
            </Reveal>
          )}

          {ctaLabel && (
            <ReservationCtaButton tab="room" variant="outline-dark" className="w-full">
              {ctaLabel}
            </ReservationCtaButton>
          )}
        </div>
      </section>

      {/* DESKTOP (Figma 1184:20) - naglowek + opis w jednym rzedzie, pod nim
          karuzela wychodzaca poza layout-container (przycieta na sekcji). */}
      <section
        data-header-theme="light"
        className="bg-bg hidden! flex-col overflow-hidden pt-20 pb-32 md:pt-32 lg:flex!"
      >
        <div className="layout-container">
          <div className="flex items-start">
            {/* 56.65% = 784/1384 — lewa kolumna wg Figmy (opis startuje na 848 px). */}
            <Reveal className="flex w-[56.65%] shrink-0 flex-col gap-4">
              {eyebrow && <p className="text-text text-lg tracking-normal uppercase">{eyebrow}</p>}
              {title && (
                <RevealText
                  as="h2"
                  className="text-text text-3xl leading-none font-normal tracking-tight text-balance md:text-4xl md:tracking-[-0.03em]"
                >
                  {title}
                </RevealText>
              )}
            </Reveal>
            {description && <p className="text-text max-w-[558px] text-base">{description}</p>}
          </div>
        </div>

        <div className="mt-20">
          <HomeHotelCarousel rooms={rooms} locale={locale} ctaLabel={ctaLabel} />
        </div>
      </section>
    </>
  )
}
