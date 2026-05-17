import { defineField, defineType } from 'sanity'

// Singleton — fixed ID 'contactPage'.
// NAP, godziny i koordynaty mapy pobierane z siteSettings.
export const contactPage = defineType({
  name: 'contactPage',
  title: 'Strona: Kontakt',
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
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow' },
        { name: 'title', type: 'localeString', title: 'Tytuł (H1)' },
        { name: 'subtitle', type: 'localeText', title: 'Podtytuł' },
        { name: 'image', type: 'imageWithAlt', title: 'Tło hero (opcjonalnie)' },
      ],
    }),

    defineField({
      name: 'contactSection',
      title: '2. Sekcja kontakt (NAP + godziny)',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow (np. "Skontaktuj się")' },
        { name: 'title', type: 'localeString', title: 'Tytuł' },
        { name: 'addressLabel', type: 'localeString', title: 'Etykieta adresu' },
        { name: 'phoneLabel', type: 'localeString', title: 'Etykieta telefonu' },
        { name: 'emailLabel', type: 'localeString', title: 'Etykieta emaila' },
        {
          name: 'restaurantHoursLabel',
          type: 'localeString',
          title: 'Etykieta godzin restauracji',
        },
        {
          name: 'receptionHoursLabel',
          type: 'localeString',
          title: 'Etykieta godzin recepcji',
        },
      ],
    }),

    defineField({
      name: 'mapSection',
      title: '3. Sekcja mapa',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow (np. "Jak nas znaleźć")' },
        { name: 'title', type: 'localeString', title: 'Tytuł' },
        {
          name: 'mapImage',
          type: 'imageWithAlt',
          title: 'Statyczny obraz mapy (placeholder do czasu Maps Embed w F8)',
        },
        {
          name: 'googleMapsLinkLabel',
          type: 'localeString',
          title: 'Etykieta linku "Otwórz w Mapach Google"',
        },
      ],
    }),

    defineField({
      name: 'directionsSection',
      title: '4. Sekcja dojazd (wskazówki praktyczne)',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow (np. "Dojazd")' },
        { name: 'title', type: 'localeString', title: 'Tytuł' },
        { name: 'content', type: 'localeText', title: 'Wskazówki dojazdu' },
      ],
    }),

    defineField({
      name: 'finalCta',
      title: '5. CTA końcowe (drawer Rezerwuj)',
      type: 'ctaBlock',
    }),

    defineField({ name: 'seo', title: 'SEO', type: 'seoMeta' }),
  ],
  preview: { prepare: () => ({ title: 'Kontakt' }) },
})
