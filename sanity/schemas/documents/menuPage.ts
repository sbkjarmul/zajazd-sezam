import { defineField, defineType } from 'sanity'

// Singleton — fixed ID 'menuPage'. Zawiera tylko teksty otoczkowe;
// kategorie i pozycje pobierane są przez GROQ z menuCategory / menuItem.
export const menuPage = defineType({
  name: 'menuPage',
  title: 'Strona: Menu restauracji',
  type: 'document',
  fields: [
    defineField({ name: 'hero', title: 'Hero', type: 'hero' }),
    defineField({
      name: 'dietaryInfo',
      title: 'Informacja o dietach specjalnych',
      type: 'localeText',
    }),
    defineField({
      name: 'allergenInfo',
      title: 'Informacja o alergenach (opcjonalnie)',
      type: 'localeText',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoMeta' }),
  ],
  preview: { prepare: () => ({ title: 'Menu restauracji' }) },
})
