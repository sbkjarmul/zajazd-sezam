import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'

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
  /**
   * Optional terms to bold within the description (case-insensitive).
   * Used by /restauracja to highlight "najlepszy stolik" / "best table".
   * Omit for plain rendering (e.g. /restauracja/menu).
   */
  highlightTerms?: string[]
}

function HighlightTerms({ text, terms }: { text: string; terms: string[] }) {
  if (!terms.length) return <>{text}</>
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

// Sekcja CTA "zarezerwuj stolik" — dark-ruby bg, biały bold h2, wielki numer
// telefonu z whitespace-nowrap (mieści się na 375px viewport), poniżej dl z
// godzinami + adresem. Współdzielona przez /restauracja i /restauracja/menu.
export async function RestaurantReservation({
  title,
  description,
  phone,
  address,
  locale,
  highlightTerms,
}: Props) {
  if (!title && !description && !phone) return null
  const t = await getTranslations('restaurant.reservation')

  return (
    <section
      className="text-text-inverse w-full py-24 md:py-32"
      style={{ background: 'var(--color-dark-ruby)' }}
    >
      <div className="layout-container flex max-w-[1280px] flex-col items-center gap-6 text-center">
        {title && (
          <h2 className="text-text-inverse max-w-5xl text-3xl leading-none font-bold tracking-tight uppercase sm:text-4xl md:text-6xl md:tracking-[-0.03em] lg:text-[80px]">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-text-inverse max-w-2xl text-base leading-relaxed sm:text-lg md:text-xl">
            {highlightTerms?.length ? (
              <HighlightTerms text={description} terms={highlightTerms} />
            ) : (
              description
            )}
          </p>
        )}
        {phone && (
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="text-text-inverse hover:text-accent text-[40px] font-black whitespace-nowrap tracking-[-0.03em] py-4 transition-colors sm:text-5xl md:py-8 md:text-6xl lg:text-[96px] lg:leading-none"
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
