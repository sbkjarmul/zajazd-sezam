import { defineField, defineType } from 'sanity'

// Singleton — fixed ID 'eventsPage'.
// Layout zgodny z Figma "SEZAM - Imprezy okolicznościowe" (676:1079).
export const eventsPage = defineType({
  name: 'eventsPage',
  title: 'Strona: Imprezy okolicznościowe',
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
      name: 'hero',
      title: '1. Hero',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow' },
        { name: 'title', type: 'localeString', title: 'Tytuł (H1)' },
        { name: 'subtitle', type: 'localeText', title: 'Podtytuł' },
        { name: 'primaryCtaLabel', type: 'localeString', title: 'CTA główne (drawer event)' },
        {
          name: 'secondaryCtaLabel',
          type: 'localeString',
          title: 'CTA drugorzędne (Zobacz sale)',
        },
        { name: 'image', type: 'imageWithAlt', title: 'Tło hero' },
      ],
    }),

    defineField({
      name: 'promiseSection',
      title: '2. Sekcja "Obietnica" — pełnoekranowa wiadomość',
      type: 'object',
      fields: [
        { name: 'leadText', type: 'localeText', title: 'Lead — desktop' },
        { name: 'highlightedText', type: 'localeText', title: 'Wyróżniony fragment — desktop' },
        { name: 'tailText', type: 'localeText', title: 'Tail — desktop' },
        {
          name: 'leadTextMobile',
          type: 'localeText',
          title: 'Lead — mobile (opcjonalny override)',
          description:
            'Krótszy wariant dla < md (768px). Jeśli puste — używa wariantu desktop.',
        },
        {
          name: 'highlightedTextMobile',
          type: 'localeText',
          title: 'Wyróżniony fragment — mobile (opcjonalny override)',
          description: 'Krótszy wariant dla < md (768px). Jeśli puste — używa wariantu desktop.',
        },
        {
          name: 'tailTextMobile',
          type: 'localeText',
          title: 'Tail — mobile (opcjonalny override)',
          description:
            'Krótszy wariant dla < md (768px). Jeśli puste — używa wariantu desktop. Zostaw puste, by zakończyć wersję mobilną na wyróżnionym fragmencie.',
        },
        { name: 'ctaLabel', type: 'localeString', title: 'CTA (drawer event)' },
      ],
    }),

    defineField({
      name: 'eventTypesSection',
      title: '3. Sekcja "Typy imprez"',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow (np. "Organizujemy")' },
        { name: 'title', type: 'localeString', title: 'Tytuł' },
        { name: 'description', type: 'localeText', title: 'Opis boczny' },
      ],
    }),

    defineField({
      name: 'eventTypes',
      title: '4. Typy imprez (lista)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'eventType' }] }],
    }),

    defineField({
      name: 'hallsSection',
      title: '5. Sekcja "Sale eventowe"',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow (np. "Atmosfera")' },
        { name: 'title', type: 'localeString', title: 'Tytuł' },
        { name: 'description', type: 'localeText', title: 'Opis' },
      ],
    }),

    defineField({
      name: 'halls',
      title: '6. Sale (lista)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'eventHall' }] }],
    }),

    defineField({
      name: 'hotelUpsellSection',
      title: '7. Upsell — Nocleg na miejscu (ciemne tło)',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow (np. "Nocleg na miejscu")' },
        { name: 'title', type: 'localeString', title: 'Tytuł' },
        { name: 'description', type: 'localeText', title: 'Opis' },
        { name: 'ctaLabel', type: 'localeString', title: 'CTA (drawer room)' },
      ],
    }),

    defineField({
      name: 'cateringSection',
      title: '8. Sekcja "Catering"',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow (np. "Katering")' },
        { name: 'title', type: 'localeString', title: 'Tytuł' },
        { name: 'description', type: 'localeText', title: 'Opis' },
        { name: 'image', type: 'imageWithAlt', title: 'Zdjęcie boczne (potrawa)' },
      ],
    }),

    defineField({
      name: 'reviewsSection',
      title: '9. Opinie Google',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow' },
        { name: 'title', type: 'localeString', title: 'Tytuł' },
        { name: 'ratingValue', type: 'string', title: 'Średnia ocena (np. "4.4/5")' },
        { name: 'ratingSource', type: 'string', title: 'Źródło (np. "Google")' },
        {
          name: 'ratingCount',
          type: 'localeString',
          title: 'Opis liczby (np. "Na podstawie 1100+ opinii.")',
        },
      ],
    }),

    defineField({
      name: 'stepsSection',
      title: '10. Sekcja "Proces rezerwacji" (3 kroki)',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow (np. "Zaczynamy")' },
        { name: 'title', type: 'localeString', title: 'Tytuł (np. "Prosty proces rezerwacji")' },
        {
          name: 'steps',
          type: 'array',
          title: 'Kroki (zalecane: 3)',
          of: [
            {
              type: 'object',
              name: 'step',
              fields: [{ name: 'text', type: 'localeText', title: 'Treść kroku' }],
              preview: { select: { title: 'text.pl' } },
            },
          ],
        },
      ],
    }),

    defineField({
      name: 'reservationSection',
      title: '11. CTA końcowe — Rezerwacja sali',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'localeString', title: 'Eyebrow' },
        { name: 'title', type: 'localeString', title: 'Tytuł' },
        { name: 'description', type: 'localeText', title: 'Opis pod tytułem' },
        {
          name: 'formInvitationTitle',
          type: 'localeString',
          title: 'Tytuł zaproszenia (formularz)',
        },
        { name: 'formInvitationText', type: 'localeText', title: 'Tekst zaproszenia (formularz)' },
        { name: 'ctaLabel', type: 'localeString', title: 'Etykieta CTA (drawer event)' },
      ],
    }),

    defineField({ name: 'seo', title: 'SEO', type: 'seoMeta' }),
  ],
  preview: { prepare: () => ({ title: 'Imprezy okolicznościowe' }) },
})
