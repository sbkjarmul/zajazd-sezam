import { defineField, defineType } from 'sanity'

// Szkielet — strona /konferencje jest poza zakresem v1 (patrz PRD sekcja 3.2).
// Schemat istnieje, by klient mógł zacząć wprowadzać dane wcześniej
// i by typegen wygenerował typy gdy widok dojdzie w przyszłości.
export const conferenceRoom = defineType({
  name: 'conferenceRoom',
  title: 'Sala konferencyjna (szkielet — v2)',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nazwa', type: 'localeString' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name.pl', maxLength: 64 },
    }),
    defineField({
      name: 'capacitySeating',
      title: 'Pojemność (siedząco)',
      type: 'number',
    }),
    defineField({
      name: 'capacityStanding',
      title: 'Pojemność (stojąco)',
      type: 'number',
    }),
    defineField({ name: 'description', title: 'Opis', type: 'localeText' }),
    defineField({
      name: 'equipment',
      title: 'Wyposażenie AV',
      type: 'array',
      of: [{ type: 'localeString' }],
    }),
    defineField({
      name: 'images',
      title: 'Galeria',
      type: 'array',
      of: [{ type: 'imageWithAlt' }],
    }),
  ],
  preview: {
    select: { title: 'name.pl', capacity: 'capacitySeating' },
    prepare: ({ title, capacity }) => ({
      title,
      subtitle: capacity ? `${capacity} miejsc` : 'szkielet',
    }),
  },
})
