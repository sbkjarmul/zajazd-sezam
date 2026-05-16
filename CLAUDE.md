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

## Theming — paleta i typografia wspólna

**Paleta kolorów i czcionka są wspólne dla wszystkich trzech branż.** Różnicowanie Restauracji / Bistro / Hotelu odbywa się przez **treść, zdjęcia, układ sekcji i charakter copy** (PRD sekcja 7.2) — nie przez kolory ani fonty.

**Czcionka:** wyłącznie **Inter** (przez `next/font/google`). Brak rozróżnienia display/body — jedna rodzina, różne wagi/rozmiary.

```css
/* globals.css — tokeny wspólne, wartości z Figmy */
:root {
  /* Kolory — wartości z Figmy */
  --color-primary: ;
  --color-secondary: ;
  --color-accent: ;
  --color-bg: ;
  --color-surface: ;
  --color-text: ;
  --color-text-muted: ;
  --color-border: ;

  /* Typografia */
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

```ts
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-sans' })

// <html className={inter.variable}>
```

> 🚫 **Brak `data-theme` per branża** — wszystkie strony używają tej samej palety. Jeśli kiedyś pojawi się potrzeba per-branch tweaku (np. inny gradient hero), dodamy `data-theme` wtedy.

> Wartości HEX do uzupełnienia z Figmy. Do tego czasu używaj zmiennych bez wartości — nie hardkoduj kolorów.

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

> 🛠 **Tryb pracy:** lokalnie (brak domeny, maila, kluczy produkcyjnych). Integracje wymagające zewnętrznych kont używają **test keys / mocków**, kompletna konfiguracja produkcyjna jest w ostatniej fazie. Figma jest gotowa — theming, komponenty globalne i strony mogą lecieć równolegle z resztą.

### Faza 1 — Setup lokalny ← zacznij tutaj
- [ ] `create-next-app` z TypeScript (strict), Tailwind, App Router, ESLint
- [ ] Prettier + konfiguracja `tailwind.config.ts` (mapowanie do CSS Custom Properties)
- [ ] `next-intl` — middleware, `locales: ['pl', 'en']`, lokalizowane slugi (mapowanie z `ARCHITECTURE.md` sekcja 4.3)
- [ ] Redirect `/` → `/pl/` na podstawie `Accept-Language`
- [ ] Inicjalizacja projektu Sanity (lokalne Studio embedded pod `/studio`, dataset `production`)
- [ ] Sanity `localeString` jako custom type (PL + EN) — fundament dla wszystkich pól wielojęzycznych
- [ ] Sanity schemat `seoMeta` (osadzany w innych schematach)
- [ ] Konfiguracja `@sanity/typegen` (lub `sanity-codegen`) → typy TS do `/types/sanity.ts`
- [ ] Klient Sanity (read-only) + helper `urlFor` dla obrazków
- [ ] `.env.local.example` (do repo, bez wartości) + `.gitignore` (`.env.local`, `node_modules`, `.next`, `dist`)

### Faza 2 — Fundament SEO i schematy Sanity
- [ ] `generateMetadata` helper bazowy (canonical, hreflang, OG, locale mapping `pl_PL` / `en_US`)
- [ ] `app/sitemap.ts` — wpisy `/pl/` i `/en/` (URL z env: `NEXT_PUBLIC_SITE_URL=http://localhost:3000` lokalnie)
- [ ] `public/robots.txt` (lokalnie `Disallow: /` lub bez sitemapy do produkcji)
- [ ] Schema.org JSON-LD helpers: `Organization`, `LocalBusiness`, `Restaurant`, `LodgingBusiness`, `EventVenue` — dane z `siteSettings`
- [ ] Schematy Sanity: `siteSettings`, `homepage`, `restaurant`, `bistro`, `hotel`, `menuCategory`, `menuItem`, `eventHall`, `eventType`, `conferenceRoom` (szkielet)
- [ ] GROQ queries w `lib/sanity/queries.ts` dla wszystkich stron
- [ ] Wprowadzenie testowych treści PL+EN w lokalnym Studio (NAP, hero, 2–3 pozycje menu, 1 sala — wystarczy do dev)

### Faza 3 — Theming i komponenty bazowe (Figma → kod)
- [ ] Eksport design tokenów z Figmy: kolory (wspólna paleta), spacing, radii, shadows
- [ ] CSS Custom Properties w `globals.css` — wyłącznie wspólne tokeny w `:root`, **bez** `data-theme` per branża
- [ ] `tailwind.config.ts` — mapowanie tokenów (`theme.extend.colors`, `fontFamily.sans = ['var(--font-sans)']`)
- [ ] Inter przez `next/font/google` z `variable: '--font-sans'`, subsets `['latin', 'latin-ext']` (polskie znaki)
- [ ] Komponenty bazowe `components/ui/`: `Button`, `Input`, `Select`, `Textarea`, `Card`, `Sheet` (drawer), `Tabs`, `Toast`
- [ ] Decyzja: shadcn/ui jako baza (rekomendowane, szybkie) vs własne komponenty od zera

### Faza 4 — Komponenty globalne i layout
- [ ] `useScrollDirection` hook
- [ ] `Header.tsx` — `position: fixed`, transparent → blur, scroll-aware
- [ ] `BurgerMenu.tsx` — overlay/sheet, nawigacja, dane kontaktowe z `siteSettings`
- [ ] `LanguageSwitcher.tsx` — mapowanie slugów PL↔EN (`/pl/restauracja` ↔ `/en/restaurant`), wyróżnienie aktywnego języka
- [ ] `Footer.tsx` — dane z `siteSettings`, bez social media
- [ ] `ReservationDrawer.tsx` — `Sheet` + `Tabs` (Rezerwacja pokoju / Zapytanie o event), zgodnie z Figmą
- [ ] `Toast`/notyfikacje — feedback po wysłaniu formularza
- [ ] `app/[locale]/layout.tsx` — provider i18n, Header, Footer, Drawer (globalny), JSON-LD per branża przez nested layouts

### Faza 5 — Formularze i API lokalne
- [ ] `RoomBookingForm.tsx` + `EventInquiryForm.tsx` — UI z Figmy, walidacja client-side (Zod + react-hook-form)
- [ ] Cloudflare Turnstile widget — **test site key** `1x00000000000000000000AA` (zawsze passes)
- [ ] Zod schemas w `lib/validators/` — współdzielone client+server
- [ ] Route Handler `POST /api/send-form` — Turnstile verify (test secret `1x0000000000000000000000000000000AA`) → Zod → wysyłka
- [ ] Wysyłka emaila: **mock w dev** (`console.log` HTML + zapis do `tmp/mails/*.html`), Resend dopiero w F8
- [ ] HTML email templates: recepcja + auto-reply (gotowe, parsowalne po Figma)
- [ ] Route Handler `POST /api/revalidate` — weryfikacja `SANITY_WEBHOOK_SECRET`, `revalidatePath` dla PL+EN

### Faza 6 — Strony (Figma → kod)
- [ ] `/[locale]/page.tsx` — sekcje: `HeroSection`, `ProblemSection`, `SolutionSection`, `EventHallsSection`, `RestaurantSection`, `StepsSection`, `ReviewsSection` (mock data), `HotelUpsellSection`, `CtaSection`
- [ ] `/restauracja` + `/restauracja/menu` (filtr kategorii — client component, bez przeładowania)
- [ ] `/bistro`
- [ ] `/hotel` — karty 8 typów pokoi
- [ ] `/imprezy-okolicznosciowe` — sale + typy imprez, CTA → drawer (zakładka event)
- [ ] `/kontakt` — mapa: placeholder/statyczny obraz lokalnie (Maps Embed w F8)
- [ ] `LightboxGallery` dla sal (PRD 6.3)
- [ ] Wszystkie obrazki przez `next/image`, `alt` z Sanity (PL/EN per locale)
- [ ] Wprowadzenie pełnych treści PL+EN w lokalnym Studio (wszystkie sekcje, zdjęcia)

### Faza 7 — QA lokalne
- [ ] TypeScript strict — zero `any`, zero `@ts-ignore`, zero błędów
- [ ] ESLint + Prettier — czysty `lint` i `format`
- [ ] Lighthouse lokalnie: LCP < 2.5s, CLS < 0.1, accessibility ≥ 95
- [ ] Walidacja a11y (WCAG 2.1 AA): focus management drawer/menu, kontrast, aria-labels, keyboard nav
- [ ] Hierarchia nagłówków (jeden H1 per strona) + walidacja `alt` na każdym obrazku
- [ ] Walidacja długości meta: `metaTitle` ≤ 60, `metaDescription` ≤ 160
- [ ] Walidacja `hreflang` na każdej stronie (PL ↔ EN)
- [ ] Test responsywności: 375 / 768 / 1280
- [ ] Test cross-browser: Chrome, Safari, Firefox
- [ ] Sprawdzenie czy `.env.local` nie jest commitowane

### Faza 8 — Integracje produkcyjne (czeka na klucze, domenę, maila)
> Uruchom dopiero gdy klient dostarczy konta i klucze. Wymienić mocki na prawdziwe wartości — kod aplikacji już gotowy.
- [ ] Resend: konto + verify domeny (DKIM/SPF/DMARC), `RESEND_API_KEY`, podmiana mocka w `/api/send-form`
- [ ] `RECEPTION_EMAIL=recepcja@zajazdsezam.pl`, `REPLY_FROM_EMAIL` (po potwierdzeniu z klientem)
- [ ] Cloudflare Turnstile: konto + prawdziwe `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`
- [ ] Google Places API: klucz + `GOOGLE_PLACE_ID` → wymienić mock w `lib/googleReviews.ts`
- [ ] Google Maps Embed: klucz + iframe na `/kontakt`
- [ ] Google Analytics 4: `NEXT_PUBLIC_GA4_MEASUREMENT_ID` + komponent script
- [ ] Sanity webhook URL → produkcyjny endpoint `/api/revalidate`

### Faza 9 — Deploy i launch (czeka na domenę)
- [ ] Domena `zajazdsezam.pl` → rejestrator → Cloudflare NS
- [ ] Cloudflare: proxy ON, Bot Fight Mode, WAF rules, rate limiting `/api/send-form`
- [ ] Vercel: projekt, podpięcie repo, zmienne środowiskowe produkcyjne, domena custom
- [ ] `NEXT_PUBLIC_SITE_URL=https://zajazdsezam.pl` — sprawdzić sitemap, canonical, OG, hreflang
- [ ] `robots.txt` produkcyjny (`Allow: /` + `Sitemap:`)
- [ ] Google Search Console: weryfikacja domeny + submisja sitemap
- [ ] Smoke test produkcyjny: każda podstrona PL+EN, drawer, formularz (test wysyłki → recepcja), language switcher

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
