'use client'

import { useTranslations } from 'next-intl'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { useUI } from '@/components/providers/UIProvider'
import { VisuallyHidden } from 'radix-ui'
import { cn } from '@/lib/utils'
import { RoomBookingForm } from '@/components/forms/RoomBookingForm'
import { EventInquiryForm } from '@/components/forms/EventInquiryForm'

export function ReservationDrawer() {
  const t = useTranslations('reservationDrawer')
  const { reservationOpen, closeReservation, reservationTab, setReservationTab } = useUI()

  return (
    <Sheet open={reservationOpen} onOpenChange={(open) => (open ? null : closeReservation())}>
      <SheetContent
        side="right"
        className="bg-surface flex w-full max-w-[632px] flex-col gap-8 overflow-y-auto border-l-0 p-8 sm:max-w-[632px]"
      >
        <VisuallyHidden.Root>
          <SheetDescription>
            Formularz rezerwacji pokoju lub zapytania o organizację imprezy.
          </SheetDescription>
        </VisuallyHidden.Root>

        <SheetTitle className="text-text text-3xl font-light tracking-tight">
          {t('title')}
        </SheetTitle>

        <div role="tablist" className="border-border-subtle flex gap-4 border-b">
          <button
            type="button"
            role="tab"
            aria-selected={reservationTab === 'room'}
            onClick={() => setReservationTab('room')}
            className={cn(
              'cursor-pointer px-1 pb-2 text-lg transition-colors',
              reservationTab === 'room'
                ? 'border-text -mb-px border-b-2 font-bold'
                : 'text-text-muted font-normal',
            )}
          >
            {t('tabs.room')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={reservationTab === 'event'}
            onClick={() => setReservationTab('event')}
            className={cn(
              'cursor-pointer px-1 pb-2 text-lg transition-colors',
              reservationTab === 'event'
                ? 'border-text -mb-px border-b-2 font-bold'
                : 'text-text-muted font-normal',
            )}
          >
            {t('tabs.event')}
          </button>
        </div>

        {reservationTab === 'room' ? <RoomBookingForm /> : <EventInquiryForm />}
      </SheetContent>
    </Sheet>
  )
}
