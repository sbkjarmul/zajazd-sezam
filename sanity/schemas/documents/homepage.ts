import { defineField, defineType } from 'sanity'

// Singleton — jeden dokument o stałym ID 'homepage'.
// Sekcje strony głównej zgodne z PRD sekcja 4.1.
export const homepage = defineType({
  name: 'homepage',
  title: 'Strona główna',
  type: 'document',
  fields: [
    defineField({ name: 'hero', title: '1. Hero', type: 'hero' }),

    defineField({
      name: 'problemSection',
      title: '2. Problem / Empatia (3 karty)',
      type: 'object',
      fields: [
        { name: 'title', type: 'localeString', title: 'Tytuł sekcji' },
        {
          name: 'cards',
          type: 'array',
          title: 'Karty (zalecane: 3)',
          of: [
            {
              type: 'object',
              name: 'problemCard',
              fields: [
                { name: 'title', type: 'localeString', title: 'Tytuł' },
                { name: 'description', type: 'localeText', title: 'Opis' },
              ],
              preview: { select: { title: 'title.pl' } },
            },
          ],
          validation: (r) => r.length(3),
        },
      ],
    }),

    defineField({
      name: 'solutionSection',
      title: '3. Rozwiązanie (4 filary)',
      type: 'object',
      fields: [
        { name: 'title', type: 'localeString', title: 'Tytuł sekcji' },
        { name: 'description', type: 'localeText', title: 'Wstęp' },
        {
          name: 'pillars',
          type: 'array',
          title: 'Filary (zalecane: 4)',
          of: [
            {
              type: 'object',
              name: 'pillar',
              fields: [
                { name: 'title', type: 'localeString', title: 'Tytuł' },
                { name: 'description', type: 'localeText', title: 'Opis' },
              ],
              preview: { select: { title: 'title.pl' } },
            },
          ],
          validation: (r) => r.length(4),
        },
      ],
    }),

    defineField({
      name: 'eventHallsSection',
      title: '4. Sale eventowe (z CTA do drawera)',
      type: 'object',
      fields: [
        { name: 'title', type: 'localeString', title: 'Tytuł sekcji' },
        { name: 'description', type: 'localeText', title: 'Wstęp' },
        {
          name: 'halls',
          type: 'array',
          title: 'Sale do wyświetlenia',
          of: [{ type: 'reference', to: [{ type: 'eventHall' }] }],
        },
        { name: 'ctaLabel', type: 'localeString', title: 'Etykieta CTA' },
      ],
    }),

    defineField({
      name: 'restaurantSection',
      title: '5. Restauracja (zdjęcia dań)',
      type: 'object',
      fields: [
        { name: 'title', type: 'localeString', title: 'Tytuł sekcji' },
        { name: 'description', type: 'localeText', title: 'Wstęp' },
        {
          name: 'dishImages',
          type: 'array',
          title: 'Zdjęcia dań (3–4)',
          of: [{ type: 'imageWithAlt' }],
        },
        { name: 'menuLinkLabel', type: 'localeString', title: 'Etykieta linka do menu' },
      ],
    }),

    defineField({
      name: 'stepsSection',
      title: '6. Plan 3 kroków',
      type: 'object',
      fields: [
        { name: 'title', type: 'localeString', title: 'Tytuł sekcji' },
        {
          name: 'steps',
          type: 'array',
          title: 'Kroki (zalecane: 3)',
          of: [
            {
              type: 'object',
              name: 'step',
              fields: [
                { name: 'title', type: 'localeString', title: 'Tytuł kroku' },
                { name: 'description', type: 'localeText', title: 'Opis' },
              ],
              preview: { select: { title: 'title.pl' } },
            },
          ],
          validation: (r) => r.length(3),
        },
      ],
    }),

    defineField({
      name: 'reviewsSection',
      title: '7. Referencje (Google Reviews)',
      type: 'object',
      fields: [
        { name: 'title', type: 'localeString', title: 'Tytuł sekcji' },
        {
          name: 'description',
          type: 'localeText',
          title: 'Wstęp (opcjonalnie)',
        },
        // Same opinie pobierane są z Google Places API w lib/googleReviews.ts.
      ],
    }),

    defineField({
      name: 'hotelUpsellSection',
      title: '8. Hotel (upsell)',
      type: 'object',
      fields: [
        { name: 'title', type: 'localeString', title: 'Tytuł sekcji' },
        { name: 'description', type: 'localeText', title: 'Wstęp' },
        { name: 'image', type: 'imageWithAlt', title: 'Zdjęcie' },
        { name: 'ctaLabel', type: 'localeString', title: 'Etykieta CTA' },
      ],
    }),

    defineField({ name: 'finalCta', title: '9. CTA końcowe', type: 'ctaBlock' }),

    defineField({ name: 'seo', title: 'SEO strony głównej', type: 'seoMeta' }),
  ],
  preview: {
    prepare: () => ({ title: 'Strona główna' }),
  },
})
