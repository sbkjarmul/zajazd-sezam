'use client'

import { Accordion } from 'radix-ui'
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
}

// Wspoldzielony FAQ (bazowo Figma 971:1509 z restauracji): serif naglowek z
// akcentem kursywa po lewej, akordeon pytan/odpowiedzi po prawej; pierwszy
// rozwiniety. Jasny motyw (ruby na cream) — pasuje do jasnych sekcji tresci
// restauracji, hotelu i imprez. Reuzywany na wszystkich trzech stronach.
export function FaqSection({ data, locale }: Props) {
  if (!data) return null
  const heading = pickLocale(data.heading, locale)
  const items = (data.items ?? [])
    .map((item, i) => ({
      value: `faq-${i}`,
      question: pickLocale(item?.question, locale),
      answer: pickLocale(item?.answer, locale),
    }))
    .filter((item) => item.question)

  if (!items.length) return null

  return (
    <section data-header-theme="light" className="bg-bg py-16 md:py-24">
      <div className="layout-container grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        {heading && (
          <RevealText
            as="h2"
            mode="fade"
            className="font-accent text-ruby text-[clamp(34px,5vw,64px)] leading-none tracking-[-0.01em] not-italic"
          >
            <AccentText text={heading} />
          </RevealText>
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
                  <Accordion.Trigger className="group text-ruby flex w-full items-center justify-between gap-6 py-6 text-left">
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
                  {item.answer && (
                    <p className="text-ruby pb-6 text-lg leading-normal">{item.answer}</p>
                  )}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Reveal>
      </div>
    </section>
  )
}
