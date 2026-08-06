import { Fragment } from 'react'
import type { CONTACT_PAGE_QUERY_RESULT, SITE_SETTINGS_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'
import { formatPhonePl } from '@/lib/format/phone'
import { Reveal } from '@/components/Reveal'

type Props = {
  data: NonNullable<CONTACT_PAGE_QUERY_RESULT>['contactSection']
  settings: SITE_SETTINGS_QUERY_RESULT
  locale: Locale
}

// Ciemna sekcja "Skontaktuj się" (Figma 1144:94) — jedyny blok strony /kontakt.
// Wysrodkowany blok: eyebrow + serifowy tytul akcentowy, pod nim tabela
// telefonow per branza (Recepcja/Restauracja/Bistro/Hotel/Imprezy) oraz adres i
// email. Numery, adres i email pochodza z siteSettings (NAP = jedno zrodlo);
// Hotel i Imprezy korzystaja z numeru glownego (recepcja) jako fallback.
export function ContactInfo({ data, settings, locale }: Props) {
  const eyebrow = pickLocale(data?.eyebrow, locale)
  const title = pickLocale(data?.title, locale)
  const phonesLabel = pickLocale(data?.phoneLabel, locale)
  const addressLabel = pickLocale(data?.addressLabel, locale) ?? (locale === 'pl' ? 'Adres' : 'Address')
  const emailLabel = pickLocale(data?.emailLabel, locale) ?? 'Email'

  const address = settings?.address
  const email = settings?.publicEmail ?? settings?.receptionEmail
  const mainPhone = settings?.phone

  // Linie telefoniczne per branza — etykieta z Sanity, numer z siteSettings.
  const phoneLines = [
    { label: pickLocale(data?.receptionLabel, locale), value: mainPhone },
    { label: pickLocale(data?.restaurantLabel, locale), value: settings?.phoneRestaurant ?? mainPhone },
    { label: pickLocale(data?.bistroLabel, locale), value: settings?.phoneBistro ?? mainPhone },
    { label: pickLocale(data?.hotelLabel, locale), value: mainPhone },
    { label: pickLocale(data?.eventsLabel, locale), value: mainPhone },
  ].filter((line): line is { label: string; value: string } => Boolean(line.label && line.value))

  return (
    <section
      data-header-theme="dark"
      className="bg-dark text-light flex min-h-[100svh] flex-col items-center justify-center gap-16 px-4 py-32 md:gap-24 md:px-16"
    >
      <header className="flex flex-col items-center gap-2 text-center">
        {eyebrow && (
          <p className="text-base tracking-normal uppercase md:text-lg">{eyebrow}</p>
        )}
        {title && (
          <h1 className="font-accent text-[clamp(48px,10vw,100px)] leading-none font-normal tracking-[-0.02em] not-italic">
            {title}
          </h1>
        )}
      </header>

      <Reveal className="flex flex-col items-start gap-16 md:gap-24">
        {phoneLines.length > 0 && (
          <div className="grid grid-cols-[auto_auto] items-center gap-x-8 gap-y-4 sm:gap-x-16 md:gap-x-28 md:gap-y-5">
            <span aria-hidden className="block" />
            {phonesLabel && (
              <p className="text-sm tracking-normal uppercase md:text-base">{phonesLabel}</p>
            )}
            {phoneLines.map((line) => (
              <Fragment key={line.label}>
                <span className="text-base tracking-[-0.02em] md:text-xl">{line.label}</span>
                <a
                  href={`tel:${line.value.replace(/\s/g, '')}`}
                  className="font-accent hover:text-accent text-[clamp(26px,4vw,35px)] leading-none whitespace-nowrap text-white transition-colors"
                >
                  {formatPhonePl(line.value)}
                </a>
              </Fragment>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
          {address?.street && (
            <div className="flex flex-col gap-4">
              <p className="text-sm tracking-normal uppercase md:text-base">{addressLabel}</p>
              <p className="text-lg leading-[1.3] text-white md:text-xl">
                {address.street}
                {address.postalCode && address.city && (
                  <>
                    <br />
                    {address.postalCode} {address.city}
                  </>
                )}
              </p>
            </div>
          )}

          {email && (
            <div className="flex flex-col gap-4">
              <p className="text-sm tracking-normal uppercase md:text-base">{emailLabel}</p>
              <a
                href={`mailto:${email}`}
                className="hover:text-accent text-lg break-all text-white transition-colors md:text-xl"
              >
                {email}
              </a>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  )
}
