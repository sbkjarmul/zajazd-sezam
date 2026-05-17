'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations('languageSwitcher')
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  function switchTo(target: Locale) {
    if (target === locale) return
    // next-intl router.replace zachowuje aktualną ścieżkę, mapuje slug PL↔EN
    // przez routing.pathnames config.
    router.replace(pathname, { locale: target })
  }

  return (
    <div
      role="group"
      aria-label={t('ariaLabel')}
      className={cn(
        'inline-flex items-center gap-2 text-base tracking-normal uppercase',
        className,
      )}
    >
      {routing.locales.map((loc) => {
        const active = loc === locale
        return (
          <button
            key={loc}
            type="button"
            onClick={() => switchTo(loc)}
            aria-current={active ? 'true' : undefined}
            className={cn(
              'cursor-pointer rounded-full px-3 py-1 transition-colors',
              active ? 'bg-primary text-primary-foreground' : 'text-text-muted hover:text-text',
            )}
          >
            {t(loc)}
          </button>
        )
      })}
    </div>
  )
}
