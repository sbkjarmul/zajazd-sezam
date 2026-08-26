'use client'

import { useUI } from '@/components/providers/UIProvider'
import { cn } from '@/lib/utils'
import { ctaClasses, type CtaVariant } from '@/lib/cta'

type Props = {
  children: React.ReactNode
  tab?: 'room' | 'event'
  variant?: CtaVariant
  className?: string
}

// Pill-shaped CTA.
// Desktop (md+): otwiera global reservation drawer z formularzem.
// Mobile (< md): renderuje <a href="tel:..."> — kliknięcie inicjuje połączenie,
// klient nie musi męczyć się z wypełnianiem formularza na małym ekranie.
// Jeśli brak phone w UIProvider, fallback do drawer-buttona na wszystkich BP.
// Rozmiar/typografia: `lib/cta.ts` — wspólne dla wszystkich CTA w aplikacji.
export function ReservationCtaButton({
  children,
  tab = 'room',
  variant = 'filled-dark',
  className,
}: Props) {
  const { openReservation, phone } = useUI()
  const baseClasses = ctaClasses(variant, className)

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
