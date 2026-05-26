import type { CONTACT_PAGE_QUERY_RESULT, SITE_SETTINGS_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<CONTACT_PAGE_QUERY_RESULT>['contactSection']
  settings: SITE_SETTINGS_QUERY_RESULT
  locale: Locale
}

export function ContactInfo({ data, settings, locale }: Props) {
  const eyebrow = pickLocale(data?.eyebrow, locale)
  const title = pickLocale(data?.title, locale)
  const addressLabel = pickLocale(data?.addressLabel, locale)
  const phoneLabel = pickLocale(data?.phoneLabel, locale)
  const emailLabel = pickLocale(data?.emailLabel, locale)

  const address = settings?.address
  const phone = settings?.phone
  const email = settings?.publicEmail ?? settings?.receptionEmail

  return (
    <section className="bg-light py-20 md:py-32">
      <div className="layout-container flex flex-col gap-12 md:gap-20">
        <header className="flex flex-col gap-4">
          {eyebrow && (
            <p className="text-accent text-sm tracking-normal uppercase leading-[normal]">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-text max-w-3xl text-2xl leading-none font-light tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-6xl">
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
              <dd className="text-text text-xl leading-[1.2] md:text-2xl">
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
        </dl>
      </div>
    </section>
  )
}
