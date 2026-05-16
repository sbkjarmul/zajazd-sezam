# PRD — Strona internetowa Zajazdu Sezam
**Wersja:** 2.0  
**Data:** maj 2026  
**Właściciel projektu:** Zajazd Sezam  
**Typ dokumentu:** Product Requirements Document

---

## 1. Kontekst marki i pozycjonowanie

### 1.1 Kim jest Sezam? (Brand Discovery)

Zajazd Sezam to kompleks gastronomiczno-hotelowy oferujący organizację imprez okolicznościowych, noclegi, restaurację, catering oraz sale konferencyjne — wszystko w jednym miejscu.

**Kluczowe atuty operacyjne:**
- Wesela do 200 osób (Sala Bankietowa), imprezy do 100 (Sala Złota), kameralne do 20 (Sala Szafirowa), rodzinne do 35 (sala restauracyjna)
- Hotel z pokojami Komfort i Standard, recepcja 24/7, sauna
- Restauracja czynna 12:00–22:00 z rozbudowanym menu (polskim i angielskim)
- Diety specjalne: bezglutenowa, wegetariańska

### 1.2 ZAG — Różnicowanie według Marty Neumeier

> *"ZAG" to odpowiedź na pytanie: kiedy wszyscy idą w lewo, gdzie iść w prawo?*

**Analiza konkurencji (typowe hotele i restauracje eventowe):**
- Skupiają się na liczbach (pojemność sal, ceny)
- Komunikują "profesjonalizm" i "elegancję" w sposób zimny i korporacyjny
- Pomijają emocjonalne centrum uroczystości: rodzinę

**ZAG Sezamu:**  
Podczas gdy konkurencja sprzedaje **salę i catering**, Sezam sprzedaje **spokój głowy i pełną obecność w ważnych chwilach**.

> **Jedno zdanie pozycjonowania:**  
> *"Zajazd Sezam to jedyne miejsce, gdzie organizujesz uroczystość rodzinną bez stresu — bo hotel, restauracja, sala i obsługa są pod jednym dachem, a Ty możesz po prostu być z bliskimi."*

**Wyróżnik nr 1 — Kompleksowość bez kompromisów:**  
Goście nie muszą rezerwować osobno noclegu, taksówek, cateringu i dekoracji. Wszystko jest na miejscu.

**Wyróżnik nr 2 — Kuchnia polska z charakterem:**  
Menu oparte na produktach wysokiej jakości, z nowościami sezonowymi (Żołądki Gęsie, Filet z kaczki sous vide, Kurczak supreme z gorgonzolą) — nie hotelowa stołówka, ale prawdziwa restauracja.

**Wyróżnik nr 3 — Ciepłe, rodzinne wnętrze:**  
Sezam nie jest "centrum konferencyjnym". To zajazd — z historią, atmosferą, nazwami sal (Złota, Szafirowa) i menu, które ma własną tożsamość ("Jaśkowe danie", "Kotlet Sezam").

---

## 2. Framework komunikacji — StoryBrand 2.0

### 2.1 Schemat narracyjny (Donald Miller)

| Element StoryBrand | Treść dla Sezamu |
|---|---|
| **Bohater** | Organizator uroczystości (mama wesela, jubilatka, osoba planująca komunię) |
| **Problem zewnętrzny** | Organizacja imprezy wymaga koordynacji wielu dostawców, noclegów, menu, dekoracji |
| **Problem wewnętrzny** | Strach, że coś pójdzie nie tak; lęk, że nie będę mogła/mógł cieszyć się chwilą |
| **Problem filozoficzny** | Ważne chwile powinny być przeżywane, nie zarządzane |
| **Przewodnik** | Zajazd Sezam — z doświadczeniem, ciepłem i gotową infrastrukturą |
| **Plan** | Skontaktuj się → Ustalamy szczegóły → Ty się cieszysz, my robimy resztę |
| **Wezwanie do działania (CTA)** | "Zarezerwuj termin" / "Sprawdź dostępność" |
| **Sukces** | Niezapomniana uroczystość, zadowoleni goście, wspomnienia na całe życie |
| **Porażka (uniknięta)** | Stres, chaos, poczucie straty — bo zamiast być z rodziną, trzeba było "gasić pożary" |

### 2.2 Propozycja wartości (wartość wyjściowa klienta)

> **"Zajazd Sezam to miejsce, które pozwala Ci spokojnie świętować ważne chwile z bliskimi. Nie musisz martwić się o organizację, jedzenie ani noclegi. Wszystko znajduje się w jednym kompleksie — więc Twoi goście mają wygodę, a Ty możesz skupić się na radości i wspólnych momentach."**

---

## 3. Architektura strony internetowej

### 3.1 Cele strony

- **Cel główny:** Generowanie zapytań ofertowych (formularz/telefon)
- **Cel drugorzędny:** Budowanie zaufania przez prezentację oferty, atmosfery i kuchni
- **Cel trzecorzędny:** SEO lokalne — Stalowa Wola i okolice (imprezy okolicznościowe, wesela, hotel, catering)

### 3.2 Mapa strony (sitemap)

Strona jest dwujęzyczna. Język polski jest domyślny, dostępny pod `/pl/`, angielski pod `/en/`. Root `/` przekierowuje na podstawie `Accept-Language` (fallback: `/pl/`).

```
/  → redirect do /pl/
├── /pl/
│   ├── /pl/imprezy-okolicznosciowe   ← jedna strona, bez podstron
│   ├── /pl/restauracja
│   │   └── /pl/restauracja/menu
│   ├── /pl/bistro
│   ├── /pl/hotel
│   └── /pl/kontakt
└── /en/
    ├── /en/events                    ← jedna strona, bez podstron
    ├── /en/restaurant
    │   └── /en/restaurant/menu
    ├── /en/bistro
    ├── /en/hotel
    └── /en/contact

🚫 Poza zakresem v1 (do wdrożenia w przyszłości):
    /pl/konferencje-i-szkolenia
    /pl/catering
```

**Uwagi i18n:**
- Przełącznik językowy (PL / EN) dostępny wyłącznie w burger menu
- Każda strona posiada tag `hreflang` wskazujący odpowiednik w drugim języku (wymóg SEO)
- Slugi URL są lokalizowane, nie tylko treść (np. `/wesela` → `/weddings`)
- Fallback języka: jeśli treść nie jest przetłumaczona, wyświetla się wersja polska
- Tech stack: Next.js (App Router) + Sanity CMS — szczegóły w sekcji 6.3

### 3.3 Priorytety konwersji

1. Drawer "Rezerwuj" uruchamiany z każdej podstrony
2. CTA "Rezerwuj" widoczny globalnie w sticky header
3. Sekcja z salami (zdjęcia + pojemność) z CTA → drawer Rezerwuj

### 3.4 Sticky header — struktura i zachowanie

**Zachowanie przy scrollowaniu:**
- Domyślnie: przezroczysty (transparent), bez tła
- Scroll w dół → header chowa się (translate Y: -100%)
- Scroll w górę → header pojawia się z powrotem, z tłem (np. lekki blur lub kolor solid) dla czytelności na treści strony
- Implementacja: `position: fixed` + nasłuchiwanie `scroll` direction w JS/React hook (`useScrollDirection`)

Header jest widoczny na wszystkich podstronach i w obu językach.

**Elementy headera (od lewej do prawej):**

```
[ Logo Sezam ]                    [ Rezerwuj ]  [ ☰ ]
```

| Element | Opis |
|---|---|
| **Logo** | Klikalne, prowadzi do strony głównej (`/pl/` lub `/en/`) |
| **CTA "Rezerwuj"** | Przycisk otwierający drawer z formularzami |
| **Burger menu (☰)** | Otwiera panel nawigacyjny (overlay lub side drawer) |

**Zawartość burger menu:**
- Linki nawigacyjne do wszystkich podstron
- Przełącznik języka PL / EN — jedyne miejsce na stronie gdzie użytkownik zmienia język
- Numer telefonu i/lub email (opcjonalnie, zgodnie z makietą Figma)

**Przełącznik języka:**
- Zmiana języka przekierowuje na odpowiednik bieżącej strony w drugim języku (np. `/pl/restauracja` → `/en/restaurant`)
- Aktywny język jest wizualnie wyróżniony
- Wybór języka nie resetuje użytkownika do strony głównej

---

## 4. Struktura widoków — Landing Page i podstrony

> ⚠️ **Uwaga:** Teksty (copy) na wszystkich widokach są gotowe w projekcie Figma i stanowią jedyne źródło prawdy dla treści. PRD nie definiuje copy — opisuje wyłącznie strukturę, logikę i wymagania funkcjonalne.

### 4.1 Strona główna — sekcje i logika

| # | Sekcja | Cel funkcjonalny | Uwagi |
|---|---|---|---|
| 1 | **Hero** | Pierwsza identyfikacja marki + główne CTA | Pełnoekranowe zdjęcie, overlay, animacja wejścia |
| 2 | **Problem / Empatia** | Rezonans z organizatorem uroczystości | 3 karty z ikonami |
| 3 | **Rozwiązanie** | Prezentacja kompleksowości Sezamu | 4 filary: sale, kuchnia, hotel, obsługa |
| 4 | **Sale eventowe** | Konwersja — zapytanie o termin | 4 karty sal z pojemnościami, CTA → drawer Rezerwuj |
| 5 | **Restauracja** | Budowanie apetytu i zaufania przez kuchnię | 3–4 zdjęcia dań, CTA → /restauracja/menu |
| 6 | **Plan 3 kroków** | Obniżenie bariery wejścia | Uproszczony schemat procesu rezerwacji |
| 7 | **Referencje** | Social proof — opinie z Google | Integracja z Google Business Profile (patrz sekcja 6.3) |
| 8 | **Hotel (upsell)** | Sprzedaż noclegów przy okazji eventu | CTA → drawer Rezerwuj (zakładka: pokoje) |
| 9 | **CTA końcowe** | Ostatnie wezwanie do działania | Przycisk Rezerwuj → drawer |
| 10 | **Footer** | Nawigacja, dane kontaktowe, copyright | Bez linków social media (nieaktywne) |

### 4.2 Drawer „Rezerwuj"

Drawer (boczny panel) uruchamiany przyciskiem **Rezerwuj** dostępnym globalnie w headerze i w sekcjach CTA. Zawiera dwa osobne formularze w zakładkach:

**Zakładka 1 — Rezerwacja pokoju:**

| Pole | Typ | Wymagane |
|---|---|---|
| Imię i nazwisko | text | ✅ |
| Email | email | ✅ |
| Telefon | tel | ✅ |
| Data przyjazdu | date | ✅ |
| Data wyjazdu | date | ✅ |
| Typ pokoju | select | ✅ |
| Uwagi | textarea | ❌ |

**Opcje pola "Typ pokoju":**

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

**Zakładka 2 — Zapytanie o event:**

| Pole | Typ | Wymagane |
|---|---|---|
| Imię i nazwisko | text | ✅ |
| Email | email | ✅ |
| Telefon | tel | ✅ |
| Rodzaj imprezy | select (wesele / komunia / urodziny / konferencja / inne) | ✅ |
| Preferowana data | date | ✅ |
| Liczba gości | number | ✅ |
| Wybrana sala | select | ❌ |
| Wiadomość | textarea | ❌ |

**Mechanika wysyłki:**
- Po wysłaniu formularza email trafia na adres recepcji w ustalonym szablonie (HTML email template)
- Recepcja ręcznie sprawdza dostępność i kontaktuje się z klientem
- Użytkownik otrzymuje email z potwierdzeniem przyjęcia zapytania (auto-reply)
- Brak integracji z zewnętrznym systemem rezerwacji

**Ochrona przed botami — formularz:**
Formularz chroniony przez **Cloudflare Turnstile** (rekomendowany) lub **hCaptcha** jako alternatywa. Oba są przyjazne użytkownikom (brak klasycznego "kliknij w sygnalizację świetlną") i bezpłatne w podstawowym planie.

| Rozwiązanie | Rekomendacja | Uwagi |
|---|---|---|
| **Cloudflare Turnstile** | ✅ Rekomendowane | Niewidoczne lub minimalne wyzwanie, działa świetnie z Next.js, bezpłatne |
| **hCaptcha** | Alternatywa | Podobne możliwości, bezpłatny plan |
| ~~Google reCAPTCHA v2~~ | ❌ Odradzane | Wpływ na prywatność, irytujące dla użytkownika |
| ~~Google reCAPTCHA v3~~ | ⚠️ Opcjonalnie | Niewidoczne, ale wymaga Google dependency i oceny score po stronie serwera |

Weryfikacja tokena odbywa się **po stronie serwera** (Next.js Route Handler / API route) przed wysyłką emaila — nigdy tylko po stronie klienta.

---

## 5. Specyfikacja podstron

> ⚠️ Teksty na każdej podstronie zgodnie z makietami w Figma. Poniżej opisana wyłącznie struktura i logika widoków.

### 5.1 /pl/restauracja/menu (i odpowiednik /en/)

**Logika widoku:**
- Hero z zdjęciem
- Menu podzielone na kategorie (Przystawki, Zupy, Dania mięsne, Ryby, Wegetariańskie, Sałatki, Menu dziecięce, Desery)
- Filtr kategorii — przełączanie jednym kliknięciem, bez przeładowania strony
- Informacja o dostępnych dietach specjalnych
- CTA → drawer Rezerwuj (zakładka: event) lub numer telefonu
- Brak rezerwacji stolika online

**Dane z Sanity:** schemat `menuCategory` + `menuItem`

### 5.3 /pl/hotel (i odpowiednik /en/)

**Logika widoku:**
- Hero z zdjęciem pokoju
- Karty typów pokoi (zdjęcia, opis udogodnień):
  - Apartament Komfort
  - Pokój dwuosobowy Komfort
  - Pokój trzyosobowy Komfort
  - Pokój czteroosobowy Komfort
  - Pokój jednoosobowy Komfort (łóżko pojedyncze lub King Size)
  - Pokój jednoosobowy Standard
  - Pokój dwuosobowy Standard
- Sekcja atuty obiektu (sauna, recepcja 24/7, parking)
- CTA → drawer Rezerwuj (zakładka: pokój)
- Numery telefonów zgodnie z makietą Figma

**Dane z Sanity:** schemat `hotel` + typy pokoi

### 5.3 /pl/konferencje-i-szkolenia (i odpowiednik /en/)

**Logika widoku:**
- Hero
- Karty sal konferencyjnych z opisem wyposażenia AV
- Oferta cateringowa na czas szkolenia
- CTA → drawer Rezerwuj (zakładka: event, rodzaj: konferencja)

**Dane z Sanity:** schemat `conferenceRoom`

### 5.4 /pl/catering (i odpowiednik /en/)

**Logika widoku:**
- Hero
- Sekcje typów usług (imprezy rodzinne, firmowe, grille, pikniki)
- Zasięg geograficzny (Stalowa Wola i okolice)
- CTA → drawer Rezerwuj (zakładka: event)

### 5.5 /pl/kontakt (i odpowiednik /en/)

**Logika widoku:**
- Mapa Google z lokalizacją (Stalowa Wola)
- Dane kontaktowe: telefon, email — zgodnie z makietą Figma
- Godziny otwarcia restauracji
- Brak formularza kontaktowego na tej stronie (formularz jest w drawerze)
- Brak linków social media

---

## 6. Wymagania techniczne

### 6.1 Wydajność i dostępność

| Wymóg | Specyfikacja |
|---|---|
| Czas ładowania | < 3 sekundy (LCP) |
| Mobile-first | Pełna responsywność (breakpoints: 375px, 768px, 1280px) |
| Dostępność | WCAG 2.1 AA minimum |
| Core Web Vitals | LCP < 2.5s, CLS < 0.1, FID < 100ms |

### 6.2 SEO — wymagania szczegółowe

SEO jest priorytetem projektu. Każda podstrona i każda branża musi mieć w pełni programowalne i unikalne metadane zarządzane z Sanity.

#### 6.2.1 Metadane per strona (Next.js `generateMetadata`)

Każda podstrona eksportuje `generateMetadata()` pobierające dane z Sanity. Żadne metadane nie są hardkodowane w kodzie.

| Pole | Opis | Przykład (Restauracja) |
|---|---|---|
| `title` | Unikalny tytuł strony | `Restauracja Sezam — Stalowa Wola` |
| `description` | Opis strony, 140–160 znaków | `Restauracja w Stalowej Woli z kuchnią polską…` |
| `keywords` | Słowa kluczowe lokalne | `restauracja Stalowa Wola, wesele Stalowa Wola…` |
| `canonical` | Kanoniczny URL strony | `https://sezam.pl/pl/restauracja` |
| `robots` | Indeksowanie | `index, follow` (domyślnie) |
| `og:title` | Tytuł dla podglądu linku | jak `title` lub osobny |
| `og:description` | Opis dla podglądu linku | jak `description` lub osobny |
| `og:image` | Zdjęcie podglądu linku | Dedykowane zdjęcie OG per strona z Sanity |
| `og:url` | Pełny URL strony | `https://sezam.pl/pl/restauracja` |
| `og:locale` | Język strony | `pl_PL` / `en_US` |
| `og:type` | Typ treści | `website` |
| `hreflang` | Odpowiednik językowy | `/pl/restauracja` ↔ `/en/restaurant` |

**Schemat Sanity `seoMeta` (reużywalny obiekt osadzany w każdym dokumencie):**

```typescript
// Każdy schemat (restaurant, bistro, hotel, eventHall itd.) zawiera pole:
seo: {
  type: 'object',
  fields: [
    { name: 'metaTitle',       type: 'localeString' },   // PL + EN
    { name: 'metaDescription', type: 'localeString' },   // PL + EN
    { name: 'ogImage',         type: 'image' },           // wspólne dla obu języków
    { name: 'noIndex',         type: 'boolean' },         // override robots
  ]
}
```

> 📌 Redaktor uzupełnia `metaTitle` i `metaDescription` osobno dla PL i EN bezpośrednio w Sanity Studio. Jeśli pole jest puste, Next.js stosuje fallback z `siteSettings`.

#### 6.2.2 Alerty SEO — pola obowiązkowe

W Sanity Studio pole `metaTitle` i `metaDescription` są oznaczone jako **wymagane** z podglądem licznika znaków:
- `metaTitle`: 50–60 znaków
- `metaDescription`: 140–160 znaków

#### 6.2.3 Alt teksty dla zdjęć

Każde zdjęcie w Sanity (hero, galeria, danie, pokój, sala) ma obowiązkowe pole `alt` w obu językach (`localeString`). `next/image` zawsze otrzymuje `alt` z Sanity — nigdy pusty string.

Konwencja nazewnictwa altów:

| Typ zdjęcia | Przykład alt (PL) | Przykład alt (EN) |
|---|---|---|
| Hero restauracji | `Wnętrze Restauracji Sezam w Stalowej Woli` | `Interior of Sezam Restaurant in Stalowa Wola` |
| Danie | `Filet z kaczki sous vide z puree — Restauracja Sezam` | `Sous vide duck fillet with purée — Sezam Restaurant` |
| Pokój hotelowy | `Pokój Komfort w Hotelu Sezam — Stalowa Wola` | `Comfort Room at Sezam Hotel — Stalowa Wola` |
| Sala eventowa | `Sala Bankietowa Sezam na wesele — do 200 osób` | `Sezam Banquet Hall for weddings — up to 200 guests` |

#### 6.2.4 Schema.org (JSON-LD) per branża

Każda branża ma dedykowany JSON-LD wstrzyknięty przez Next.js w `<head>`. Dane pobierane z Sanity (`siteSettings`).

| Branża / strona | Typ Schema.org |
|---|---|
| Strona główna | `Organization` + `LocalBusiness` |
| Restauracja | `Restaurant` (z `servesCuisine`, `openingHours`, `address`) |
| Bistro | `Restaurant` |
| Hotel | `LodgingBusiness` (z `amenityFeature`, `checkinTime`, `checkoutTime`) |
| Imprezy | `EventVenue` |
| Konferencje | `EventVenue` + `MeetingRoom` |
| Kontakt | `LocalBusiness` z pełnymi danymi NAP |

**NAP (Name, Address, Phone)** musi być identyczny we wszystkich Schema.org, stopce i stronie kontaktowej — Google weryfikuje spójność dla SEO lokalnego.

#### 6.2.5 SEO techniczne — checklist implementacyjna

- [ ] `sitemap.xml` generowany automatycznie przez Next.js (`app/sitemap.ts`) — osobne wpisy dla `/pl/` i `/en/`
- [ ] `robots.txt` z dyrektywą `Sitemap:` wskazującą na sitemap
- [ ] `hreflang` w `<head>` na każdej stronie wskazujący odpowiednik językowy
- [ ] Kanoniczny URL (`canonical`) na każdej podstronie
- [ ] Brak zduplikowanych tytułów i opisów — walidacja w CI (np. `next-seo` lub własny skrypt)
- [ ] Open Graph image: min. 1200×630px, osobne per branża, przechowywane w Sanity
- [ ] Wszystkie `<img>` przez `next/image` — zakaz użycia gołego tagu `<img>`
- [ ] Nagłówki H1–H3 w poprawnej hierarchii na każdej podstronie (jeden H1 per strona)
- [ ] Google Search Console: weryfikacja domeny + submisja sitemap po launchu

### 6.3 Funkcje techniczne

- [ ] Drawer "Rezerwuj" z dwoma formularzami (pokój / event)
- [ ] Wysyłka formularza emailem do recepcji (HTML template) + auto-reply do klienta
- [ ] Integracja z Google Maps (mapa na /kontakt)
- [ ] Google Analytics 4
- [ ] Sticky header z CTA "Rezerwuj" i burger menu
- [ ] Lightbox do galerii zdjęć sal
- [ ] Cloudflare Turnstile na formularzu w drawerze (weryfikacja po stronie serwera)
- [ ] Cloudflare WAF / Bot Fight Mode na poziomie domeny (ochrona całej strony)
- [ ] Integracja z Google Business Profile API — pobieranie i wyświetlanie opinii

**Google Reviews — szczegóły integracji:**

Opinie pobierane są z wizytówki Google Business Profile przez **Google Places API** (pole `reviews` w Places Details). Wyświetlane w sekcji referencji na stronie głównej.

| Aspekt | Decyzja |
|---|---|
| Źródło danych | Google Places API (`/maps/api/place/details`) |
| Cachowanie | Odpowiedź cache'owana po stronie serwera (ISR lub `revalidate`) — nie odpytujemy API przy każdym wejściu na stronę |
| Liczba opinii | Wyświetlane 3–5 najnowszych lub najwyżej ocenianych |
| Filtr | Tylko opinie z oceną ≥ 4★ (opcjonalnie, do ustalenia) |
| Dane wyświetlane | Imię autora, ocena (gwiazdki), treść opinii, data |
| Link | CTA "Zobacz wszystkie opinie" → wizytówka Google |
| Klucz API | Google Places API Key — przechowywany w zmiennych środowiskowych (`.env`), nigdy w kodzie |

### 6.3 Stack technologiczny

**Frontend:** Next.js (App Router)
- Server-side rendering (SSR) i Static Site Generation (SSG) dla SEO i wydajności
- Routing oparty o dynamiczny segment `[locale]` — `/pl/...` i `/en/...`
- `next-intl` do zarządzania tłumaczeniami i routingiem językowym
- `next/image` z automatyczną optymalizacją i lazy loadingiem

**CMS:** Sanity.io
- Jeden projekt Sanity obsługuje wszystkie trzy branże (Restauracja, Bistro, Hotel) + imprezy i konferencje
- Treści wielojęzyczne obsługiwane przez pola obiektowe z kluczami `pl` i `en`
- Sanity Studio dostępne dla redaktora treści bez wiedzy technicznej
- Webhooks → Vercel ISR revalidation przy każdej publikacji treści

**Architektura schematów Sanity (wstępna):**

| Schema | Opis | Wielojęzyczne |
|---|---|---|
| `homepage` | Sekcje strony głównej | ✅ |
| `restaurant` | Strona restauracji + meta | ✅ |
| `bistro` | Strona bistro + meta | ✅ |
| `hotel` | Strona hotelu + pokoje | ✅ |
| `menuCategory` | Kategorie menu (Przystawki, Zupy…) | ✅ |
| `menuItem` | Pozycja menu (nazwa PL/EN, opis, cena, diety) | ✅ |
| `eventHall` | Sala eventowa (nazwa, pojemność, zdjęcia) | ✅ |
| `eventType` | Typ imprezy (wesele, komunia…) | ✅ |
| `conferenceRoom` | Sala szkoleniowa + wyposażenie | ✅ | *(szkielet — widok poza zakresem v1)* |
| `siteSettings` | Dane globalne: telefon, email, godziny | częściowo |

**Theming per branża:**
Trzy branże (Hotel, Restauracja, Bistro) mają oddzielne style wizualne oparte o wspólną paletę i typografię z Figma, implementowane jako CSS Custom Properties (design tokens). Każda branża nadpisuje zestaw tokenów tematycznych (`--theme-accent`, `--theme-bg`, itd.) na poziomie layout segmentu w Next.js:

```
app/
├── [locale]/
│   ├── layout.tsx           ← shared: header, footer, i18n provider
│   ├── page.tsx             ← strona główna
│   ├── hotel/
│   │   └── layout.tsx       ← data-theme="hotel"
│   ├── restauracja/
│   │   └── layout.tsx       ← data-theme="restauracja"
│   └── bistro/
│       └── layout.tsx       ← data-theme="bistro"
```

**Hosting:** Vercel
- Automatyczne preview deployments dla każdego brancha
- Edge Network dla niskich czasów odpowiedzi w Polsce i UE

**Ochrona przed botami — poziom infrastruktury:**
Domena przepuszczana przez **Cloudflare** (bezpłatny plan wystarczający), co zapewnia:
- Bot Fight Mode — automatyczne blokowanie znanych botów i scraperów
- DDoS protection
- WAF (Web Application Firewall) z podstawowymi regułami
- Rate limiting na endpointach API (szczególnie `/api/send-form`)

Konfiguracja: DNS domeny wskazuje na Cloudflare → Cloudflare proxy → Vercel. Wymaga ustawienia rekordów DNS w panelu Cloudflare zamiast bezpośrednio u rejestratora domeny.

---

## 7. Identyfikacja wizualna (wytyczne)

### 7.1 Paleta kolorów i typografia

Paleta kolorów i typografia są definiowane w projekcie Figma i są **wspólne dla wszystkich trzech branż** (Hotel, Restauracja, Bistro). Każda branża ma natomiast własny styl wizualny (układ, nastrój, charakter sekcji) nakładany poprzez theming tokens (patrz sekcja 6.3).

> 📌 Paleta i typografia do uzupełnienia po finalizacji projektu w Figma.

### 7.2 Style per branża

| Branża | Charakter wizualny | Uwagi |
|---|---|---|
| **Restauracja** | Ciepły, klasyczny, apetyczny | Nacisk na zdjęcia dań i atmosferę sali |
| **Bistro** | Casualowy, nowoczesny, codzienny | Lżejszy, bardziej przystępny nastrój |
| **Hotel** | Spokojny, komfortowy, elegancki | Zdjęcia pokoi, detale wyposażenia |

### 7.3 Fotografia

**Styl zdjęć:**
- Ciepłe tonacje, naturalne światło lub świece
- Emocje: rodzina przy stole, toast, dziecko na kolanach babci
- Jedzenie: apetyczne, bliskie kadry, rustykalna ceramika
- Wnętrza: pełne, gotowe, zapraszające

**Unikać:**
- Zimnych, sterylnych kadrów
- Pustych sal bez atmosfery
- Stockowych zdjęć par z białymi uśmiechami

---

## 8. Metryki sukcesu (KPIs)

| Metryka | Cel (3 miesiące po launch) |
|---|---|
| Współczynnik konwersji formularza | ≥ 3% sesji |
| Liczba zapytań miesięcznie | +30% vs. obecny stan |
| Bounce rate | < 55% |
| Avg. session duration | > 2 min |
| Pozycja w Google (lokalnie) | Top 5 dla "wesela [miasto]", "imprezy okolicznościowe [miasto]" |
| Ruch organiczny | +20% kw/kw po 6 miesiącach |

---

## 9. Kolejne kroki

| Krok | Odpowiedzialny | Termin |
|---|---|---|
| Dostarczenie zdjęć wysokiej jakości (sale, jedzenie, hotel) | Klient | Tydzień 1 |
| Eksport design tokenów z Figma (kolory, typografia) do projektu Next.js | Designer + Developer | Tydzień 1 |
| Projekt UI/UX (Figma) — w toku, stanowi podstawę implementacji | Designer | ✅ W toku |
| Akceptacja projektów | Klient | Tydzień 3 |
| Implementacja front-end | Developer | Tydzień 4–6 |
| Integracja CMS i formularzy | Developer | Tydzień 6–7 |
| Testy, QA, poprawki | Zespół | Tydzień 7–8 |
| Launch + monitoring | Zespół | Tydzień 8 |

---

## 10. Otwarte pytania do klienta

| # | Pytanie | Status |
|---|---|---|
| 1 | Region/miasto SEO | ✅ Stalowa Wola i okolice |
| 2 | Istniejąca domena | ✅ Tak, domena istnieje |
| 3 | Zdjęcia — format i dostępność | ✅ Gotowe w formacie `.webp` — destynacja: patrz sekcja 11 |
| 4 | Tech stack | ✅ Next.js + Sanity CMS, dwujęzyczna (PL domyślny, EN) |
| 5 | System rezerwacji online | ✅ Brak — formularz w drawerze, ręczna obsługa przez recepcję |
| 6 | Rezerwacja stolika online | ✅ Nie — brak tej funkcji |
| 7 | Numery telefonów i email | ✅ Zawarte w makiecie Figma |
| 8 | Social media | ✅ Nieaktywne — brak linków na stronie |
| 9 | Copywriting | ✅ Gotowy — wszystkie teksty w makietach Figma |
| 10 | Adres email recepcji (do wysyłki formularza) | ✅ recepcja@zajazdsezam.pl |
| 11 | Adres email auto-reply (potwierdzenie dla klienta) | ⏳ Do potwierdzenia |
| 12 | Nazwa domeny (do konfiguracji next-intl i hreflang) | ✅ zajazdsezam.pl |

---

## 11. Zasoby graficzne — zdjęcia

Zdjęcia dostarczone przez klienta w formacie `.webp`. Developer powinien umieścić je w następującej strukturze w repozytorium:

```
/public
└── /images
    ├── /hotel
    │   ├── hero.webp
    │   ├── apartment-comfort.webp
    │   ├── room-double-comfort.webp
    │   ├── room-triple-comfort.webp
    │   ├── room-quad-comfort.webp
    │   ├── room-single-comfort-single.webp
    │   ├── room-single-comfort-king.webp
    │   ├── room-single-standard.webp
    │   └── room-double-standard.webp
    ├── /restauracja
    │   ├── hero.webp
    │   ├── dish-[nazwa].webp
    │   └── ...
    ├── /bistro
    │   ├── hero.webp
    │   └── ...
    ├── /eventy
    │   ├── sala-bankietowa.webp
    │   ├── sala-zlota.webp
    │   ├── sala-szafirowa.webp
    │   └── ...
    └── /og
        ├── og-default.webp        ← Open Graph fallback
        ├── og-restauracja.webp
        ├── og-bistro.webp
        └── og-hotel.webp
```

**Wymagania techniczne dla zdjęć:**
- Format: `.webp` ✅ (dostarczony przez klienta)
- Serwowane przez `next/image` z automatyczną optymalizacją rozmiaru i jakości
- Każde zdjęcie powinno mieć atrybut `alt` uzupełniony zgodnie z opisem w Figma
- Zdjęcia hero: minimum 1920×1080px dla jakości na dużych ekranach
- Zdjęcia kart/miniaturek: minimum 800×600px

---

*Dokument wygenerowany na potrzeby projektu Zajazd Sezam. Wersja 2.0.*
