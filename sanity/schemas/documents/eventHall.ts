import { defineField, defineType } from 'sanity'

export const eventHall = defineType({
  name: 'eventHall',
  title: 'Sala eventowa',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nazwa sali (np. Sala Bankietowa, Sala Złota)',
      type: 'localeString',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (do referencji w formularzu eventu)',
      type: 'slug',
      options: { source: 'name.pl', maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'capacity',
      title: 'Pojemność (liczba gości)',
      type: 'number',
      validation: (r) => r.required().positive().integer(),
    }),
    defineField({
      name: 'description',
      title: 'Opis sali',
      type: 'localeText',
    }),
    defineField({
      name: 'amenities',
      title: 'Wyposażenie / atuty',
      type: 'array',
      of: [{ type: 'localeString' }],
    }),
    defineField({
      name: 'images',
      title: 'Galeria zdjęć',
      type: 'array',
      of: [{ type: 'imageWithAlt' }],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'order',
      title: 'Kolejność wyświetlania',
      type: 'number',
      initialValue: 100,
    }),
    defineField({
      name: 'suitableFor',
      title: 'Pasująca do typów imprez',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'eventType' }] }],
    }),
  ],
  orderings: [{ title: 'Kolejność', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name.pl', capacity: 'capacity', media: 'images.0' },
    prepare: ({ title, capacity, media }) => ({
      title,
      subtitle: capacity ? `do ${capacity} osób` : 'pojemność nieokreślona',
      media,
    }),
  },
})
