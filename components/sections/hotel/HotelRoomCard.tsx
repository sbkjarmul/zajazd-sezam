import type { ALL_ROOM_TYPES_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { pickLocale } from '@/lib/i18n/pickLocale'
import { getTranslations } from 'next-intl/server'
import { cn } from '@/lib/utils'

type RoomType = ALL_ROOM_TYPES_QUERY_RESULT[number]

type Props = {
  room: RoomType
  locale: Locale
  index: number
}

export async function HotelRoomCard({ room, locale, index }: Props) {
  const t = await getTranslations('hotel')
  const name = pickLocale(room.name, locale)
  const description = pickLocale(room.description, locale)
  const amenities = room.amenities ?? []
  const heroImage = room.images?.[0]
  // Alternujemy strony: 0=image-left, 1=image-right, 2=image-left, ...
  const imageOnLeft = index % 2 === 0

  return (
    <section className="bg-bg">
      <div
        className={cn(
          'mx-auto grid w-full max-w-[1512px] grid-cols-1 lg:grid-cols-2',
          !imageOnLeft && 'lg:[&>*:first-child]:order-2',
        )}
      >
        <div className="relative aspect-[3/2] lg:aspect-auto lg:min-h-[700px]">
          <SanityImage
            image={heroImage}
            locale={locale}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="bg-bg flex flex-col gap-8 p-8 md:p-16">
          <div className="flex flex-col gap-4">
            {name && (
              <h3 className="text-text text-3xl leading-tight font-light tracking-tight uppercase md:text-4xl">
                {name}
              </h3>
            )}
            {description && (
              <p className="text-text-muted text-lg leading-relaxed">{description}</p>
            )}
          </div>

          <div>
            <ReservationCtaButton tab="room" variant="filled-dark">
              {t('bookRoom')}
            </ReservationCtaButton>
          </div>

          {amenities.length > 0 && (
            <ul className="border-border-subtle flex flex-col border-t">
              {amenities.map((a, i) => (
                <li
                  key={i}
                  className="border-border-subtle text-text border-b py-3 text-base last:border-b-0"
                >
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
