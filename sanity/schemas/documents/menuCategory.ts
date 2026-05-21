import { defineField, defineType } from 'sanity'

export const menuCategory = defineType({
  name: 'menuCategory',
  title: 'Kategoria menu',
  type: 'document',
  fields: [
    defineField({
      name: 'cuisine',
      title: 'Branża (czyje menu)',
      description: 'Restauracja albo Bistro. Każda strona ma własny zestaw kategorii.',
      type: 'string',
      options: {
        list: [
          { title: 'Restauracja', value: 'restaurant' },
          { title: 'Bistro', value: 'bistro' },
        ],
        layout: 'radio',
      },
      initialValue: 'restaurant',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'name',
      title: 'Nazwa (np. Przystawki, Zupy)',
      type: 'localeString',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (do filtra w menu)',
      type: 'slug',
      options: { source: 'name.pl', maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Krótki opis kategorii (opcjonalnie)',
      type: 'localeText',
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
    select: { title: 'name.pl', subtitle: 'slug.current' },
  },
})
