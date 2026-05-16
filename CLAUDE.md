# CLAUDE.md — Instrukcja dla Claude Code
## Projekt: Zajazd Sezam

Jesteś **Senior Web Developerem** pracującym nad stroną internetową Zajazdu Sezam.
Przed rozpoczęciem pracy przeczytaj `PRD.md` i `ARCHITECTURE.md` — to Twoje jedyne źródła prawdy dla wymagań i decyzji architektonicznych. Dodatkowo `RULES.md` zawiera obowiązujące zasady współpracy, jakości kodu i komunikacji — stosuj je w każdej interakcji.

---

## Stack technologiczny

- **Framework:** Next.js 14+ App Router (TypeScript, strict mode)
- **Stylowanie:** Tailwind CSS + CSS Custom Properties (design tokens z Figmy)
- **CMS:** Sanity.io (schematy w `/sanity/schemas/`)
- **i18n:** `next-intl` (lokale: `pl` domyślny, `en`)
- **Walidacja:** Zod (server-side w Route Handlers, client-side w formularzach)
- **Email:** Resend
- **Bot protection:** Cloudflare Turnstile
- **Linting:** ESLint + Prettier

---

## Zasady których ZAWSZE przestrzegasz

### Kod

- **Nigdy** nie używaj gołego tagu `<img>` — zawsze `next/image` z atrybutem `alt`
- **Nigdy** nie hardkodujesz metadanych SEO — zawsze `generateMetadata()` z danymi z Sanity
- **Nigdy** nie commituj kluczy API — wszystko przez zmienne środowiskowe z `.env.local`
- **Nigdy** nie piszesz logiki biznesowej po stronie klienta jeśli powinna być server-side
- Każdy komponent który pobiera dane z Sanity jest **Server Component** (domyślnie w App Router)
- `'use client'` tylko gdy komponent wymaga: hooków stanu, event listenerów, przeglądarki (np. `window`)

### TypeScript

- Strict mode włączony — zero `any`, zero ignorowanych błędów
- Typy generowane z schematów Sanity przez `sanity-codegen` lub ręcznie w `/types/`
- Props każdego komponentu mają zdefiniowany interfejs

### Nazewnictwo

- Komponenty: `PascalCase` (np. `HeroSection.tsx`, `ReservationDrawer.tsx`)
- Hooki: `camelCase` z prefiksem `use` (np. `useScrollDirection.ts`)
- Pliki pomocnicze: `camelCase` (np. `googleReviews.ts`, `emailTemplates.ts`)
- Zmienne środowiskowe: `SCREAMING_SNAKE_CASE`
- Klasy Tailwind: mobile-first (domyślnie mobile, breakpointy dla większych ekranów)

### Commits

Używaj konwencji Conventional Commits:
```
feat: add reservation drawer with two form tabs
fix: correct hreflang tags for /en/restaurant
chore: update Sanity schemas for room types
```

---

## Struktura projektu

Ściśle zgodna z `ARCHITECTURE.md` sekcja 3. Skrót:

```
app/[locale]/          ← wszystkie strony pod locałem
app/api/               ← Route Handlers (send-form, revalidate)
components/layout/     ← Header, BurgerMenu, Footer, ReservationDrawer
components/sections/   ← sekcje strony głównej
components/forms/      ← RoomBookingForm, EventInquiryForm
components/ui/         ← komponenty bazowe (Button, Card, itp.)
hooks/                 ← useScrollDirection i inne
lib/sanity/            ← client.ts, queries.ts
lib/                   ← googleReviews.ts, email.ts
messages/              ← pl.json, en.json (tylko etykiety UI)
sanity/schemas/        ← definicje schematów Sanity
public/images/         ← zdjęcia .webp (struktura w ARCHITECTURE.md sekcja 12)
types/                 ← TypeScript interfaces
```

---

## i18n — zasady

- Routing: `/pl/...` i `/en/...`, middleware redirect `/` → `/pl/`
- Lokalizowane slugi URL (mapowanie w `middleware.ts`):
  ```
  /pl/imprezy-okolicznosciowe  ↔  /en/events
  /pl/restauracja              ↔  /en/restaurant
  /pl/restauracja/menu         ↔  /en/restaurant/menu
  /pl/bistro                   ↔  /en/bistro
  /pl/hotel                    ↔  /en/hotel
  /pl/kontakt                  ↔  /en/contact
  ```
- Pliki `messages/pl.json` i `en.json` zawierają **tylko etykiety UI** (przyciski, błędy formularza, placeholdery, aria-labels) — **nie treści stron** (te są w Sanity)
- Każda strona ma `hreflang` wskazujący odpowiednik w drugim języku
- Zmiana języka w burger menu → redirect na odpowiednik bieżącej strony (nie na `/`)

---

## Sanity — zasady

- Każde pole tekstowe widoczne dla użytkownika jest wielojęzyczne:
  ```typescript
  { name: 'title', type: 'object', fields: [
    { name: 'pl', type: 'string' },
    { name: 'en', type: 'string' },
  ]}
  ```
- Każdy schemat zawiera osadzony obiekt `seoMeta` (patrz `sanity/schemas/seoMeta.ts`)
- Dane do strony pobierane przez GROQ w Server Components — nigdy client-side fetch do Sanity
- ISR revalidacja przez webhook: `POST /api/revalidate` po każdej publikacji w Studio
- Klient Sanity jest read-only w Next.js — zapis tylko przez Studio

---

## SEO — zasady

- `generateMetadata()` na **każdej** podstronie — dane z Sanity przez GROQ
- `metaTitle`: max 60 znaków, `metaDescription`: max 160 znaków
- Canonical URL na każdej podstronie
- Schema.org JSON-LD per branża — dane z `siteSettings` (jeden schemat, spójne NAP wszędzie)
- `sitemap.ts` generowany automatycznie z wpisami dla `/pl/` i `/en/`
- Jeden `<h1>` per strona, poprawna hierarchia H1→H2→H3
- Atrybuty `alt` na wszystkich zdjęciach — pobierane z Sanity (PL lub EN zależnie od locale)

---

## Header — zachowanie

```
position: fixed
Domyślnie: transparent (na górze strony)
Scroll w dół → translateY(-100%), transition ease-in-out
Scroll w górę → translateY(0), tło: backdrop-blur lub solid
```

Implementacja przez `hooks/useScrollDirection.ts`. Elementy: `[Logo] ... [Rezerwuj] [☰]`

Burger menu zawiera: nawigację + przełącznik języka (PL/EN) — jedyne miejsce zmiany języka.

---

## Drawer "Rezerwuj"

- Globalny komponent, dostępny z każdej podstrony
- Dwie zakładki: **Rezerwacja pokoju** i **Zapytanie o event**
- Pełna specyfikacja pól w `ARCHITECTURE.md` sekcja 7
- Flow wysyłki: Turnstile token → `POST /api/send-form` → verify server-side → Zod validate → send email
- Email recepcji: `recepcja@zajazdsezam.pl`
- Typy pokoi (select): apartament-komfort, pokój 2os. komfort, 3os. komfort, 4os. komfort, 1os. komfort single, 1os. komfort king, 1os. standard, 2os. standard

---

## Theming per branża

```css
/* Tokeny wspólne w :root (wartości z Figmy — do uzupełnienia) */
:root {
  --color-primary: ;
  --color-bg: ;
  --font-display: ;
  --font-body: ;
}

/* Per branża przez data-theme na layout.tsx */
[data-theme="restauracja"] { --theme-accent: ; }
[data-theme="bistro"]      { --theme-accent: ; }
[data-theme="hotel"]       { --theme-accent: ; }
```

Wartości tokenów do uzupełnienia po otrzymaniu dostępu do Figmy. Do tego czasu używaj zmiennych bez wartości — nie hardkoduj kolorów.

---

## Zmienne środowiskowe

Pełna lista w `ARCHITECTURE.md` sekcja 13. Template `.env.local`:

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
SANITY_WEBHOOK_SECRET=

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# Email
RECEPTION_EMAIL=recepcja@zajazdsezam.pl
REPLY_FROM_EMAIL=
RESEND_API_KEY=

# Google
GOOGLE_PLACES_API_KEY=
GOOGLE_PLACE_ID=
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY=

# Analytics
NEXT_PUBLIC_GA4_MEASUREMENT_ID=
```

Zmienne z prefiksem `NEXT_PUBLIC_` są widoczne client-side — tylko te które tego wymagają.

---

## Fazy implementacji

### Faza 1 — Setup (bez Figmy) ← zacznij tutaj
- [ ] `create-next-app` z TypeScript + Tailwind + App Router
- [ ] Konfiguracja `next-intl` — middleware, routing, lokalizowane slugi
- [ ] Inicjalizacja projektu Sanity — wszystkie schematy
- [ ] `generateMetadata` helper bazowy
- [ ] `sitemap.ts` + `robots.txt`
- [ ] Schema.org JSON-LD helpers per branża
- [ ] Route Handler `/api/send-form` (Turnstile + Zod + Resend)
- [ ] Route Handler `/api/revalidate` (webhook Sanity)
- [ ] `.env.local` template + `.env.example` (bez wartości, do repo) + `.gitignore`

### Faza 2 — Komponenty globalne (częściowo bez Figmy)
- [ ] `useScrollDirection` hook
- [ ] `Header.tsx` — fixed, scroll-aware, transparent
- [ ] `BurgerMenu.tsx` — nawigacja + przełącznik języka
- [ ] `Footer.tsx` — dane z `siteSettings`
- [ ] `ReservationDrawer.tsx` — dwie zakładki
- [ ] `RoomBookingForm.tsx` + `EventInquiryForm.tsx`
- [ ] CSS Custom Properties — struktura tokenów (wartości po Figmie)

### Faza 3 — Strony (czeka na Figmę + zdjęcia)
- [ ] Strona główna `/[locale]/page.tsx` — wszystkie sekcje
- [ ] `/restauracja` + `/restauracja/menu`
- [ ] `/bistro`
- [ ] `/hotel`
- [ ] `/imprezy-okolicznosciowe`
- [ ] `/kontakt`

### Faza 4 — Integracje (czeka na klucze API)
- [ ] Google Places API — sekcja opinii
- [ ] Google Maps Embed — strona kontakt
- [ ] Google Analytics 4
- [ ] Cloudflare Turnstile — podpięcie site key z .env (widget client-side)

---

## Domena

`https://zajazdsezam.pl`

Używana w: canonical URL, hreflang, sitemap, Schema.org, Cloudflare config.

---

## Czego NIE rób

- Nie używaj `pages/` router — projekt jest na App Router
- Nie pisz inline styles — tylko Tailwind + CSS Custom Properties
- Nie fetchuj danych z Sanity po stronie klienta — Server Components
- Nie używaj `localStorage` ani `sessionStorage`
- Nie instaluj bibliotek bez sprawdzenia czy nie duplikują istniejącej funkcjonalności
- Nie twórz podstron `/konferencje` ani `/catering` — poza zakresem v1
- Nie hardkoduj tekstów stron — treści z Sanity, etykiety UI z `messages/`
- Nie commituj `.env.local`

---

## Kontekst biznesowy

Zajazd Sezam to kompleks gastronomiczno-hotelowy w **Stalowej Woli**. Trzy branże z osobnymi stylami wizualnymi: **Restauracja**, **Bistro**, **Hotel** — plus oferta eventowa i kontakt. SEO lokalne pod Stalową Wolę i okolice. Strona dwujęzyczna: PL (domyślny) + EN.

Pełny kontekst: `PRD.md` i `ARCHITECTURE.md`. Zasady pracy: `RULES.md`.
