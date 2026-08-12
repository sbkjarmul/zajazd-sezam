import { SanityImage } from '@/components/SanityImage'
import { ParallaxImage } from '@/components/ParallaxImage'
import { cn } from '@/lib/utils'
import type { Locale } from '@/i18n/routing'

type Props = {
  image: Parameters<typeof SanityImage>[0]['image']
  locale: Locale
  // Pionowy gradient nalozony na zdjecie: gora = kolor biezacej sekcji, dol =
  // kolor sekcji nastepnej (plynne przejscie miedzy panelami) - wg Figmy.
  gradient: string
  // Klasy pozycjonowania ramki (absolute + inset/top/bottom).
  className?: string
  // Domyslnie full-bleed (rozwiazuje sie do 100vw dla kazdego viewportu). Forma
  // media-conditioned zamiast golego '100vw' celowo: te obrazy zyja w sekcjach
  // bramkowanych breakpointem (mobile/desktop), wiec jedna kopia jest zawsze
  // display:none. Next mierzy jej boundingWidth = 0 i przy golym '100vw' odpala
  // falszywy warning "not rendered at full viewport width". Efektywny rozmiar
  // identyczny, ostrzezenie znika.
  sizes?: string
  // Gdy true - zdjecie dryfuje na scroll (ParallaxImage) zamiast statycznego kadru.
  parallax?: boolean
}

// Pelnoszerokie zdjecie "wtapiajace sie" w sekcje (wersja mobilna makiety,
// Figma 936:2): absolutny kadr + nalozony gradient, ktory u gory ma kolor
// biezacej sekcji, a u dolu kolor sekcji nastepnej. To tylko dekoracja tla -
// tresc sekcji lezy nad nim (z-10).
export function SectionBleedImage({
  image,
  locale,
  gradient,
  className,
  sizes = '(min-width: 0px) 100vw',
  parallax = false,
}: Props) {
  return (
    <div className={cn('pointer-events-none absolute overflow-hidden', className)}>
      {parallax ? (
        <ParallaxImage image={image} locale={locale} sizes={sizes} loading="eager" />
      ) : (
        <SanityImage image={image} locale={locale} fill sizes={sizes} className="object-cover" />
      )}
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: gradient }} />
    </div>
  )
}
