import { defineField, defineType } from 'sanity'

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Nagłówek (H1) — desktop',
      type: 'localeString',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'headlineMobile',
      title: 'Nagłówek (H1) — mobile (opcjonalny override)',
      description:
        'Krótszy wariant nagłówka pokazywany do md (< 768px). Jeśli puste — używa wariantu desktop.',
      type: 'localeString',
    }),
    defineField({
      name: 'subheadline',
      title: 'Podtytuł — desktop',
      type: 'localeText',
    }),
    defineField({
      name: 'subheadlineMobile',
      title: 'Podtytuł — mobile (opcjonalny override)',
      description: 'Krótszy podtytuł pokazywany do md. Jeśli puste — używa wariantu desktop.',
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
