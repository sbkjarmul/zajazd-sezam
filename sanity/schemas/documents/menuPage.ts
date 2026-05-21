import { defineField, defineType } from 'sanity'

// Singleton — fixed ID 'menuPage'.
// Layout zgodny z Figma "SEZAM - Menu Restauracja" (676:2407).
// Kategorie i pozycje menu pobierane z menuCategory / menuItem.
export const menuPage = defineType({
  name: 'menuPage',
  title: 'Strona: Menu restauracji',
  type: 'document',
  fields: [
    // Logo w headerze pochodzi zawsze z restaurantPage.headerLogo
    // (z fallbackiem do siteSettings.defaultHeaderLogo). Menu nie ma własnego override.
    defineField({
      name: 'pageIntro',
      title: '1. Hero (intro strony)',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow (np. "Nasze menu")' },
        { name: 'title', type: 'localeString', title: 'Tytuł (duży)' },
        { name: 'subtitle', type: 'localeText', title: 'Podtytuł' },
        { name: 'ctaLabel', type: 'localeString', title: 'Etykieta CTA (scroll do menu)' },
      ],
    }),
    defineField({
      name: 'photoStrip',
      title: '2. Pasek 4 zdjęć (wizualny break)',
      type: 'array',
      of: [{ type: 'imageWithAlt' }],
      validation: (r) => r.max(4),
    }),
    defineField({
      name: 'reservationSection',
      title: '3. Sekcja: Zarezerwuj stolik',
      type: 'object',
      fields: [
        { name: 'title', type: 'localeString', title: 'Tytuł' },
        { name: 'description', type: 'localeText', title: 'Opis' },
      ],
    }),
    defineField({
      name: 'dietaryInfo',
      title: 'Informacja o dietach (opcjonalnie)',
      type: 'localeText',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoMeta' }),
  ],
  preview: { prepare: () => ({ title: 'Menu restauracji' }) },
})
