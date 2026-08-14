import { jsonLdScript } from '@/lib/seo/jsonLd'

// Renderuje jeden blok danych strukturalnych Schema.org jako <script type="application/ld+json">.
// Server component — osadzany w layoutach/stronach z danymi z Sanity (siteSettings).
// Wiele niezaleznych typow (np. Organization + LocalBusiness) = wiele instancji tego komponentu;
// Google akceptuje wiele osobnych blokow JSON-LD na stronie.
export function JsonLd<T>({ data }: { data: T }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(data)} />
}
