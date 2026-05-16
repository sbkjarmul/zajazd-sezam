'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Link } from '@/i18n/navigation'
import { useUI } from '@/components/providers/UIProvider'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Logo } from './Logo'
import type { SITE_SETTINGS_QUERY_RESULT } from '@/types/sanity'
import type { Locale, Pathname } from '@/i18n/routing'
import { VisuallyHidden } from 'radix-ui'

type NavItem = {
  href: Pathname
  key: 'home' | 'restaurant' | 'bistro' | 'hotel' | 'events' | 'contact'
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', key: 'home' },
  { href: '/restauracja', key: 'restaurant' },
  { href: '/bistro', key: 'bistro' },
  { href: '/hotel', key: 'hotel' },
  { href: '/imprezy-okolicznosciowe', key: 'events' },
  { href: '/kontakt', key: 'contact' },
]

type Props = {
  settings: SITE_SETTINGS_QUERY_RESULT | null
}

export function BurgerMenu({ settings }: Props) {
  const t = useTranslations()
  const locale = useLocale() as Locale
  const { burgerOpen, closeBurger } = useUI()

  const address = settings?.address
  const phone = settings?.phone
  const email = settings?.publicEmail ?? settings?.receptionEmail

  return (
    <Sheet open={burgerOpen} onOpenChange={(open) => (open ? null : closeBurger())}>
      <SheetContent
        side="right"
        className="bg-bg flex w-full max-w-[480px] flex-col gap-10 border-l-0 p-8 sm:max-w-[480px]"
      >
        <VisuallyHidden.Root>
          <SheetTitle>{t('burgerMenu.title')}</SheetTitle>
          <SheetDescription>Nawigacja po stronie i dane kontaktowe.</SheetDescription>
        </VisuallyHidden.Root>

        <div className="flex items-start justify-between">
          <Logo variant="on-light" />
        </div>

        <nav className="flex flex-1 flex-col gap-2 text-3xl tracking-tight">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={closeBurger}
              className="text-text hover:text-accent py-1 transition-colors"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div className="border-border-subtle flex flex-col gap-6 border-t pt-6">
          <div className="flex items-center justify-between">
            <span className="text-text-muted text-sm tracking-wider uppercase">
              {t('burgerMenu.languageLabel')}
            </span>
            <LanguageSwitcher />
          </div>

          {(address || phone || email) && (
            <address className="flex flex-col gap-2 text-base not-italic">
              {address?.street && (
                <p className="text-text">
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
                  className="text-text hover:text-accent transition-colors"
                >
                  {phone}
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="text-text hover:text-accent transition-colors"
                  lang={locale === 'pl' ? 'pl' : 'en'}
                >
                  {email}
                </a>
              )}
            </address>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
