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
      name: 'heroHeadline',
      title: '1. Hero — nagłówek',
      type: 'localeString',
    }),
    defineField({
      name: 'centralBanner',
      title: '2. Banner środkowy (np. "JESTEŚMY OTWARCI CODZIENNIE!")',
      type: 'localeString',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoMeta' }),
  ],
  preview: { prepare: () => ({ title: 'Bistro' }) },
})
