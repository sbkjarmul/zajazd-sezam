import type { MENU_BY_CATEGORY_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Category = MENU_BY_CATEGORY_QUERY_RESULT[number]

type Props = {
  category: Category
  locale: Locale
}

/**
 * Restauracja — redesign menu (Figma). Układ dwukolumnowy na jasnym tle:
 * po lewej nagłówek kategorii (Westbourne serif) + opis, po prawej dania w
 * dwóch mniejszych kolumnach (grid-cols-2, flow wierszami). Każde danie:
 * nazwa uppercase → opis → cena pod spodem.
 */
export function MenuCategoryColumns({ category, locale }: Props) {
  const slug = category.slug
  if (!slug) return null

  const rawName = pickLocale(category.name, locale)
  // Konwencja Sanity: "Tytuł — podtytuł" → duży nagłówek + regular pod spodem.
  const [name, subtitle] = (() => {
    if (!rawName) return [rawName, undefined] as const
    const idx = rawName.indexOf(' — ')
    if (idx === -1) return [rawName, undefined] as const
    return [rawName.slice(0, idx), rawName.slice(idx + 3)] as const
  })()
  const description = pickLocale(category.description, locale)
  const items = category.items ?? []
  if (items.length === 0) return null

  return (
    <section id={slug} className="bg-bg text-ruby scroll-mt-32">
      <div className="layout-container py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          {/* Lewa kolumna — nagłówek + opis sekcji */}
          <header className="flex flex-col gap-4">
            <h2 className="font-accent text-[clamp(44px,5vw,72px)] tracking-normal">{name}</h2>
            {subtitle && <p className="text-lg font-normal">{subtitle}</p>}
            {description && (
              <p className="text-ruby/80 max-w-md text-base md:text-lg">{description}</p>
            )}
          </header>

          {/* Prawa strefa — dania w dwóch kolumnach (flow kolumnowy) */}
          <ul className="columns-1 gap-x-12 sm:columns-2">
            {items.map((item) => {
              const itemName = pickLocale(item.name, locale)
              const itemDesc = pickLocale(item.description, locale)
              return (
                <li
                  key={item._key}
                  className="mb-10 flex break-inside-avoid flex-col gap-3 last:mb-0"
                >
                  <h3 className="text-lg font-medium tracking-normal uppercase">{itemName}</h3>
                  {itemDesc && <p className="text-ruby/80 text-sm md:text-base">{itemDesc}</p>}
                  <div className="mt-1 text-lg tabular-nums">{item.price} zł</div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
