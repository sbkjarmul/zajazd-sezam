import type { BISTRO_MENU_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { RevealText } from '@/components/RevealText'
import { pickLocale } from '@/lib/i18n/pickLocale'
import { categoryAnchor } from '@/lib/menu/categoryAnchor'

type Props = {
  categories: BISTRO_MENU_QUERY_RESULT
  heading: string
  locale: Locale
}

// Redesign wg Figma 1010:2 — sekcja "NASZE MENU" na jasnym tle. Każda
// kategoria to wiersz: po lewej nazwa (ruby-light, font-black uppercase) +
// ewentualny opis kategorii, po prawej lista pozycji (uppercase, ruby-light, waga
// regular). Wiersze rozdzielone pełnej szerokości liniami 1px (ruby-light
// #1a2789 — wg Figmy).
// Animacje: nagłówek fade, nazwy kategorii i pozycje odsłaniane spod maski
// (RevealText mode="lines" — SplitText, linia wyjeżdża spod niewidzialnej maski).
// Mobile i tablet (< lg) uzywaja mniejszej typografii — nazwa kategorii 36px,
// pozycje 18px (o 25% mniej niz docelowe 48/24px) — bo w pelnym rozmiarze
// pozycje lamaly sie na 2 wiersze. Tablet dzieli wiersz na dwie ROWNE kolumny
// (md:grid-cols-2); od lg wracaja rozmiary i proporcje z Figmy (prawa kolumna
// max 436px).
export function BistroMenuList({ categories, heading, locale }: Props) {
  const rendered = categories.filter((cat) => (cat.items ?? []).length > 0)
  if (rendered.length === 0) return null

  return (
    <section data-header-theme="light" className="bg-bg text-ruby-light">
      <div className="layout-container pt-16 md:pt-24">
        <RevealText
          as="h2"
          mode="fade"
          className="text-ruby-light text-center text-[clamp(44px,9vw,110px)] font-black tracking-tight uppercase md:tracking-[-0.03em]"
        >
          {heading}
        </RevealText>
      </div>

      {/* Linie pełnej szerokości (full-bleed), 1px, ruby-light (#1a2789 — Figma). */}
      <div className="border-ruby-light mt-10 border-t md:mt-16">
        {rendered.map((category) => {
          const name = pickLocale(category.name, locale)
          // Podtytul pod nazwa kategorii bierze sie z pola `description`
          // (np. Pierogi -> "Porcja 14 sztuk"). Wczesniej byl wciskany w nazwe
          // po separatorze " — " i rozbijany w kodzie — pole w Sanity bylo
          // pobierane, ale nigdzie nierysowane.
          const description = pickLocale(category.description, locale)
          const items = category.items ?? []
          return (
            <div key={category._id} className="border-ruby-light border-b">
              <div
                id={categoryAnchor(category.name)}
                className="layout-container grid scroll-mt-32 grid-cols-1 gap-8 py-8 md:grid-cols-2 md:items-start md:gap-16 md:py-10 lg:grid-cols-[1fr_minmax(0,436px)]"
              >
                <div className="flex flex-col gap-2">
                  <RevealText
                    as="h3"
                    mode="lines"
                    className="text-ruby-light text-[36px] font-black tracking-tight uppercase md:tracking-[-0.02em] lg:text-[64px]"
                  >
                    {name}
                  </RevealText>
                  {description && (
                    <p className="text-ruby-light text-base font-normal tracking-normal uppercase">
                      {description}
                    </p>
                  )}
                </div>

                <ul className="flex flex-col gap-3 md:gap-4">
                  {items.map((item, idx) => (
                    <RevealText
                      key={item._key}
                      as="li"
                      mode="lines"
                      delay={idx * 0.08}
                      start="top 90%"
                      className="text-[18px] leading-[1.1] font-normal tracking-tight uppercase lg:text-xl"
                    >
                      {pickLocale(item.name, locale)}
                    </RevealText>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
