import { defineField, defineType } from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Strona: Kontakt',
  type: 'document',
  fields: [
    defineField({ name: 'hero', title: 'Hero (opcjonalnie)', type: 'hero' }),
    defineField({
      name: 'intro',
      title: 'Wprowadzenie / jak nas znaleźć',
      type: 'localeText',
    }),
    defineField({
      name: 'directions',
      title: 'Dojazd / wskazówki praktyczne (opcjonalnie)',
      type: 'localeText',
    }),
    // NAP, godziny, mapa pobierane przez GROQ z siteSettings.
    defineField({ name: 'seo', title: 'SEO', type: 'seoMeta' }),
  ],
  preview: { prepare: () => ({ title: 'Kontakt' }) },
})
