import { defineField, defineType } from 'sanity'

const DIET_OPTIONS = [
  { title: 'Wegetariańskie', value: 'vegetarian' },
  { title: 'Wegańskie', value: 'vegan' },
  { title: 'Bezglutenowe', value: 'gluten-free' },
  { title: 'Bezlaktozowe', value: 'lactose-free' },
  { title: 'Ostre', value: 'spicy' },
]

export const menuItem = defineType({
  name: 'menuItem',
  title: 'Pozycja menu',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nazwa dania',
      type: 'localeString',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Opis (składniki, sposób przygotowania)',
      type: 'localeText',
    }),
    defineField({
      name: 'price',
      title: 'Cena (PLN)',
      type: 'number',
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'category',
      title: 'Kategoria menu',
      type: 'reference',
      to: [{ type: 'menuCategory' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'diet',
      title: 'Diety specjalne',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: DIET_OPTIONS, layout: 'tags' },
    }),
    defineField({
      name: 'image',
      title: 'Zdjęcie dania (opcjonalnie)',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'order',
      title: 'Kolejność w kategorii',
      type: 'number',
      initialValue: 100,
    }),
    defineField({
      name: 'available',
      title: 'Dostępne w menu',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Kategoria + kolejność',
      name: 'categoryOrder',
      by: [
        { field: 'category.name.pl', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'name.pl', price: 'price', category: 'category.name.pl', media: 'image' },
    prepare: ({ title, price, category, media }) => ({
      title,
      subtitle: `${category || '—'} · ${price ? price + ' zł' : 'brak ceny'}`,
      media,
    }),
  },
})
