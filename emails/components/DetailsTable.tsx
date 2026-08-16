// Tabela "etykieta / wartosc" ze szczegolami zgloszenia. Uzywana w mailu do
// recepcji (pelne dane) i w auto-reply (podsumowanie dla goscia).
// Reszta maila jest wysrodkowana, ale tabela zostaje dwukolumnowa i wyrownana
// do lewej - wysrodkowane pary daja poszarpana krawedz i wydluzaja arkusz.

import * as React from 'react'
import { Column, Row, Section } from '@react-email/components'
import type { DetailRow } from '@/lib/email/types'
import { BRAND } from './theme'

export function DetailsTable({ rows }: { rows: DetailRow[] }) {
  return (
    <Section style={table}>
      {rows.map((row, index) => (
        // Klasa `detail-row` jest hakiem dla wersji tekstowej maila - pozwala
        // html-to-text sformatowac wiersz jako "Etykieta   wartosc" zamiast
        // sklejac obie komorki (patrz lib/email/templates.tsx).
        <Row key={row.label} className="detail-row" style={index === 0 ? firstRow : undefined}>
          <Column style={labelCell}>{row.label}</Column>
          <Column style={valueCell}>{row.value}</Column>
        </Row>
      ))}
    </Section>
  )
}

const table: React.CSSProperties = {
  width: '100%',
  borderTop: `1px solid ${BRAND.border}`,
}

const cellBase: React.CSSProperties = {
  padding: '14px 0',
  borderBottom: `1px solid ${BRAND.border}`,
  verticalAlign: 'top',
  // Jawnie, bo sekcja tresci w EmailShell dziedziczy `text-align: center`.
  textAlign: 'left',
}

const firstRow: React.CSSProperties = {
  width: '100%',
}

// Para etykieta/wartosc idzie za wzorcem <dt>/<dd> ze strony (DESIGN-RULES 4.7,
// por. RestaurantReservation): oba 16px, tracking 0, hierarchia przez kolor.
const labelCell: React.CSSProperties = {
  ...cellBase,
  width: '42%',
  paddingRight: '16px',
  fontSize: '16px',
  lineHeight: '120%',
  letterSpacing: 0,
  fontWeight: 400,
  textTransform: 'uppercase',
  color: BRAND.textMuted,
}

const valueCell: React.CSSProperties = {
  ...cellBase,
  fontSize: '16px',
  lineHeight: '120%',
  letterSpacing: 0,
  color: BRAND.dark,
}
