import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { ParallaxImage } from '@/components/ParallaxImage'
import { RevealText } from '@/components/RevealText'
import { Link } from '@/i18n/navigation'
import { Reveal } from '@/components/Reveal'
import { pickLocale } from '@/lib/i18n/pickLocale'
import { preventOrphans } from '@/lib/preventOrphans'
import { SectionBleedImage } from './SectionBleedImage'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['restaurantBlock']
  locale: Locale
}

// Mobile: sekcja samowystarczalna - zdjecie wtapia sie w wlasne tlo (dark-ruby)
// u gory i u dolu. Krotki fade u gory - zdjecie zajmuje dolna czesc panelu,
// tekst na litym dark-ruby, button na zdjeciu. Przejscie do Hotelu = connector.
const RESTAURANT_GRADIENT =
  'linear-gradient(180deg, var(--color-dark-ruby) 0%, rgba(17,28,42,0) 14%, rgba(17,28,42,0) 84%, var(--color-dark-ruby) 98%)'

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
    <>
      {/* MOBILE (Figma 936:62) - tresc u gory na dark-ruby + pelnoszerokie
          zdjecie z gradientem wtapiajacym sie w Hotel (light) u dolu.
          `lg:hidden!` bije `.snap-panels > section { display:flex }`. */}
      <section
        data-header-theme="dark"
        className="bg-dark-ruby text-text-inverse relative flex w-full flex-col overflow-hidden lg:hidden!"
      >
        {/* Tresc u gory, zdjecie in-flow nizej WYDLUZA sekcje ponad 100svh
            (scroll do pelnego zdjecia, potem snap - jak Hotel). */}
        <div className="layout-container relative z-10 flex flex-col gap-10 pt-[120px]">
          <Reveal className="flex flex-col gap-4">
            {eyebrow && <p className="text-base tracking-normal uppercase">{eyebrow}</p>}
            {title && (
              <h2 className="max-w-[14ch] text-[40px] font-normal tracking-[-3px] text-balance">
                {titleNoOrphans}
              </h2>
            )}
          </Reveal>
          <Reveal delay={100} className="flex flex-col gap-10">
            {description && <p className="text-text-inverse/85 text-base">{description}</p>}
            {ctaLabel && (
              <Link
                href="/restauracja/menu"
                className="text-text inline-flex h-16 w-full items-center justify-center rounded-full bg-white px-6 text-xl transition-opacity hover:opacity-90"
              >
                {ctaLabel}
              </Link>
            )}
          </Reveal>
        </div>
        <SectionBleedImage
          image={data.image}
          locale={locale}
          gradient={RESTAURANT_GRADIENT}
          className="relative z-0 -mt-12 min-h-[62svh] w-full flex-1"
        />
      </section>

      {/* DESKTOP (bez zmian - tylko bramkowanie widocznosci) */}
      <section
        data-header-theme="dark"
        className="text-text-inverse relative hidden! min-h-[600px] flex-col overflow-hidden md:min-h-[720px] lg:flex! lg:h-[800px]"
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

        {/* Wiekszy odstep u gory: eyebrow/tytul nie moga chowac sie pod fixed
            headerem (~88px). pt zapewnia przeswit pod headerem; pb bez zmian
            (justify-between trzyma opis+CTA przy dole). */}
        <div className="layout-container relative z-10 flex flex-1 flex-col justify-between gap-10 pt-28 pb-16 md:pt-36 md:pb-20">
          {/* Góra-lewo: eyebrow + tytuł */}
          <Reveal className="flex flex-col gap-4">
            {eyebrow && (
              <p className="wide:text-lg text-base tracking-normal uppercase">{eyebrow}</p>
            )}
            {title && (
              <RevealText
                as="h2"
                className="max-w-[14ch] text-3xl leading-none font-normal tracking-tight text-balance md:text-4xl md:tracking-[-0.03em]"
              >
                {titleNoOrphans}
              </RevealText>
            )}
          </Reveal>

          {/* Dół-lewo: opis + CTA */}
          <Reveal delay={100} className="flex flex-col gap-8">
            {description && (
              <p className="text-text-inverse/85 max-w-md text-base md:text-lg">{description}</p>
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
    </>
  )
}
