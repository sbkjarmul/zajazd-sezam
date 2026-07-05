import { Fragment } from 'react'

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

// Splits a single line on `*accent*` markers → italic <em> for odd segments.
function renderLine(line: string, lineKey: number) {
  const segments = line.split('*')
  return segments.map((seg, i) =>
    i % 2 === 1 ? (
      <em key={`${lineKey}-${i}`} className="italic">
        {seg}
      </em>
    ) : (
      <Fragment key={`${lineKey}-${i}`}>{seg}</Fragment>
    ),
  )
}

// Renders headline text as Westbourne serif with `*italic*` accents and `\n`
// line breaks. Meant to sit inside a `font-accent not-italic` heading element.
export function AccentText({ text }: Props) {
  const lines = text.split('\n')
  if (lines.length === 1) return <>{renderLine(lines[0], 0)}</>
  return (
    <>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {renderLine(line, li)}
        </span>
      ))}
    </>
  )
}
