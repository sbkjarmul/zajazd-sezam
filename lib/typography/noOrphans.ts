// Sieroty typograficzne — polska zasada skladu: jednoliterowe spojniki i
// przyimki (a, i, o, u, w, z) nie moga zostawac na koncu wiersza. Do tego
// krotkie slowo otwierajace nowe zdanie (po kropce) samotnie na koncu wiersza
// wyglada zle, wiec przyklejamy je do nastepnego wyrazu.
//
// Zamieniamy zwykla spacje na NBSP ( ) — dlugosc stringa sie NIE zmienia
// (1 znak za 1 znak), wiec offsety liczone na tekscie (np. `startIndex`
// w ColorizeText) zostaja poprawne. Funkcja jest idempotentna: po pierwszym
// przebiegu sierota ma juz NBSP, wiec nie da sie dopasowac ponownie.
//
// Wpiete globalnie w `lib/i18n/pickLocale` — kazdy tekst z Sanity renderowany
// w UI dostaje to automatycznie. SEO ma wlasne, niezalezne pickLocale
// (`lib/seo/metadata.ts`, `lib/seo/jsonLd.ts`), wiec meta tagi i JSON-LD
// zostaja czystym tekstem bez NBSP.

const NBSP = ' '

/** Maksymalna dlugosc slowa po kropce, ktore doklejamy do nastepnego. */
const MAX_SENTENCE_OPENER = 3

const SINGLE_LETTER_RE = /(^|[\s(„"'])([aiouwzAIOUWZ]) +/g
const SENTENCE_OPENER_RE = new RegExp(`([.!?]\\s)([\\p{L}]{1,${MAX_SENTENCE_OPENER}}) +`, 'gu')

export function noOrphans(text: string): string
export function noOrphans(text: null | undefined): undefined
export function noOrphans(text?: string | null): string | undefined
export function noOrphans(text?: string | null): string | undefined {
  if (!text) return text ?? undefined
  return text.replace(SINGLE_LETTER_RE, `$1$2${NBSP}`).replace(SENTENCE_OPENER_RE, `$1$2${NBSP}`)
}

type Segment = { text?: string | null }

/**
 * Wariant dla tekstu rozbitego na kilka sasiadujacych segmentow (np. lead +
 * pogrubiony highlight + tail w EventsPromise). Samo `noOrphans` na kazdym
 * segmencie z osobna NIE widzi granicy — "...umowe." konczy jeden string,
 * a "Ty cieszysz..." zaczyna nastepny, wiec regula "slowo po kropce" nie ma
 * czego dopasowac. Tutaj sklejamy wszystko w jeden tekst, przepuszczamy przez
 * `noOrphans` i tniemy z powrotem (dlugosci sie nie zmieniaja).
 *
 * Zwraca dla kazdego niepustego segmentu:
 *  - `text`      — tresc po korekcie,
 *  - `sepBefore` — separator przed segmentem (spacja albo NBSP, gdy sierota
 *                  wypadla dokladnie na granicy); dla pierwszego pusty,
 *  - `startIndex`— offset znakowy w calosci, gotowy dla ColorizeText.
 */
export function noOrphansSegments<T extends Segment>(
  segments: T[],
): Array<T & { text: string; sepBefore: string; startIndex: number }> {
  const present = segments.filter((s): s is T & { text: string } => Boolean(s.text))
  if (!present.length) return []

  const full = noOrphans(present.map((s) => s.text).join(' '))
  let offset = 0

  return present.map((segment, i) => {
    const startIndex = offset
    const result = {
      ...segment,
      text: full.slice(offset, offset + segment.text.length),
      sepBefore: i === 0 ? '' : full.charAt(offset - 1),
      startIndex,
    }
    offset += segment.text.length + 1
    return result
  })
}
