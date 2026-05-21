'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from 'react-day-picker'

import { cn } from '@/lib/utils'

// Calendar w wariancie zgodnym z naszym design systemem:
//  - paleta: bg-surface (tło popovera ustawia <PopoverContent>), text-text, accent (gold)
//  - selected dzień: pełen accent (gold) + accent-foreground
//  - today: outline accent
//  - outside/disabled: text-muted / opacity
// Klasy mapowane przez `classNames` (API react-day-picker v9/v10).

type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-1', className)}
      classNames={{
        months: 'flex flex-col gap-4 sm:flex-row',
        month: 'flex flex-col gap-3',
        month_caption: 'relative flex items-center justify-center pt-1 h-9',
        caption_label: 'text-sm font-medium uppercase tracking-wider text-text',
        nav: 'absolute inset-x-1 top-1 flex items-center justify-between',
        button_previous:
          'inline-flex h-7 w-7 items-center justify-center rounded-md text-text hover:bg-muted hover:text-accent transition-colors',
        button_next:
          'inline-flex h-7 w-7 items-center justify-center rounded-md text-text hover:bg-muted hover:text-accent transition-colors',
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday:
          'text-text-muted w-9 font-normal text-[11px] uppercase tracking-wider pb-1',
        week: 'flex w-full mt-1',
        day: 'h-9 w-9 text-center text-sm p-0',
        day_button:
          'inline-flex h-9 w-9 items-center justify-center rounded-md text-text hover:bg-muted hover:text-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent transition-colors',
        selected:
          '[&_button]:bg-accent [&_button]:text-accent-foreground [&_button]:hover:bg-accent [&_button]:hover:text-accent-foreground',
        today: '[&_button]:ring-1 [&_button]:ring-accent',
        outside: '[&_button]:text-text-muted [&_button]:opacity-50',
        disabled: '[&_button]:text-text-muted [&_button]:opacity-40 [&_button]:cursor-not-allowed',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClass, ...rest }) => {
          const Icon = orientation === 'left' ? ChevronLeft : ChevronRight
          return <Icon className={cn('size-4', chevronClass)} {...rest} />
        },
      }}
      {...props}
    />
  )
}

export { Calendar }
