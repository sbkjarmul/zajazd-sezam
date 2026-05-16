import { defineField, defineType } from 'sanity'

export const hotelPage = defineType({
  name: 'hotelPage',
  title: 'Strona: Hotel',
  type: 'document',
  fields: [
    defineField({ name: 'hero', title: 'Hero', type: 'hero' }),
    defineField({ name: 'intro', title: 'Wprowadzenie', type: 'localeText' }),
    defineField({
      name: 'amenities',
      title: 'Atuty obiektu (sauna, recepcja 24/7, parking, …)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'amenity',
          fields: [
            { name: 'title', type: 'localeString', title: 'Nazwa' },
            { name: 'description', type: 'localeText', title: 'Opis (opcjonalnie)' },
          ],
          preview: { select: { title: 'title.pl' } },
        },
      ],
    }),
    defineField({
      name: 'rooms',
      title: 'Typy pokoi (referencje)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'roomType' }] }],
    }),
    defineField({ name: 'finalCta', title: 'CTA końcowe (drawer Rezerwuj)', type: 'ctaBlock' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoMeta' }),
  ],
  preview: { prepare: () => ({ title: 'Hotel' }) },
})
