# DESIGN-RULES.md — Zajazd Sezam

Źródło prawdy dla typografii, paddingów sekcji, gapów i stylów komponentów. **Tokeny** (rozmiary, kolory, breakpointy) są w [app/globals.css](../app/globals.css) `@theme` — ten dokument opisuje **jak ich używać**.

Zasada: **wewnątrz jednej strony używamy spójnego zestawu** — eyebrowy wszędzie tego samego rozmiaru/letter-spacingu, body teksty tej samej skali, sekcje tego samego rytmu paddingów. Wyjątki są nazwane i udokumentowane.

---

## TOC

0. [Wstęp](#0-wstęp)
1. [Tokeny globalne](#1-tokeny-globalne)
2. [Skala paddingów sekcji](#2-skala-paddingów-sekcji)
3. [Skala gapów](#3-skala-gapów)
4. [Atomy typograficzne](#4-atomy-typograficzne)
5. [Buttony](#5-buttony)
6. [Theme tła sekcji](#6-theme-tła-sekcji)
7. [Per-page rozpiski](#7-per-page-rozpiski)
8. [Quick reference](#8-quick-reference)

---

## 0. Wstęp

**Mobile-first.** Klasy bazowe definiują mobile (`<768px`), kolejne breakpointy nadpisują na większych ekranach.

**1:1 z Figmą tylko dla dwóch wariantów:**
- **Mobile** (< 768px) — 1:1 z Figma mobile
- **Desktop** (≥ 1024px) — 1:1 z Figma desktop

**Tablet (768–1023px) = interpolacja** mobile→desktop, **nie** 1:1 (Figma nie ma osobnego wariantu tablet). Przy implementacji pisz `base → md → lg`; pomijaj `md:` chyba że potrzebujesz świadomej korekty dla tabletu.

Custom breakpoint `wide:` = 1440px (nadpisany Tailwind `2xl`) — używamy do skalowania detali typograficznych (eyebrow `wide:text-lg`, hero `wide:text-[96px]`) na Figmowym desktop frame.

---

## 1. Tokeny globalne

Wszystkie wartości w [app/globals.css](../app/globals.css) bloku `@theme`. Ten plik dokumentuje **nazwy klas Tailwind i co znaczą** — nie powtarza HEX'ów i innych raw values.

### 1.1 Skala typograficzna

| Klasa | Wartość | Użycie |
|---|---|---|
| `text-xs` | 12px | Captions, znaczniki czasu |
| `text-sm` | 16px | Caption Kontakt, `<dt>` labels |
| `text-md` | 19px | (zarezerwowane — obecnie nieużywane) |
| `text-lg` | 20px | Body large desktop, button tekst |
| `text-xl` | 24px | Body emphasis, subtitle hero md+ |
| `text-2xl` | 32px | h2 mobile, body lead, h3 card |
| `text-3xl` | 40px | h1 mobile (home/hotel), h2 mobile (subpage), h2-medium mobile |
| `text-4xl` | 48px | h2 mobile (subpage), h2-large mobile |
| `text-5xl` | 64px | h2 md, h1 mobile (bistro/kontakt), h2-medium md/lg |
| `text-6xl` | 72px | **h2 sekcji lg+** (kanon), h1 home md |
| `text-7xl` | 80px | h1 hero md+ (hotel/events), h2-large lg+ |
| `text-8xl` | 100px | Big numbers, stat values lg+ |
| `text-[clamp(...)]` / arbitrary | — | Hero h1 fluid (Restaurant), `text-[96px]` (Hotel wide), `text-[120px]` (Events/Restaurant lg+) |

### 1.2 Tracking (letter-spacing)

| Klasa | Wartość | Użycie |
|---|---|---|
| `tracking-tight` | -0.01em (-1%) | h1/h2/h3 mobile |
| `tracking-[-0.03em]` | -3% | h1/h2/h3 md+ (zawsze parowane z `tracking-tight` jako baseline) |
| `tracking-[-0.02em]` | -2% | HotelQuote (świadomy wariant — soft display weight) |
| `tracking-normal` | 0 | Body, eyebrows |
| `tracking-widest` | 0.125em | **Wyłącznie** SEZAM wordmark w logo |

**Reguła:** `tracking-wide` / `tracking-wider` / `tracking-widest` **nigdy** w eyebrowach, body, ani headingach Sezamu. Tylko logo wordmark dostaje `tracking-widest`.

### 1.3 Breakpointy

| Alias | Wartość | Notatka |
|---|---|---|
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop baseline |
| `xl` | 1280px | Wide desktop |
| `wide` / `2xl` | 1440px | Figma desktop frame (override Tailwind 1536) |

### 1.4 layout-container

Każda sekcja, header i footer używa `layout-container`:

```css
@utility layout-container {
  margin-inline: auto;
  width: 100%;
  max-width: 1512px;
  padding-inline: 1rem;      /* 16px mobile */
  @media (min-width: 768px) {
    padding-inline: 4rem;     /* 64px desktop */
  }
}
```

**Image-bleed do prawej** (obraz przylega do prawej krawędzi viewportu): `md:!pr-0` — zeruje prawy padding na md+.

### 1.5 Role kolorów (semantyczne)

Pełna paleta w [app/globals.css](../app/globals.css). Używamy **wyłącznie ról semantycznych** w kodzie:

| Rola | Klasa | Użycie |
|---|---|---|
| Tło default | `bg-bg` | Większość sekcji content |
| Tło białe | `bg-surface` | EventsPromise, EventsHalls, EventsCatering |
| Tło ciemne | `bg-primary` (=czarny), `bg-secondary` (=navy) | ContactBlock home, HotelReservationCta, BistroBlock |
| Tło inline (specjalne) | `style={{ background: 'var(--color-dark-ruby)' }}` | RestaurantBlock home, RestaurantReservation, EventsBlock CTA |
| Tekst default | `text-text` | Wszystko na light bg |
| Tekst muted | `text-text-muted` | Drugorzędne opisy |
| Tekst na dark | `text-text-inverse` | Sekcje dark — h2, body, eyebrow |
| Tekst na dark drugorzędny | `text-text-inverse/70` lub `/80` | Opisy pod h2 w dark sections |
| Accent (gold) | `text-accent`, `bg-accent` | Eyebrow Kontakt, gold tła (EventsSteps) |
| CTA filled | `bg-primary text-primary-foreground` | Standardowy CTA dark |
| Border | `border-primary` (=`border-2`) | Outline buttony |
| Border subtle | `border-border-subtle` | Cienkie linie dekoracyjne |
| Focus ring | `--color-ring` (gold) | Stan focus a11y |
| Error | `text-destructive`, `bg-destructive` | Walidacja formularza |

### 1.6 Radii

| Klasa | Wartość | Użycie |
|---|---|---|
| `rounded-md` | 12px | Karty, header bg |
| `rounded-lg` | 16px | Większe karty |
| `rounded-full` | 9999px | **Wszystkie buttony** (pill) + okrągłe avatary, ikony nawigacji w karuzelach |

---

## 2. Skala paddingów sekcji

Każda sekcja używa **jednej z 5 kanonicznych klas** (+ modyfikator `fixed-height`). Pozwala to wzrokowo "wczytać" rytm strony — kolejne sekcje mają tę samą oddech-między-tłami, więc strona płynie.

### 2.1 `hero` — `pt-32 pb-16 md:pt-40 md:pb-32`

Padding nakładamy na **inner div** w `layout-container`, **nie** na sekcji — sekcja musi być full-bleed dla obrazu tła z `min-h-screen`.

```tsx
<section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
  {/* bg image, gradient */}
  <div className="layout-container pt-32 pb-16 md:pt-40 md:pb-32">
    {/* hero content */}
  </div>
</section>
```

| | Mobile | Desktop |
|---|---|---|
| top | 128px (kompensuje fixed header) | 160px |
| bottom | 64px | 128px |

**Użycie**: HomeHero, HotelHero, EventsHero. ContactHero używa `md:pb-24` zamiast `md:pb-32` (krótszy hero `min-h-[60vh]`).

### 2.2 `header` — `pt-8 pb-12 md:pt-12 md:pb-16`

Mini-sekcja-pasek z samym nagłówkiem (eyebrow + h2), bez contentu.

| | Mobile | Desktop |
|---|---|---|
| top | 32px | 48px |
| bottom | 48px | 64px |

**Użycie**: ServicesIntro (jedyna obecna).

### 2.3 `default` — `py-20 md:py-32` ★ KANON dla 80% sekcji

```tsx
<section className="bg-bg py-20 md:py-32">
  <div className="layout-container flex flex-col gap-12 md:gap-20">
    <header>…</header>
    <div>…content…</div>
  </div>
</section>
```

| | Mobile | Desktop |
|---|---|---|
| py | 80px | 128px |

**Użycie**: AboutSection, EventsBlock, HotelBlock, EventTypesCarousel, EventsHalls, EventsCatering, EventsPromise (+ `min-h-[800px]`), HotelAmenities, HotelDiscover, HotelReservationCta, ContactInfo, ContactMap, ContactDirections.

### 2.4 `compact` — `py-16 md:py-20`

Sekcje, w których content sam w sobie jest "wysoki" (carousel kart 400px+, blok 2-kolumnowy z dużym obrazem) — pełne `py-32` daje przesadny pusty obszar.

| | Mobile | Desktop |
|---|---|---|
| py | 64px | 80px |

**Użycie**: ReviewsBlock, ContactBlock (home), HotelReviews, EventsReviews.

### 2.5 `spacious` — `py-24 md:py-40`

Końcowe sekcje "wezwanie do działania" / banery cross-sell. Maksymalny oddech, sygnalizuje "to jest finał strony".

| | Mobile | Desktop |
|---|---|---|
| py | 96px | 160px |

**Użycie**: EventsHotelUpsell, EventsReservationCta, ContactFinalCta.

### 2.6 `fixed-height` (modyfikator)

Nie zastępuje skali `py-*` — dodaje constraint wysokości do "kafelka" z Figmy. Stosujemy tylko gdy Figma jasno definiuje fixed-height tile.

```tsx
{/* min-h-* — sekcja może rosnąć z contentem */}
<section className="bg-bg flex min-h-[800px] items-center justify-center">

{/* lg:h-* — sztywna wysokość od desktopu */}
<section className="text-text-inverse py-20 lg:h-[800px]" style={{ background: 'var(--color-secondary)' }}>
```

**Użycie**: HotelQuote (`min-h-[800px]`), RestaurantBlock (`md:min-h-[760px] lg:h-[800px]`), BistroBlock (`lg:h-[800px]`), EventsPromise (`min-h-[800px]`), EventsSteps (`min-h-[800px]`), BistroBanner (`lg:min-h-[800px]`).

### 2.7 Wyjątki udokumentowane (NIE naprawiać bez decyzji designera)

- **MenuCategorySection** — `py-16 md:py-24`. Kategorie menu występują wielokrotnie pod sobą; pełne `py-32` rozciągnęłoby stronę menu do 6+ ekranów.
- **RestaurantPitch** — `py-16 md:py-[64px]` wewnątrz `min-h-[800px]`. Padding tu nie definiuje wysokości, tylko safe zone od krawędzi.
- **RestaurantCraft** — `py-10 md:py-16`. Leży między dwoma fixed-height (`RestaurantPitch` + `RestaurantAmbiance`); designer celowo ścisnął by Craft był "wstawką".
- **RestaurantAmbiance** — używa **hero-pattern** `pt-32 pb-16 md:pt-40 md:pb-20` mimo że to nie hero — celowy "drugi hero" w środku strony.
- **EventsSteps** — padding wewnątrz layout-container; sekcja ma `min-h-[800px] flex flex-col`.

---

## 3. Skala gapów

4 kanoniczne skale gapów. Reguła: **w obrębie jednej strony jeden gap dla danego kontekstu** — header-inner zawsze takie samo, section-inner zawsze takie samo.

### 3.1 `header-inner` — `gap-4`

Wewnątrz `<header>` lub flex-col wrappera, gdzie są eyebrow + h2 + opcjonalny opis.

```tsx
<header className="flex flex-col gap-4">
  {eyebrow && <p>…</p>}
  {title && <h2>…</h2>}
</header>
```

16px na obu breakpointach. Wystarcza bo eyebrow jest mały, a h2 ma `leading-none`.

**Wariant `gap-3 md:gap-4`** — centered header z 3 warstwami (eyebrow + h2 + dodatkowy podpis pod h2). Daje 12px na mobile, żeby cluster nie był luźny. Użycie: ReviewsBlock, HotelReviews, EventsReviews, EventsHotelUpsell, EventsReservationCta.

### 3.2 `section-inner` — `gap-12 md:gap-20`

Pomiędzy blokiem nagłówka a głównym contentem sekcji (list, grid, carousel).

```tsx
<div className="layout-container flex flex-col gap-12 md:gap-20">
  <header>…</header>
  <div>…content…</div>
</div>
```

48px mobile / 80px desktop. **Użycie**: AboutSection, HotelAmenities, HotelDiscover.

**Wariant `gap-10 md:gap-[54px]`** — przy carouselach (Reviews) — desktop 54px zamiast 80px bo carousel sam jest "kompaktowy" wizualnie.

**Wariant `gap-8` (mobile flat) lub `gap-10`** — gdy section content jest 2-kolumnowym layoutem (image + text obok siebie), nie pionowym stack'iem.

### 3.3 `content-cluster` — `gap-6` lub `gap-8`

Wewnątrz contentu: opis ↔ CTA, items w liście.

- `gap-6` — krótki opis + button
- `gap-8` — dłuższy opis + większy CTA, lub para image+content

---

## 4. Atomy typograficzne

### 4.1 Eyebrow

Mały capslocked nadpis nad nagłówkiem sekcji.

#### Default (kanon Sezam)

```tsx
<p className="text-text wide:text-lg text-base tracking-normal uppercase leading-[normal]">
  {eyebrow}
</p>
```

| | Wartość |
|---|---|
| Mobile / tablet / desktop <1440 | 16px (`text-base`) |
| Desktop ≥1440 (`wide:`) | 20px (`text-lg`) |
| Tracking | 0 (`tracking-normal`) |
| Line-height | normal (browser default ~1.4) |
| Case | UPPERCASE |
| Kolor | `text-text` (light bg) lub `text-text-inverse` (dark bg) |
| Weight | `font-normal` (400) |

**Użycie**: wszystkie sekcje z eyebrowem na home, hotel, events. Po ostatnim passie również ContactBlock home.

#### Wariant Kontakt subpage (świadomy odjazd)

```tsx
<p className="text-accent text-sm tracking-normal uppercase">
  {eyebrow}
</p>
```

- 16px stale (bez skoku na 1440)
- `text-accent` (gold) — wyróżnia accent kolorystyczny obok h2 `font-light`
- **Użycie**: ContactHero, ContactInfo, ContactMap, ContactDirections subpage

#### Wariant baseline-aligned (rzadko)

```tsx
<p className="text-text text-base tracking-normal uppercase md:text-2xl">
  {eyebrow}
</p>
```

- Eyebrow rośnie do 24px na desktopie żeby baseline-align z `lg:text-[48px]` h2 stojącym obok (header 2-kolumnowy)
- **Użycie**: HotelAmenities, HotelDiscover

#### Anti-patterns

- ❌ `text-base md:text-xl` — skok na 24px już od 768px zamiast na 20px od 1440px (niespójne ze skalą `wide:text-lg`)
- ❌ `tracking-wide` / `tracking-wider` / `tracking-widest` — eyebrow zawsze `tracking-normal`
- ❌ Pomijanie `leading-[normal]` — eyebrow potrafi się skleić z h2 gdy h2 ma `leading-none`

### 4.2 H1 hero — per branża

**Reguła wspólna**: zawsze `leading-none` + `tracking-tight md:tracking-[-0.03em]`. Weight i case są ustalone per branża jako element brand identity.

| Strona | Klasy | Weight | Case |
|---|---|---|---|
| **Home** | `text-3xl md:text-6xl lg:text-[80px]` | `font-normal` | mixed |
| **Hotel** | `text-3xl md:text-7xl lg:text-[80px] wide:text-[96px]` | `font-normal` | **UPPERCASE** |
| **Events** | `text-[64px] md:text-7xl lg:text-[120px]` | `font-medium` | mixed |
| **Restauracja** | mobile `text-[clamp(72px,20vw,112px)] font-black`, desktop `md:text-[120px] font-bold` | mixed | **UPPERCASE** |
| **Bistro** | `text-5xl md:text-7xl lg:text-[90px]` | `font-black` | **UPPERCASE** |
| **Kontakt** | `text-5xl md:text-6xl lg:text-7xl` | `font-normal` | mixed |

Hero h1 lg+ jest **zawsze większy niż h2 sekcji** (kanon h2 lg+ = 72px). Wszystkie hero osiągają ≥ 80px na lg+.

### 4.3 H2 sekcja

#### Klasy bazowe (kanon)

```tsx
<h2 className="text-2xl md:text-5xl lg:text-6xl leading-none tracking-tight md:tracking-[-0.03em]">
  {title}
</h2>
```

| | Mobile | Tablet (md) | Desktop (lg+) |
|---|---|---|---|
| `font-size` | 32px (`text-2xl`) | 64px (`text-5xl`) | 72px (`text-6xl`) |
| `line-height` | 1.0 (`leading-none`) | 1.0 | 1.0 |
| `letter-spacing` | -1% (`tracking-tight`) | -3% (`tracking-[-0.03em]`) | -3% |

**Uwaga subpage**: niektóre sekcje na subpage'ach (HotelReviews, EventsReviews, HotelReservationCta, EventsCatering) używają mobilnego `text-4xl` (48px) zamiast `text-2xl` (32px) — to obecnie zachowane jako wariant subpage. Konwergencja na md+ na 64px → lg+ 72px jest zachowana.

#### Weight per branża

| Strona | Weight | Uzasadnienie |
|---|---|---|
| Home, Hotel, Events, MenuReservation w restauracji | `font-normal` | Neutralna, "klasyczna" elegancja |
| **Restauracja** | `font-bold` | Brand restauracji — większy ciężar, tradycja |
| **Bistro** | `font-black` | Brand bistro — najcięższy weight, dynamika "uliczna" |
| **Kontakt** | `font-light` | Brand kontaktu — lekkość, oddech informacyjny |

#### Warianty rozmiaru

W trzech sytuacjach robimy mniejszą h2 świadomie:

| Wariant | Klasy | Użycie |
|---|---|---|
| `h2-medium` | `text-3xl md:text-4xl lg:text-[48px]` | Header 2-kolumnowy (eyebrow lewo / h2 prawo) — h2 nie wypycha eyebrowa za viewport. HotelAmenities, HotelDiscover. |
| `h2-sub` | `text-3xl md:text-4xl lg:text-5xl` | h2 jako "tytuł działu" obok bloku tekstu w 5/7 grid. ContactDirections. |
| `h2-large` | `text-4xl md:text-6xl lg:text-[80px]` | Sekcja "manifest brandu". RestaurantCraft, RestaurantAmbiance, RestaurantReservation, MenuCategorySection bez accent image. |

#### Anti-patterns

- ❌ `leading-tight` / `leading-snug` — h2 zawsze `leading-none`
- ❌ Mieszanie weights w obrębie jednej strony
- ❌ `lg:text-[64px]` w h2 — zostało zunifikowane do `lg:text-6xl`. Jeśli pojawia się — usunąć

### 4.4 H3 karta / podsekcja

Trzy warianty zależnie od kontekstu kartki/podsekcji.

| Wariant | Klasy | Użycie |
|---|---|---|
| `h3-card` | `text-2xl leading-none tracking-tight md:tracking-[-0.03em]` | EventTypesCarousel name, HallCard, HotelDiscover cardEyebrow |
| `h3-room` | `text-2xl md:text-3xl lg:text-[40px] leading-none font-normal tracking-tight md:tracking-[-0.03em] uppercase` | HotelRoomCard typ pokoju |
| `h3-amenity` | `text-xl md:text-2xl lg:text-[32px] leading-none font-normal tracking-tight md:tracking-[-0.03em] uppercase` | HotelAmenities item title |

Weight w h3 idzie za regułą branży (menu item w MenuCategorySection ma `font-bold` na restauracji, `font-black` na bistrze).

### 4.5 Body lead — 32px

Duży, display-style paragraf wprowadzający sekcję.

```tsx
{/* Standard — AboutSection intro, HotelQuote (z font-light) */}
<p className="text-2xl leading-[normal] tracking-[-0.03em]">{intro}</p>

{/* Highlight (kolorowe podświetlenia w treści) — EventsPromise */}
<p className="text-[32px] leading-tight tracking-[-0.03em]">{intro}</p>
```

| | Wartość |
|---|---|
| `font-size` | 32px (mobile + desktop, bez skoku) |
| `leading` | normal (~1.4) lub tight (1.2) wariant highlight |
| `tracking` | -0.03em (display) |

### 4.6 Body — large / default / small

5 kanonicznych poziomów body:

| Poziom | Klasy | Użycie |
|---|---|---|
| `body-large` | `text-base leading-[1.2] md:text-lg` | **Opisy w blokach contentowych** — EventsBlock, RestaurantBlock, HotelBlock, BistroBlock, HotelRoomCard.description |
| `body-large-emphasis` | `text-lg leading-[1.2] md:text-xl lg:text-2xl` | HotelReservationCta description, MenuCategorySection podkategoria |
| `body-default` | `text-base leading-[1.2] md:text-lg lg:text-xl` | HotelAmenities item description (krok większy — to lista bullet) |
| `body-small` | `text-base leading-[1.2]` (bez skoku na desktop) | Krótki podpis w karcie (HotelDiscover.cardDesc), opisy dań |
| `body-subtitle-hero` | `text-base leading-[1.2] md:text-xl` lub wariant Hotel `text-base wide:text-xl md:text-lg` | Podtytuł pod h1 hero |

**Reguła**: body zawsze `font-normal` (400), `tracking-normal` (0), `leading-[1.2]` (lub `leading-[normal]` dla lead, `leading-[1.4]` dla quote review).

### 4.7 Caption / dt label

```tsx
<dt className="text-text-inverse text-sm tracking-normal uppercase">{label}</dt>
```

| | Wartość |
|---|---|
| `font-size` | 16px (`text-sm`) |
| `tracking` | 0 |
| Case | UPPERCASE |
| Użycie | `<dt>` w ContactBlock, ContactInfo, RestaurantReservation, recenzje time stamp `text-xs` |

### 4.8 Quote — wariant HotelQuote

```tsx
<p className="text-xl leading-[normal] font-light tracking-[-0.02em] whitespace-pre-line uppercase md:text-[32px]">
  {quote}
</p>
```

Świadomy wariant `body-quote` z `font-light` + `tracking-[-0.02em]` (soft display). 24px mobile → 32px md+. **Tylko HotelQuote.**

---

## 5. Buttony

**Źródło prawdy**: [components/ReservationCtaButton.tsx](../components/ReservationCtaButton.tsx) — pill shape `h-[60px]`, `rounded-full`, `px-6`, `text-lg`, `font-normal`. 4 warianty kolorystyczne.

### Wysokości

| Wariant | Wysokość | Klasy | Użycie |
|---|---|---|---|
| **`btn-standard`** | `h-[60px]` | `inline-flex items-center justify-center rounded-full px-6 text-lg font-normal` | Standard — większość CTA |
| **`btn-hero`** | `h-[65px]` | jw. + `className="h-[65px]"` | Hero CTA (HotelHero, EventsHero), HotelReservationCta finalne |
| **`btn-card`** | `h-[48px]` + `text-base` | jw. + mniejszy tekst | Cross-sell card (HotelDiscover) |

### Warianty kolorystyczne (z `ReservationCtaButton`)

| Wariant | Klasy |
|---|---|
| `filled-dark` | `bg-primary text-primary-foreground border-2 border-primary hover:bg-primary-hover` |
| `filled-light` | `bg-text-inverse text-text border-2 border-text-inverse hover:bg-transparent hover:text-text-inverse` |
| `outline-dark` | `border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground` |
| `outline-light` | `border-2 border-text-inverse text-text-inverse hover:bg-text-inverse hover:text-text` |

### Anti-patterns

- ❌ `h-[63px]` — ujednolicić do `h-[60px]`
- ❌ Hardcoded background bez ról semantycznych — używać `bg-primary`/`bg-text-inverse`
- ❌ `rounded-lg` lub bez `rounded-full` — buttony Sezam zawsze pill

### Cykliczne strzałki (carousel nav)

Okrągłe dark buttony pod scrollerem na mobile:

```tsx
<button className="bg-primary text-primary-foreground hover:bg-primary-hover flex size-14 cursor-pointer items-center justify-center rounded-full transition-colors disabled:bg-gray disabled:cursor-not-allowed disabled:hover:bg-gray">
  <ChevronLeft className="size-6" />
</button>
```

Disabled state: `disabled:bg-gray` (gray fill, **nie** opacity drop).

---

## 6. Theme tła sekcji

### Light tła

| Klasa | Kontekst |
|---|---|
| `bg-bg` | Cream `#f6f5ef` — większość sekcji |
| `bg-surface` | Białe `#fff` — EventsPromise, EventsHalls, EventsCatering |

### Dark tła

| Klasa / styl | Kontekst |
|---|---|
| `bg-primary` (= czarny `#1f1f1c`) | ContactBlock home, HotelReservationCta |
| `bg-secondary` (= navy `#1c224f`) | BistroBlock home |
| `style={{ background: 'var(--color-dark-ruby)' }}` (= `#111c2a`) | RestaurantBlock home, RestaurantReservation, EventsBlock CTA inline |
| `style={{ background: 'var(--color-ruby-light)' }}` (= `#1a2789`) | BistroHero, BistroBanner |
| `style={{ background: 'var(--color-dark)' }}` | ContactFinalCta |
| `bg-accent` (gold) | EventsSteps |

### Reguła tekstu na dark

- Main: `text-text-inverse` (cream)
- Drugorzędny (opisy pod h2): `text-text-inverse/70` (ContactFinalCta, BistroBlock desc) lub `/80` (RestaurantBlock, BistroBlock desc)
- Eyebrow na dark: `text-text-inverse` (cream, full opacity)
- Link/CTA hover na dark: `hover:text-accent` (gold)

---

## 7. Per-page rozpiski

Każda strona poniżej ma tabelę sekcji w kolejności renderowania z paddingiem, gapami, weight'em h2 i typem eyebrowa.

**Legenda padding**: `H` = hero, `Hd` = header, `D` = default, `C` = compact, `S` = spacious, `FH` = fixed-height (+ baseline py jeśli różny od kanonu).
**Legenda eyebrow**: `D` = default Sezam, `K` = wariant Kontakt, `B` = wariant baseline-aligned, `—` = brak.

### 7.1 Home (/)

| # | Sekcja | Padding | Header gap | Section gap | h2 weight | Eyebrow |
|---|---|---|---|---|---|---|
| 1 | HeroSection | H | `gap-6` (subheadline) | — | (h1) `font-normal` | — |
| 2 | AboutSection | D | — | `gap-12 md:gap-20` | (lead) | — |
| 3 | ServicesIntro | Hd | `mt-4` (h2↔eyebrow) | — | `font-normal` | D |
| 4 | EventsBlock | D | `gap-4 md:gap-6` | `gap-8` (lg row) | `font-normal` | D |
| 5 | RestaurantBlock | FH + `py-20` | `gap-4` | `gap-8` | `font-normal` (text-text-inverse) | D (text-text-inverse) |
| 6 | HotelBlock | D | `gap-4` | `gap-6` | `font-normal` | D |
| 7 | BistroBlock | FH + `py-20` | `gap-4` | `gap-8` | `font-normal` (text-text-inverse) | D (text-text-inverse) |
| 8 | ReviewsBlock | C | `gap-3 md:gap-4` centered | `gap-10 md:gap-[54px]` | `font-normal` | D |
| 9 | ContactBlock | C | `gap-2` | `gap-6 md:gap-8` | `font-normal` (text-text-inverse) | D (text-text-inverse) |

### 7.2 Restauracja (/restauracja)

| # | Sekcja | Padding | h2 / hero | Eyebrow |
|---|---|---|---|---|
| 1 | RestaurantHero | H | h1 `font-black uppercase clamp(72,20vw,112)` mobile / `font-bold md:text-[120px]` desktop | mobile-only `text-sm font-medium tracking-widest` |
| 2 | RestaurantPitch | FH (`min-h-[800px]`) + wyjątek `py-16 md:py-[64px]` | (lead 2 zdania `font-bold` + `font-normal`) | — |
| 3 | RestaurantCraft | wyjątek `py-10 md:py-16` | `h2-large` (`font-bold`) | — |
| 4 | RestaurantAmbiance | hero-pattern (wyjątek "drugi hero") | `h2-large` (`font-bold uppercase`) | — |
| 5 | RestaurantReservation | D + dark | `h2-large` (`font-bold uppercase`) | — |

### 7.3 Restauracja → Menu (/restauracja/menu)

| # | Sekcja | Padding | h2 | Eyebrow |
|---|---|---|---|---|
| 1 | RestaurantHero (Menu wariant) | H | jw. | jw. |
| 2..N | MenuCategorySection × N | wyjątek `py-16 md:py-24` (powtarzalne) | `h2-large` (`font-bold` lub `font-black` dla bistro variant) | — |

### 7.4 Bistro (/bistro)

| # | Sekcja | Padding | h2 / hero | Eyebrow |
|---|---|---|---|---|
| 1 | BistroHero | H (`min-h-[420px]`) + dark | h1 `font-black uppercase text-5xl md:text-7xl lg:text-[90px]` | — |
| 2 | BistroBanner | FH (`lg:min-h-[800px]`) + `py-24 md:py-32` + dark | (banner h1 `font-black uppercase text-4xl md:text-6xl lg:text-[90px]`) | — |
| 3..N | MenuCategorySection × N | wyjątek `py-16 md:py-24` | `h2-large` (`font-black`) | — |

### 7.5 Hotel (/hotel)

| # | Sekcja | Padding | h2 weight | Eyebrow |
|---|---|---|---|---|
| 1 | HotelHero | H | (h1 `font-normal uppercase wide:text-[96px]`) | D |
| 2 | HotelQuote | FH (`min-h-[800px]`) | (body-quote `font-light`) | — |
| 3..N | HotelRoomCard × N | (karta, nie sekcja) | h3-room `font-normal uppercase` | — |
| N+1 | HotelAmenities | D | `h2-medium` `font-normal uppercase` | B (baseline-aligned) |
| N+2 | HotelReviews | C | h2 kanon (`text-4xl` mobile wariant) | D (centered) |
| N+3 | HotelDiscover | D | `h2-medium` `font-normal uppercase` | B (baseline-aligned) |
| N+4 | HotelReservationCta | D + dark | h2 kanon `font-normal uppercase` (text-text-inverse) | D (text-text-inverse, `md:text-2xl` lokalnie — do uspójnienia) |

### 7.6 Imprezy (/imprezy-okolicznosciowe)

| # | Sekcja | Padding | h2 weight | Eyebrow |
|---|---|---|---|---|
| 1 | EventsHero | H | (h1 `font-medium text-[64px] md:text-7xl lg:text-[120px]`) | D |
| 2 | EventsPromise | FH (`min-h-[800px]`) + D | (body-lead-highlight `text-[32px]`) | — |
| 3 | EventTypesCarousel | D | h2 kanon `font-normal` | D |
| 4 | EventsHalls | D | h2 kanon `font-normal` | D |
| 5 | EventsHotelUpsell | S + dark | h2 kanon `font-normal` | D (text-text-inverse) |
| 6 | EventsCatering | D | h2 kanon (`text-4xl` mobile wariant) `font-normal` | D |
| 7 | EventsReviews | C | h2 kanon (`text-4xl` mobile wariant) `font-normal` | D (centered) |
| 8 | EventsSteps | FH (`min-h-[800px]`) + accent bg | h2 kanon `font-normal` | D (na gold tle) |
| 9 | EventsReservationCta | S | h2 kanon `font-normal` | D z `text-accent` |

### 7.7 Kontakt (/kontakt)

| # | Sekcja | Padding | h2 weight | Eyebrow |
|---|---|---|---|---|
| 1 | ContactHero | H (`min-h-[60vh]`, `md:pb-24`) | h1 `font-normal text-5xl md:text-6xl lg:text-7xl` | K (Kontakt wariant) |
| 2 | ContactInfo | D | h2 `font-light text-4xl md:text-5xl lg:text-6xl` | K |
| 3 | ContactMap | D | h2 `font-light text-4xl md:text-5xl` | K |
| 4 | ContactDirections | D | `h2-sub` `font-light text-3xl md:text-4xl lg:text-5xl` | K |
| 5 | ContactFinalCta | S + dark | h2 `font-light text-4xl md:text-5xl lg:text-6xl` (text-text-inverse) | — |

---

## 8. Quick reference

| Element | Kanon |
|---|---|
| Heading tracking | `tracking-tight md:tracking-[-0.03em]` (−1% / −3%) |
| Heading leading | `leading-none` |
| Heading weight | `font-normal` (home/hotel/events) · `font-bold` (restauracja) · `font-black` (bistro) · `font-light` (kontakt subpage) |
| H1 hero lg+ | ≥ 80px (zawsze > h2 sekcji = 72px) |
| H2 sekcja kanon | `text-2xl md:text-5xl lg:text-6xl` (32/64/72px) |
| H2 mobile (subpage variant) | `text-4xl` (48px) — HotelReviews, EventsReviews, HotelReservationCta, EventsCatering |
| Body lead | `text-2xl leading-[normal] tracking-[-0.03em]` (32px) |
| Body large | `text-base leading-[1.2] md:text-lg` (16→20px) |
| Body tracking | 0 |
| Eyebrow | `text-base wide:text-lg tracking-normal uppercase leading-[normal]` (16→20px od 1440) |
| Eyebrow Kontakt | `text-sm text-accent tracking-normal uppercase` (16px, gold) |
| Eyebrow weight | `font-normal` (zawsze) |
| Container padding | 16px mobile / 64px desktop |
| Container max-width | 1512px |
| Section padding default | `py-20 md:py-32` (80/128px) |
| Section padding compact | `py-16 md:py-20` (64/80px) |
| Section padding spacious | `py-24 md:py-40` (96/160px) |
| Section padding hero | `pt-32 pb-16 md:pt-40 md:pb-32` na inner div |
| Header inner gap | `gap-4` (`gap-3 md:gap-4` centered z 3 warstwami) |
| Section inner gap | `gap-12 md:gap-20` (48/80px) |
| Content cluster gap | `gap-6` / `gap-8` |
| Button height | `h-[60px]` standard · `h-[65px]` hero · `h-[48px]` card |
| Button shape | `rounded-full px-6 text-lg font-normal` |
| Image-bleed right | `md:!pr-0` |
