'use client'

import { Accordion } from 'radix-ui'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/i18n/routing'
import { AccentText } from '@/components/AccentText'
import { RevealText } from '@/components/RevealText'
import { Reveal } from '@/components/Reveal'
import { pickLocale } from '@/lib/i18n/pickLocale'

type LocaleValue = { pl?: string | null; en?: string | null } | null | undefined

type FaqItem = { question?: LocaleValue; answer?: LocaleValue } | null

export type FaqSectionData =
  | {
      heading?: LocaleValue
      items?: FaqItem[] | null
    }
  | null
  | undefined

type Props = {
  data: FaqSectionData
  locale: Locale
  /**
   * 'serif' (default) — serif naglowek Westbourne z akcentem kursywa, kolor
   * ruby (restauracja). 'plain' — naglowek Inter uppercase w kolorze dark
   * (`text-text`): /hotel uzywa font-light, /imprezy font-normal.
   */
  variant?: 'serif' | 'plain'
  /** Grubosc naglowka w wariancie 'plain'. Default 'light' (hotel). */
  headingWeight?: 'light' | 'regular'
  /**
   * Wielkosc liter naglowka w wariancie 'plain'. Default 'upper' (hotel).
   * 'sentence' zostawia tekst z Sanity bez zmian - tylko pierwsza litera duza
   * (/imprezy).
   */
  headingCase?: 'upper' | 'sentence'
  /**
   * 'compact' (default) — `py-16 md:py-24`, sekcja w normalnym flow strony
   * (/restauracja).
   * 'panel' — `pt-[120px] pb-16`, gdy FAQ jest mobilnym panelem snapu (/hotel,
   * /imprezy). Panel dosuwa sie GORA do viewportu, wiec przy 64px naglowek
   * wchodzil pod fixed header (88px wysokosci). 120px to kanon z DESIGN-RULES 2.9,
   * ten sam co w sasiednich panelach (HotelAmenities, Reviews, HotelDiscover).
   */
  spacing?: 'compact' | 'panel'
}

// Wspoldzielony FAQ (bazowo Figma 971:1509 z restauracji): serif naglowek z
// akcentem kursywa po lewej, akordeon pytan/odpowiedzi po prawej; pierwszy
// rozwiniety. Jasny motyw (ruby na cream) — pasuje do jasnych sekcji tresci
// restauracji, hotelu i imprez. Reuzywany na wszystkich trzech stronach.
// Wariant 'plain' zamienia serif+ruby na Inter+dark, zeby wtopic sie w /hotel.
export function FaqSection({
  data,
  locale,
  variant = 'serif',
  headingWeight = 'light',
  headingCase = 'upper',
  spacing = 'compact',
}: Props) {
  const t = useTranslations('faq')
  if (!data) return null
  const isPlain = variant === 'plain'
  const textColor = isPlain ? 'text-text' : 'text-ruby'
  const plainWeight = headingWeight === 'regular' ? 'font-normal' : 'font-light'
  const plainCase = headingCase === 'upper' ? 'uppercase' : 'normal-case'
  const heading = pickLocale(data.heading, locale)
  const items = (data.items ?? [])
    .map((item, i) => ({
      value: `faq-${i}`,
      question: pickLocale(item?.question, locale),
      answer: pickLocale(item?.answer, locale),
    }))
    .filter((item) => item.question)

  if (!items.length) return null

  // Odstep gorny: patrz `spacing` w Props. Na panelach snapu 120px, bo panel
  // dosuwa sie gora do viewportu i 64px chowalo naglowek pod fixed headerem.
  const paddingClass = spacing === 'panel' ? 'pt-[120px] pb-16 md:py-24' : 'py-16 md:py-24'

  return (
    <section data-header-theme="light" className={`bg-bg ${paddingClass}`}>
      {/* Dwie kolumny dopiero od lg - na tablecie (768-1023) siatka 2-kolumnowa
          byla za ciasna, wiec naglowek i akordeon ida jedna kolumna. */}
      <div className="layout-container grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        {heading && (
          // Eyebrow "FAQ" nad naglowkiem — kanon z DESIGN-RULES 4.1
          // (`text-base wide:text-lg tracking-normal uppercase`), kolor
          // dziedziczony po wariancie sekcji (ruby / dark).
          <div className="flex flex-col gap-4">
            <Reveal>
              <p className={`${textColor} wide:text-lg text-base tracking-normal uppercase`}>
                {t('eyebrow')}
              </p>
            </Reveal>
            {isPlain ? (
              <RevealText
                as="h2"
                mode="fade"
                className={`text-text text-3xl leading-none ${plainWeight} ${plainCase} tracking-tight whitespace-pre-line md:text-4xl md:tracking-[-0.03em] lg:text-[48px]`}
              >
                {heading.replace(/\*/g, '')}
              </RevealText>
            ) : (
              <RevealText
                as="h2"
                mode="fade"
                className="font-accent text-ruby text-[clamp(34px,5vw,64px)] leading-none tracking-[-0.01em] not-italic"
              >
                <AccentText text={heading} />
              </RevealText>
            )}
          </div>
        )}

        <Reveal delay={120} className="w-full">
          <Accordion.Root
            type="single"
            collapsible
            defaultValue={items[0]?.value}
            className="w-full"
          >
            {items.map((item) => (
              <Accordion.Item
                key={item.value}
                value={item.value}
                className="border-b border-[var(--color-gray)]"
              >
                <Accordion.Header>
                  <Accordion.Trigger
                    className={`group ${textColor} flex w-full items-center justify-between gap-6 py-6 text-left`}
                  >
                    <span className="text-lg leading-snug">{item.question}</span>
                    <span
                      aria-hidden
                      className="shrink-0 text-2xl leading-none font-light transition-transform duration-200 group-data-[state=open]:rotate-45"
                    >
                      +
                    </span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
                  {item.answer && <p className={`${textColor} pb-6 text-lg`}>{item.answer}</p>}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Reveal>
      </div>
    </section>
  )
}
