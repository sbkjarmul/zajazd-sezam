import { defineArrayMember, defineField } from 'sanity'

/**
 * Element galerii zdjec - obraz z OPCJONALNYM altem.
 *
 * Uzywany w tablicach, ktore redaktor zapelnia hurtowo (galerie sal, typow
 * imprez i pokoi, wyswietlane w lightboksie). Wymuszanie altu w dwoch jezykach
 * przy kilkudziesieciu zdjeciach naraz blokowalo zapis dokumentu, a same
 * zdjecia sa tam dekoracyjne - opis niesie otaczajaca tresc.
 *
 * KLUCZOWE: `name` musi zostac `imageWithAlt`, bo tak zapisany jest `_type`
 * istniejacych elementow w bazie. Zmiana nazwy sprawilaby, ze Studio pokazuje
 * wszystkie dotychczasowe zdjecia jako "nieznany typ". Rozni sie od globalnego
 * typu `imageWithAlt` wylacznie brakiem walidacji altu.
 *
 * Dla zdjec trescowych (hero, kadry w sekcjach) nadal uzywamy globalnego
 * `imageWithAlt` z wymaganym altem - tam alt realnie niesie znaczenie.
 */
export const galleryImageMember = () =>
  defineArrayMember({
    type: 'image',
    name: 'imageWithAlt',
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Tekst alternatywny (PL/EN) — opcjonalny',
        description: 'Możesz zostawić puste. Uzupełnij tylko gdy chcesz lepsze SEO/dostępność.',
        type: 'localeString',
      }),
    ],
  })
