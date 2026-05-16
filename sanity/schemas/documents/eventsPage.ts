import { defineField, defineType } from 'sanity'

export const eventsPage = defineType({
  name: 'eventsPage',
  title: 'Strona: Imprezy okolicznościowe',
  type: 'document',
  fields: [
    defineField({ name: 'hero', title: 'Hero', type: 'hero' }),
    defineField({ name: 'intro', title: 'Wprowadzenie', type: 'localeText' }),
    defineField({
      name: 'eventTypes',
      title: 'Typy imprez',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'eventType' }] }],
    }),
    defineField({
      name: 'halls',
      title: 'Sale eventowe',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'eventHall' }] }],
    }),
    defineField({ name: 'finalCta', title: 'CTA końcowe', type: 'ctaBlock' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoMeta' }),
  ],
  preview: { prepare: () => ({ title: 'Imprezy okolicznościowe' }) },
})
