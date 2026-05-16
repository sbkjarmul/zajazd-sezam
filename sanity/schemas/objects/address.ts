import { defineField, defineType } from 'sanity'

export const address = defineType({
  name: 'address',
  title: 'Adres',
  type: 'object',
  fields: [
    defineField({ name: 'street', title: 'Ulica i numer', type: 'string' }),
    defineField({ name: 'postalCode', title: 'Kod pocztowy', type: 'string' }),
    defineField({ name: 'city', title: 'Miasto', type: 'string', initialValue: 'Stalowa Wola' }),
    defineField({
      name: 'region',
      title: 'Województwo',
      type: 'string',
      initialValue: 'podkarpackie',
    }),
    defineField({
      name: 'country',
      title: 'Kraj (kod ISO)',
      type: 'string',
      initialValue: 'PL',
    }),
    defineField({
      name: 'latitude',
      title: 'Szerokość geograficzna (dla mapy + Schema.org)',
      type: 'number',
    }),
    defineField({
      name: 'longitude',
      title: 'Długość geograficzna (dla mapy + Schema.org)',
      type: 'number',
    }),
  ],
})
