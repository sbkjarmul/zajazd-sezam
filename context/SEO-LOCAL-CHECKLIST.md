# SEO / GEO — checklista lokalna (Stalowa Wola i okolice)

> Cel: **top 3 w Google + w mapce (Local Pack)** dla fraz „restauracja / hotel / sala
> weselna Stalowa Wola" i okolic. O pozycji w mapce decyduje w ~50% **Google Business
> Profile + opinie + spójne NAP**, reszta to on-page/technical + linki lokalne.
>
> Legenda: `[x]` zrobione · `[ ]` do zrobienia · **P0** teraz · **P1** przed/przy launchu · **P2** ciągłe
>
> NAP (jedno źródło prawdy — musi być IDENTYCZNE wszędzie):
> **Zajazd Sezam · ul. Komisji Edukacji Narodowej 51, 37-450 Stalowa Wola · +48 15 642 21 06**
> geo: `50.569070, 22.038126`

---

## 1. Technical / on-page SEO — stan kodu

- [x] JSON-LD `Organization` + `LocalBusiness` globalnie (NAP, godziny, geo, sameAs)
- [x] JSON-LD branżowe: `Restaurant`, `LodgingBusiness`, `EventVenue`, Bistro (`Restaurant`), `FAQPage`
- [x] Geo (`GeoCoordinates`) + `sameAs` → Google Business Profile
- [x] `og:image` per strona + fallback statyczny; martwe URL-e image/logo naprawione
- [x] Meta title/description z frazą „Stalowa Wola" na każdej stronie
- [x] hreflang PL/EN + x-default, canonical per strona
- [x] `html lang=pl-PL/en-US`, jeden H1 per strona, sitemap + robots
- [x] **P1** `areaServed` w schema — Stalowa Wola + 8 okolicznych miejscowości (silny sygnał geo)
- [x] **P1** `hasMap` (Google Maps z geo) + `priceRange` w LocalBusiness/Restaurant/Bistro/Hotel
- [x] **P1** `Menu` schema z realnymi pozycjami (ceny PLN) na `/restauracja/menu`
- [ ] **P2** `AggregateRating` w schema — dopiero po realnych opiniach Google (NIGDY fałszywe)
- [ ] **P1** Embedded Google Map (iframe) na `/kontakt` — dziś placeholder (Faza 8 CLAUDE.md)
- [ ] **P1** Alt-teksty zdjęć z frazą lokalną gdzie naturalne („…w Stalowej Woli")

## 2. Google Business Profile (GBP) — NAJWAŻNIEJSZE dla mapki

> ✅ Profil ISTNIEJE od dawna (staż = przewaga). Praca = AUDYT i optymalizacja, nie zakładanie.

- [x] **P0** Wizytówka istnieje i zweryfikowana (własność potwierdzona)
- [x] **P0** `sameAs` w kodzie (share.google/JU9WU9Wq2y2irrfpC) prowadzi do TEGO profilu ✔
- [x] **P0** NAP na GBP zgodne z adresem na stronie (potwierdzone przez klienta)
- [ ] **P0** Kategorie do ustawienia w GBP (edycja na koncie właściciela — nie po stronie kodu):
  - Główna (jedna, najwięcej wagi): **Restauracja** — rekomendacja (rdzeń „zajazdu")
  - Dodatkowe: **Hotel**, **Dom weselny / Sala bankietowa**, **Bar** (bistro),
    **Firma cateringowa**, **Organizator imprez i eventów**
  - ⚠️ Główną wybrać wg priorytetu biznesu (jeśli #1 to wesela → główna „Dom weselny")
- [ ] **P0** NAP identyczne co na stronie (znak w znak) + strona WWW `https://zajazdsezam.pl`
- [ ] **P0** Godziny otwarcia (restauracja 12–22, recepcja 24/7) + godziny świąteczne
- [ ] **P0** Obszar działania / adres widoczny (nie ukrywać — to obiekt stacjonarny)
- [ ] **P1** 20+ zdjęć w kategoriach: budynek/wejście, sale, pokoje, dania, wesele, zespół
- [ ] **P1** Opis firmy z frazami: „Stalowa Wola", „wesela", „noclegi", „restauracja", „sala bankietowa"
- [ ] **P1** Atrybuty: parking, WiFi, dostępność, płatność kartą, sauna, na wynos (bistro)
- [ ] **P1** Produkty/Usługi w GBP: typy pokoi, oferta weselna, menu, catering
- [ ] **P2** Posty GBP co 1–2 tyg. (oferty, wydarzenia, sezonowe menu) — sygnał aktywności
- [ ] **P2** Q&A — samodzielnie dodać najczęstsze pytania z odpowiedziami
- [ ] **P1** Ten sam profil podpiąć w `siteSettings.googleBusinessProfileUrl` (już: link jest)

## 3. Opinie (reviews) — drugi najmocniejszy lever

- [ ] **P0** Ustalić proces proszenia o opinię (po pobycie/evencie: SMS/mail z linkiem GBP)
- [ ] **P1** Wygenerować krótki link do opinii (GBP → „Poproś o opinie") + QR na recepcji/stolikach
- [ ] **P2** Odpowiadać na KAŻDĄ opinię (pozytywną i negatywną) w ≤48h — z frazą lokalną w odpowiedzi
- [ ] **P2** Cel startowy: 30+ opinii, śr. ≥4,5; potem stały przyrost (świeżość się liczy)
- [ ] **P2** Zbierać też opinie na Booking / Tripadvisor / Facebook (dywersyfikacja)

## 4. Cytowania NAP / katalogi (citations) — spójność = zaufanie

> Wszędzie DOKŁADNIE to samo NAP. Rozbieżności (skróty ulicy, stary telefon) osłabiają geo.

- [ ] **P1** Booking.com + Tripadvisor (hotel — mocne, tematyczne)
- [ ] **P1** pkt.pl, panoramafirm.pl, zumi.pl, aleo.com, gowork.pl
- [ ] **P1** Katalogi weselne: weselezklasa / ślubowa / mojewesele / weddings.pl
- [ ] **P1** Facebook + Instagram (profil firmowy z adresem, spójne NAP)
- [ ] **P2** Lokalne: portale Stalowej Woli, powiat stalowowolski, izba/organizacje branżowe
- [ ] **P2** Audyt spójności NAP co kwartał (wyszukać stary adres/telefon i poprawić)

## 5. Treść lokalna (local content) — pod frazy z intencją

- [ ] **P1** Nasycić istniejące strony frazami: „w Stalowej Woli", „na Podkarpaciu", nazwy dzielnic
- [ ] **P2** Landingi/sekcje pod okoliczne miejscowości (patrz §7) — „sala weselna Nisko/Tarnobrzeg…"
- [ ] **P2** Blog/aktualności: „gdzie zjeść w Stalowej Woli", „sala na komunię Stalowa Wola",
      „hotel na wesele Podkarpacie" — treść odpowiadająca na realne zapytania
- [ ] **P2** Strona/sekcja „Dojazd" — z okolic (Nisko, Tarnobrzeg, Nowa Dęba), parking, koordynaty
- [x] **P1** FAQ + FAQPage pod long-tail lokalny — restauracja, hotel, imprezy (wspólny `FaqSection`)

### Frazy docelowe (przykłady — do rank-trackingu)
| Branża | Główne | Long-tail lokalny |
|---|---|---|
| Restauracja | restauracja Stalowa Wola | gdzie zjeść obiad Stalowa Wola, restauracja polska kuchnia Stalowa Wola |
| Hotel | hotel Stalowa Wola, nocleg Stalowa Wola | tani nocleg Stalowa Wola, pokoje z parkingiem Stalowa Wola |
| Imprezy | sala weselna Stalowa Wola | wesele Stalowa Wola, sala na komunię/stypę/urodziny Stalowa Wola |
| Bistro | bistro Stalowa Wola, obiady na wynos | tanie obiady Stalowa Wola, jedzenie na wynos Stalowa Wola |

## 6. Linki lokalne (local link building)

- [ ] **P2** Portale i media Stalowej Woli / powiatu (wpisy, patronaty, wydarzenia)
- [ ] **P2** Partnerzy weselni (fotografowie, DJ-e, kwiaciarnie) — wzajemne linki/rekomendacje
- [ ] **P2** Lokalne organizacje, izba gospodarcza, sponsoring wydarzeń
- [ ] **P2** Katalogi turystyczne Podkarpacia / szlaki kulinarne

## 7. Boostery GEO w kodzie (do implementacji — mogę zrobić)

- [x] **P1** `areaServed` w `LocalBusiness`/`Restaurant`/`Bistro`/`EventVenue`/`LodgingBusiness` —
      **Stalowa Wola, Nisko, Tarnobrzeg, Nowa Dęba, Zaklików, Radomyśl nad Sanem,
      Pysznica, Bojanów** ⚠️ POTWIERDZIĆ realny zasięg z klientem (lista w `lib/seo/jsonLd.ts`)
- [x] **P1** `hasMap` → deep-link Google Maps (z geo; nadpisywalny przez `siteSettings.googleMapsUrl`)
- [x] **P1** `priceRange` — Restauracja/Hotel `$$`, Bistro `$` (do korekty z klientem)
- [x] **P1** `Menu` + `hasMenuSection`/`MenuItem` z Sanity (ceny PLN) na `/restauracja/menu`
- [ ] **P1** Embedded mapa na `/kontakt` (Google Maps Embed API — Faza 8)
- [x] **P2** `BreadcrumbList` JSON-LD na wszystkich podstronach (ścieżka w SERP, PL/EN)
- [ ] **P2** Landing pages per miejscowość (jeśli zdecydujemy — §5)

## 8. Pomiar i monitoring

- [ ] **P1** Google Search Console — weryfikacja domeny + submit `sitemap.xml`
- [ ] **P1** Google Analytics 4 (`NEXT_PUBLIC_GA4_MEASUREMENT_ID` — Faza 8)
- [ ] **P1** Walidacja JSON-LD na żywym URL: [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] **P2** Monitoring pozycji dla fraz z §5 (ręcznie lub narzędzie) — mierzyć mapkę osobno
- [ ] **P2** GBP Insights — telefony, kliknięcia „trasa", wyświetlenia w mapce
- [ ] **P2** Core Web Vitals (LCP/CLS/INP) w GSC — szybkość wpływa na ranking

## 9. Migracja starej strony (Joomla) — przekierowania

> Zweryfikowane 2026-08-14 przez crawl żywej `http://zajazdsezam.pl` (stara Joomla nadal online).

- [x] **P0** Redirecty 301/308 kompletne — 21 realnych URL-i starej strony pokrytych w `next.config.ts`
  (menu + warianty `index.php`/SEF; podtypy imprez; `/rodo`, `/zajazd/regulamin`)
- [x] Potwierdzone: brak osieroconych URL-i treściowych (19 prób → 404); cele redirectów istnieją
- [ ] **P1 launch** ⚠️ Stara strona ma ZEPSUTE HTTPS (działa tylko `http://`) — po wdrożeniu
  upewnić się, że `https://zajazdsezam.pl` działa i `http→https` się przekierowuje
- [ ] **P1 launch** Po deployu: GSC → Strony → 404 — dorobić redirecty dla ewentualnych orphanów
- [ ] (opcjonalne) `/index.php/component/search` (200, wyszukiwarka Joomli) — noindex/ignore
- [ ] (opcjonalne) 308 → literalne 301 przez `vercel.json` `statusCode: 301` (Google traktuje równoważnie)

---

## Kolejność ataku (rekomendacja)

1. **P0 teraz:** GBP (§2) + start zbierania opinii (§3) — to daje najwięcej i działa niezależnie od deployu.
2. **Przy launchu (P1):** boostery geo w kodzie (§7), citations (§4), GSC+GA4 (§8), mapa na /kontakt.
3. **Ciągłe (P2):** opinie, posty GBP, treść lokalna, linki — to buduje przewagę w czasie.

> Rzeczy z §7 (kod) mogę zaimplementować od ręki — daj znać, zaczynam od `areaServed` +
> `hasMap` + `priceRange` (najszybszy zysk geo w schema).
