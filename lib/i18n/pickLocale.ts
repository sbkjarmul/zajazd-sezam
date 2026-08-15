import type { Locale } from '@/i18n/routing'
import { noOrphans } from '@/lib/typography/noOrphans'

type LocaleObject<T = string> = { pl?: T | null; en?: T | null } | null | undefined

// Wybiera wartość PL/EN z obiektu lokaliowego. Fallback na PL gdy brak wartości EN.
//
// Na wyjściu tekst przechodzi przez `noOrphans` — jednoliterowe spójniki
// i krótkie słowa otwierające zdanie dostają NBSP, żeby nie wisiały na końcu
// wiersza. Dotyczy TYLKO wartości tekstowych (inne typy lecą bez zmian) i tylko
// warstwy UI: SEO ma własne pickLocale w `lib/seo/`, więc meta tagi, JSON-LD
// i sitemapa zostają czystym tekstem.
export function pickLocale<T>(value: LocaleObject<T>, locale: Locale): T | undefined {
  const picked = value?.[locale] ?? value?.pl ?? undefined
  return typeof picked === 'string' ? (noOrphans(picked) as T) : picked
}
