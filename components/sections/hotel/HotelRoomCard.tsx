import type { ALL_ROOM_TYPES_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { RoomImageSlider } from './RoomImageSlider'
import { pickLocale } from '@/lib/i18n/pickLocale'
import { getTranslations } from 'next-intl/server'
import { cn } from '@/lib/utils'

type RoomType = ALL_ROOM_TYPES_QUERY_RESULT[number]

type Props = {
  room: RoomType
  locale: Locale
  index: number
}

// Wg Figma 676:357: image 50% h-[800px], content 50% p-[32px], h3 40px font-normal,
// description 24px text-dark, button outline-dark "ZAREZERWUJ", amenities right-aligned
// 24px text-dark wypełniają resztę kolumny od dołu.
export async function HotelRoomCard({ room, locale, index }: Props) {
  const t = await getTranslations('hotel')
  const name = pickLocale(room.name, locale)
  const description = pickLocale(room.description, locale)
  const amenities = room.amenities ?? []
  const images = room.images ?? []
  const imageOnLeft = index % 2 === 0

  return (
    <section className="bg-bg">
      <div
        className={cn(
          'mx-auto grid w-full max-w-[1512px] grid-cols-1 lg:grid-cols-2',
          !imageOnLeft && 'lg:[&>*:first-child]:order-2',
        )}
      >
        <div className="relative aspect-square lg:aspect-auto lg:h-[800px]">
          <RoomImageSlider
            images={images}
            locale={locale}
            prevLabel={t('prevImage')}
            nextLabel={t('nextImage')}
          />
        </div>

        <div className="bg-bg flex flex-col gap-6 p-6 md:p-8 lg:gap-8 lg:p-[32px]">
          <div className="flex flex-col gap-6">
            {name && (
              <h3 className="text-text text-3xl leading-none font-normal tracking-tight uppercase md:text-4xl md:tracking-[-0.03em] lg:text-[40px]">
                {name}
              </h3>
            )}
            {description && (
              <p className="text-text text-lg leading-[1.2] md:text-xl lg:text-2xl">
                {description}
              </p>
            )}
          </div>

          <div>
            <ReservationCtaButton tab="room" variant="outline-dark" className="w-full md:w-auto">
              {t('bookRoom')}
            </ReservationCtaButton>
          </div>

          {amenities.length > 0 && (
            <ul className="mt-auto flex flex-col items-end gap-1 pt-4 lg:gap-2 lg:pt-8">
              {amenities.map((a, i) => (
                <li key={i} className="text-text text-base md:text-xl lg:text-2xl">
                  {pickLocale(a, locale)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
