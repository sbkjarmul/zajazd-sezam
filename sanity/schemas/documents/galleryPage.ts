import { defineArrayMember, defineField, defineType } from 'sanity'

// Singleton — fixed ID 'galleryPage'.
// Strona "Galeria": naglowek + luzna siatka kwadratowych kafli (offset co druga
// kolumna), klik otwiera lightbox (YARL + Zoom). Wszystkie zdjecia z pola images[].
export const galleryPage = defineType({
  name: 'galleryPage',
  title: 'Strona: Galeria',
  type: 'document',
  fields: [
    defineField({
      name: 'headerLogo',
      title: 'Logo w headerze (SVG/PNG) — override dla tej strony',
      description:
        'Jeśli puste, używane jest defaultHeaderLogo z siteSettings (lub fallback tekstowy SEZAM).',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow (nad tytułem)',
      type: 'localeString',
    }),
    defineField({
      name: 'title',
      title: 'Tytuł strony',
      type: 'localeString',
    }),
    defineField({
      name: 'intro',
      title: 'Wprowadzenie (pod tytułem)',
      type: 'localeText',
    }),
    defineField({
      name: 'images',
      title: 'Zdjęcia galerii',
      description:
        'Kolejność kafli = kolejność na liście. Wystarczy wrzucić sam plik — alt jest opcjonalny (uzupełnij tylko gdy chcesz lepsze SEO/dostępność).',
      type: 'array',
      of: [
        defineArrayMember({
          // Zwykly obraz (NIE imageWithAlt) — celowo bez wymuszonego alt, zeby
          // mozna bylo hurtowo wrzucac same pliki. Alt opcjonalny ponizej.
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Tekst alternatywny (opcjonalny, PL/EN)',
              description: 'Możesz zostawić puste — nie jest wymagany.',
              type: 'localeString',
            }),
          ],
        }),
      ],
      validation: (r) => r.min(1),
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoMeta' }),
  ],
  preview: { prepare: () => ({ title: 'Galeria' }) },
})
