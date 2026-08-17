'use client'

import { Fragment, useRef, type CSSProperties } from 'react'
import { useInkOffsets } from '@/hooks/useInkOffsets'

type Props = {
  /**
   * Text with two inline conventions:
   *  - `*...*` wraps an italic Westbourne accent span (design uses italic to
   *    emphasise a phrase inside an otherwise upright serif heading),
   *  - `\n` forces a line break (block per line).
   * The surrounding element is expected to carry `font-accent` (Westbourne) so
   * plain segments render upright and accent segments render italic.
   */
  text: string
}

// Props doklejane do elementu ZACZYNAJACEGO wiersz - to on dostaje korekte
// odsadzenia (patrz useInkOffsets).
type LeadProps = { 'data-ink-align': string; style?: CSSProperties }

// Splits a single line on `*accent*` markers → italic <em> for odd segments.
// Pierwszy niepusty segment dostaje `lead` (marker + korekta odsadzenia).
function renderLine(line: string, lineKey: number, lead: LeadProps) {
  const segments = line.split('*')
  let leadUsed = false

  return segments.map((seg, i) => {
    const key = `${lineKey}-${i}`
    const takesLead = !leadUsed && seg !== ''
    if (takesLead) leadUsed = true

    if (i % 2 === 1) {
      return (
        <em key={key} className="italic" {...(takesLead ? lead : {})}>
          {seg}
        </em>
      )
    }
    // Segment zwykly opakowujemy w <span> tylko gdy niesie `lead` - inaczej
    // zostaje golym tekstem (bez zbednego wezla w DOM).
    return takesLead ? (
      <span key={key} {...lead}>
        {seg}
      </span>
    ) : (
      <Fragment key={key}>{seg}</Fragment>
    )
  })
}

// Renders headline text as Westbourne serif with `*italic*` accents and `\n`
// line breaks. Meant to sit inside a `font-accent not-italic` heading element.
//
// Client component, bo wiersze wyrownujemy optycznie do lewej krawedzi
// (useInkOffsets): kursywa ma duze lewe odsadzenie i wiersz zaczynajacy sie
// akcentem wygladal na wciety wzgledem wiersza nad nim.
// `display: contents` na wrapperze -> ref bez wlasnego boxa, layout bez zmian.
export function AccentText({ text }: Props) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const offsets = useInkOffsets(rootRef, [text])
  const lines = text.split('\n')

  const leadFor = (i: number): LeadProps => ({
    'data-ink-align': '',
    style: offsets[i] ? { marginLeft: `-${offsets[i]}em` } : undefined,
  })

  return (
    <span ref={rootRef} className="contents">
      {lines.length === 1
        ? renderLine(lines[0], 0, leadFor(0))
        : lines.map((line, li) => (
            <span key={li} className="block">
              {renderLine(line, li, leadFor(li))}
            </span>
          ))}
    </span>
  )
}
