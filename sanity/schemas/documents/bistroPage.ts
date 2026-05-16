import { defineField, defineType } from 'sanity'

export const bistroPage = defineType({
  name: 'bistroPage',
  title: 'Strona: Bistro',
  type: 'document',
  fields: [
    defineField({ name: 'hero', title: 'Hero', type: 'hero' }),
    defineField({ name: 'intro', title: 'Wprowadzenie', type: 'localeText' }),
    defineField({
      name: 'highlights',
      title: 'Wyróżniki bistro',
      type: 'array',
      of: [{ type: 'localeString' }],
    }),
    defineField({
      name: 'openingHours',
      title: 'Godziny otwarcia bistro',
      type: 'array',
      of: [{ type: 'openingHoursEntry' }],
    }),
    defineField({
      name: 'gallery',
      title: 'Galeria',
      type: 'array',
      of: [{ type: 'imageWithAlt' }],
    }),
    defineField({ name: 'finalCta', title: 'CTA końcowe', type: 'ctaBlock' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoMeta' }),
  ],
  preview: { prepare: () => ({ title: 'Bistro' }) },
})
