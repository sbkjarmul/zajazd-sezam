import { defineField, defineType } from 'sanity'

// Singleton — jeden dokument o stałym ID 'homepage'.
// Layout sekcji zgodny z Figma "SEZAM - Landing Page" (676:1500).
export const homepage = defineType({
  name: 'homepage',
  title: 'Strona główna',
  type: 'document',
  fields: [
    defineField({
      name: 'headerLogo',
      title: 'Logo w headerze (SVG/PNG) — override dla tej strony',
      description:
        'Jeśli puste, używane jest defaultHeaderLogo z siteSettings (lub fallback tekstowy SEZAM).',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'hero',
      title: '1. Hero',
      type: 'hero',
    }),

    defineField({
      name: 'aboutSection',
      title: '2. Sekcja "O nas" + statystyki',
      type: 'object',
      fields: [
        { name: 'intro', type: 'localeText', title: 'Wprowadzenie' },
        {
          name: 'stats',
          type: 'array',
          title: 'Statystyki (zalecane: 4)',
          of: [
            {
              type: 'object',
              name: 'stat',
              fields: [
                { name: 'value', type: 'string', title: 'Liczba (np. "5000+")' },
                { name: 'label', type: 'localeString', title: 'Opis' },
              ],
              preview: { select: { title: 'value', subtitle: 'label.pl' } },
            },
          ],
        },
      ],
    }),

    defineField({
      name: 'servicesIntro',
      title: '3. Nagłówek sekcji usług',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow (np. "Nasze usługi")' },
        { name: 'title', type: 'localeString', title: 'Tytuł (np. "Odkryj Sezam")' },
      ],
    }),

    defineField({
      name: 'eventsBlock',
      title: '4. Blok: Imprezy okolicznościowe',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow' },
        { name: 'title', type: 'localeString', title: 'Tytuł' },
        { name: 'description', type: 'localeText', title: 'Opis' },
        { name: 'mainImage', type: 'imageWithAlt', title: 'Zdjęcie główne' },
        {
          name: 'secondaryImage',
          type: 'imageWithAlt',
          title: 'Zdjęcie drugorzędne (opcjonalnie)',
        },
        { name: 'ctaLabel', type: 'localeString', title: 'Etykieta CTA' },
      ],
    }),

    defineField({
      name: 'restaurantBlock',
      title: '5. Blok: Restauracja',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow' },
        { name: 'title', type: 'localeString', title: 'Tytuł' },
        { name: 'description', type: 'localeText', title: 'Opis' },
        { name: 'image', type: 'imageWithAlt', title: 'Zdjęcie (np. wnętrze / danie)' },
        { name: 'ctaLabel', type: 'localeString', title: 'Etykieta CTA (do menu)' },
      ],
    }),

    defineField({
      name: 'hotelBlock',
      title: '6. Blok: Hotel',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow' },
        { name: 'title', type: 'localeString', title: 'Tytuł' },
        { name: 'description', type: 'localeText', title: 'Opis' },
        {
          name: 'images',
          type: 'array',
          title: 'Zdjęcia pokoi (3 zalecane)',
          of: [{ type: 'imageWithAlt' }],
        },
        { name: 'ctaLabel', type: 'localeString', title: 'Etykieta CTA (drawer Rezerwuj)' },
      ],
    }),

    defineField({
      name: 'bistroBlock',
      title: '7. Blok: Bistro',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow' },
        { name: 'title', type: 'localeString', title: 'Tytuł' },
        { name: 'description', type: 'localeText', title: 'Opis' },
        { name: 'image', type: 'imageWithAlt', title: 'Zdjęcie' },
        { name: 'ctaLabel', type: 'localeString', title: 'Etykieta CTA' },
      ],
    }),

    defineField({
      name: 'reviewsBlock',
      title: '8. Blok: Opinie',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow (np. "Doświadczenie")' },
        { name: 'title', type: 'localeString', title: 'Tytuł' },
        { name: 'ratingValue', type: 'string', title: 'Średnia ocena (np. "4.4/5")' },
        { name: 'ratingSource', type: 'string', title: 'Źródło (np. "Google")' },
        {
          name: 'ratingCount',
          type: 'localeString',
          title: 'Opis liczby (np. "Na podstawie 1100+ opinii.")',
        },
      ],
    }),

    defineField({
      name: 'contactBlock',
      title: '9. Blok: Kontakt / CTA końcowe',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow' },
        { name: 'title', type: 'localeString', title: 'Tytuł' },
        { name: 'image', type: 'imageWithAlt', title: 'Zdjęcie boczne' },
        // Telefon, email, adres pobierane z siteSettings.
      ],
    }),

    defineField({ name: 'seo', title: 'SEO strony głównej', type: 'seoMeta' }),
  ],
  preview: {
    prepare: () => ({ title: 'Strona główna' }),
  },
})
