'use client'

import { useUI } from '@/components/providers/UIProvider'
import { cn } from '@/lib/utils'

type Variant = 'filled-dark' | 'outline-dark' | 'outline-light'

type Props = {
  children: React.ReactNode
  tab?: 'room' | 'event'
  variant?: Variant
  className?: string
}

const VARIANT_CLASSES: Record<Variant, string> = {
  'filled-dark':
    'bg-primary text-primary-foreground border-2 border-primary hover:bg-primary-hover',
  'outline-dark':
    'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground',
  'outline-light':
    'border-2 border-text-inverse text-text-inverse hover:bg-text-inverse hover:text-text',
}

// Pill-shaped CTA that opens the global reservation drawer.
export function ReservationCtaButton({
  children,
  tab = 'room',
  variant = 'filled-dark',
  className,
}: Props) {
  const { openReservation } = useUI()
  return (
    <button
      type="button"
      onClick={() => openReservation(tab)}
      className={cn(
        'inline-flex h-[60px] cursor-pointer items-center justify-center rounded-full px-6 text-lg font-normal transition-colors',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {children}
    </button>
  )
}
