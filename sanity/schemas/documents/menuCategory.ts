import { defineField, defineType } from 'sanity'

export const menuCategory = defineType({
  name: 'menuCategory',
  title: 'Kategoria menu',
  type: 'document',
  fields: [
    // Pole techniczne: Restauracja i Bistro to ten sam typ dokumentu, a
    // rozdziela je wylacznie ta wartosc — filtry GROQ, listy w Studio i podglad
    // kategorii wszystkie po niej filtruja.
    //
    // Obsluga go nie widzi: kategorie tworzy sie z listy "Restauracja" albo
    // "Bistro", a szablon `menuCategory-by-cuisine` (sanity.config.ts) ustawia
    // branze z gory. Pole odslania sie TYLKO gdy jest puste — czyli gdy
    // dokument powstal poza tymi listami — zeby dalo sie go naprawic zamiast
    // zostac z niewidoczna kategoria, ktorej nie widac na zadnej stronie.
    //
    // Brak `initialValue` jest celowy: cichy domysl 'restaurant' wrzucalby
    // takie sieroty do menu restauracji zamiast je ujawnic.
    defineField({
      name: 'cuisine',
      title: 'Branża (czyje menu)',
      description:
        'Ustawiane automatycznie przy tworzeniu kategorii z listy Restauracja albo Bistro.',
      type: 'string',
      options: {
        list: [
          { title: 'Restauracja', value: 'restaurant' },
          { title: 'Bistro', value: 'bistro' },
        ],
        layout: 'radio',
      },
      hidden: ({ document }) => Boolean(document?.cuisine),
      validation: (r) => r.required(),
    }),
    // Kotwica sekcji (`id` w HTML) nie jest osobnym polem — powstaje z nazwy
    // przez `categoryAnchor()` przy renderowaniu. Dawny `slug` byl wymagany i
    // klient musial klikac "Generate", a sluzyl wylacznie za ten `id`.
    defineField({
      name: 'name',
      title: 'Nazwa (np. Przystawki, Zupy)',
      type: 'localeString',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Krótki opis kategorii (opcjonalnie)',
      type: 'localeText',
    }),
    defineField({
      name: 'items',
      title: 'Pozycje menu',
      description:
        'Dania w tej kategorii. Kolejność ustawiasz przeciągając pozycje — tak samo wyświetlą się na stronie.',
      type: 'array',
      of: [{ type: 'menuItem' }],
    }),
    defineField({
      name: 'order',
      title: 'Kolejność wyświetlania',
      type: 'number',
      initialValue: 100,
    }),
  ],
  orderings: [{ title: 'Kolejność', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name.pl', cuisine: 'cuisine', items: 'items' },
    prepare: ({ title, cuisine, items }) => ({
      title,
      subtitle: `${cuisine === 'bistro' ? 'Bistro' : 'Restauracja'} · ${(items ?? []).length} poz.`,
    }),
  },
})
