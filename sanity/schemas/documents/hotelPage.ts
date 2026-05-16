import { defineField, defineType } from 'sanity'

// Singleton — fixed ID 'hotelPage'.
// Layout zgodny z Figma "SEZAM - Hotel" (676:305).
// Lista pokoi pobierana z dokumentów roomType.
export const hotelPage = defineType({
  name: 'hotelPage',
  title: 'Strona: Hotel',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: '1. Hero',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow (np. "70+ miejsc noclegowych")' },
        { name: 'title', type: 'localeString', title: 'Tytuł' },
        { name: 'subtitle', type: 'localeText', title: 'Podtytuł' },
        { name: 'primaryCtaLabel', type: 'localeString', title: 'CTA główne (drawer)' },
        {
          name: 'secondaryCtaLabel',
          type: 'localeString',
          title: 'CTA drugorzędne (Zobacz pokoje)',
        },
        { name: 'image', type: 'imageWithAlt', title: 'Tło hero' },
      ],
    }),

    defineField({
      name: 'quote',
      title: '2. Cytat / hasło na pełnej szerokości',
      type: 'localeText',
    }),

    defineField({
      name: 'amenitiesSection',
      title: '4. "Dlaczego Hotel Sezam" — atuty',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow' },
        { name: 'title', type: 'localeString', title: 'Tytuł' },
        {
          name: 'items',
          type: 'array',
          title: 'Atuty',
          of: [
            {
              type: 'object',
              name: 'amenity',
              fields: [
                { name: 'title', type: 'localeString', title: 'Nazwa' },
                { name: 'description', type: 'localeText', title: 'Opis' },
              ],
              preview: { select: { title: 'title.pl', subtitle: 'description.pl' } },
            },
          ],
        },
      ],
    }),

    defineField({
      name: 'reservationSection',
      title: '5. CTA końcowe — rezerwacja noclegu',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow' },
        { name: 'title', type: 'localeString', title: 'Tytuł' },
        { name: 'description', type: 'localeText', title: 'Opis' },
        { name: 'ctaLabel', type: 'localeString', title: 'Etykieta CTA (drawer)' },
        { name: 'image', type: 'imageWithAlt', title: 'Zdjęcie boczne' },
      ],
    }),

    defineField({ name: 'seo', title: 'SEO', type: 'seoMeta' }),
  ],
  preview: { prepare: () => ({ title: 'Hotel' }) },
})
