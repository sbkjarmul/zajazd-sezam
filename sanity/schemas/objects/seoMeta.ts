import { defineField, defineType } from 'sanity'

export const seoMeta = defineType({
  name: 'seoMeta',
  title: 'SEO Meta',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title (50–60 znaków)',
      type: 'object',
      fields: [
        {
          name: 'pl',
          title: 'Polski',
          type: 'string',
          validation: (r) => r.max(60).warning('Optymalna długość: 50–60 znaków'),
        },
        {
          name: 'en',
          title: 'English',
          type: 'string',
          validation: (r) => r.max(60).warning('Optimal length: 50–60 characters'),
        },
      ],
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description (140–160 znaków)',
      type: 'object',
      fields: [
        {
          name: 'pl',
          title: 'Polski',
          type: 'text',
          rows: 2,
          validation: (r) => r.max(160).warning('Optymalna długość: 140–160 znaków'),
        },
        {
          name: 'en',
          title: 'English',
          type: 'text',
          rows: 2,
          validation: (r) => r.max(160).warning('Optimal length: 140–160 characters'),
        },
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image (1200×630px)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'noIndex',
      title: 'Wyłącz indeksowanie',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
