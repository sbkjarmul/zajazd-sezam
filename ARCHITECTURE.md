# ARCHITECTURE — Strona internetowa Zajazdu Sezam
**Wersja:** 1.0  
**Data:** maj 2026  
**Powiązany dokument:** PRD v1.9

---

## 1. Przegląd systemu

```
┌─────────────────────────────────────────────────────────────┐
│                        UŻYTKOWNIK                           │
│                  (przeglądarka / mobile)                    │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────────┐
│                      CLOUDFLARE                             │
│         DNS proxy · WAF · Bot Fight Mode · DDoS             │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                        VERCEL                               │
│              Next.js App (App Router / SSR+ISR)             │
│                                                             │
│   ┌─────────────┐   ┌──────────────┐   ┌───────────────┐   │
│   │  /pl/...    │   │   /en/...    │   │  /api/...     │   │
│   │  (polski)   │   │  (angielski) │   │  (Route Hdlr) │   │
│   └─────────────┘   └──────────────┘   └───────┬───────┘   │
└───────────────────────────────────────────────┬┴───────────┘
                    │                           │
       ┌────────────▼──────────┐    ┌───────────▼──────────┐
       │      SANITY CMS       │    │   ZEWNĘTRZNE API      │
       │  (treści + metadane)  │    │                       │
       │  Studio dla redaktora │    │  Google Places API    │
       │  Webhooks → Vercel    │    │  (opinie)             │
       └───────────────────────┘    │  Cloudflare Turnstile │
                                    │  (ochrona formularza) │
                                    │  Resend / Nodemailer  │
                                    │  (wysyłka emaili)     │
                                    └───────────────────────┘
```

---

## 2. Stack technologiczny

| Warstwa | Technologia | Uzasadnienie |
|---|---|---|
| **Frontend** | Next.js 14+ (App Router) | SSR/ISR dla SEO, natywna obsługa i18n przez `[locale]` segment |
| **CMS** | Sanity.io | Wielojęzyczne schematy, Studio bez kodu dla redaktora, webhooks do revalidacji |
| **i18n** | `next-intl` | Routing językowy, lokalizowane slugi URL, fallback PL |
| **Hosting** | Vercel | Natywna integracja z Next.js, preview deployments, Edge Network |
| **CDN / Security** | Cloudflare | WAF, Bot Fight Mode, DDoS, rate limiting, proxy DNS |
| **Ochrona formularzy** | Cloudflare Turnstile | Niewidoczne CAPTCHA, weryfikacja server-side |
| **Wysyłka emaili** | Resend (lub Nodemailer + SMTP) | HTML email template do recepcji + auto-reply |
| **Opinie** | Google Places API | Pobieranie recenzji z wizytówki Google Business Profile |
| **Mapy** | Google Maps Embed API | Mapa na stronie /kontakt |
| **Analityka** | Google Analytics 4 | Śledzenie konwersji i zachowania użytkowników |
| **Zdjęcia** | `next/image` + `.webp` | Automatyczna optymalizacja, lazy loading, brak gołych `<img>` |

---

## 3. Struktura projektu Next.js

```
sezam/
├── app/
│   └── [locale]/                        ← dynamiczny segment języka (pl / en)
│       ├── layout.tsx                   ← shared: header, footer, i18n provider, theming
│       ├── page.tsx                     ← strona główna
│       │
│       ├── imprezy-okolicznosciowe/     ← /pl/ | events/ ← /en/
│       │   └── page.tsx
│       │
│       ├── restauracja/                 ← /pl/ | restaurant/ ← /en/
│       │   ├── page.tsx
│       │   └── menu/
│       │       └── page.tsx
│       │
│       ├── bistro/
│       │   └── page.tsx
│       │
│       ├── hotel/
│       │   └── page.tsx
│       │
│       └── kontakt/                     ← /pl/ | contact/ ← /en/
│           └── page.tsx
│
├── app/api/
│   ├── send-form/
│   │   └── route.ts                     ← obsługa formularza: Turnstile verify + email
│   └── revalidate/
│       └── route.ts                     ← webhook Sanity → ISR revalidation
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx                   ← fixed, scroll-aware, przezroczysty
│   │   ├── BurgerMenu.tsx               ← nawigacja + przełącznik języka
│   │   ├── Footer.tsx
│   │   └── ReservationDrawer.tsx        ← drawer z dwoma zakładkami formularzy
│   │
│   ├── sections/                        ← sekcje strony głównej
│   │   ├── HeroSection.tsx
│   │   ├── ProblemSection.tsx
│   │   ├── SolutionSection.tsx
│   │   ├── EventHallsSection.tsx
│   │   ├── RestaurantSection.tsx
│   │   ├── StepsSection.tsx
│   │   ├── ReviewsSection.tsx           ← dane z Google Places API
│   │   ├── HotelUpsellSection.tsx
│   │   └── CtaSection.tsx
│   │
│   ├── forms/
│   │   ├── RoomBookingForm.tsx
│   │   └── EventInquiryForm.tsx
│   │
│   └── ui/                              ← komponenty bazowe (Button, Card, itd.)
│
├── hooks/
│   └── useScrollDirection.ts            ← hook dla zachowania headera
│
├── lib/
│   ├── sanity/
│   │   ├── client.ts                    ← klient Sanity (read-only)
│   │   ├── queries.ts                   ← GROQ queries
│   │   └── schemas/                     ← definicje schematów
│   ├── google-reviews.ts                ← fetcher Google Places API z cachowaniem
│   └── email.ts                         ← szablony i wysyłka emaili
│
├── messages/
│   ├── pl.json                          ← tłumaczenia UI (przyciski, etykiety, błędy)
│   └── en.json
│
├── public/
│   └── images/                          ← zdjęcia .webp (patrz sekcja 8)
│
├── sanity/
│   ├── schema.ts                        ← rejestr schematów
│   └── schemas/                         ← definicje typów Sanity
│       ├── seoMeta.ts
│       ├── siteSettings.ts
│       ├── homepage.ts
│       ├── restaurant.ts
│       ├── bistro.ts
│       ├── hotel.ts
│       ├── menuCategory.ts
│       ├── menuItem.ts
│       ├── eventHall.ts
│       ├── eventType.ts
│       └── conferenceRoom.ts            ← szkielet, widok poza zakresem v1
│
├── middleware.ts                         ← i18n routing, redirect / → /pl/
├── next.config.ts
└── .env.local                           ← klucze API (nigdy nie commitowane)
```

---

## 4. Routing i internacjonalizacja (i18n)

### 4.1 Strategia routingu

Routing językowy oparty o dynamiczny segment `[locale]` w App Router. Middleware (`middleware.ts`) obsługuje:
- Redirect `/` → `/pl/` na podstawie `Accept-Language` (fallback: `/pl/`)
- Walidację locale — nieznane locale → 404
- Przełącznik języka dostępny wyłącznie w burger menu (nie w headerze)

```
/                     → redirect → /pl/
/pl/                  → strona główna (PL)
/en/                  → strona główna (EN)
/pl/restauracja       ↔  /en/restaurant
/pl/bistro            ↔  /en/bistro
/pl/hotel             ↔  /en/hotel
/pl/imprezy-okolicznosciowe  ↔  /en/events
/pl/kontakt           ↔  /en/contact
/pl/restauracja/menu  ↔  /en/restaurant/menu
```

### 4.2 Konfiguracja `next-intl`

```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['pl', 'en'],
  defaultLocale: 'pl',
  localePrefix: 'always'          // zawsze /pl/ lub /en/ w URL
});
```

### 4.3 Lokalizowane slugi URL

Slugi są tłumaczone — nie tylko treść strony. Mapowanie zdefiniowane w konfiguracji `next-intl` lub w custom middleware:

| Segment | PL | EN |
|---|---|---|
| Imprezy | `imprezy-okolicznosciowe` | `events` |
| Restauracja | `restauracja` | `restaurant` |
| Menu | `menu` | `menu` |
| Hotel | `hotel` | `hotel` |
| Bistro | `bistro` | `bistro` |
| Kontakt | `kontakt` | `contact` |

### 4.4 Przełącznik języka

- Dostępny wyłącznie w burger menu
- Zmiana języka → redirect na odpowiednik bieżącej strony (nie na home)
- Aktywny język wizualnie wyróżniony
- Implementacja przez `useRouter` + `usePathname` z `next-intl`

---

## 5. Architektura Sanity CMS

### 5.1 Schematy

Każdy schemat zawiera osadzony obiekt `seoMeta` z polami wielojęzycznymi.

```
Sanity Project
│
├── siteSettings          ← globalne dane NAP, godziny, emaile, numery telefonów
├── homepage              ← sekcje strony głównej
│
├── restaurant            ← dane strony restauracji + seo
├── bistro                ← dane strony bistro + seo
├── hotel                 ← dane strony hotelu + seo
│   └── roomType[]        ← typy pokoi (8 wariantów)
│
├── menuCategory[]        ← kategorie menu
│   └── menuItem[]        ← pozycje menu (nazwa PL/EN, opis, cena, diety)
│
├── eventHall[]           ← sale eventowe (nazwa, pojemność, zdjęcia, seo)
├── eventType[]           ← typy imprez (wesele, komunia, urodziny…)
│
├── conferenceRoom[]      ← [SZKIELET v1 — widok poza zakresem]
│
└── seoMeta               ← reużywalny obiekt osadzany we wszystkich schematach
```

### 5.2 Schemat `seoMeta` (reużywalny)

```typescript
// sanity/schemas/seoMeta.ts
export const seoMeta = {
  name: 'seoMeta',
  type: 'object',
  fields: [
    {
      name: 'metaTitle',
      type: 'object',
      fields: [
        { name: 'pl', type: 'string', validation: r => r.max(60) },
        { name: 'en', type: 'string', validation: r => r.max(60) },
      ]
    },
    {
      name: 'metaDescription',
      type: 'object',
      fields: [
        { name: 'pl', type: 'string', validation: r => r.max(160) },
        { name: 'en', type: 'string', validation: r => r.max(160) },
      ]
    },
    { name: 'ogImage', type: 'image' },          // wspólne dla PL i EN
    { name: 'noIndex', type: 'boolean', initialValue: false },
  ]
}
```

### 5.3 Wielojęzyczność treści

Pola tekstowe widoczne dla użytkownika są zdefiniowane jako obiekty z kluczami `pl` i `en`:

```typescript
// Przykład pola wielojęzycznego
{
  name: 'title',
  type: 'object',
  fields: [
    { name: 'pl', type: 'string' },
    { name: 'en', type: 'string' },
  ]
}
```

W Next.js pobieramy wartość dla aktywnego locale:
```typescript
const title = data.title[locale]  // data.title.pl lub data.title.en
```

### 5.4 Revalidacja ISR

Po każdej publikacji treści w Sanity Studio:

```
Sanity Webhook → POST /api/revalidate → revalidatePath('/pl/restauracja')
                                      → revalidatePath('/en/restaurant')
                                      → (+ pozostałe ścieżki danego dokumentu)
```

---

## 6. Header — architektura i zachowanie

### 6.1 Układ

```
┌──────────────────────────────────────────────────────┐
│  [ Logo Sezam ]              [ Rezerwuj ]  [ ☰ ]    │
└──────────────────────────────────────────────────────┘
```

### 6.2 Zachowanie przy scrollowaniu

| Stan | Wygląd | Transformacja |
|---|---|---|
| Na górze strony | Przezroczysty, bez tła | — |
| Scroll w dół | Ukryty | `translateY(-100%)` + `transition` |
| Scroll w górę | Widoczny, z tłem (blur lub solid) | `translateY(0)` |

```typescript
// hooks/useScrollDirection.ts
type ScrollDirection = 'up' | 'down' | 'top'

export function useScrollDirection(): ScrollDirection {
  // nasłuchuje window scroll, zwraca kierunek
  // 'top' gdy scrollY < threshold (np. 10px)
}
```

```tsx
// Header.tsx
const direction = useScrollDirection()

const headerClass = cn({
  'translate-y-0':    direction === 'up' || direction === 'top',
  '-translate-y-full': direction === 'down',
  'bg-transparent':   direction === 'top',
  'bg-white/90 backdrop-blur': direction === 'up',
})
```

### 6.3 Burger menu — zawartość

```
┌─────────────────────────────┐
│  [X]                        │
│                             │
│  Strona główna              │
│  Imprezy okolicznościowe    │
│  Restauracja                │
│  Bistro                     │
│  Hotel                      │
│  Kontakt                    │
│                             │
│  ─────────────────────────  │
│  [ PL ]  [ EN ]             │
│                             │
│  📞 [numer telefonu]        │  ← opcjonalnie wg Figma
└─────────────────────────────┘
```

---

## 7. Drawer „Rezerwuj"

Globalny komponent dostępny z każdej podstrony. Uruchamiany przyciskiem w headerze lub sekcjach CTA. Implementacja jako `Sheet` (side drawer z prawej strony).

### 7.1 Zakładka 1 — Rezerwacja pokoju

| Pole | Typ | Wymagane |
|---|---|---|
| Imię i nazwisko | `text` | ✅ |
| Email | `email` | ✅ |
| Telefon | `tel` | ✅ |
| Data przyjazdu | `date` | ✅ |
| Data wyjazdu | `date` | ✅ |
| Typ pokoju | `select` | ✅ |
| Uwagi | `textarea` | ❌ |

**Opcje select "Typ pokoju":**

| Wartość | Etykieta |
|---|---|
| `apartment-comfort` | Apartament Komfort |
| `double-comfort` | Pokój dwuosobowy Komfort |
| `triple-comfort` | Pokój trzyosobowy Komfort |
| `quad-comfort` | Pokój czteroosobowy Komfort |
| `single-comfort-single-bed` | Pokój jednoosobowy Komfort — łóżko pojedyncze |
| `single-comfort-king` | Pokój jednoosobowy Komfort — łóżko King Size |
| `single-standard` | Pokój jednoosobowy Standard |
| `double-standard` | Pokój dwuosobowy Standard |

### 7.2 Zakładka 2 — Zapytanie o event

| Pole | Typ | Wymagane |
|---|---|---|
| Imię i nazwisko | `text` | ✅ |
| Email | `email` | ✅ |
| Telefon | `tel` | ✅ |
| Rodzaj imprezy | `select` | ✅ |
| Preferowana data | `date` | ✅ |
| Liczba gości | `number` | ✅ |
| Wybrana sala | `select` | ❌ |
| Wiadomość | `textarea` | ❌ |

### 7.3 Flow wysyłki formularza

```
Użytkownik wypełnia formularz
         │
         ▼
Cloudflare Turnstile widget
(token generowany client-side)
         │
         ▼
POST /api/send-form
  { formData, turnstileToken }
         │
         ▼
Route Handler (server-side)
  1. Verify Turnstile token
     → POST https://challenges.cloudflare.com/turnstile/v0/siteverify
     → jeśli invalid → return 400
         │
         ▼
  2. Walidacja danych formularza (Zod)
     → jeśli błąd → return 422
         │
         ▼
  3. Wyślij email do recepcji (HTML template)
  4. Wyślij auto-reply do użytkownika
         │
         ▼
  return 200 → UI pokazuje komunikat sukcesu
```

### 7.4 Zmienne środowiskowe formularza

```bash
# .env.local
TURNSTILE_SECRET_KEY=           # Cloudflare Turnstile secret
NEXT_PUBLIC_TURNSTILE_SITE_KEY= # Cloudflare Turnstile site key (publiczny)
RECEPTION_EMAIL=                # adres recepcji (⏳ do potwierdzenia)
REPLY_FROM_EMAIL=               # adres nadawcy auto-reply (⏳ do potwierdzenia)
RESEND_API_KEY=                 # lub SMTP credentials
```

---

## 8. SEO — architektura

### 8.1 `generateMetadata` per strona

Każda strona eksportuje `generateMetadata()` — żadne metadane nie są hardkodowane.

```typescript
// app/[locale]/restauracja/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = params
  const data = await sanityClient.fetch(restaurantQuery)

  return {
    title: data.seo.metaTitle[locale],
    description: data.seo.metaDescription[locale],
    alternates: {
      canonical: `https://sezam.pl/${locale}/restauracja`,
      languages: {
        'pl': '/pl/restauracja',
        'en': '/en/restaurant',
      }
    },
    openGraph: {
      title: data.seo.metaTitle[locale],
      description: data.seo.metaDescription[locale],
      images: [{ url: urlFor(data.seo.ogImage).width(1200).height(630).url() }],
      locale: locale === 'pl' ? 'pl_PL' : 'en_US',
      type: 'website',
    },
  }
}
```

### 8.2 Schema.org JSON-LD per branża

```typescript
// Wstrzykiwany przez <script type="application/ld+json"> w layout.tsx każdej branży

// Restauracja
{
  "@type": "Restaurant",
  "name": "Restauracja Sezam",
  "servesCuisine": "Polish",
  "openingHours": "Mo-Su 12:00-22:00",
  "address": { "@type": "PostalAddress", "addressLocality": "Stalowa Wola", ... }
}

// Hotel
{
  "@type": "LodgingBusiness",
  "name": "Hotel Sezam",
  "amenityFeature": ["sauna", "parking", "24h reception"],
  ...
}

// Strona główna / Kontakt
{
  "@type": ["LocalBusiness", "Organization"],
  "name": "Zajazd Sezam",
  "address": { ... },  // ← identyczne NAP wszędzie
  "telephone": "...",
  ...
}
```

> ⚠️ **NAP Consistency:** Name, Address, Phone muszą być identyczne we wszystkich JSON-LD, stopce i stronie kontaktowej. Dane pobierane ze wspólnego `siteSettings` w Sanity.

### 8.3 Sitemap i robots

```typescript
// app/sitemap.ts — generowany automatycznie
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://sezam.pl/pl/', lastModified: new Date() },
    { url: 'https://sezam.pl/en/', lastModified: new Date() },
    { url: 'https://sezam.pl/pl/restauracja', ... },
    { url: 'https://sezam.pl/en/restaurant', ... },
    // ...wszystkie ścieżki PL i EN
  ]
}
```

```
# public/robots.txt
User-agent: *
Allow: /
Sitemap: https://sezam.pl/sitemap.xml
```

---

## 9. Integracje zewnętrzne

### 9.1 Google Places API — opinie

```typescript
// lib/google-reviews.ts
export async function getGoogleReviews() {
  const url = `https://maps.googleapis.com/maps/api/place/details/json
    ?place_id=${PLACE_ID}
    &fields=reviews,rating
    &key=${GOOGLE_PLACES_API_KEY}`

  const res = await fetch(url, {
    next: { revalidate: 3600 }  // cache 1h — nie odpytujemy API przy każdym wejściu
  })

  const data = await res.json()
  return data.result.reviews
    .filter(r => r.rating >= 4)   // tylko ≥ 4★ (do potwierdzenia)
    .slice(0, 5)                  // max 5 opinii
}
```

**Zmienne środowiskowe:**
```bash
GOOGLE_PLACES_API_KEY=    # klucz Google Places API
GOOGLE_PLACE_ID=          # ID wizytówki Sezamu w Google (⏳ do potwierdzenia)
```

### 9.2 Cloudflare Turnstile — ochrona formularza

```typescript
// app/api/send-form/route.ts
async function verifyTurnstile(token: string): Promise<boolean> {
  const res = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    }
  )
  const data = await res.json()
  return data.success
}
```

### 9.3 Google Maps Embed — strona kontakt

Prosta integracja przez `<iframe>` Google Maps Embed API — bez JavaScript SDK, lekka i wystarczająca dla statycznej mapy z pinezką.

```bash
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY=   # osobny klucz z ograniczeniem do Maps Embed API
```

---

## 10. Ochrona przed botami — dwie warstwy

```
WARSTWA 1 — Infrastruktura (Cloudflare)
────────────────────────────────────────
• Bot Fight Mode — blokuje znane boty i scrapery
• WAF — podstawowe reguły bezpieczeństwa
• DDoS protection
• Rate limiting: /api/send-form → max N req/min per IP
• Konfiguracja: rejestrator domeny → NS Cloudflare → Cloudflare proxy → Vercel

WARSTWA 2 — Formularz (Cloudflare Turnstile)
─────────────────────────────────────────────
• Widget client-side generuje token
• Token weryfikowany server-side przed wysyłką emaila
• Brak możliwości wysyłki formularza z pominięciem weryfikacji
```

---

## 11. Theming — wspólna paleta i typografia

**Decyzja:** wszystkie trzy branże (Restauracja, Bistro, Hotel) używają **wspólnej palety kolorów** i **jednej czcionki (Inter)**. Różnicowanie branż następuje przez **treść, zdjęcia, układ sekcji i charakter copy** (PRD sekcja 7.2) — nie przez tokeny wizualne.

Implementacja przez CSS Custom Properties w `:root`. Brak `data-theme` per branża — gdyby kiedyś pojawiła się potrzeba subtelnego per-branch tweaku (np. innego gradientu hero), dodamy mechanizm wtedy.

```css
/* globals.css — wszystkie tokeny w :root, wartości z Figmy */
:root {
  /* Paleta — wspólna dla wszystkich branż */
  --color-primary: /* z Figmy */;
  --color-secondary: /* z Figmy */;
  --color-accent: /* z Figmy */;
  --color-bg: /* z Figmy */;
  --color-surface: /* z Figmy */;
  --color-text: /* z Figmy */;
  --color-text-muted: /* z Figmy */;
  --color-border: /* z Figmy */;

  /* Typografia — wyłącznie Inter */
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],   // latin-ext obowiązkowy dla PL (ą, ę, ł, ś, ć, ń, ó, ź, ż)
  variable: '--font-sans',
  display: 'swap',
})

// <html lang={locale} className={inter.variable}>
```

```typescript
// tailwind.config.ts — mapowanie tokenów na Tailwind
export default {
  theme: {
    extend: {
      colors: {
        primary:   'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent:    'var(--color-accent)',
        bg:        'var(--color-bg)',
        surface:   'var(--color-surface)',
        text:      { DEFAULT: 'var(--color-text)', muted: 'var(--color-text-muted)' },
        border:    'var(--color-border)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

> 📌 Konkretne wartości HEX do uzupełnienia po eksporcie z Figmy (Variables → JSON lub manualnie).

---

## 12. Zasoby graficzne — struktura folderów

Zdjęcia dostarczone w formacie `.webp`, serwowane przez `next/image`.

```
public/images/
├── hotel/
│   ├── hero.webp
│   ├── apartment-comfort.webp
│   ├── room-double-comfort.webp
│   ├── room-triple-comfort.webp
│   ├── room-quad-comfort.webp
│   ├── room-single-comfort-single.webp
│   ├── room-single-comfort-king.webp
│   ├── room-single-standard.webp
│   └── room-double-standard.webp
├── restauracja/
│   ├── hero.webp
│   ├── dish-[nazwa].webp
│   └── interior.webp
├── bistro/
│   ├── hero.webp
│   └── ...
├── eventy/
│   ├── sala-bankietowa.webp
│   ├── sala-zlota.webp
│   ├── sala-szafirowa.webp
│   └── sala-restauracyjna.webp
└── og/
    ├── og-default.webp          ← fallback OG (1200×630px)
    ├── og-restauracja.webp
    ├── og-bistro.webp
    └── og-hotel.webp
```

**Wymagania techniczne:**
- Format: `.webp` ✅
- Hero images: min. 1920×1080px
- Karty / miniatury: min. 800×600px
- OG images: dokładnie 1200×630px
- Każde zdjęcie: obowiązkowy `alt` w PL i EN z Sanity

---

## 13. Zmienne środowiskowe — kompletna lista

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=                      # read-only token dla Next.js
SANITY_WEBHOOK_SECRET=                 # weryfikacja webhooków ISR

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# Email
RECEPTION_EMAIL=                       # ⏳ do potwierdzenia
REPLY_FROM_EMAIL=                      # ⏳ do potwierdzenia
RESEND_API_KEY=                        # lub SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS

# Google
GOOGLE_PLACES_API_KEY=
GOOGLE_PLACE_ID=                       # ⏳ do potwierdzenia
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY=

# Analytics
NEXT_PUBLIC_GA4_MEASUREMENT_ID=
```

> 🔒 Klucze z prefiksem `NEXT_PUBLIC_` są widoczne po stronie klienta — tylko te, które tego wymagają (Turnstile site key, GA4, Maps Embed). Pozostałe klucze wyłącznie server-side.

---

## 14. Checklist implementacyjna

### Infrastruktura
- [ ] Konfiguracja DNS domeny → Cloudflare NS
- [ ] Cloudflare: Bot Fight Mode ON, WAF rules, rate limiting `/api/send-form`
- [ ] Vercel: projekt, zmienne środowiskowe, domena custom
- [ ] Sanity: projekt, dataset `production`, Studio deploy

### i18n
- [ ] `next-intl` skonfigurowany z lokalizowanymi slugami
- [ ] Middleware: redirect `/` → `/pl/`, fallback locale
- [ ] `hreflang` w `<head>` na każdej stronie
- [ ] Przełącznik języka w burger menu

### SEO
- [ ] `generateMetadata()` na każdej podstronie (dane z Sanity)
- [ ] Schema.org JSON-LD per branża (dane z `siteSettings`)
- [ ] `sitemap.ts` — wpisy PL i EN
- [ ] `robots.txt` z dyrektywą `Sitemap:`
- [ ] OG images per branża (1200×630px) w Sanity
- [ ] Canonical URL na każdej podstronie
- [ ] Jeden H1 per strona, hierarchia H1–H3
- [ ] Google Search Console: weryfikacja + submisja sitemap

### Formularze i bezpieczeństwo
- [ ] Cloudflare Turnstile: widget client-side + weryfikacja server-side
- [ ] Route Handler `/api/send-form`: Turnstile verify → Zod validate → send email
- [ ] HTML email template do recepcji
- [ ] Auto-reply email dla użytkownika
- [ ] Walidacja client-side (UX) + server-side (bezpieczeństwo)

### Komponenty
- [ ] Header: `position: fixed`, `useScrollDirection`, transparent → blur
- [ ] Burger menu z nawigacją i przełącznikiem języka
- [ ] Drawer "Rezerwuj" z dwoma zakładkami
- [ ] Sekcja opinii: integracja Google Places API z cachowaniem
- [ ] Menu restauracji: filtr kategorii bez przeładowania strony
- [ ] Google Maps embed na `/kontakt`
- [ ] `next/image` na wszystkich zdjęciach — zakaz gołego `<img>`

### Theming
- [ ] CSS Custom Properties w `:root` — wspólna paleta dla wszystkich branż (bez `data-theme`)
- [ ] Inter przez `next/font/google` z `subsets: ['latin', 'latin-ext']` i `variable: '--font-sans'`
- [ ] `tailwind.config.ts` mapuje tokeny na klasy Tailwind
- [ ] Wartości HEX z Figma

---

*Dokument architektoniczny projektu Zajazd Sezam. Źródło prawdy dla decyzji implementacyjnych.*
