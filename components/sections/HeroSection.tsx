import { Fragment } from 'react'
import { Star } from 'lucide-react'
import type { HOMEPAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { ReservationCtaButton } from '@/components/ReservationCtaButton'
import { HomeHeroBackground } from './HomeHeroBackground'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<HOMEPAGE_QUERY_RESULT>['hero']
  locale: Locale
}

const GUESTS_LABEL: Record<Locale, string> = {
  pl: '1100+ zadowolonych gości',
  en: '1100+ happy guests',
}

const RESERVE_LABEL: Record<Locale, string> = {
  pl: 'Zarezerwuj termin',
  en: 'Book your stay',
}

// Wysokość hero minimalnie 800px, poza tym proporcja stała wg Figmy (930:6 —
// 1512x1119). Wcześniej hero „rósł" wg proporcji zdjęcia (2752x2590, prawie
// kwadrat) i był o ~250px za wysoki: dużo pustego nieba, budynek ledwo wystawał.
// Stała proporcja skraca sekcję — pełny budynek mieści się w kadrze jak w Figmie.
const HERO_MIN_HEIGHT = '800px'
const HERO_ASPECT = '1512 / 1119'

// Dzieli nagłówek na 3 części:
//   line1     — słowa poza łącznikiem i akcentem (pierwsza linia)
//   connector — łącznik przed akcentem (np. „w"), w Inter, przenoszony do 2. linii
//   accent    — ostatnie 2 słowa („rodzinnej atmosferze") kursywą Westbourne Serif
// Wymuszony <br> gwarantuje: 1. linia = line1, 2. linia = „w " + akcent (łącznik
// nie zostaje osierocony na końcu 1. linii).
function splitHeadline(text: string): { line1: string; connector: string; accent: string } {
  const parts = text.trim().split(/\s+/).filter(Boolean)
  if (parts.length < 3) {
    return { line1: parts.slice(0, -2).join(' '), connector: '', accent: parts.slice(-2).join(' ') }
  }
  return {
    line1: parts.slice(0, -3).join(' '),
    connector: parts[parts.length - 3],
    accent: parts.slice(-2).join(' '),
  }
}

// Reveal nagłówka slowo-po-slowie robi CSS (klasa .hero-word + keyframes
// w globals.css), a nie GSAP/SplitText — dzięki temu cała sekcja jest Server
// Componentem i nie ciągnie SplitText do bundla klienta. Spany renderują się
// serwerowo, więc animacja startuje w pierwszej klatce, bez czekania na
// hydrację i `document.fonts.ready` (tak działała wersja GSAP).
// `--hero-i` to globalny indeks słowa w całym nagłówku → stagger 0.04s.
function Words({ text, startIndex }: { text: string; startIndex: number }) {
  const words = text.split(/\s+/).filter(Boolean)
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="hero-word" style={{ '--hero-i': startIndex + i } as React.CSSProperties}>
            {word}
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </>
  )
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

function Headline({
  line1,
  connector,
  accent,
  plain = false,
}: {
  line1: string
  connector: string
  accent: string
  // plain=true -> akcent renderowany zwyklym Interem (bez kursywy Westbourne).
  // Desktop (Figma 930:6) uzywa akcentu; mobile (Figma 936:14) ma caly tytul w
  // jednym kroju sans, bez kursywy - stad plain na wariancie mobilnym.
  plain?: boolean
}) {
  const line1Count = line1 ? countWords(line1) : 0
  const connectorIndex = line1Count
  const accentStart = connectorIndex + (connector ? 1 : 0)

  return (
    <>
      {line1 && <Words text={line1} startIndex={0} />}
      {line1 && <br />}
      {connector && <Words text={connector} startIndex={connectorIndex} />}
      {connector ? ' ' : ''}
      {plain ? (
        <Words text={accent} startIndex={accentStart} />
      ) : (
        <em className="font-accent font-normal italic">
          <Words text={accent} startIndex={accentStart} />
        </em>
      )}
    </>
  )
}

// 4.5 gwiazdki (4 pełne + 1 połówka). Połówka: bazowa gwiazdka-outline z
// nałożoną, przyciętą do 50% szerokości gwiazdką wypełnioną.
function StarRating() {
  return (
    <div className="text-text-inverse flex items-center gap-1" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <Star key={i} className="size-5 fill-current" strokeWidth={1.5} />
      ))}
      <span className="relative inline-flex size-5">
        <Star className="absolute inset-0 size-5" strokeWidth={1.5} />
        <span className="absolute inset-0 w-1/2 overflow-hidden">
          <Star className="size-5 fill-current" strokeWidth={1.5} />
        </span>
      </span>
    </div>
  )
}

export function HeroSection({ data, locale }: Props) {
  if (!data) return null
  const headlineDesktop = pickLocale(data.headline, locale)
  const headlineMobile = pickLocale(data.headlineMobile, locale) ?? headlineDesktop
  const subheadlineDesktop = pickLocale(data.subheadline, locale)
  const subheadlineMobile = pickLocale(data.subheadlineMobile, locale) ?? subheadlineDesktop
  const ctaLabel = pickLocale(data.primaryCtaLabel, locale) ?? RESERVE_LABEL[locale]

  const deskAccent = headlineDesktop ? splitHeadline(headlineDesktop) : null
  const mobAccent = headlineMobile ? splitHeadline(headlineMobile) : null

  // Wysokość sekcji: min. 800px + stała proporcja wg Figmy (nie wg wymiarów
  // zdjęcia) — krótsza sekcja, pełny budynek w kadrze.
  const heroStyle: React.CSSProperties = {
    minHeight: HERO_MIN_HEIGHT,
    aspectRatio: HERO_ASPECT,
  }

  return (
    // justify-start! nadpisuje wysrodkowanie z `.snap-panels > section`
    // (justify-content:center). Hero jest wyzszy niz viewport (proporcja
    // sekcji), wiec wysrodkowana tresc ladowala na dachach budynku. Tresc
    // przypieta do gory => napisy w niebie, NAD budynkiem (mobile i desktop).
    <section
      data-header-theme="dark"
      // Hero zostaje czystym kadrem — bez przyciemnienia pod headerem, ktore
      // przy przewijaniu w obrebie sekcji zakrywalo pierwsza linie h1.
      data-header-gradient="off"
      className="relative flex w-full flex-col justify-start! overflow-hidden"
      style={heroStyle}
    >
      <HomeHeroBackground
        image={data.image}
        locale={locale}
        imageClassName="object-[center_38%]"
        priority
      />

      {/* Wtopienie dołu zdjęcia w biel — miękkie przejście hero → sekcja About
          (białe tło). */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-[30%] bg-gradient-to-t from-white from-22% via-white/80 via-55% to-transparent"
      />

      <div className="text-text-inverse layout-container relative flex flex-col items-center gap-6 pt-[110px] pb-24 text-center md:gap-7 md:pt-[150px]">
        {/* Ocena: 4.5 gwiazdki + liczba gości — wyśrodkowane, stack pionowy.
            Wchodzi na końcu sekwencji (1.45s), jak w poprzednim timeline GSAP. */}
        <div
          className="hero-fade-in flex flex-col items-center gap-2"
          style={{ '--hero-delay': '1.45s', '--hero-dur': '0.55s' } as React.CSSProperties}
        >
          <StarRating />
          <span className="text-sm md:text-base">{GUESTS_LABEL[locale]}</span>
        </div>

        {(mobAccent || deskAccent) && (
          <h1 className="text-[30px] font-normal tracking-tight md:text-[52px] lg:text-[60px] xl:text-[64px]">
            {mobAccent && (
              <span className="md:hidden">
                <Headline
                  line1={mobAccent.line1}
                  connector={mobAccent.connector}
                  accent={mobAccent.accent}
                  plain
                />
              </span>
            )}
            {deskAccent && (
              <span className="hidden md:inline">
                <Headline
                  line1={deskAccent.line1}
                  connector={deskAccent.connector}
                  accent={deskAccent.accent}
                />
              </span>
            )}
          </h1>
        )}

        {(subheadlineMobile || subheadlineDesktop) && (
          <div className="overflow-hidden">
            <p
              className="hero-mask-in text-text-inverse/90 max-w-xl text-base md:text-lg"
              style={{ '--hero-delay': '0.7s', '--hero-dur': '0.7s' } as React.CSSProperties}
            >
              <span className="md:hidden">{subheadlineMobile}</span>
              <span className="hidden md:inline">{subheadlineDesktop}</span>
            </p>
          </div>
        )}

        <div className="w-full overflow-hidden pt-2 md:w-auto">
          <div
            className="hero-mask-in w-full md:w-auto"
            style={{ '--hero-delay': '1.1s', '--hero-dur': '0.6s' } as React.CSSProperties}
          >
            <ReservationCtaButton tab="room" variant="filled-dark" className="w-full md:w-auto">
              {ctaLabel}
            </ReservationCtaButton>
          </div>
        </div>
      </div>
    </section>
  )
}
