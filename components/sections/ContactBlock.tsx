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

// Wg Figma 676:1657 — sekcja na dark (#1f1f1c), tekst light, gap-80 items-center.
// Lewo flex-1: title block (eyebrow 20px + h2 64px) + boxes vertical stack (gap-32, każdy box gap-4).
// Prawo flex-1: okrągły obraz (rounded-full), aspect-square, h-full.
export async function ContactBlock({ data, settings, locale }: Props) {
  if (!data) return null
  const t = await getTranslations('home.contact')
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const phone = settings?.phone
  const email = settings?.publicEmail ?? settings?.receptionEmail
  const address = settings?.address

  return (
    <section
      className="text-text-inverse py-16 md:py-20"
      style={{ background: 'var(--color-primary)' }}
    >
      <div className="layout-container flex flex-col gap-8 md:flex-row md:items-center md:gap-20">
        <div className="flex flex-col gap-8 md:flex-1 md:gap-10">
          <div className="flex flex-col gap-2">
            {eyebrow && (
              <p className="text-text-inverse text-base tracking-normal uppercase md:text-xl">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-text-inverse text-4xl leading-none font-normal tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-[64px]">
                {title}
              </h2>
            )}
          </div>

          <dl className="flex flex-col gap-6 md:gap-8">
            {phone && (
              <div className="flex flex-col gap-1">
                <dt className="text-text-inverse text-base tracking-normal md:text-xl">
                  {t('phone')}
                </dt>
                <dd className="text-text-inverse text-2xl md:text-[32px]">
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
                <dt className="text-text-inverse text-base tracking-normal md:text-xl">
                  {t('email')}
                </dt>
                <dd className="text-text-inverse text-2xl break-all md:text-[32px]">
                  <a href={`mailto:${email}`} className="hover:text-accent transition-colors">
                    {email}
                  </a>
                </dd>
              </div>
            )}
            {address?.street && (
              <div className="flex flex-col gap-1">
                <dt className="text-text-inverse text-base tracking-normal md:text-xl">
                  {t('address')}
                </dt>
                <dd className="text-text-inverse text-2xl leading-[1.2] md:text-[32px]">
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

          {phone && (
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="bg-text-inverse text-text hover:bg-text-inverse/90 inline-flex h-[60px] w-full items-center justify-center rounded-full px-6 text-lg transition-colors md:hidden"
            >
              {locale === 'pl' ? 'Zadzwoń' : 'Call us'}
            </a>
          )}
        </div>

        <div className="relative aspect-square w-full overflow-hidden rounded-md md:flex-1 md:rounded-full">
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
