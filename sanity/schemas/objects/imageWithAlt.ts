import { defineField, defineType } from 'sanity'

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Zdjęcie z opisem alt',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Tekst alternatywny (PL/EN) — wymagany dla SEO i dostępności',
      type: 'localeString',
      validation: (r) =>
        r.custom((value: { pl?: string; en?: string } | undefined) => {
          if (!value?.pl || !value?.en) return 'Wypełnij alt zarówno po polsku jak i po angielsku'
          return true
        }),
    }),
  ],
})
