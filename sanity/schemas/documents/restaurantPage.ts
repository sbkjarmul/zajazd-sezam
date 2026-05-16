import { defineField, defineType } from 'sanity'

// Singleton — fixed ID 'restaurantPage'.
export const restaurantPage = defineType({
  name: 'restaurantPage',
  title: 'Strona: Restauracja',
  type: 'document',
  fields: [
    defineField({ name: 'hero', title: 'Hero', type: 'hero' }),
    defineField({
      name: 'intro',
      title: 'Wprowadzenie (charakter kuchni, atmosfera)',
      type: 'localeText',
    }),
    defineField({
      name: 'highlights',
      title: 'Wyróżniki kuchni',
      type: 'array',
      of: [{ type: 'localeString' }],
    }),
    defineField({
      name: 'gallery',
      title: 'Galeria zdjęć (wnętrze, dania)',
      type: 'array',
      of: [{ type: 'imageWithAlt' }],
    }),
    defineField({
      name: 'menuCtaLabel',
      title: 'Etykieta CTA do menu',
      type: 'localeString',
    }),
    defineField({ name: 'finalCta', title: 'CTA końcowe (drawer Rezerwuj)', type: 'ctaBlock' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoMeta' }),
  ],
  preview: {
    prepare: () => ({ title: 'Restauracja' }),
  },
})
