'use client'

import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import { X } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Link, useRouter, usePathname } from '@/i18n/navigation'
import { useUI } from '@/components/providers/UIProvider'
import { routing, type Locale, type Pathname } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { VisuallyHidden } from 'radix-ui'

type NavItem = {
  href: Pathname
  label: { pl: string; en: string }
}

// Krótkie etykiety dla burger menu (Figma 773:110). Footer używa pełnych
// nazw z `nav.*`, więc nie nadpisujemy globalnych translations.
const NAV_ITEMS: NavItem[] = [
  { href: '/', label: { pl: 'Strona główna', en: 'Home' } },
  { href: '/hotel', label: { pl: 'Hotel', en: 'Hotel' } },
  { href: '/restauracja', label: { pl: 'Restauracja', en: 'Restaurant' } },
  { href: '/bistro', label: { pl: 'Bistro', en: 'Bistro' } },
  { href: '/imprezy-okolicznosciowe', label: { pl: 'Imprezy', en: 'Events' } },
  { href: '/kontakt', label: { pl: 'Kontakt', en: 'Contact' } },
]

// Wg Figma 773:47: drawer 508px szerokości, bg-white, p-[32px], gap-[40px].
// Header: brand icon (sezam-brandmark.svg) + close X (size-8).
// Nav: 6 linków text-[40px] Inter regular, gap-[16px], aktywny = accent gold.
// Language: label "Język strony" 20px uppercase + pill 2-button toggle,
// każdy button p-[16px] text-[32px], aktywny = gold, nieaktywny = color/gray.
// Overlay: backdrop-blur-[6px] na półprzezroczystym dark bg.
export function BurgerMenu() {
  const t = useTranslations()
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const router = useRouter()
  const { burgerOpen, closeBurger } = useUI()

  function switchLocale(target: Locale) {
    if (target === locale) return
    router.replace(pathname, { locale: target })
    closeBurger()
  }

  return (
    <Sheet open={burgerOpen} onOpenChange={(open) => (open ? null : closeBurger())}>
      <SheetContent
        side="right"
        showCloseButton={false}
        overlayClassName="backdrop-blur-[6px] bg-[rgba(31,31,28,0.5)]"
        className="bg-surface flex w-full max-w-[508px] flex-col gap-10 border-l-0 p-8 sm:max-w-[508px]"
      >
        <VisuallyHidden.Root>
          <SheetTitle>{t('burgerMenu.title')}</SheetTitle>
          <SheetDescription>Nawigacja po stronie i przełącznik języka.</SheetDescription>
        </VisuallyHidden.Root>

        <div className="flex items-start justify-between">
          <Image
            src="/images/icons/sezam-brandmark.svg"
            alt="Sezam"
            width={100}
            height={52}
            className="h-auto w-[60px]"
            priority
          />
          <button
            type="button"
            onClick={closeBurger}
            aria-label={t('common.close')}
            className="text-text hover:text-accent cursor-pointer transition-colors"
          >
            <X className="size-8" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-4">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === pathname
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeBurger}
                className={cn(
                  'text-[40px] leading-none transition-colors',
                  isActive ? 'text-accent' : 'text-text hover:text-accent',
                )}
              >
                {item.label[locale]}
              </Link>
            )
          })}
        </nav>

        <div className="flex w-full flex-col items-start gap-[10px]">
          <span className="text-text text-base tracking-normal uppercase md:text-xl">
            {t('burgerMenu.languageLabel')}
          </span>
          <div
            role="group"
            aria-label={t('languageSwitcher.ariaLabel')}
            className="flex w-full items-start justify-between rounded-full p-2"
          >
            {routing.locales.map((loc) => {
              const active = loc === locale
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => switchLocale(loc)}
                  aria-current={active ? 'true' : undefined}
                  className={cn(
                    'flex flex-1 cursor-pointer items-center justify-center rounded-full p-4 text-[32px] transition-colors',
                    active ? 'text-accent' : 'text-gray hover:text-text',
                  )}
                >
                  {t(`languageSwitcher.${loc}`)}
                </button>
              )
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
