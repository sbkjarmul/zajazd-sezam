'use client'

import * as React from 'react'
import { useState } from 'react'
import { useLocale } from 'next-intl'
import { Calendar as CalendarIcon } from 'lucide-react'
import { enUS, pl } from 'react-day-picker/locale'

import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

// Controlled date field — przyjmuje ISO `YYYY-MM-DD` (zgodne z Zod schema
// `lib/validators/reservation.ts`). Trigger trzyma się tej samej kreski +
// stanów co reszta inputów drawera: 2px accent w stanie aktywnym (filled
// lub otwarty popover), 1px text dark + muted gdy pusty i zamknięty.
// data-empty ustawiamy ręcznie; data-state Radix przekazuje sam.

const triggerClasses =
  'border-accent text-accent flex h-[48px] w-full cursor-pointer items-center justify-between gap-2 rounded-none border-0 border-b-2 bg-transparent px-0 text-left text-[20px] outline-none focus-visible:outline-none transition-colors ' +
  '[&[data-empty][data-state=closed]]:border-b [&[data-empty][data-state=closed]]:border-text [&[data-empty][data-state=closed]]:text-text-muted ' +
  '[&_svg]:size-[18px] [&_svg]:text-accent [&[data-empty][data-state=closed]_svg]:text-text-muted'

function toISO(date: Date): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function fromISO(value: string): Date | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatDisplay(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

type DateFieldProps = {
  value: string
  onChange: (iso: string) => void
  onBlur?: () => void
  placeholder: string
  ariaLabel?: string
  disabledBefore?: Date
}

export function DateField({
  value,
  onChange,
  onBlur,
  placeholder,
  ariaLabel,
  disabledBefore,
}: DateFieldProps) {
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const selected = fromISO(value)
  const isEmpty = !value

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) onBlur?.()
      }}
    >
      <PopoverTrigger
        type="button"
        data-empty={isEmpty || undefined}
        aria-label={ariaLabel ?? placeholder}
        className={triggerClasses}
      >
        <span className="truncate">
          {selected ? formatDisplay(selected, locale) : placeholder}
        </span>
        <CalendarIcon aria-hidden />
      </PopoverTrigger>
      <PopoverContent align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            if (date) {
              onChange(toISO(date))
              setOpen(false)
              onBlur?.()
            }
          }}
          defaultMonth={selected}
          locale={locale === 'en' ? enUS : pl}
          weekStartsOn={1}
          disabled={disabledBefore ? { before: disabledBefore } : undefined}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
