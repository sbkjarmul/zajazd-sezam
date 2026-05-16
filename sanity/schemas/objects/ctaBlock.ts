import { defineField, defineType } from 'sanity'

export const ctaBlock = defineType({
  name: 'ctaBlock',
  title: 'Blok CTA',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Tytuł',
      type: 'localeString',
    }),
    defineField({
      name: 'description',
      title: 'Opis',
      type: 'localeText',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Etykieta przycisku (otwiera drawer Rezerwuj)',
      type: 'localeString',
    }),
  ],
})
