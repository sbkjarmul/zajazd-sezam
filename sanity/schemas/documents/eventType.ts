import { defineField, defineType } from 'sanity'

export const eventType = defineType({
  name: 'eventType',
  title: 'Typ imprezy',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nazwa',
      type: 'localeString',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (wewnętrzny identyfikator, np. "wesele")',
      type: 'slug',
      options: { source: 'name.pl', maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Krótki opis',
      type: 'localeText',
    }),
    defineField({
      name: 'image',
      title: 'Zdjęcie reprezentacyjne (karuzela typów)',
      type: 'imageWithAlt',
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
