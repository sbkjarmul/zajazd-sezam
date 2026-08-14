import { JsonLd } from './JsonLd'
import { breadcrumbListJsonLd } from '@/lib/seo/jsonLd'
import { buildBreadcrumb } from '@/lib/seo/metadata'
import type { Locale, Pathname } from '@/i18n/routing'

// Emituje BreadcrumbList JSON-LD dla danej podstrony (niewidoczny w UI — wplywa
// tylko na wyglad wyniku w Google). Na stronie glownej nic nie renderuje.
export function Breadcrumbs({ locale, pathname }: { locale: Locale; pathname: Pathname }) {
  const data = breadcrumbListJsonLd({ items: buildBreadcrumb(locale, pathname) })
  if (!data) return null
  return <JsonLd data={data} />
}
