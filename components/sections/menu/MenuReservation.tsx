import type { MENU_PAGE_QUERY_RESULT, SITE_SETTINGS_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<MENU_PAGE_QUERY_RESULT>['reservationSection']
  settings: SITE_SETTINGS_QUERY_RESULT | null
  locale: Locale
}

// Identyczna kompozycja jak RestaurantReservation — wyciągnięcie do shared
// można zrobić w F7 jeśli powtarza się też na bistro / hotel.
export async function MenuReservation({ data, settings, locale }: Props) {
  if (!data) return null
  const t = await getTranslations('restaurant.reservation')
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const phone = settings?.phone
  const address = settings?.address

  return (
    <section className="bg-bg py-24 md:py-40">
      <div className="mx-auto flex w-full max-w-[1384px] flex-col items-center gap-8 px-6 text-center md:px-16">
        {title && (
          <h2 className="text-text max-w-5xl text-4xl leading-tight font-light tracking-tight uppercase md:text-6xl">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-text-muted max-w-2xl text-xl leading-relaxed">{description}</p>
        )}
        {phone && (
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="text-text hover:text-accent mt-4 text-5xl font-light tracking-tight transition-colors md:text-7xl lg:text-8xl"
          >
            {phone}
          </a>
        )}
        <dl className="border-border-subtle mt-8 grid w-full max-w-2xl grid-cols-1 gap-8 border-t pt-8 md:grid-cols-2">
          <div className="flex flex-col items-center gap-1">
            <dt className="text-text-muted text-sm tracking-wider uppercase">{t('hours')}</dt>
            <dd className="text-text text-lg">{t('hoursValue')}</dd>
          </div>
          <div className="flex flex-col items-center gap-1">
            <dt className="text-text-muted text-sm tracking-wider uppercase">{t('location')}</dt>
            <dd className="text-text text-lg">
              {address?.street ?? '—'}
              {address?.postalCode && address?.city && (
                <>
                  <br />
                  {address.postalCode} {address.city}
                </>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
