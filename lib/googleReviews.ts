// Kształt zgodny z Google Places API "place details" → field `reviews`.
// W F8 podmienimy mock-call na prawdziwy fetch przez GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID.
export type GoogleReview = {
  authorName: string
  authorUrl?: string
  profilePhotoUrl?: string
  rating: number
  relativeTimeDescription: { pl: string; en: string }
  text: { pl: string; en: string }
  /** Unix ms — używane do sortowania */
  time: number
}

export type GoogleReviewsData = {
  rating: number
  userRatingsTotal: number
  reviews: GoogleReview[]
}

const MOCK_DATA: GoogleReviewsData = {
  rating: 4.4,
  userRatingsTotal: 1100,
  reviews: [
    {
      authorName: 'Agnieszka W',
      rating: 5,
      relativeTimeDescription: { pl: '1 tydzień temu', en: '1 week ago' },
      text: {
        pl: 'Idealne miejsce na przyjęcia w gronie rodzinnym, lokal przytulny i zadbany. Jedzenie pyszne, przygotowane ze świeżych składników podane w estetyczny sposób. Różnorodne menu sprawia, że każdy znajdzie coś dla siebie. Obsługa miła, pomocna i dbająca o gości. Polecam serdecznie.',
        en: 'A perfect place for family gatherings — cozy and well-kept. The food is delicious, made from fresh ingredients and beautifully plated. The varied menu means everyone finds something they love. The staff is kind, helpful and attentive. Highly recommend.',
      },
      time: Date.now() - 7 * 24 * 60 * 60 * 1000,
    },
    {
      authorName: 'Centro Dachy',
      rating: 5,
      relativeTimeDescription: { pl: '1 tydzień temu', en: '1 week ago' },
      text: {
        pl: 'Byliśmy na urodzinowym obiedzie. Na kilkanaście osób nie powtórzyło się żadne danie, a mimo to wszystko było podane w tym samym czasie. Szacunek dla kucharzy i kelnerów. Pyszne jedzonko.',
        en: 'We had a birthday dinner here. For more than a dozen guests no dish repeated, yet everything was served at the same time. Hats off to the chefs and waiters. Delicious food.',
      },
      time: Date.now() - 10 * 24 * 60 * 60 * 1000,
    },
    {
      authorName: 'Anna Kretka',
      authorUrl: 'https://www.google.com/maps/contrib/107724545548099902402?hl=pl',
      rating: 5,
      relativeTimeDescription: { pl: '3 miesiące temu', en: '3 months ago' },
      text: {
        pl: 'Super eleganckie miejsce, idealne na organizację przyjęcia — piękny wystrój, przepyszne i urozmaicone jedzenie, przemiła i pomocna obsługa. Gorąco polecam.',
        en: 'Very elegant venue, perfect for hosting events — beautiful interior, delicious and varied food, very friendly and helpful staff. Highly recommend.',
      },
      time: Date.now() - 90 * 24 * 60 * 60 * 1000,
    },
    {
      authorName: 'Tomek S',
      rating: 5,
      relativeTimeDescription: { pl: '2 miesiące temu', en: '2 months ago' },
      text: {
        pl: 'Nocowaliśmy z rodziną — pokój czysty, łóżka wygodne, śniadanie obfite i smaczne. Dzieciom najbardziej spodobała się sauna. Wracamy na pewno.',
        en: 'We stayed here with the family — clean room, comfortable beds, generous and tasty breakfast. The kids loved the sauna the most. We will definitely be back.',
      },
      time: Date.now() - 60 * 24 * 60 * 60 * 1000,
    },
  ],
}

/**
 * Mock — w F8 zastąpimy realnym fetchem do Google Places API:
 *   GET https://maps.googleapis.com/maps/api/place/details/json
 *     ?place_id=GOOGLE_PLACE_ID
 *     &fields=rating,user_ratings_total,reviews
 *     &language={locale}
 *     &key=GOOGLE_PLACES_API_KEY
 * Z cache via Next.js fetch + revalidate co 24h.
 */
export async function getGoogleReviews(): Promise<GoogleReviewsData> {
  return MOCK_DATA
}
