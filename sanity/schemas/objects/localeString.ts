import { defineField, defineType } from 'sanity'

export const localeString = defineType({
  name: 'localeString',
  title: 'String wielojęzyczny',
  type: 'object',
  fields: [
    defineField({ name: 'pl', title: 'Polski', type: 'string' }),
    defineField({ name: 'en', title: 'English', type: 'string' }),
  ],
})

export const localeText = defineType({
  name: 'localeText',
  title: 'Tekst wielojęzyczny',
  type: 'object',
  fields: [
    defineField({ name: 'pl', title: 'Polski', type: 'text', rows: 3 }),
    defineField({ name: 'en', title: 'English', type: 'text', rows: 3 }),
  ],
})
