/**
 * Formatowanie polskich numerów telefonu do wyświetlania.
 *
 * W CMS (`siteSettings.phone`) numer trzymamy w formacie E.164 (same cyfry
 * z prefiksem kraju, np. `+48156422102`). Ten helper renderuje go czytelnie:
 *   +48156422102  →  "+48 15 642 21 02"
 * czyli: kierunkowy kraju, kierunkowy miejscowy, reszta w grupach — nigdy
 * jako jeden ciąg cyfr.
 *
 * Zakładamy wyłącznie numery polskie (9 cyfr krajowych) — stąd lekki szablon
 * zamiast ciężkiej biblioteki. `href="tel:"` nadal budujemy z surowej wartości
 * E.164, formatowanie dotyczy tylko warstwy prezentacji.
 */

// Dwucyfrowe prefiksy polskich numerów komórkowych (grupowanie 3-3-3).
const MOBILE_PREFIXES = new Set([
  '45', '50', '51', '53', '57', '60', '66', '69', '72', '73', '78', '79', '88',
])

export function formatPhonePl(raw?: string | null): string {
  if (!raw) return ''

  const digits = raw.replace(/\D/g, '')
  const national = digits.startsWith('48') ? digits.slice(2) : digits

  // Nieoczekiwana długość → oddaj wejście przycięte, nie psuj wyświetlania.
  if (national.length !== 9) return raw.trim()

  if (MOBILE_PREFIXES.has(national.slice(0, 2))) {
    // Komórka: +48 XXX XXX XXX
    return `+48 ${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6, 9)}`
  }

  // Stacjonarny: +48 XX XXX XX XX (dwucyfrowy kierunkowy miejscowy)
  return `+48 ${national.slice(0, 2)} ${national.slice(2, 5)} ${national.slice(5, 7)} ${national.slice(7, 9)}`
}
