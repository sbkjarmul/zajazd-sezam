import { defineField, defineType } from 'sanity'

// Pozycja menu jako OBIEKT osadzony w tablicy `menuCategory.items` — nie jako
// osobny dokument. Obsluga dodaje danie w tym samym miejscu, w ktorym edytuje
// kategorie: bez wyklikiwania referencji i bez osobnej listy dokumentow.
// Kolejnosc = kolejnosc w tablicy (drag & drop), wiec pole `order` jest zbedne.
//
// Zestaw pol jest ograniczony do tego, co faktycznie trafia na strone. Dawne
// `diet` i `image` byly pobierane przez GROQ, ale zaden komponent ich nie
// rysowal — usuniete razem z danymi.
export const menuItem = defineType({
  name: 'menuItem',
  title: 'Pozycja menu',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Nazwa dania',
      type: 'localeString',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'price',
      title: 'Cena (PLN)',
      description: 'Opcjonalna. Restauracja podaje ceny; Bistro serwuje same listy dań bez cen.',
      type: 'number',
      validation: (r) => r.positive(),
    }),
    defineField({
      name: 'description',
      title: 'Opis (składniki, sposób przygotowania)',
      type: 'localeText',
    }),
    defineField({
      name: 'available',
      title: 'Dostępne w menu',
      description: 'Odznacz, żeby chwilowo ukryć danie na stronie bez kasowania go z listy.',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'name.pl', price: 'price', available: 'available' },
    prepare: ({ title, price, available }) => ({
      title: title || 'Bez nazwy',
      subtitle: [price ? `${price} zł` : null, available === false ? 'ukryte' : null]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})
