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
// Desktop (lg+): 2 kolumny — lewo flex-1 tekst (eyebrow + h2 + dane kontaktowe),
//   prawo flex-1 okrągły obraz (rounded-full), aspect-square.
// Tablet/mobile (<lg): jedna kolumna, obraz pod tekstem (kolejność DOM).
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
      <div className="layout-container flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-20">
        <div className="flex flex-col gap-8 lg:flex-1 lg:gap-10">
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
                <dt className="text-text-inverse text-sm tracking-normal uppercase">
                  {t('phone')}
                </dt>
                <dd className="text-text-inverse text-xl md:text-2xl">
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
                <dt className="text-text-inverse text-sm tracking-normal uppercase">
                  {t('email')}
                </dt>
                <dd className="text-text-inverse text-xl break-all md:text-2xl">
                  <a href={`mailto:${email}`} className="hover:text-accent transition-colors">
                    {email}
                  </a>
                </dd>
              </div>
            )}
            {address?.street && (
              <div className="flex flex-col gap-1">
                <dt className="text-text-inverse text-sm tracking-normal uppercase">
                  {t('address')}
                </dt>
                <dd className="text-text-inverse text-xl leading-[1.2] md:text-2xl">
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
              className="bg-text-inverse text-text hover:bg-text-inverse/90 inline-flex h-[60px] w-full items-center justify-center rounded-full px-6 text-lg transition-colors md:w-fit md:min-w-[220px] lg:hidden"
            >
              {locale === 'pl' ? 'Zadzwoń' : 'Call us'}
            </a>
          )}
        </div>

        <div className="flex justify-center lg:flex-1">
          <div className="relative aspect-square w-4/5 overflow-hidden rounded-full">
            <SanityImage
              image={data.image}
              locale={locale}
              fill
              sizes="(max-width: 1024px) 80vw, 32vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
