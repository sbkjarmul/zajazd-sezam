import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Logo } from './Logo'
import type { SITE_SETTINGS_QUERY_RESULT } from '@/types/sanity'
import type { Locale, Pathname } from '@/i18n/routing'
import { cn } from '@/lib/utils'

type SiteMapItem = { href: Pathname; key: 'hotel' | 'restaurant' | 'bistro' | 'events' | 'contact' }

const SITE_MAP_ITEMS: SiteMapItem[] = [
  { href: '/hotel', key: 'hotel' },
  { href: '/restauracja', key: 'restaurant' },
  { href: '/bistro', key: 'bistro' },
  { href: '/imprezy-okolicznosciowe', key: 'events' },
  { href: '/kontakt', key: 'contact' },
]

export type FooterTheme = 'light' | 'dark'

type Props = {
  settings: SITE_SETTINGS_QUERY_RESULT | null
  locale: Locale
  // Per-page brand label w kolumnie 1. Fallback do siteSettings.companyName.
  brandLabel?: string
  // Per-page kolor tła stopki. Domyślnie 'light' (cream + dark text).
  theme?: FooterTheme
  // Override koloru tła (np. bistro #1a2789).
  bgColor?: string
  // Wariant z gigantycznym SEZAM wordmarkiem na górze + kolumny right-aligned (bistro).
  bigBrand?: boolean
}

export async function Footer({
  settings,
  locale,
  brandLabel,
  theme = 'light',
  bgColor,
  bigBrand = false,
}: Props) {
  const t = await getTranslations()
  const description = settings?.shortDescription?.[locale]
  const defaultBrand = settings?.companyName?.[locale] ?? 'Zajazd Sezam'
  const resolvedBrand = brandLabel ?? defaultBrand
  const address = settings?.address
  const phone = settings?.phone
  const email = settings?.publicEmail ?? settings?.receptionEmail
  const year = new Date().getFullYear()
  const isDark = theme === 'dark'
  const bgStyle = bgColor
    ? { background: bgColor }
    : isDark
      ? { background: 'var(--color-dark-ruby)' }
      : undefined

  return (
    <footer
      className={cn(
        'border-t',
        isDark ? 'text-text-inverse border-white/15' : 'bg-bg text-text border-border-subtle',
      )}
      style={bgStyle}
    >
      {bigBrand ? (
        <div className="layout-container flex flex-col gap-16 pt-20 pb-12 md:pt-20">
          {/* Gigantic SEZAM wordmark — rozciągnięty na pełną szerokość kontenera */}
          <svg
            viewBox="0 0 1000 240"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="SEZAM"
            className={cn('block w-full', isDark ? 'text-text-inverse' : 'text-text')}
          >
            <text
              x="0"
              y="220"
              fontSize="290"
              fontWeight="900"
              fontFamily="Inter, sans-serif"
              fill="currentColor"
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
            >
              SEZAM
            </text>
          </svg>

          {/* Navigation columns — right-aligned na desktop */}
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-end md:gap-10">
            <FooterColumn
              title={resolvedBrand}
              isDark={isDark}
              items={[
                address?.street && {
                  text: (
                    <>
                      {address.street}
                      {address.postalCode && address.city && (
                        <>
                          <br />
                          {address.postalCode} {address.city}
                        </>
                      )}
                    </>
                  ),
                },
                phone && {
                  text: phone,
                  href: `tel:${phone.replace(/\s/g, '')}`,
                },
              ]}
            />
            <FooterColumn
              title={t('footer.siteMapHeading')}
              isDark={isDark}
              items={SITE_MAP_ITEMS.map((item) => ({
                text: t(`nav.${item.key}`),
                href: item.href,
                isInternal: true,
              }))}
            />
            <FooterColumn
              title={t('footer.termsHeading')}
              isDark={isDark}
              items={[
                { text: t('footer.links.privacy') },
                { text: t('footer.links.cookies') },
                { text: t('footer.links.terms') },
              ]}
            />
          </div>
        </div>
      ) : (
        <div className="layout-container flex flex-col items-center gap-12 py-16 text-center md:flex-row md:items-start md:py-20 md:text-left">
          {/* Left: logo + description (mobile: centered) */}
          <div className="flex flex-col items-center gap-6 md:w-1/2 md:items-start">
            <Logo variant={isDark ? 'on-dark' : 'on-light'} />
            {description && (
              <p
                className={cn(
                  'max-w-[600px] text-base leading-relaxed md:text-lg',
                  isDark ? 'text-text-inverse' : 'text-text',
                )}
              >
                {description}
              </p>
            )}
          </div>

          {/* Right: 3 columns (mobile: stacked + centered) */}
          <div
            className={cn(
              'grid w-full flex-1 grid-cols-1 gap-10 border-t pt-10 md:grid-cols-3 md:border-t-0 md:pt-0',
              isDark ? 'border-white/15' : 'border-border-subtle',
            )}
          >
            <FooterColumn
              title={resolvedBrand}
              isDark={isDark}
              items={[
                address?.street && {
                  text: (
                    <>
                      {address.street}
                      {address.postalCode && address.city && (
                        <>
                          <br />
                          {address.postalCode} {address.city}
                        </>
                      )}
                    </>
                  ),
                },
                phone && {
                  text: phone,
                  href: `tel:${phone.replace(/\s/g, '')}`,
                },
                email && {
                  text: email,
                  href: `mailto:${email}`,
                },
              ]}
            />
            <FooterColumn
              title={t('footer.siteMapHeading')}
              isDark={isDark}
              items={SITE_MAP_ITEMS.map((item) => ({
                text: t(`nav.${item.key}`),
                href: item.href,
                isInternal: true,
              }))}
            />
            <FooterColumn
              title={t('footer.termsHeading')}
              isDark={isDark}
              items={[
                { text: t('footer.links.privacy') },
                { text: t('footer.links.cookies') },
                { text: t('footer.links.terms') },
              ]}
            />
          </div>
        </div>
      )}

      <div className={cn('border-t', isDark ? 'border-white/15' : 'border-border-subtle')}>
        <div className="layout-container flex py-6">
          <p className={cn('text-sm', isDark ? 'text-text-inverse' : 'text-text-muted')}>
            {t('footer.copyright', { year })}
          </p>
        </div>
      </div>
    </footer>
  )
}

type ColumnItem =
  | {
      text: React.ReactNode
      href?: string
      isInternal?: boolean
    }
  | false
  | null
  | undefined
  | ''

function FooterColumn({
  title,
  items,
  isDark,
}: {
  title: string
  items: ColumnItem[]
  isDark: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-3 md:items-start">
      <h4
        className={cn(
          'text-sm tracking-normal uppercase',
          isDark ? 'text-text-inverse' : 'text-text-muted',
        )}
      >
        {title}
      </h4>
      {items.filter(Boolean).map((item, i) => {
        if (!item) return null
        const className = cn(
          'text-base',
          item.href && 'hover:text-accent transition-colors',
          isDark ? 'text-text-inverse' : 'text-text',
        )
        if (item.href && item.isInternal) {
          return (
            <Link key={i} href={item.href as Pathname} className={className}>
              {item.text}
            </Link>
          )
        }
        if (item.href) {
          return (
            <a key={i} href={item.href} className={className}>
              {item.text}
            </a>
          )
        }
        return (
          <span
            key={i}
            className={cn('text-base', isDark ? 'text-text-inverse' : 'text-text-muted')}
          >
            {item.text}
          </span>
        )
      })}
    </div>
  )
}
