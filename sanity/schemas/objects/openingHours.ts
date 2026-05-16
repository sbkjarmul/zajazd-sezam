import { defineField, defineType } from 'sanity'

const WEEKDAYS = [
  { title: 'Poniedziałek', value: 'Monday' },
  { title: 'Wtorek', value: 'Tuesday' },
  { title: 'Środa', value: 'Wednesday' },
  { title: 'Czwartek', value: 'Thursday' },
  { title: 'Piątek', value: 'Friday' },
  { title: 'Sobota', value: 'Saturday' },
  { title: 'Niedziela', value: 'Sunday' },
]

export const openingHoursEntry = defineType({
  name: 'openingHoursEntry',
  title: 'Zakres godzin',
  type: 'object',
  fields: [
    defineField({
      name: 'daysOfWeek',
      title: 'Dni tygodnia',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: WEEKDAYS },
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'opens',
      title: 'Otwarcie (HH:MM)',
      type: 'string',
      placeholder: '12:00',
      validation: (r) => r.regex(/^\d{2}:\d{2}$/, { name: 'godzina', invert: false }),
    }),
    defineField({
      name: 'closes',
      title: 'Zamknięcie (HH:MM)',
      type: 'string',
      placeholder: '22:00',
      validation: (r) => r.regex(/^\d{2}:\d{2}$/, { name: 'godzina', invert: false }),
    }),
  ],
  preview: {
    select: { days: 'daysOfWeek', opens: 'opens', closes: 'closes' },
    prepare({ days, opens, closes }) {
      const daysLabel = Array.isArray(days) ? days.join(', ') : '—'
      return {
        title: `${daysLabel}`,
        subtitle: `${opens || '?'} – ${closes || '?'}`,
      }
    },
  },
})
