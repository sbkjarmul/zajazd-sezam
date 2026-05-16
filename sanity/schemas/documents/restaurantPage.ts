import { defineField, defineType } from 'sanity'

// Singleton — fixed ID 'restaurantPage'.
// Sekcje zgodne z Figma "SEZAM - Restauracja" (676:2181).
export const restaurantPage = defineType({
  name: 'restaurantPage',
  title: 'Strona: Restauracja',
  type: 'document',
  fields: [
    defineField({
      name: 'heroHeadline',
      title: '1. Hero — nagłówek (np. "ZJEDZ W SEZAMIE.")',
      type: 'localeString',
    }),
    defineField({
      name: 'heroImage',
      title: '1. Hero — zdjęcie pod nagłówkiem',
      type: 'imageWithAlt',
    }),

    defineField({
      name: 'pitchSection',
      title: '2. Sekcja pitcha',
      type: 'object',
      fields: [
        { name: 'text', type: 'localeText', title: 'Treść (centrowana, duża)' },
        { name: 'ctaLabel', type: 'localeString', title: 'Etykieta CTA' },
      ],
    }),

    defineField({
      name: 'craftSection',
      title: '3. Sekcja "Kulinarna sztuka"',
      type: 'object',
      fields: [
        { name: 'title', type: 'localeString', title: 'Tytuł' },
        { name: 'description', type: 'localeText', title: 'Opis' },
        { name: 'primaryImage', type: 'imageWithAlt', title: 'Zdjęcie główne (kwadratowe)' },
        { name: 'secondaryImage', type: 'imageWithAlt', title: 'Zdjęcie drugorzędne' },
        { name: 'ctaLabel', type: 'localeString', title: 'Etykieta CTA (do menu)' },
      ],
    }),

    defineField({
      name: 'ambianceSection',
      title: '4. Sekcja "Wnętrze i atmosfera"',
      type: 'object',
      fields: [
        { name: 'title', type: 'localeString', title: 'Tytuł' },
        { name: 'tagline', type: 'localeText', title: 'Krótki opis obok tytułu' },
        { name: 'ctaLabel', type: 'localeString', title: 'Etykieta CTA (Zarezerwuj stolik)' },
        { name: 'image', type: 'imageWithAlt', title: 'Zdjęcie panoramiczne' },
      ],
    }),

    defineField({
      name: 'reservationSection',
      title: '5. Sekcja: Zarezerwuj stolik',
      type: 'object',
      fields: [
        { name: 'title', type: 'localeString', title: 'Tytuł (np. "ZAREZERWUJ STOLIK")' },
        {
          name: 'description',
          type: 'localeText',
          title: 'Opis (np. "Zadzwoń, a nasz zespół…")',
        },
        // Telefon, godziny i adres pobierane z siteSettings.
      ],
    }),

    defineField({ name: 'seo', title: 'SEO', type: 'seoMeta' }),
  ],
  preview: { prepare: () => ({ title: 'Restauracja' }) },
})
