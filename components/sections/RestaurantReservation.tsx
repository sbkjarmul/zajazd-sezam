import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { RevealImage } from '@/components/RevealImage'
import { RevealText } from '@/components/RevealText'
import { Reveal } from '@/components/Reveal'
import { AccentText } from '@/components/AccentText'
import { formatPhonePl } from '@/lib/format/phone'

type Address = {
  street?: string | null
  postalCode?: string | null
  city?: string | null
} | null

type Props = {
  title?: string | null
  description?: string | null
  phone?: string | null
  address?: Address
  locale: Locale
  // Kwadratowe zdjęcie po prawej stronie (Figma 967:203). Opcjonalne —
  // /restauracja/menu reużywa sekcję bez zdjęcia.
  image?: Parameters<typeof SanityImage>[0]['image']
}

// Sekcja CTA "Zarezerwuj stolik" (Figma 967:70) — dark-ruby tło, lewa kolumna:
// serif nagłówek z akcentem kursywą (marker *…*), opis, wielki numer telefonu
// Westbourne, na dole godziny + adres. Po prawej kwadratowe zdjęcie.
// Współdzielona przez /restauracja i /restauracja/menu.
export async function RestaurantReservation({
  title,
  description,
  phone,
  address,
  locale,
  image,
}: Props) {
  if (!title && !description && !phone) return null
  const t = await getTranslations('restaurant.reservation')

  return (
    <section
      data-header-theme="dark"
      className="text-text-inverse w-full pt-20 pb-4 md:py-24"
      style={{ background: 'var(--color-dark-ruby)' }}
    >
      <div className="layout-container flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
        {/* Lewa kolumna — tekst + telefon, godziny/lokalizacja u dołu */}
        <div className="flex flex-1 flex-col lg:min-h-[560px]">
          {title && (
            <RevealText
              as="h2"
              mode="fade"
              className="font-accent text-text-inverse text-[clamp(34px,6vw,64px)] leading-none tracking-[-0.01em] not-italic"
            >
              <AccentText text={title} />
            </RevealText>
          )}
          <Reveal delay={120}>
            {description && (
              <p className="text-text-inverse mt-6 max-w-2xl text-lg">{description}</p>
            )}
            {phone && (
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="font-accent text-text-inverse hover:text-accent mt-8 block text-[clamp(48px,9vw,96px)] leading-none whitespace-nowrap not-italic transition-colors"
              >
                {formatPhonePl(phone)}
              </a>
            )}
          </Reveal>

          <dl className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:mt-auto lg:pt-16">
            <div className="flex flex-col gap-2">
              <dt className="text-text-inverse text-sm font-bold tracking-normal uppercase">
                {t('hours')}
              </dt>
              <dd className="text-text-inverse text-base font-light">{t('hoursValue')}</dd>
            </div>
            <div className="flex flex-col gap-2">
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

        {/* Prawa kolumna — kwadratowe zdjęcie */}
        {image && (
          <div className="relative aspect-square w-full overflow-hidden lg:w-[286px] lg:shrink-0">
            <RevealImage
              image={image}
              locale={locale}
              sizes="(max-width: 1024px) 100vw, 286px"
              direction="up"
            />
          </div>
        )}
      </div>
    </section>
  )
}
