import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Logo } from './Logo'
import type { SITE_SETTINGS_QUERY_RESULT } from '@/types/sanity'
import type { Locale, Pathname } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import type { SanityImage } from '@/components/SanityImage'

type LogoImage = Parameters<typeof SanityImage>[0]['image']

type SiteMapItem = {
  href: Pathname
  key: 'hotel' | 'restaurant' | 'menu' | 'bistro' | 'events' | 'contact'
}

const SITE_MAP_ITEMS: SiteMapItem[] = [
  { href: '/hotel', key: 'hotel' },
  { href: '/restauracja', key: 'restaurant' },
  { href: '/restauracja/menu', key: 'menu' },
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
  // Wariant z powiększonym logo na górze + kolumny right-aligned (bistro/restauracja).
  bigBrand?: boolean
  // Godziny otwarcia w kolumnie 1 (wariant bigBrand) — zamiast telefonu.
  hoursText?: string
  // Ukrywa opis (shortDescription) obok logo w standardowym wariancie stopki.
  hideDescription?: boolean
  // Obraz logo — to samo co w headerze per-podstrona. Jeśli brak, fallback tekstowy "SEZAM / ZAWSZE ŚWIEŻO".
  logoImage?: LogoImage
}

export async function Footer({
  settings,
  locale,
  brandLabel,
  theme = 'light',
  bgColor,
  bigBrand = false,
  hoursText,
  hideDescription = false,
  logoImage,
}: Props) {
  const t = await getTranslations()
  const description = hideDescription ? undefined : settings?.shortDescription?.[locale]
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
        <div className="layout-container flex flex-col items-center gap-12 pt-20 pb-12 md:flex-row md:items-start md:justify-between md:gap-16 md:pt-20">
          {/* Powiększone logo (ten sam komponent co w headerze, size="lg") —
              naturalne proporcje, bez naciągania SVG. Mobile: wycentrowane nad
              kolumnami; desktop: po lewej, kolumny po prawej w jednym rzędzie. */}
          <Logo
            size="lg"
            variant={isDark ? 'on-dark' : 'on-light'}
            image={logoImage}
            locale={locale}
          />

          {/* Kolumny nawigacji — centrowane na mobile, rząd na desktop */}
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-10">
            <FooterColumn
              title={resolvedBrand}
              isDark={isDark}
              strong
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
                hoursText
                  ? { text: hoursText }
                  : phone && {
                      text: phone,
                      href: `tel:${phone.replace(/\s/g, '')}`,
                    },
              ]}
            />
            <FooterColumn
              title={t('footer.siteMapHeading')}
              isDark={isDark}
              strong
              items={SITE_MAP_ITEMS.map((item) => ({
                text: t(`nav.${item.key}`),
                href: item.href,
                isInternal: true,
              }))}
            />
            <FooterColumn
              title={t('footer.termsHeading')}
              isDark={isDark}
              strong
              items={[
                { text: t('footer.links.privacy') },
                { text: t('footer.links.cookies') },
                { text: t('footer.links.terms') },
              ]}
            />
          </div>
        </div>
      ) : (
        <div className="layout-container flex flex-col items-center gap-12 py-16 text-center md:items-start md:py-20 md:text-left xl:flex-row">
          {/* Left: logo + description (mobile: centered) */}
          <div className="flex flex-col items-center gap-6 md:items-start xl:w-1/3">
            <Logo
              variant={isDark ? 'on-dark' : 'on-light'}
              image={logoImage}
              locale={locale}
            />
            {description && (
              <p
                className={cn(
                  'max-w-[450px] text-[14px] leading-[normal]',
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
              'grid w-full flex-1 grid-cols-1 gap-10 border-t pt-10 md:grid-cols-3 xl:border-t-0 xl:pt-0',
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
  strong = false,
}: {
  title: string
  items: ColumnItem[]
  isDark: boolean
  // `strong` (wariant bigBrand): nagłówek bold + pełny kontrast, itemy w pełnym
  // dark-ruby zamiast wyciszonych. Standardowa stopka zostaje przy text-muted.
  strong?: boolean
}) {
  const headingClass = isDark
    ? 'text-text-inverse'
    : strong
      ? 'text-dark-ruby'
      : 'text-text-muted'
  const itemClass = isDark ? 'text-text-inverse' : strong ? 'text-dark-ruby' : 'text-text'
  const spanClass = isDark ? 'text-text-inverse' : strong ? 'text-dark-ruby' : 'text-text'

  return (
    <div className="flex flex-col items-center gap-3 md:items-start">
      <h4
        className={cn('text-sm tracking-normal uppercase', strong && 'font-bold', headingClass)}
      >
        {title}
      </h4>
      {items.filter(Boolean).map((item, i) => {
        if (!item) return null
        const className = cn(
          'text-base',
          item.href && 'hover:text-accent transition-colors',
          itemClass,
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
          <span key={i} className={cn('text-base', spanClass)}>
            {item.text}
          </span>
        )
      })}
    </div>
  )
}
