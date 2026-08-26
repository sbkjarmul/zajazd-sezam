import { defineField, defineType } from 'sanity'

// Opinia gościa wyświetlana w taśmie na stronie głównej, /hotel i /imprezy.
//
// Dlaczego treść siedzi w CMS, a nie leci z Google Places API: API zwraca
// maksymalnie 5 opinii i to bez paginacji — niezależnie od klucza, billingu
// czy weryfikacji wizytówki. Chcemy pokazać 10, więc opinie przepisujemy
// ręcznie i trzymamy jako zwykłą treść, tak jak resztę tekstów strony.
export const review = defineType({
  name: 'review',
  title: 'Opinia',
  type: 'document',
  fields: [
    defineField({
      name: 'authorName',
      title: 'Autor',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Ocena (1-5)',
      type: 'number',
      initialValue: 5,
      validation: (r) => r.required().min(1).max(5).integer(),
    }),
    defineField({
      name: 'text',
      title: 'Treść opinii',
      type: 'localeText',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data wystawienia',
      description: 'Na jej podstawie liczymy podpis "2 miesiące temu" pod opinią.',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'authorUrl',
      title: 'Link do profilu autora (opcjonalnie)',
      description: 'Profil Google recenzenta — jeśli podany, nazwisko staje się linkiem.',
      type: 'url',
    }),
    defineField({
      name: 'order',
      title: 'Kolejność wyświetlania',
      type: 'number',
      initialValue: 100,
    }),
  ],
  orderings: [
    { title: 'Kolejność', name: 'order', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Najnowsze', name: 'newest', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'authorName', subtitle: 'text.pl', rating: 'rating' },
    prepare({ title, subtitle, rating }) {
      return {
        title: `${'★'.repeat(rating ?? 0)} ${title ?? ''}`.trim(),
        subtitle,
      }
    },
  },
})
