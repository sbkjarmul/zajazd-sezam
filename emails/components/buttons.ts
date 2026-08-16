// Wspolny styl CTA dla obu szablonow, zeby nie rozjechaly sie miedzy soba.
// Wg DESIGN-RULES 5, wariant `btn-card` + `filled-dark`: pill, 48px wysokosci,
// text-base (16px), font-normal. Na pelna szerokosc karty - w mailu jest jedno
// CTA i ma byc trudne do przeoczenia.

import type * as React from 'react'
import { BRAND } from './theme'

export const ctaButton: React.CSSProperties = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  padding: '13px 24px',
  borderRadius: '999px',
  border: `2px solid ${BRAND.dark}`,
  backgroundColor: BRAND.dark,
  color: BRAND.textInverse,
  fontSize: '16px',
  lineHeight: '120%',
  letterSpacing: 0,
  fontWeight: 400,
  textAlign: 'center',
  textDecoration: 'none',
}
