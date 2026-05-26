'use client'

import { useUI } from '@/components/providers/UIProvider'
import { cn } from '@/lib/utils'

type Variant = 'filled-dark' | 'filled-light' | 'outline-dark' | 'outline-light'

type Props = {
  children: React.ReactNode
  tab?: 'room' | 'event'
  variant?: Variant
  className?: string
}

const VARIANT_CLASSES: Record<Variant, string> = {
  'filled-dark':
    'bg-primary text-primary-foreground border-2 border-primary hover:bg-primary-hover',
  'filled-light':
    'bg-text-inverse text-text border-2 border-text-inverse hover:bg-transparent hover:text-text-inverse',
  'outline-dark':
    'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground',
  'outline-light':
    'border-2 border-text-inverse text-text-inverse hover:bg-text-inverse hover:text-text',
}

// Pill-shaped CTA.
// Desktop (md+): otwiera global reservation drawer z formularzem.
// Mobile (< md): renderuje <a href="tel:..."> — kliknięcie inicjuje połączenie,
// klient nie musi męczyć się z wypełnianiem formularza na małym ekranie.
// Jeśli brak phone w UIProvider, fallback do drawer-buttona na wszystkich BP.
export function ReservationCtaButton({
  children,
  tab = 'room',
  variant = 'filled-dark',
  className,
}: Props) {
  const { openReservation, phone } = useUI()
  const baseClasses = cn(
    'h-[60px] cursor-pointer items-center justify-center rounded-full px-6 text-lg font-normal transition-colors',
    VARIANT_CLASSES[variant],
    className,
  )

  return (
    <>
      {phone && (
        <a
          href={`tel:${phone.replace(/\s/g, '')}`}
          className={cn(baseClasses, 'inline-flex md:hidden')}
        >
          {children}
        </a>
      )}
      <button
        type="button"
        onClick={() => openReservation(tab)}
        className={cn(baseClasses, phone ? 'hidden md:inline-flex' : 'inline-flex')}
      >
        {children}
      </button>
    </>
  )
}
