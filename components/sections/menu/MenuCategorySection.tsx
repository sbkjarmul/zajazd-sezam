import type { MENU_BY_CATEGORY_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Category = MENU_BY_CATEGORY_QUERY_RESULT[number]

type Props = {
  category: Category
  locale: Locale
}

const DIET_LABEL_KEYS: Record<string, string> = {
  vegetarian: 'menu.diet.vegetarian',
  vegan: 'menu.diet.vegan',
  'gluten-free': 'menu.diet.glutenFree',
  'lactose-free': 'menu.diet.lactoseFree',
  spicy: 'menu.diet.spicy',
}

export function MenuCategorySection({ category, locale }: Props) {
  const t = useTranslations()
  const slug = category.slug
  if (!slug) return null

  const name = pickLocale(category.name, locale)
  const description = pickLocale(category.description, locale)
  const items = category.items ?? []

  return (
    <section id={slug} className="bg-bg scroll-mt-32 py-16 md:py-24">
      <div className="flex flex-col gap-4 pb-8">
        <h2 className="text-text text-4xl font-light tracking-tight uppercase md:text-6xl">
          {name}
        </h2>
        {description && <p className="text-text-muted max-w-2xl text-xl">{description}</p>}
      </div>

      <ul className="flex flex-col">
        {items.map((item) => {
          const itemName = pickLocale(item.name, locale)
          const itemDesc = pickLocale(item.description, locale)
          const diets = item.diet ?? []
          return (
            <li
              key={item._id}
              className="border-border-subtle flex items-start justify-between gap-6 border-b py-4 last:border-b-0"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h3 className="text-text text-xl">{itemName}</h3>
                  {diets.length > 0 && (
                    <span className="text-accent text-xs tracking-wider uppercase">
                      {diets.map((d) => t(DIET_LABEL_KEYS[d] ?? d)).join(' · ')}
                    </span>
                  )}
                </div>
                {itemDesc && <p className="text-text-muted text-sm">{itemDesc}</p>}
              </div>
              <div className="text-text shrink-0 text-xl tabular-nums">{item.price} zł</div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
