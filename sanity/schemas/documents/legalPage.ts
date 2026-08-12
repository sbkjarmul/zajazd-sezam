import { defineField, defineType } from 'sanity'

// Strona prawna (Regulamin, Polityka prywatnosci). JEDEN typ, dwie stale
// instancje (ID 'regulamin' oraz 'polityka-prywatnosci' — patrz LEGAL_PAGE_IDS
// w schemas/index.ts i sanity/structure.ts). Tresc jako localeText (projekt nie
// uzywa PortableText); render z `whitespace-pre-line` zachowuje akapity/wciecia.
export const legalPage = defineType({
  name: 'legalPage',
  title: 'Strona prawna',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tytuł (H1)',
      type: 'localeString',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Wstęp (opcjonalny akapit pod tytułem)',
      type: 'localeText',
    }),
    defineField({
      name: 'body',
      title: 'Treść',
      description: 'Pełny tekst dokumentu. Puste linie = odstępy między akapitami.',
      type: 'localeText',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoMeta' }),
  ],
  preview: {
    select: { pl: 'title.pl', en: 'title.en' },
    prepare: ({ pl, en }) => ({ title: pl || en || 'Strona prawna' }),
  },
})
