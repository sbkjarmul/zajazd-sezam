import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Ustawienia witryny',
  type: 'document',
  // Singleton — wymuszone w sanity/structure.ts (jeden dokument o stałym ID).
  fields: [
    defineField({
      name: 'companyName',
      title: 'Nazwa marki',
      type: 'localeString',
      initialValue: { pl: 'Zajazd Sezam', en: 'Zajazd Sezam' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'legalName',
      title: 'Pełna nazwa firmy (do JSON-LD / faktur)',
      type: 'string',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Krótki opis marki (1–2 zdania, do meta description)',
      type: 'localeText',
    }),

    defineField({
      name: 'address',
      title: 'Adres (NAP)',
      type: 'address',
      validation: (r) => r.required(),
    }),

    defineField({
      name: 'phone',
      title: 'Numer telefonu (E.164, np. +48155551234)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'receptionEmail',
      title: 'Email recepcji (formularze)',
      type: 'string',
      initialValue: 'recepcja@zajazdsezam.pl',
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: 'publicEmail',
      title: 'Email publiczny (stopka, kontakt)',
      type: 'string',
      validation: (r) => r.email(),
    }),

    defineField({
      name: 'openingHoursRestaurant',
      title: 'Godziny otwarcia — Restauracja',
      type: 'array',
      of: [{ type: 'openingHoursEntry' }],
    }),
    defineField({
      name: 'openingHoursReception',
      title: 'Godziny otwarcia — Recepcja Hotelu (24/7)',
      type: 'array',
      of: [{ type: 'openingHoursEntry' }],
    }),

    defineField({
      name: 'googleBusinessProfileUrl',
      title: 'URL wizytówki Google Business Profile',
      type: 'url',
    }),
    defineField({
      name: 'googleMapsUrl',
      title: 'Link do mapy Google (do CTA "zobacz na mapie")',
      type: 'url',
    }),

    defineField({
      name: 'defaultHeaderLogo',
      title: 'Domyślne logo w headerze (SVG/PNG, fallback dla stron bez własnego)',
      type: 'imageWithAlt',
    }),

    defineField({
      name: 'favicon',
      title: 'Favicon (ikona w zakładce przeglądarki)',
      description:
        'Najlepiej SVG lub kwadratowe PNG ≥ 192×192. Domyślnie używany jest /images/icons/sezam-hotel-brandmark.svg.',
      type: 'image',
    }),

    defineField({
      name: 'defaultSeo',
      title: 'Domyślny SEO (fallback dla stron bez własnego)',
      type: 'seoMeta',
    }),
  ],
  preview: {
    select: { title: 'companyName.pl' },
    prepare: ({ title }) => ({ title: title || 'Ustawienia witryny' }),
  },
})
