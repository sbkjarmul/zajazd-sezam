# DESIGN-RULES.md — Zajazd Sezam

Ogólne wytyczne typografii i odstępów. Wartości tokenów są zdefiniowane w [app/globals.css](app/globals.css) w bloku `@theme`.

---

## 1. Kontener i padding

- **Klasa**: `layout-container` — używana w każdej sekcji, headerze i footerze.
- **Max width**: `1512px`.
- **Padding boczny**:
  - Mobile: `16px` (`px-4`)
  - Desktop (`md+`, 768px+): `64px` (`px-16`)
- **Image-bleed** (obraz przylega do krawędzi kontenera): `md:!pr-0`, żeby zerować prawy padding.

## 2. Breakpointy

| Alias | Wartość |
|---|---|
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` / `wide` | 1440px (Figma desktop frame, override domyślnego 1536) |

Mobile-first. `wide:` używamy do skalowania typografii eyebrows i labeli z 16 → 20px od 1440px.

## 3. Nagłówki (h1, h2, h3)

- **Waga (font-weight) — per podstrona**:
  - Default (strona główna, hotel, kontakt, events): `font-normal` (400)
  - **Restauracja** (`/restauracja`, `/restauracja/menu`): `font-bold` (700)
  - **Bistro** (`/bistro`): `font-black` (900)
  - Wyjątek lokalny: Menu dish row (item title) — `font-bold`.
- `leading-none` (`line-height: 1`).
- **Letter-spacing**:
  - Mobile: **−1%** (`tracking-tight`)
  - Desktop (`md+`): **−3%** (`tracking-[-0.03em]`)
- Składanie klas: `tracking-tight md:tracking-[-0.03em]`.

## 4. Body text

- `font-normal` (waga 400).
- `leading-[1.2]` (line-height = font-size × 1.2).
- Brak `tracking-*` (letter-spacing = 0).

## 5. Eyebrows (małe nadpisy nad nagłówkiem)

- `text-base wide:text-lg` (16 → 20px od 1440px).
- `uppercase`.
- `tracking-normal` (letter-spacing = 0) — **nigdy** `tracking-wide`.

## 6. Duże liczby / wordmarki

- Stosujemy tę samą regułę trackingu co nagłówki: `tracking-tight md:tracking-[-0.03em]`, `font-normal`, `leading-none`.

---

## Quick reference

| Element | Reguła |
|---|---|
| Heading tracking | `tracking-tight md:tracking-[-0.03em]` (−1% mobile / −3% desktop) |
| Heading leading | `leading-none` |
| Heading weight | `font-normal` default, `font-bold` w Restauracji, `font-black` w Bistro |
| Body tracking | 0 |
| Body leading | `leading-[1.2]` |
| Body weight | `font-normal` |
| Eyebrow tracking | `tracking-normal` (= 0) |
| Eyebrow font size | `text-base wide:text-lg` (16 → 20px od 1440) |
| Container padding | 16px mobile / 64px desktop |
| Container max-width | 1512px |
| Image-bleed right | `md:!pr-0` |
