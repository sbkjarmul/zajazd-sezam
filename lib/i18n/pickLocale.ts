import type { Locale } from '@/i18n/routing'

type LocaleObject<T = string> = { pl?: T | null; en?: T | null } | null | undefined

// Wybiera wartość PL/EN z obiektu lokaliowego. Fallback na PL gdy brak wartości EN.
export function pickLocale<T>(value: LocaleObject<T>, locale: Locale): T | undefined {
  return value?.[locale] ?? value?.pl ?? undefined
}
