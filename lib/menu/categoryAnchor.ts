import type { LocaleString } from '@/types/sanity'

// Kotwica sekcji kategorii menu (`id` w HTML, cel linkow `#...`).
//
// Liczona z POLSKIEJ nazwy, nie z nazwy w biezacym jezyku — dzieki temu ten sam
// link dziala na /pl i /en, a przelaczenie jezyka nie gubi pozycji na stronie.
// Zastapila pole `slug` w Sanity, ktore bylo wymagane, wyklikiwane recznie
// i nie sluzylo do niczego innego.
export function categoryAnchor(name: LocaleString | null | undefined): string | undefined {
  const source = name?.pl ?? name?.en
  if (!source) return undefined

  const slug = source
    .normalize('NFD')
    // Znaki diakrytyczne zdjete przez NFD; `ł` nie ma formy rozlozonej,
    // wiec leci osobno.
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l')
    .replace(/Ł/g, 'L')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || undefined
}
