import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { RevealImage } from '@/components/RevealImage'
import { RevealText } from '@/components/RevealText'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { Reveal } from '@/components/Reveal'
import { SanityImage } from '@/components/SanityImage'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['hotelBlock']
  locale: Locale
}

// Subtelny gradient na karcie pokoju: zloty ton u gory + przyciemnienie u dolu
// pod tekst (nazwa + opis) - wg Figma 1072:2/3.
const ROOM_CARD_GRADIENT =
  'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.12) 38%, rgba(164,146,102,0.15) 100%)'

// Slider pokoi - na razie na sztywno (3x ten sam apartament), pozniej z Sanity.
const HOTEL_ROOMS = [
  { name: 'Apartament Comfort', caption: 'Kiedy zależy Ci na każdym szczególe.' },
  { name: 'Apartament Comfort', caption: 'Kiedy zależy Ci na każdym szczególe.' },
  { name: 'Apartament Comfort', caption: 'Kiedy zależy Ci na każdym szczególe.' },
]

// Wg Figma 930:86 (1512×628 content). Proporcje 1:1:
//   header 370 · gap 80 · [ duże 326 · opis 324 · małe 337 ] = rooms 998
// Desktop: flex — header 25.5% + gap 5.5% + rooms 69% (3 kolumny wg fr 326/324/337).
// Wysokość wiersza wyznacza duże zdjęcie (aspect-[326/628], pełna wysokość):
//   • header — tytuł u góry,
//   • małe zdjęcie — u góry (aspect-[337/312] ≈ 0.5 wysokości),
//   • opis + CTA — do lewej, dosunięte w dół, ale podniesione o ~19% (pb-[36%]),
//     bo w Figmie dół przycisku jest na 512/628 (≈81%), nie na samym dole.
// <lg: jedna kolumna (header → duże → opis+CTA → małe).
export function HotelBlock({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)
  const mainImage = data.mainImage
  const sideImage = data.sideImage

  return (
    <>
      {/* MOBILE (Figma 936:73) - ciemna sekcja: naglowek + slider kart pokoi
          (peek sasiadow) na ciemnym tle-zdjeciu, zloty CTA. `lg:hidden!` bije
          `.snap-panels > section { display:flex }`. */}
      <section
        data-header-theme="dark"
        className="text-text-inverse relative w-full overflow-hidden lg:hidden!"
        style={{ backgroundColor: 'var(--color-dark)' }}
      >
        <div className="layout-container relative z-10 mb-auto flex flex-col gap-8 pt-[120px] pb-20">
          <Reveal className="flex flex-col gap-4">
            {eyebrow && <p className="text-base tracking-normal uppercase">{eyebrow}</p>}
            {title && (
              <h2 className="text-[40px] leading-[40px] font-normal tracking-[-3px]">{title}</h2>
            )}
          </Reveal>
          {description && <p className="text-text-inverse/90 text-base">{description}</p>}

          {/* Slider pokoi - natywny poziomy scroll-snap; aktywna karta na srodku,
              sasiedzi wystaja po bokach (px = polowa szerokosci - polowa karty). */}
          <Reveal delay={100} className="-mx-4">
            <div className="flex snap-x snap-mandatory [scrollbar-width:none] gap-3 overflow-x-auto scroll-smooth px-[calc(50%-135px)] [&::-webkit-scrollbar]:hidden">
              {HOTEL_ROOMS.map((room, i) => (
                <article
                  key={i}
                  className="relative aspect-[270/314] w-[270px] shrink-0 snap-center overflow-hidden"
                >
                  {mainImage && (
                    <SanityImage
                      image={mainImage}
                      locale={locale}
                      fill
                      sizes="270px"
                      className="object-bottom"
                    />
                  )}
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{ backgroundImage: ROOM_CARD_GRADIENT }}
                  />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5">
                    <p className="font-accent text-[21px] leading-none text-white italic">
                      {room.name}
                    </p>
                    <p className="text-text-inverse/90 text-xs">{room.caption}</p>
                  </div>
                </article>
              ))}
            </div>
          </Reveal>

          {ctaLabel && (
            <ReservationCtaButton tab="room" variant="filled-gold" className="h-16 w-full text-xl">
              {ctaLabel}
            </ReservationCtaButton>
          )}
        </div>
      </section>

      {/* DESKTOP (bez zmian - tylko bramkowanie widocznosci) */}
      <section data-header-theme="light" className="bg-bg hidden! pt-20 md:pt-32 lg:flex!">
        <div className="layout-container flex h-full flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-[5.5%]">
          {/* Header — 25.5%, tytuł u góry */}
          <Reveal className="flex flex-col gap-4 lg:w-[25.5%] lg:shrink-0 lg:pt-1">
            {eyebrow && <p className="text-text text-lg tracking-normal uppercase">{eyebrow}</p>}
            {title && (
              <RevealText
                as="h2"
                className="text-text text-3xl leading-none font-normal tracking-tight md:text-4xl md:tracking-[-0.03em]"
              >
                {title}
              </RevealText>
            )}
          </Reveal>

          {/* Rooms — 3 kolumny: duże zdjęcie · opis+CTA · małe zdjęcie */}
          <div className="grid grid-cols-1 lg:flex-1 lg:grid-cols-[326fr_324fr_337fr] lg:items-stretch">
            {/* Duże zdjęcie — pełna wysokość wiersza */}
            {mainImage && (
              <Reveal delay={120}>
                <div className="relative aspect-[326/628] overflow-hidden">
                  <RevealImage
                    image={mainImage}
                    locale={locale}
                    sizes="(max-width: 1024px) 100vw, 22vw"
                    start="top 90%"
                  />
                </div>
              </Reveal>
            )}

            {/* Opis + CTA — do lewej, dół podniesiony o ~19% wysokości */}
            {(description || ctaLabel) && (
              <Reveal
                delay={200}
                className="flex flex-col items-start gap-8 lg:justify-end lg:p-4 lg:pb-20"
              >
                {description && (
                  <p className="text-text max-w-[308px] text-[16px] leading-[1.2]">{description}</p>
                )}
                {ctaLabel && (
                  <ReservationCtaButton
                    tab="room"
                    variant="filled-dark"
                    className="w-full self-stretch whitespace-nowrap sm:w-auto sm:min-w-[224px] sm:self-start"
                  >
                    {ctaLabel}
                  </ReservationCtaButton>
                )}
              </Reveal>
            )}

            {/* Małe zdjęcie — rozciągnięte do dołu (pełna wysokość wiersza) */}
            {sideImage && (
              <Reveal delay={280} className="lg:h-full">
                <div className="relative aspect-[312/312] w-full overflow-hidden">
                  <RevealImage
                    image={sideImage}
                    locale={locale}
                    sizes="(max-width: 1024px) 100vw, 22vw"
                    start="top 90%"
                  />
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
