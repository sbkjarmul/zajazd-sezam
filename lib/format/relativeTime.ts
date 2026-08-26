/**
 * Podpis "2 miesiące temu" pod opinią gościa — liczony z daty wystawienia.
 *
 * Wcześniej ten tekst był wpisywany ręcznie razem z treścią opinii (mock
 * Google Places API zwracał gotowe `relative_time_description`). Odkąd opinie
 * żyją w CMS, redakcja podaje tylko datę — inaczej podpisy zestarzałyby się
 * po kilku tygodniach i "1 tydzień temu" wisiałoby pod roczną opinią.
 *
 * Polska liczba mnoga ma trzy formy (1 / 2-4 / 5+) i nie da się jej złożyć
 * z `Intl.RelativeTimeFormat` bez zaokrągleń, których nie chcemy — stąd
 * własny, mały szablon.
 */

import type { Locale } from '@/i18n/routing'

type PluralForms = {
  /** 1 tydzień */
  one: string
  /** 2-4 tygodnie */
  few: string
  /** 5+ tygodni */
  many: string
}

const UNITS_PL: Record<'day' | 'week' | 'month' | 'year', PluralForms> = {
  day: { one: 'dzień', few: 'dni', many: 'dni' },
  week: { one: 'tydzień', few: 'tygodnie', many: 'tygodni' },
  month: { one: 'miesiąc', few: 'miesiące', many: 'miesięcy' },
  year: { one: 'rok', few: 'lata', many: 'lat' },
}

const UNITS_EN: Record<'day' | 'week' | 'month' | 'year', string> = {
  day: 'day',
  week: 'week',
  month: 'month',
  year: 'year',
}

// Reguła polskiej liczby mnogiej: 1 -> one; 2-4 (poza 12-14) -> few; reszta -> many.
function pluralPl(count: number, forms: PluralForms): string {
  if (count === 1) return forms.one
  const lastTwo = count % 100
  const last = count % 10
  if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return forms.few
  return forms.many
}

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * @param publishedAt data wystawienia opinii (ISO `YYYY-MM-DD` z Sanity)
 * @param now punkt odniesienia — wstrzykiwany, żeby wynik był deterministyczny
 *            w obrębie jednego renderu (wszystkie karty liczone od tej samej chwili)
 */
export function relativeTimeDescription(publishedAt: string, now: number): Record<Locale, string> {
  const elapsedDays = Math.max(0, Math.floor((now - Date.parse(publishedAt)) / DAY_MS))

  const [unit, count] =
    elapsedDays >= 365
      ? (['year', Math.floor(elapsedDays / 365)] as const)
      : elapsedDays >= 30
        ? (['month', Math.floor(elapsedDays / 30)] as const)
        : elapsedDays >= 7
          ? (['week', Math.floor(elapsedDays / 7)] as const)
          : (['day', elapsedDays] as const)

  if (unit === 'day' && count === 0) {
    return { pl: 'dzisiaj', en: 'today' }
  }

  return {
    pl: `${count} ${pluralPl(count, UNITS_PL[unit])} temu`,
    en: `${count} ${UNITS_EN[unit]}${count === 1 ? '' : 's'} ago`,
  }
}
