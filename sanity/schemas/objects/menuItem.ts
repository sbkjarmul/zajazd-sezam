import { defineField, defineType } from 'sanity'

const DIET_OPTIONS = [
  { title: 'Wegetariańskie', value: 'vegetarian' },
  { title: 'Wegańskie', value: 'vegan' },
  { title: 'Bezglutenowe', value: 'gluten-free' },
  { title: 'Bezlaktozowe', value: 'lactose-free' },
  { title: 'Ostre', value: 'spicy' },
]

// Pozycja menu jako OBIEKT osadzony w tablicy `menuCategory.items` — nie jako
// osobny dokument. Dzieki temu obsluga dodaje danie w tym samym miejscu, w
// ktorym edytuje kategorie: bez wyklikiwania referencji i bez wracania do
// osobnej listy 70 dokumentow. Kolejnosc = kolejnosc w tablicy (drag & drop),
// wiec pole `order` jest zbedne.
//
// Pola rzadko uzywane siedza w zwinietej grupie "Szczegoly", zeby dodanie
// pozycji sprowadzalo sie do wpisania nazwy (i ewentualnie ceny).
export const menuItem = defineType({
  name: 'menuItem',
  title: 'Pozycja menu',
  type: 'object',
  fieldsets: [
    {
      name: 'details',
      title: 'Szczegóły (opis, dieta, zdjęcie)',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Nazwa dania',
      type: 'localeString',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'price',
      title: 'Cena (PLN)',
      description: 'Opcjonalna. Restauracja podaje ceny; Bistro serwuje same listy dań bez cen.',
      type: 'number',
      validation: (r) => r.positive(),
    }),
    defineField({
      name: 'description',
      title: 'Opis (składniki, sposób przygotowania)',
      type: 'localeText',
      fieldset: 'details',
    }),
    defineField({
      name: 'diet',
      title: 'Diety specjalne',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: DIET_OPTIONS },
      fieldset: 'details',
    }),
    defineField({
      name: 'image',
      title: 'Zdjęcie dania (opcjonalnie)',
      type: 'imageWithAlt',
      fieldset: 'details',
    }),
    defineField({
      name: 'available',
      title: 'Dostępne w menu',
      description: 'Odznacz, żeby chwilowo ukryć danie na stronie bez kasowania go z listy.',
      type: 'boolean',
      initialValue: true,
      fieldset: 'details',
    }),
  ],
  preview: {
    select: { title: 'name.pl', price: 'price', available: 'available', media: 'image' },
    prepare: ({ title, price, available, media }) => ({
      title: title || 'Bez nazwy',
      subtitle: [price ? `${price} zł` : null, available === false ? 'ukryte' : null]
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
})
