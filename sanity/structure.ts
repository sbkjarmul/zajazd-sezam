import type { StructureResolver } from 'sanity/structure'
import { SINGLETON_IDS } from './schemas'

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
              singletonItem(S, 'contactPage', 'Kontakt'),
            ]),
        ),

      S.divider(),

      // === Ustawienia (singleton) ===
      singletonItem(S, 'siteSettings', 'Ustawienia witryny'),

      S.divider(),

      // === Restauracja (listy) ===
      S.listItem()
        .title('Restauracja')
        .id('restaurantGroup')
        .child(
          S.list()
            .title('Restauracja')
            .items([
              S.documentTypeListItem('menuCategory').title('Kategorie menu'),
              S.documentTypeListItem('menuItem').title('Pozycje menu'),
            ]),
        ),

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

      // === Konferencje (v2 — szkielet) ===
      S.listItem()
        .title('Konferencje (v2)')
        .id('conferencesGroup')
        .child(
          S.list()
            .title('Konferencje')
            .items([S.documentTypeListItem('conferenceRoom').title('Sale konferencyjne')]),
        ),

      S.divider(),

      // Wszystko inne (poza singletonami) — fallback
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !SINGLETON_SCHEMA_NAMES.includes(item.getId() as keyof typeof SINGLETON_IDS) &&
          ![
            'menuCategory',
            'menuItem',
            'eventType',
            'eventHall',
            'roomType',
            'conferenceRoom',
          ].includes(item.getId()!),
      ),
    ])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function singletonItem(S: any, schemaType: keyof typeof SINGLETON_IDS, title: string) {
  return S.listItem()
    .title(title)
    .id(schemaType)
    .child(S.document().schemaType(schemaType).documentId(SINGLETON_IDS[schemaType]).title(title))
}
