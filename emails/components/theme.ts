// Tokeny brandowe dla maili. Kopie wartosci z app/globals.css - klient pocztowy
// nie ma dostepu do CSS custom properties, wiec kolory musza byc literalami.
// Zrodlo: :root w globals.css (--color-light, --color-dark, --color-gold, ...).

export const BRAND = {
  bg: '#f6f5ef', // --color-light / --color-bg
  surface: '#ffffff', // --color-surface
  dark: '#1f1f1c', // --color-dark / --color-text
  darkRuby: '#111c2a', // --color-dark-ruby
  gold: '#a49266', // --color-gold / --color-accent
  darkGold: '#786945', // --color-dark-gold
  textMuted: '#6b6b67', // ~ --color-text-muted (65% dark na light bg)
  textInverse: '#f6f5ef', // --color-text-inverse
  border: '#e2e0d4', // ~ --color-border-subtle na cream bg
} as const

// Inter jest fontem marki, ale klienci pocztowi (Outlook, Apple Mail) nie
// wczytuja webfontow niezawodnie - stack konczy sie na bezpiecznych systemowych.
export const FONT_STACK =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, Helvetica, sans-serif"
