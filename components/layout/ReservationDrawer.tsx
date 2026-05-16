'use client'

import { useTranslations } from 'next-intl'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUI } from '@/components/providers/UIProvider'
import { VisuallyHidden } from 'radix-ui'
import { cn } from '@/lib/utils'

// Lista typów pokoi zgodna z ARCHITECTURE.md sekcja 7.1 — wartości muszą się
// pokrywać z polem `identifier` w schemacie roomType (Sanity).
const ROOM_TYPES = [
  { value: 'apartment-comfort', label: 'Apartament Komfort' },
  { value: 'double-comfort', label: 'Pokój dwuosobowy Komfort' },
  { value: 'triple-comfort', label: 'Pokój trzyosobowy Komfort' },
  { value: 'quad-comfort', label: 'Pokój czteroosobowy Komfort' },
  { value: 'single-comfort-single-bed', label: 'Pokój 1-os. Komfort — łóżko pojedyncze' },
  { value: 'single-comfort-king', label: 'Pokój 1-os. Komfort — łóżko King Size' },
  { value: 'single-standard', label: 'Pokój jednoosobowy Standard' },
  { value: 'double-standard', label: 'Pokój dwuosobowy Standard' },
]

const EVENT_TYPES = [
  { value: 'wedding', label: 'Wesele' },
  { value: 'communion', label: 'Komunia' },
  { value: 'birthday', label: 'Urodziny' },
  { value: 'corporate', label: 'Impreza firmowa' },
  { value: 'other', label: 'Inne' },
]

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

        {reservationTab === 'room' ? <RoomForm /> : <EventForm />}

        <div className="border-border-subtle mt-auto flex flex-col gap-4 border-t pt-6">
          <button
            type="submit"
            disabled
            className="bg-primary text-primary-foreground hover:bg-primary-hover inline-flex h-[60px] w-full cursor-not-allowed items-center justify-center rounded-full px-6 text-lg font-normal opacity-60 transition-colors"
            title="Walidacja i wysyłka — Faza 5"
          >
            {t('submit')}
          </button>
          <p className="text-text-muted text-center text-sm">{t('disclaimer')}</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function RoomForm() {
  const t = useTranslations('reservationDrawer.room')
  return (
    <form className="flex flex-col gap-4" noValidate>
      <p className="text-text text-2xl">{t('intro')}</p>

      <Field label={t('fullName')}>
        <Input name="fullName" autoComplete="name" />
      </Field>
      <Field label={t('email')}>
        <Input name="email" type="email" autoComplete="email" />
      </Field>
      <Field label={t('phone')}>
        <Input name="phone" type="tel" autoComplete="tel" />
      </Field>
      <Field label={t('roomType')}>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="—" />
          </SelectTrigger>
          <SelectContent>
            {ROOM_TYPES.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t('checkIn')}>
          <Input name="checkIn" type="date" />
        </Field>
        <Field label={t('checkOut')}>
          <Input name="checkOut" type="date" />
        </Field>
      </div>
      <Field label={t('guests')}>
        <Input name="guests" type="number" min={1} max={20} defaultValue={2} />
      </Field>
      <Field label={t('notes')}>
        <Textarea name="notes" rows={3} />
      </Field>
    </form>
  )
}

function EventForm() {
  const t = useTranslations('reservationDrawer.event')
  return (
    <form className="flex flex-col gap-4" noValidate>
      <p className="text-text text-2xl">{t('intro')}</p>

      <Field label={t('fullName')}>
        <Input name="fullName" autoComplete="name" />
      </Field>
      <Field label={t('email')}>
        <Input name="email" type="email" autoComplete="email" />
      </Field>
      <Field label={t('phone')}>
        <Input name="phone" type="tel" autoComplete="tel" />
      </Field>
      <Field label={t('eventType')}>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="—" />
          </SelectTrigger>
          <SelectContent>
            {EVENT_TYPES.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label={t('preferredDate')}>
        <Input name="preferredDate" type="date" />
      </Field>
      <Field label={t('guests')}>
        <Input name="guests" type="number" min={1} max={300} defaultValue={50} />
      </Field>
      <Field label={t('message')}>
        <Textarea name="message" rows={3} />
      </Field>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-text-muted text-xs tracking-wide uppercase">{label}</Label>
      {children}
    </div>
  )
}
