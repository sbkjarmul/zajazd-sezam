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
      name: 'contactSection',
      title: 'Sekcja kontakt (NAP)',
      type: 'object',
      description:
        'Ciemna sekcja "Skontaktuj się": eyebrow + tytuł (serif akcentowy), tabela telefonów per branża oraz adres i email. Numery, adres i email pobierane z siteSettings — tutaj tylko etykiety.',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow (np. "Porozmawiajmy")' },
        { name: 'title', type: 'localeString', title: 'Tytuł (serif akcentowy, np. "Skontaktuj się")' },
        { name: 'phoneLabel', type: 'localeString', title: 'Nagłówek kolumny telefonów (np. "Telefony")' },
        { name: 'receptionLabel', type: 'localeString', title: 'Etykieta linii — Recepcja' },
        { name: 'restaurantLabel', type: 'localeString', title: 'Etykieta linii — Restauracja' },
        { name: 'bistroLabel', type: 'localeString', title: 'Etykieta linii — Bistro' },
        { name: 'hotelLabel', type: 'localeString', title: 'Etykieta linii — Hotel' },
        { name: 'eventsLabel', type: 'localeString', title: 'Etykieta linii — Imprezy' },
        { name: 'addressLabel', type: 'localeString', title: 'Etykieta adresu' },
        { name: 'emailLabel', type: 'localeString', title: 'Etykieta emaila' },
      ],
    }),

    defineField({ name: 'seo', title: 'SEO', type: 'seoMeta' }),
  ],
  preview: { prepare: () => ({ title: 'Kontakt' }) },
})
