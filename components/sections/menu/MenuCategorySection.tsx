import type { MENU_BY_CATEGORY_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { pickLocale } from '@/lib/i18n/pickLocale'
import { cn } from '@/lib/utils'

type Category = MENU_BY_CATEGORY_QUERY_RESULT[number]

type Props = {
  category: Category
  locale: Locale
  index: number
  forceTheme?: 'dark' | 'light'
}

function sectionTheme(index: number): 'dark' | 'light' {
  if (index < 2 || index >= 5) return 'dark'
  return 'light'
}

export function MenuCategorySection({ category, locale, index, forceTheme }: Props) {
  const slug = category.slug
  if (!slug) return null

  const name = pickLocale(category.name, locale)
  const description = pickLocale(category.description, locale)
  const items = category.items ?? []
  const accentImage = items.find((i) => i.image?.asset?.url)?.image
  const theme = forceTheme ?? sectionTheme(index)
  const isDark = theme === 'dark'
  const imageOnLeft = index % 2 === 0

  return (
    <section
      id={slug}
      className={cn('scroll-mt-48', isDark ? 'text-text-inverse' : 'text-secondary')}
      style={{
        background: isDark ? 'var(--color-dark-ruby)' : 'var(--color-light)',
      }}
    >
      <div className="layout-container py-16 md:py-24">
        {accentImage ? (
          <div
            className={cn(
              'flex flex-col items-center gap-10 lg:flex-row lg:gap-20',
              !imageOnLeft && 'lg:flex-row-reverse',
            )}
          >
            <div className="relative aspect-square w-full overflow-hidden lg:w-1/2">
              <SanityImage
                image={accentImage}
                locale={locale}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="flex w-full flex-col gap-8 lg:w-1/2 lg:gap-10">
              <header className="flex flex-col gap-4">
                <h2 className="text-4xl leading-none font-bold tracking-tight uppercase md:text-5xl md:tracking-[-0.03em] lg:text-[64px]">
                  {name}
                </h2>
                {description && (
                  <p className="text-lg leading-[1.2] md:text-2xl">{description}</p>
                )}
              </header>

              <ul className="flex flex-col gap-4">
                {items.map((item) => {
                  const itemName = pickLocale(item.name, locale)
                  const itemDesc = pickLocale(item.description, locale)
                  return (
                    <li
                      key={item._id}
                      className="flex items-center justify-between gap-6"
                    >
                      <div className="flex min-w-0 flex-1 flex-col">
                        <h3 className="text-xl font-bold tracking-tight uppercase md:text-2xl md:tracking-[-0.03em]">
                          {itemName}
                        </h3>
                        {itemDesc && (
                          <p
                            className={cn(
                              'text-xs leading-[1.2]',
                              isDark ? 'text-text-inverse/70' : 'text-secondary/70',
                            )}
                          >
                            {itemDesc}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 text-xl tabular-nums md:text-2xl">
                        {item.price} zł
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-12 md:gap-16">
            <header className="flex max-w-3xl flex-col gap-3 md:gap-4">
              <h2 className="text-4xl leading-none font-bold tracking-tight uppercase md:text-6xl md:tracking-[-0.03em] lg:text-[80px]">
                {name}
              </h2>
              {description && (
                <p className="text-base leading-[1.2] md:text-lg">{description}</p>
              )}
            </header>

            <ul className="md:columns-2 md:gap-x-16">
              {items.map((item) => {
                const itemName = pickLocale(item.name, locale)
                const itemDesc = pickLocale(item.description, locale)
                return (
                  <li
                    key={item._id}
                    className="mb-8 flex items-start justify-between gap-6 break-inside-avoid last:mb-0"
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <h3 className="text-lg font-bold tracking-tight uppercase md:text-2xl md:tracking-[-0.03em]">
                        {itemName}
                      </h3>
                      {itemDesc && (
                        <p
                          className={cn(
                            'text-sm leading-[1.2] md:text-base',
                            isDark ? 'text-text-inverse/70' : 'text-secondary/70',
                          )}
                        >
                          {itemDesc}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 text-lg tabular-nums md:text-xl">
                      {item.price} zł
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
