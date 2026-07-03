import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { ParallaxImage } from '@/components/ParallaxImage'
import { RevealText } from '@/components/RevealText'
import { Link } from '@/i18n/navigation'
import { Reveal } from '@/components/Reveal'
import { pickLocale } from '@/lib/i18n/pickLocale'
import { preventOrphans } from '@/lib/preventOrphans'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['restaurantBlock']
  locale: Locale
}

// Sekcja restauracji — pełnoekranowe zdjęcie z parallaxem (dryf Y na scroll,
// jak w hero) + tekst nałożony na obraz: eyebrow + tytuł u góry po lewej,
// opis + CTA u dołu po lewej. Gradient przyciemnia lewą stronę dla czytelności
// jasnego tekstu (prawa część zdjęcia bywa jaśniejsza).
export function RestaurantBlock({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  // „i" (jednoliterowy spójnik) nie może zostać na końcu 1. linii — nbsp wiąże
  // go z „smacznie" i przenosi do drugiej linii.
  const titleNoOrphans = title ? preventOrphans(title) : title
  const description = pickLocale(data.description, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)

  return (
    <section
      className="text-text-inverse relative flex min-h-[600px] flex-col overflow-hidden md:min-h-[720px] lg:h-[800px]"
      style={{ background: 'var(--color-dark-ruby)' }}
    >
      {/* Warstwowanie bez ujemnego z-index: sekcja ma nieprzezroczyste tło
          (dark-ruby fallback), więc `-z-*` chowałoby obraz ZA tłem. Zdjęcie i
          gradient to zwykłe absolute (paint w kolejności DOM), treść z-10 na wierzchu. */}
      <ParallaxImage
        image={data.image}
        locale={locale}
        sizes="100vw"
        loading="eager"
        imageClassName="object-center"
      />
      {/* Przyciemnienie lewej strony (tekst) — górny i dolny róg czytelne. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"
      />

      <div className="layout-container relative z-10 flex flex-1 flex-col justify-between gap-10 py-16 md:py-20">
        {/* Góra-lewo: eyebrow + tytuł */}
        <Reveal className="flex flex-col gap-4">
          {eyebrow && (
            <p className="wide:text-lg text-base tracking-normal uppercase">{eyebrow}</p>
          )}
          {title && (
            <RevealText
              as="h2"
              className="max-w-[14ch] text-3xl leading-none font-normal tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-6xl"
            >
              {titleNoOrphans}
            </RevealText>
          )}
        </Reveal>

        {/* Dół-lewo: opis + CTA */}
        <Reveal delay={100} className="flex flex-col gap-8">
          {description && (
            <p className="text-text-inverse/85 max-w-md text-base leading-[1.3] md:text-lg">
              {description}
            </p>
          )}
          {ctaLabel && (
            <Link
              href="/restauracja/menu"
              className="bg-text-inverse text-text inline-flex h-[60px] w-full items-center justify-center rounded-full px-6 text-lg transition-opacity hover:opacity-90 md:w-fit md:min-w-[220px]"
            >
              {ctaLabel}
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  )
}
