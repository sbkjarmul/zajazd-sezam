'use client'

import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { useUI } from '@/components/providers/UIProvider'
import { VisuallyHidden } from 'radix-ui'
import { cn } from '@/lib/utils'
import { RoomBookingForm } from '@/components/forms/RoomBookingForm'
import { EventInquiryForm } from '@/components/forms/EventInquiryForm'

// Wg Figma 676:1750: drawer 632px szerokości, bg-white, p-[32px], gap-[40px].
// Header: "REZERWUJ" text-[40px] font-light + close X 32px.
// Tabs gap-[16px], aktywny = border-b-1 text-bold, oba 20px.
// Backdrop: backdrop-blur-[6px] bg-[rgba(31,31,28,0.5)].
export function ReservationDrawer() {
  const t = useTranslations('reservationDrawer')
  const { reservationOpen, closeReservation, reservationTab, setReservationTab } = useUI()
  const tCommon = useTranslations('common')

  return (
    <Sheet open={reservationOpen} onOpenChange={(open) => (open ? null : closeReservation())}>
      <SheetContent
        side="right"
        showCloseButton={false}
        overlayClassName="backdrop-blur-[6px] bg-[rgba(31,31,28,0.5)]"
        className="bg-surface flex w-full max-w-[632px] flex-col gap-10 overflow-y-auto border-l-0 p-8 sm:max-w-[632px]"
      >
        <VisuallyHidden.Root>
          <SheetDescription>
            Formularz rezerwacji pokoju lub zapytania o organizację imprezy.
          </SheetDescription>
        </VisuallyHidden.Root>

        <div className="flex items-start justify-between">
          <SheetTitle className="text-text text-[40px] font-light tracking-normal">
            {t('title')}
          </SheetTitle>
          <button
            type="button"
            onClick={closeReservation}
            aria-label={tCommon('close')}
            className="text-text hover:text-accent cursor-pointer transition-colors"
          >
            <X className="size-8" />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <div role="tablist" className="flex items-center gap-4">
            <button
              type="button"
              role="tab"
              aria-selected={reservationTab === 'room'}
              onClick={() => setReservationTab('room')}
              className={cn(
                'text-text cursor-pointer py-1 text-lg transition-all',
                reservationTab === 'room'
                  ? 'border-text border-b font-bold'
                  : 'font-normal',
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
                'text-text cursor-pointer py-1 text-lg transition-all',
                reservationTab === 'event'
                  ? 'border-text border-b font-bold'
                  : 'font-normal',
              )}
            >
              {t('tabs.event')}
            </button>
          </div>
          <div className="border-text border-t" aria-hidden />
        </div>

        {reservationTab === 'room' ? <RoomBookingForm /> : <EventInquiryForm />}
      </SheetContent>
    </Sheet>
  )
}
