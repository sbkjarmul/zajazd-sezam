import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Logo } from './Logo'
import type { SITE_SETTINGS_QUERY_RESULT } from '@/types/sanity'
import type { Locale, Pathname } from '@/i18n/routing'

type SiteMapItem = { href: Pathname; key: 'hotel' | 'restaurant' | 'bistro' | 'events' | 'contact' }

const SITE_MAP_ITEMS: SiteMapItem[] = [
  { href: '/hotel', key: 'hotel' },
  { href: '/restauracja', key: 'restaurant' },
  { href: '/bistro', key: 'bistro' },
  { href: '/imprezy-okolicznosciowe', key: 'events' },
  { href: '/kontakt', key: 'contact' },
]

type Props = {
  settings: SITE_SETTINGS_QUERY_RESULT | null
  locale: Locale
}

export async function Footer({ settings, locale }: Props) {
  const t = await getTranslations()
  const description = settings?.shortDescription?.[locale]
  const companyName = settings?.companyName?.[locale] ?? 'Zajazd Sezam'
  const address = settings?.address
  const phone = settings?.phone
  const email = settings?.publicEmail ?? settings?.receptionEmail
  const year = new Date().getFullYear()

  return (
    <footer className="bg-bg text-text border-border-subtle border-t">
      <div className="mx-auto flex w-full max-w-[1512px] flex-col gap-12 px-6 py-20 md:flex-row md:px-16">
        {/* Left: logo + description */}
        <div className="flex flex-col gap-6 md:w-1/2">
          <Logo variant="on-light" />
          {description && (
            <p className="text-text max-w-[600px] text-lg leading-relaxed">{description}</p>
          )}
        </div>

        {/* Right: 3 columns */}
        <div className="border-border-subtle grid flex-1 grid-cols-1 gap-10 border-t pt-10 md:grid-cols-3 md:border-t-0 md:pt-0">
          {/* Column 1 — NAP */}
          <div className="flex flex-col gap-3">
            <h4 className="text-text-muted text-sm tracking-wider uppercase">{companyName}</h4>
            {address?.street && (
              <p className="text-text text-base">
                {address.street}
                {address.postalCode && address.city && (
                  <>
                    <br />
                    {address.postalCode} {address.city}
                  </>
                )}
              </p>
            )}
            {phone && (
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="text-text hover:text-accent text-base transition-colors"
              >
                {phone}
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="text-text hover:text-accent text-base transition-colors"
              >
                {email}
              </a>
            )}
          </div>

          {/* Column 2 — Site map */}
          <div className="flex flex-col gap-3">
            <h4 className="text-text-muted text-sm tracking-wider uppercase">
              {t('footer.siteMapHeading')}
            </h4>
            {SITE_MAP_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-text hover:text-accent text-base transition-colors"
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </div>

          {/* Column 3 — Terms */}
          <div className="flex flex-col gap-3">
            <h4 className="text-text-muted text-sm tracking-wider uppercase">
              {t('footer.termsHeading')}
            </h4>
            <span className="text-text-muted text-base">{t('footer.links.privacy')}</span>
            <span className="text-text-muted text-base">{t('footer.links.cookies')}</span>
            <span className="text-text-muted text-base">{t('footer.links.terms')}</span>
          </div>
        </div>
      </div>

      <div className="border-border-subtle border-t">
        <div className="mx-auto flex w-full max-w-[1512px] px-6 py-6 md:px-16">
          <p className="text-text-muted text-sm">{t('footer.copyright', { year })}</p>
        </div>
      </div>
    </footer>
  )
}
