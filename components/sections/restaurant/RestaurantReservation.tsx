import type { RESTAURANT_PAGE_QUERY_RESULT, SITE_SETTINGS_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<RESTAURANT_PAGE_QUERY_RESULT>['reservationSection']
  settings: SITE_SETTINGS_QUERY_RESULT | null
  locale: Locale
}

// Podświetla rzeczowniki "najlepszy stolik" / "best table" w tekście (zgodnie z Figmą).
function HighlightTerms({ text, locale }: { text: string; locale: Locale }) {
  const terms = locale === 'pl' ? ['najlepszy', 'stolik'] : ['best', 'table']
  const pattern = new RegExp(`(${terms.join('|')})`, 'gi')
  const parts = text.split(pattern)
  return (
    <>
      {parts.map((part, i) =>
        terms.some((t) => t.toLowerCase() === part.toLowerCase()) ? (
          <strong key={i} className="font-bold">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

export async function RestaurantReservation({ data, settings, locale }: Props) {
  if (!data) return null
  const t = await getTranslations('restaurant.reservation')
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)
  const phone = settings?.phone
  const address = settings?.address

  return (
    <section
      className="text-text-inverse w-full py-24 md:py-32"
      style={{ background: 'var(--color-dark-ruby)' }}
    >
      <div className="layout-container flex max-w-[1280px] flex-col items-center gap-6 text-center">
        {title && (
          <h2 className="text-text-inverse max-w-5xl text-4xl leading-[1.0] font-bold tracking-tight uppercase md:text-6xl md:tracking-[-0.03em] lg:text-[80px]">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-text-inverse max-w-2xl text-lg leading-relaxed md:text-xl">
            <HighlightTerms text={description} locale={locale} />
          </p>
        )}
        {phone && (
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="text-text-inverse hover:text-accent py-8 text-6xl font-black tracking-[-0.05em] transition-colors md:text-7xl lg:text-[96px] lg:leading-none"
          >
            {phone}
          </a>
        )}

        <dl className="mt-2 grid w-full max-w-2xl grid-cols-1 gap-10 md:grid-cols-2">
          <div className="flex flex-col items-center gap-2">
            <dt className="text-text-inverse text-sm font-bold tracking-normal uppercase">
              {t('hours')}
            </dt>
            <dd className="text-text-inverse text-base font-light">{t('hoursValue')}</dd>
          </div>
          <div className="flex flex-col items-center gap-2">
            <dt className="text-text-inverse text-sm font-bold tracking-normal uppercase">
              {t('location')}
            </dt>
            <dd className="text-text-inverse text-base font-light">
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
