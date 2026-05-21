import { defineField, defineType } from 'sanity'

// Singleton — fixed ID 'bistroPage'.
// Layout zgodny z Figma "SEZAM - Bistro" (676:3251).
// Menu pobierane z menuCategory (kategorie: dania-miesne, ryby, wege).
export const bistroPage = defineType({
  name: 'bistroPage',
  title: 'Strona: Bistro',
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
      name: 'heroHeadline',
      title: '1. Hero — nagłówek',
      type: 'localeString',
    }),
    defineField({
      name: 'menuIntroHeading',
      title: '2. Intro menu — nagłówek (np. "Menu")',
      type: 'localeString',
    }),
    defineField({
      name: 'menuIntroBody',
      title: '3. Intro menu — opis',
      type: 'localeText',
    }),
    defineField({
      name: 'centralBanner',
      title: '4. Banner środkowy (np. "JESTEŚMY OTWARCI CODZIENNIE!")',
      type: 'localeString',
    }),
    defineField({
      name: 'hoursText',
      title: '5. Godziny otwarcia (tekst, łamania linii zachowane)',
      type: 'localeText',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoMeta' }),
  ],
  preview: { prepare: () => ({ title: 'Bistro' }) },
})
