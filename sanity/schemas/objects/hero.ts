import { defineField, defineType } from 'sanity'

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Nagłówek (H1)',
      type: 'localeString',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'subheadline',
      title: 'Podtytuł',
      type: 'localeText',
    }),
    defineField({
      name: 'image',
      title: 'Zdjęcie hero (min. 1920×1080)',
      type: 'imageWithAlt',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'primaryCtaLabel',
      title: 'Etykieta głównego CTA (otwiera drawer Rezerwuj)',
      type: 'localeString',
    }),
  ],
})
