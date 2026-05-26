import type { CONTACT_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { HeroParallaxImage } from '@/components/sections/HeroParallaxImage'

type Props = {
  image: NonNullable<CONTACT_PAGE_QUERY_RESULT>['heroImage']
  locale: Locale
}

// Hero kontakt — animacje 1:1 z HotelHero (HeroParallaxImage): load reveal
// 10s ease-out 1.2→1.1 + scroll parallax 1.1→1.0. Obraz jest `fixed inset-0`
// (pełny viewport behind całej strony), sekcja h-[400px] określa tylko ile
// miejsca zajmuje w document flow — ContactInfo z bg-light zakrywa obraz
// po przewinięciu.
export function ContactHero({ image, locale }: Props) {
  if (!image) return null

  return (
    <section className="relative h-[400px] w-full overflow-hidden">
      <HeroParallaxImage image={image} locale={locale} imageClassName="object-bottom" />
    </section>
  )
}
