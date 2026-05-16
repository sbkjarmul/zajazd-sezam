import { defineField, defineType } from 'sanity'

// ID slugów odpowiada wartościom z formularza rezerwacji
// (patrz ARCHITECTURE.md sekcja 7.1 — drawer Rezerwuj, pole "Typ pokoju").
const ROOM_TYPE_SLUGS = [
  { title: 'Apartament Komfort', value: 'apartment-comfort' },
  { title: 'Pokój dwuosobowy Komfort', value: 'double-comfort' },
  { title: 'Pokój trzyosobowy Komfort', value: 'triple-comfort' },
  { title: 'Pokój czteroosobowy Komfort', value: 'quad-comfort' },
  { title: 'Pokój jednoosobowy Komfort — łóżko pojedyncze', value: 'single-comfort-single-bed' },
  { title: 'Pokój jednoosobowy Komfort — łóżko King Size', value: 'single-comfort-king' },
  { title: 'Pokój jednoosobowy Standard', value: 'single-standard' },
  { title: 'Pokój dwuosobowy Standard', value: 'double-standard' },
]

export const roomType = defineType({
  name: 'roomType',
  title: 'Typ pokoju',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nazwa wyświetlana',
      type: 'localeString',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'identifier',
      title: 'Identyfikator (musi pokrywać się z wartością w formularzu rezerwacji)',
      type: 'string',
      options: { list: ROOM_TYPE_SLUGS },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Opis pokoju',
      type: 'localeText',
    }),
    defineField({
      name: 'capacity',
      title: 'Liczba osób',
      type: 'number',
      validation: (r) => r.required().positive().integer(),
    }),
    defineField({
      name: 'amenities',
      title: 'Udogodnienia',
      type: 'array',
      of: [{ type: 'localeString' }],
    }),
    defineField({
      name: 'images',
      title: 'Galeria zdjęć',
      type: 'array',
      of: [{ type: 'imageWithAlt' }],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'order',
      title: 'Kolejność wyświetlania',
      type: 'number',
      initialValue: 100,
    }),
  ],
  orderings: [{ title: 'Kolejność', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name.pl', identifier: 'identifier', media: 'images.0' },
    prepare: ({ title, identifier, media }) => ({
      title,
      subtitle: identifier,
      media,
    }),
  },
})
