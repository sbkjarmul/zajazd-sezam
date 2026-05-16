import type { HOMEPAGE_QUERY_RESULT, SITE_SETTINGS_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import { SanityImage } from '@/components/SanityImage'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['contactBlock']
  settings: SITE_SETTINGS_QUERY_RESULT | null
  locale: Locale
}

export async function ContactBlock({ data, settings, locale }: Props) {
  if (!data) return null
  const t = await getTranslations('home.contact')
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const phone = settings?.phone
  const email = settings?.publicEmail ?? settings?.receptionEmail
  const address = settings?.address

  return (
    <section className="bg-bg py-20 md:py-32">
      <div className="mx-auto grid w-full max-w-[1384px] grid-cols-1 gap-10 px-6 md:grid-cols-12 md:px-16">
        <div className="flex flex-col gap-10 md:col-span-7">
          <div className="flex flex-col gap-4">
            {eyebrow && <p className="text-accent text-sm tracking-widest uppercase">{eyebrow}</p>}
            {title && (
              <h2 className="text-text text-4xl font-light tracking-tight md:text-5xl">{title}</h2>
            )}
          </div>

          <dl className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {phone && (
              <div className="flex flex-col gap-1">
                <dt className="text-text-muted text-sm tracking-wider uppercase">{t('phone')}</dt>
                <dd className="text-text text-2xl">
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
              <div className="flex flex-col gap-1">
                <dt className="text-text-muted text-sm tracking-wider uppercase">{t('email')}</dt>
                <dd className="text-text text-2xl">
                  <a href={`mailto:${email}`} className="hover:text-accent transition-colors">
                    {email}
                  </a>
                </dd>
              </div>
            )}
            {address?.street && (
              <div className="flex flex-col gap-1 md:col-span-2">
                <dt className="text-text-muted text-sm tracking-wider uppercase">{t('address')}</dt>
                <dd className="text-text text-2xl">
                  {address.street}
                  {address.postalCode && address.city && (
                    <>
                      , {address.postalCode} {address.city}
                    </>
                  )}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-md md:col-span-5">
          <SanityImage
            image={data.image}
            locale={locale}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
