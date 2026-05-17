import type { CONTACT_PAGE_QUERY_RESULT, SITE_SETTINGS_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<CONTACT_PAGE_QUERY_RESULT>['contactSection']
  settings: SITE_SETTINGS_QUERY_RESULT
  locale: Locale
}

type HoursEntry = NonNullable<
  NonNullable<SITE_SETTINGS_QUERY_RESULT>['openingHoursRestaurant']
>[number]

const DAY_LABELS: Record<Locale, Record<string, string>> = {
  pl: {
    Monday: 'Pn',
    Tuesday: 'Wt',
    Wednesday: 'Śr',
    Thursday: 'Cz',
    Friday: 'Pt',
    Saturday: 'Sb',
    Sunday: 'Nd',
  },
  en: {
    Monday: 'Mon',
    Tuesday: 'Tue',
    Wednesday: 'Wed',
    Thursday: 'Thu',
    Friday: 'Fri',
    Saturday: 'Sat',
    Sunday: 'Sun',
  },
}

function formatHours(entries: HoursEntry[] | null | undefined, locale: Locale): string | null {
  if (!entries?.length) return null
  return entries
    .map((entry) => {
      const days = (entry.daysOfWeek ?? []).map((d) => DAY_LABELS[locale][d] ?? d)
      const range =
        days.length === 7
          ? locale === 'pl'
            ? 'Codziennie'
            : 'Daily'
          : days.length === 2
            ? `${days[0]}–${days[1]}`
            : days.join(', ')
      const opens = entry.opens ?? ''
      const closes = entry.closes ?? ''
      const is24h = opens === '00:00' && (closes === '23:59' || closes === '24:00')
      const hours = is24h ? '24/7' : `${opens} – ${closes}`
      return `${range} · ${hours}`
    })
    .join(' · ')
}

export function ContactInfo({ data, settings, locale }: Props) {
  const eyebrow = pickLocale(data?.eyebrow, locale)
  const title = pickLocale(data?.title, locale)
  const addressLabel = pickLocale(data?.addressLabel, locale)
  const phoneLabel = pickLocale(data?.phoneLabel, locale)
  const emailLabel = pickLocale(data?.emailLabel, locale)
  const restaurantHoursLabel = pickLocale(data?.restaurantHoursLabel, locale)
  const receptionHoursLabel = pickLocale(data?.receptionHoursLabel, locale)

  const address = settings?.address
  const phone = settings?.phone
  const email = settings?.publicEmail ?? settings?.receptionEmail
  const restaurantHours = formatHours(settings?.openingHoursRestaurant, locale)
  const receptionHours = formatHours(settings?.openingHoursReception, locale)

  return (
    <section className="bg-bg py-20 md:py-32">
      <div className="layout-container flex flex-col gap-14">
        <header className="flex flex-col gap-4">
          {eyebrow && <p className="text-accent text-sm tracking-normal uppercase">{eyebrow}</p>}
          {title && (
            <h2 className="text-text max-w-3xl text-4xl leading-tight font-light tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-6xl">
              {title}
            </h2>
          )}
        </header>

        <dl className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {address?.street && (
            <div className="flex flex-col gap-2">
              <dt className="text-text-muted text-sm tracking-normal uppercase">
                {addressLabel ?? (locale === 'pl' ? 'Adres' : 'Address')}
              </dt>
              <dd className="text-text text-xl leading-snug md:text-2xl">
                {address.street}
                {address.postalCode && address.city && (
                  <>
                    <br />
                    {address.postalCode} {address.city}
                  </>
                )}
              </dd>
            </div>
          )}

          {phone && (
            <div className="flex flex-col gap-2">
              <dt className="text-text-muted text-sm tracking-normal uppercase">
                {phoneLabel ?? (locale === 'pl' ? 'Telefon' : 'Phone')}
              </dt>
              <dd className="text-text text-xl md:text-2xl">
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="hover:text-accent transition-colors"
                >
                  {phone}
                </a>
              </dd>
            </div>
          )}

          {email && (
            <div className="flex flex-col gap-2">
              <dt className="text-text-muted text-sm tracking-normal uppercase">
                {emailLabel ?? 'Email'}
              </dt>
              <dd className="text-text text-xl md:text-2xl">
                <a
                  href={`mailto:${email}`}
                  className="hover:text-accent break-all transition-colors"
                >
                  {email}
                </a>
              </dd>
            </div>
          )}

          {restaurantHours && (
            <div className="flex flex-col gap-2">
              <dt className="text-text-muted text-sm tracking-normal uppercase">
                {restaurantHoursLabel ?? (locale === 'pl' ? 'Restauracja' : 'Restaurant')}
              </dt>
              <dd className="text-text text-xl leading-snug md:text-2xl">{restaurantHours}</dd>
            </div>
          )}

          {receptionHours && (
            <div className="flex flex-col gap-2">
              <dt className="text-text-muted text-sm tracking-normal uppercase">
                {receptionHoursLabel ?? (locale === 'pl' ? 'Recepcja hotelu' : 'Hotel reception')}
              </dt>
              <dd className="text-text text-xl leading-snug md:text-2xl">{receptionHours}</dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  )
}
