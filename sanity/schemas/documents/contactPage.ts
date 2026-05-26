import { defineField, defineType } from 'sanity'

// Singleton — fixed ID 'contactPage'.
// NAP pobierany z siteSettings; etykiety pól per lokalizacja.
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
      name: 'heroImage',
      title: 'Hero — zdjęcie (wysokość 400px na pełną szerokość)',
      description:
        'Wyświetla się na samej górze strony /kontakt jako sekcja-blok obrazowy bez tekstu, z parallax-animacją (load reveal + scroll). Jeśli puste, sekcja nie renderuje się.',
      type: 'imageWithAlt',
    }),

    defineField({
      name: 'contactSection',
      title: 'Sekcja kontakt (NAP)',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow (np. "Skontaktuj się")' },
        { name: 'title', type: 'localeString', title: 'Tytuł' },
        { name: 'addressLabel', type: 'localeString', title: 'Etykieta adresu' },
        { name: 'phoneLabel', type: 'localeString', title: 'Etykieta telefonu' },
        { name: 'emailLabel', type: 'localeString', title: 'Etykieta emaila' },
      ],
    }),

    defineField({ name: 'seo', title: 'SEO', type: 'seoMeta' }),
  ],
  preview: { prepare: () => ({ title: 'Kontakt' }) },
})
