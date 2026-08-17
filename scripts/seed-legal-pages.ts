/**
 * Seed stron prawnych: Regulamin Hotelu + Polityka prywatnosci.
 *
 * Zrodlo tresci PL: stara strona (Joomla) zajazdsezam.pl
 *   - http://zajazdsezam.pl/index.php/zajazd/regulamin
 *   - http://zajazdsezam.pl/index.php/home/rodo   (tam jako "Rodo")
 * Tresc PL przeniesiona wiernie; zmiany wylacznie redakcyjne:
 *   - literowka "dearomatyzaji" -> "dearomatyzacji", "600 zl." -> "600 zl"
 *   - odtworzony adres e-mail ukryty w Joomla cloak: daneosobowe@b3s.com.pl
 *   - dodane numerowanie punktow Regulaminu i naglowki sekcji (czytelnosc)
 *   - ujednolicone pojecie zdefiniowane: w pkt 6 i 8 Polityki zrodlo uzywalo
 *     "Hotel(em)", mimo ze pkt 1 definiuje "Zajazd" — wszedzie "Zajazd"
 *   - drobne poprawki interpunkcji ("uszkodzenia" -> "uszkodzenie",
 *     zbedne przecinki po "Ponadto" / "rzeczy") — bez zmiany tresci
 * EN to tlumaczenie PL (stara strona nie miala tych podstron po angielsku).
 *
 * Uruchomienie: node --env-file=.env.local --experimental-strip-types scripts/seed-legal-pages.ts
 */

import { createClient } from '@sanity/client'

// Musi zgadzac sie z LEGAL_PAGE_IDS w sanity/schemas/index.ts (skrypt jest
// standalone — nie importuje modulow projektu, patrz pozostale seedy).
const LEGAL_PAGE_IDS = {
  terms: 'regulamin',
  privacy: 'polityka-prywatnosci',
} as const

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
if (!token) throw new Error('Missing SANITY_API_TOKEN in .env.local')

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-05-16',
  token,
  useCdn: false,
})

const ls = (pl: string, en: string) => ({ _type: 'localeString', pl, en })
const lt = (pl: string, en: string) => ({ _type: 'localeText', pl, en })

// =============================================================================
// Regulamin Hotelu
// =============================================================================

const TERMS_PL = `INFORMACJE PODSTAWOWE

Recepcja: tel. 15 642 21 06
Restauracja: tel. 15 642 21 04

Recepcja czynna jest całą dobę.
Doba hotelowa trwa od godz. 14.00 do godz. 11.00.
Śniadanie serwujemy od godz. 6.00 do godz. 10.00.
Cisza nocna obowiązuje od godz. 22.00 do godz. 6.00.

Na terenie obiektu SEZAM znajduje się sauna i pralnia hotelowa dostępna dla Gości (odpłatnie).

Zapraszamy do naszego BISTRO SEZAM oferującego: kanapki, lody własnej produkcji, napoje, papierosy, wyroby garmażeryjne i ciasto.

ZASADY POBYTU

1. Pozostanie w hotelu lub pozostawienie rzeczy po godz. 11.00 bez zgłoszenia tego w recepcji jest traktowane jako przedłużenie pobytu.

2. Osoby niezameldowane w hotelu mogą przebywać gościnnie w pokoju hotelowym do godz. 22.00.

3. Hotel nie odpowiada za utratę lub uszkodzenie rzeczy wniesionych przez Gościa na teren obiektu.

4. Gość hotelowy ponosi pełną odpowiedzialność materialną za wszelkiego rodzaju uszkodzenia lub zniszczenia przedmiotów wyposażenia i urządzeń technicznych hotelu powstałe z jego winy lub z winy odwiedzających go osób. Gość hotelowy ma obowiązek zawiadomić recepcję hotelu o wystąpieniu szkody niezwłocznie po jej stwierdzeniu.

5. Na terenie całego hotelu obowiązuje całkowity ZAKAZ palenia papierosów i wyrobów tytoniowych. Złamanie tego zakazu będzie skutkować pokryciem kosztów dearomatyzacji pokoju w wysokości 600 zł, które zostaną automatycznie doliczone do rachunku hotelowego.

6. Ze względu na bezpieczeństwo przeciwpożarowe zabronione jest używanie w pokojach hotelowych i innych pomieszczeniach grzałek, żelazek i innych podobnych urządzeń elektrycznych nie stanowiących wyposażenia pokoju.

7. Przedmioty pozostawione przez wyjeżdżającego Gościa w pokoju hotelowym przechowywane są przez okres trzech miesięcy.`

const TERMS_EN = `KEY INFORMATION

Reception: tel. +48 15 642 21 06
Restaurant: tel. +48 15 642 21 04

Reception is open 24 hours a day.
The hotel day runs from 2:00 p.m. until 11:00 a.m.
Breakfast is served from 6:00 a.m. until 10:00 a.m.
Quiet hours are observed from 10:00 p.m. until 6:00 a.m.

A sauna and a hotel laundry are available to Guests on the SEZAM premises (for an additional fee).

We also invite you to our BISTRO SEZAM, offering sandwiches, house-made ice cream, drinks, cigarettes, delicatessen products and cake.

RULES OF STAY

1. Remaining at the hotel or leaving belongings in the room after 11:00 a.m. without notifying reception is treated as an extension of the stay.

2. Persons not checked in at the hotel may visit a hotel room until 10:00 p.m.

3. The hotel is not liable for the loss of or damage to belongings brought onto the premises by a Guest.

4. The Guest bears full financial liability for any damage to or destruction of the hotel's furnishings and technical equipment caused by the Guest or by persons visiting them. The Guest is obliged to notify hotel reception of any damage immediately upon discovering it.

5. Smoking cigarettes and tobacco products is STRICTLY PROHIBITED throughout the hotel. Breaching this ban results in a room deodorisation charge of PLN 600, which is automatically added to the hotel bill.

6. For fire safety reasons, the use of heaters, irons and other similar electrical appliances that are not part of the room's furnishings is prohibited in hotel rooms and other areas.

7. Items left behind by a departing Guest in a hotel room are stored for a period of three months.`

// =============================================================================
// Polityka prywatnosci (stara strona: "Rodo")
// =============================================================================

const PRIVACY_PL = `1. Administratorem danych osobowych Gościa jest P.P.H.U. Sezam z siedzibą Turbia, ul. Św. Jana Pawła II 42, NIP 8670000153, zwana dalej „Zajazdem”.

2. Dane osobowe Gościa są przetwarzane na podstawie zawartej pomiędzy Gościem a Zajazdem umowy o świadczenie usług hotelarskich. Celem przetwarzania danych osobowych jest świadczenie usług hotelarskich lub innych podobnych usług, które na życzenie Gościa są świadczone przez Zajazd. Ponadto dane osobowe Gościa mogą być przetwarzane przez monitoring wizyjny wykorzystywany w Zajeździe. Celem stosowania monitoringu wizyjnego jest ochrona Gościa oraz innych osób przebywających na terenie Zajazdu lub w jego okolicy.

3. Zajazd informuje, że podanie danych osobowych jest wymogiem umownym, jak i ustawowym (przy dokumentowaniu sprzedaży dokonanej na rzecz Gościa fakturą VAT). Brak podania danych osobowych uniemożliwia zawarcie umowy z Zajazdem, jak również uniemożliwia wystawienie faktury VAT.

4. Zajazd informuje, że każdy Gość ma prawo dostępu do swoich danych osobowych oraz ich poprawiania i aktualizacji. Każdy Gość ma również prawo do przenoszenia danych, wniesienia sprzeciwu odnośnie przetwarzania oraz do usunięcia danych osobowych, jeżeli zachodzą ku temu podstawy prawne.

5. Zajazd informuje, że dane osobowe Gościa będą przechowywane przez cały okres świadczenia usługi hotelarskiej na rzecz Gościa, jak również dane będą przechowywane przez okres przedawnienia ewentualnych roszczeń, w tym roszczeń podatkowych i cywilnych. Natomiast dane osobowe przetwarzane przez monitoring wizyjny będą przechowywane przez okres 30 dni, chyba że z uwagi na szczególne okoliczności (np. wypadek) zapis z monitoringu będzie musiał być przechowywany dłużej, w tym przez czas ewentualnego postępowania prowadzonego na podstawie przepisów ustawy.

6. Zajazd informuje, że dane osobowe Gościa mogą być ujawniane następującym kategoriom odbiorców:
a. firmom księgowym współpracującym z Zajazdem,
b. kancelariom prawnym współpracującym z Zajazdem,
c. firmom ubezpieczeniowym współpracującym z Zajazdem,
d. firmom informatycznym i firmom zapewniającym wsparcie oraz zarządzanie infrastrukturą IT Zajazdu,
e. firmom kurierskim i pocztowym,
f. biurom podróży.

7. Zajazd informuje o prawie wniesienia skargi do organu nadzorczego nadzorującego sposób przetwarzania danych osobowych.

8. W przypadku zarezerwowania noclegu w Zajeździe za pośrednictwem biura podróży lub portalu rezerwacyjnego kategorie danych osobowych Gościa przekazane do Zajazdu przez te podmioty mogą obejmować w szczególności imię i nazwisko, datę pobytu, adres e-mail oraz numer telefonu Gościa. O dokładnym źródle, z którego Zajazd pozyskał dane osobowe Gościa, można uzyskać informacje w recepcji.

9. Ponadto Zajazd udostępnia adres daneosobowe@b3s.com.pl, za pomocą którego można kontaktować się w sprawie danych osobowych.`

const PRIVACY_EN = `1. The controller of the Guest's personal data is P.P.H.U. Sezam, with its registered office at Turbia, ul. Św. Jana Pawła II 42, tax ID (NIP) 8670000153, hereinafter referred to as the "Inn".

2. The Guest's personal data is processed on the basis of the contract for the provision of hotel services concluded between the Guest and the Inn. The purpose of processing personal data is the provision of hotel services or other similar services rendered by the Inn at the Guest's request. In addition, the Guest's personal data may be processed by the CCTV system used at the Inn. The purpose of the CCTV system is to protect the Guest and other persons present on or near the Inn's premises.

3. The Inn advises that providing personal data is both a contractual and a statutory requirement (when documenting a sale made to the Guest with a VAT invoice). Failure to provide personal data makes it impossible to conclude a contract with the Inn, as well as to issue a VAT invoice.

4. The Inn advises that every Guest has the right to access their personal data and to correct and update it. Every Guest also has the right to data portability, the right to object to processing and the right to have their personal data erased, where there are legal grounds for doing so.

5. The Inn advises that the Guest's personal data will be stored for the entire period during which the hotel service is provided to the Guest, and will also be stored for the limitation period of any potential claims, including tax and civil claims. Personal data processed by the CCTV system will be stored for 30 days, unless, due to particular circumstances (e.g. an accident), the recording has to be stored for longer, including for the duration of any proceedings conducted under statutory provisions.

6. The Inn advises that the Guest's personal data may be disclosed to the following categories of recipients:
a. accounting firms cooperating with the Inn,
b. law firms cooperating with the Inn,
c. insurance companies cooperating with the Inn,
d. IT companies and companies providing support and management of the Inn's IT infrastructure,
e. courier and postal companies,
f. travel agencies.

7. The Inn advises of the right to lodge a complaint with the supervisory authority overseeing the processing of personal data.

8. Where accommodation at the Inn has been booked through a travel agency or a booking portal, the categories of the Guest's personal data transferred to the Inn by those entities may include in particular the Guest's first name and surname, dates of stay, e-mail address and telephone number. Information on the exact source from which the Inn obtained the Guest's personal data is available at reception.

9. The Inn also provides the address daneosobowe@b3s.com.pl, which may be used to make contact in matters concerning personal data.`

// =============================================================================

const docs: { _id: string; _type: string; [key: string]: unknown }[] = [
  {
    _id: LEGAL_PAGE_IDS.terms,
    _type: 'legalPage',
    title: ls('Regulamin Hotelu', 'Hotel Regulations'),
    intro: lt(
      'Regulamin obowiązuje wszystkich Gości Zajazdu Sezam. Prosimy o zapoznanie się z jego treścią przed rozpoczęciem pobytu.',
      'These regulations apply to all Guests of Zajazd Sezam. Please read them before the start of your stay.',
    ),
    body: lt(TERMS_PL, TERMS_EN),
    seo: {
      _type: 'seoMeta',
      metaTitle: {
        pl: 'Regulamin Hotelu — Zajazd Sezam Stalowa Wola',
        en: 'Hotel Regulations — Zajazd Sezam Stalowa Wola',
      },
      metaDescription: {
        pl: 'Regulamin hotelu Zajazd Sezam w Stalowej Woli: doba hotelowa, cisza nocna, śniadania, zasady pobytu i odpowiedzialność Gościa.',
        en: 'Hotel regulations of Zajazd Sezam in Stalowa Wola: hotel day, quiet hours, breakfast, rules of stay and Guest liability.',
      },
      noIndex: false,
    },
  },
  {
    _id: LEGAL_PAGE_IDS.privacy,
    _type: 'legalPage',
    title: ls('Polityka prywatności', 'Privacy Policy'),
    intro: lt(
      'Informacja o przetwarzaniu danych osobowych i prywatności Gości Zajazdu Sezam.',
      'Information on the processing of personal data and the privacy of Zajazd Sezam Guests.',
    ),
    body: lt(PRIVACY_PL, PRIVACY_EN),
    seo: {
      _type: 'seoMeta',
      metaTitle: {
        pl: 'Polityka prywatności — Zajazd Sezam Stalowa Wola',
        en: 'Privacy Policy — Zajazd Sezam Stalowa Wola',
      },
      metaDescription: {
        pl: 'Informacja o przetwarzaniu danych osobowych Gości Zajazdu Sezam: administrator, cele, okres przechowywania, odbiorcy i prawa Gościa.',
        en: 'Information on processing personal data of Zajazd Sezam Guests: controller, purposes, retention periods, recipients and Guest rights.',
      },
      noIndex: false,
    },
  },
]

for (const doc of docs) {
  const result = await client.createOrReplace(doc)
  console.log('✓ legalPage zapisany:', result._id)
}
