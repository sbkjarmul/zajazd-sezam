import type { StructureResolver } from 'sanity/structure'
import { SINGLETON_IDS, LEGAL_PAGE_IDS } from './schemas'

// Singleton schemas — zawsze otwierane jako jeden dokument o stałym ID.
const SINGLETON_SCHEMA_NAMES = Object.keys(SINGLETON_IDS) as Array<keyof typeof SINGLETON_IDS>

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Treści')
    .items([
      // === Strony (singletons) ===
      S.listItem()
        .title('Strony')
        .id('pages')
        .child(
          S.list()
            .title('Strony')
            .items([
              singletonItem(S, 'homepage', 'Strona główna'),
              singletonItem(S, 'restaurantPage', 'Restauracja'),
              singletonItem(S, 'menuPage', 'Menu restauracji'),
              singletonItem(S, 'bistroPage', 'Bistro'),
              singletonItem(S, 'hotelPage', 'Hotel'),
              singletonItem(S, 'eventsPage', 'Imprezy okolicznościowe'),
              singletonItem(S, 'galleryPage', 'Galeria'),
              singletonItem(S, 'contactPage', 'Kontakt'),
            ]),
        ),

      // === Strony prawne (jeden typ, dwie stałe instancje) ===
      S.listItem()
        .title('Strony prawne')
        .id('legalPages')
        .child(
          S.list()
            .title('Strony prawne')
            .items([
              legalItem(S, LEGAL_PAGE_IDS.terms, 'Regulamin'),
              legalItem(S, LEGAL_PAGE_IDS.privacy, 'Polityka prywatności'),
            ]),
        ),

      S.divider(),

      // === Ustawienia (singleton) ===
      singletonItem(S, 'siteSettings', 'Ustawienia witryny'),

      S.divider(),

      // === Restauracja (listy) ===
      // Kategorie obu branz to ten sam typ `menuCategory`, rozrozniany polem
      // `cuisine`. Rozdzielamy je na dwie listy, zeby obsluga nie przegladala
      // kategorii bistro szukajac dania z restauracji. Pozycje menu nie maja
      // wlasnej listy — siedza w tablicy `items` wewnatrz kategorii.
      S.listItem()
        .title('Restauracja')
        .id('restaurantGroup')
        .child(menuCategoryList(S, 'restaurant', 'Restauracja')),

      // === Bistro (listy) ===
      S.listItem()
        .title('Bistro')
        .id('bistroGroup')
        .child(menuCategoryList(S, 'bistro', 'Bistro')),

      // === Imprezy (listy) ===
      S.listItem()
        .title('Imprezy')
        .id('eventsGroup')
        .child(
          S.list()
            .title('Imprezy')
            .items([
              S.documentTypeListItem('eventType').title('Typy imprez'),
              S.documentTypeListItem('eventHall').title('Sale eventowe'),
            ]),
        ),

      // === Hotel (listy) ===
      S.listItem()
        .title('Hotel')
        .id('hotelGroup')
        .child(
          S.list()
            .title('Hotel')
            .items([S.documentTypeListItem('roomType').title('Typy pokoi')]),
        ),

      S.divider(),

      // Wszystko inne (poza singletonami) — fallback
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !SINGLETON_SCHEMA_NAMES.includes(item.getId() as keyof typeof SINGLETON_IDS) &&
          !['menuCategory', 'eventType', 'eventHall', 'roomType', 'legalPage'].includes(
            item.getId()!,
          ),
      ),
    ])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function singletonItem(S: any, schemaType: keyof typeof SINGLETON_IDS, title: string) {
  return S.listItem()
    .title(title)
    .id(schemaType)
    .child(S.document().schemaType(schemaType).documentId(SINGLETON_IDS[schemaType]).title(title))
}

// Stała instancja typu `legalPage` o zadanym ID (regulamin / polityka-prywatnosci).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function legalItem(S: any, id: string, title: string) {
  return S.listItem()
    .title(title)
    .id(id)
    .child(S.document().schemaType('legalPage').documentId(id).title(title))
}

// Lista kategorii menu jednej branzy. `initialValueTemplates` sprawia, ze nowa
// kategoria tworzona z tej listy ma juz ustawione `cuisine` — obsluga nie musi
// pamietac o radiu i nie doda dania bistro do menu restauracji.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function menuCategoryList(S: any, cuisine: 'restaurant' | 'bistro', title: string) {
  return S.documentTypeList('menuCategory')
    .title(`${title} — kategorie menu`)
    .filter('_type == "menuCategory" && cuisine == $cuisine')
    .params({ cuisine })
    .defaultOrdering([{ field: 'order', direction: 'asc' }])
    .initialValueTemplates([S.initialValueTemplateItem('menuCategory-by-cuisine', { cuisine })])
}
