'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import {
  ROOM_TYPE_IDS,
  roomBookingSchema,
  type RoomBookingValues,
} from '@/lib/validators/reservation'
import { useReservationSubmit } from './useReservationSubmit'
import { TurnstileField } from './TurnstileField'
import { DateField } from './DateField'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

// Wg Figma 676:1763: form gap-[24px]. Tytuł text-[32px] uppercase, lista pól
// h-[63px] border p-[16px] text-[20px], submit h-[65px] rounded-full w-full,
// disclaimer text-[16px] center. Brak labelek nad polami — placeholder w roli.
export function RoomBookingForm() {
  const t = useTranslations('reservationDrawer.room')
  const tErrors = useTranslations()
  const tCommon = useTranslations('reservationDrawer')
  const tRoomTypes = useTranslations('reservationDrawer.roomTypeOptions')
  const { submitForm, submitting } = useReservationSubmit()
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstile, setTurnstile] = useState<TurnstileInstance | null>(null)

  const form = useForm<RoomBookingValues>({
    resolver: zodResolver(roomBookingSchema),
    defaultValues: {
      email: '',
      phone: '',
      guests: 2,
    },
  })

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  const onSubmit = handleSubmit(async (values) => {
    const ok = await submitForm({ kind: 'room', data: values }, turnstileToken)
    if (ok) {
      reset()
      turnstile?.reset()
      setTurnstileToken('')
    }
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <h3 className="text-text text-lg leading-none font-normal tracking-tight uppercase md:text-xl md:tracking-[-0.03em]">
        {t('intro')}
      </h3>

      <div className="flex flex-col gap-5">
        <FieldShell error={errors.email?.message} tt={tErrors}>
          <input
            {...register('email')}
            type="email"
            placeholder={t('email')}
            autoComplete="email"
            inputMode="email"
            aria-label={t('email')}
            className={inputClasses}
          />
        </FieldShell>

        <FieldShell error={errors.phone?.message} tt={tErrors}>
          <input
            {...register('phone')}
            type="tel"
            placeholder={t('phone')}
            autoComplete="tel"
            inputMode="tel"
            aria-label={t('phone')}
            className={inputClasses}
          />
        </FieldShell>

        {/* Rodzaj pokoju + Liczba gości w jednym rzędzie — select dostaje 2/3 szerokości,
            number input 1/3 (przyciasna sama liczba). */}
        <div className="grid grid-cols-[2fr_1fr] gap-[10px]">
          <FieldShell error={errors.roomType?.message} tt={tErrors}>
            <Controller
              control={control}
              name="roomType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={selectTriggerClasses}
                    aria-label={t('roomType')}
                  >
                    <SelectValue placeholder={t('roomType')} />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOM_TYPE_IDS.map((id) => (
                      <SelectItem key={id} value={id}>
                        {tRoomTypes(id)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FieldShell>

          <FieldShell error={errors.guests?.message} tt={tErrors}>
            <input
              {...register('guests', { valueAsNumber: true })}
              type="number"
              min={1}
              max={20}
              inputMode="numeric"
              placeholder={t('guests')}
              aria-label={t('guests')}
              className={inputClasses}
            />
          </FieldShell>
        </div>

        {/* Kolejność per Figma 676:1777: LEWE = Wymeldowanie, PRAWE = Zameldowanie */}
        <div className="grid grid-cols-2 gap-[10px]">
          <FieldShell error={errors.checkOut?.message} tt={tErrors}>
            <Controller
              control={control}
              name="checkOut"
              render={({ field }) => (
                <DateField
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder={t('checkOut')}
                  ariaLabel={t('checkOut')}
                />
              )}
            />
          </FieldShell>
          <FieldShell error={errors.checkIn?.message} tt={tErrors}>
            <Controller
              control={control}
              name="checkIn"
              render={({ field }) => (
                <DateField
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder={t('checkIn')}
                  ariaLabel={t('checkIn')}
                />
              )}
            />
          </FieldShell>
        </div>
      </div>

      <TurnstileField
        ref={setTurnstile}
        onSuccess={setTurnstileToken}
        onExpire={() => setTurnstileToken('')}
        onError={() => setTurnstileToken('')}
      />

      <div className="border-text mt-auto border-t" aria-hidden />

      <div className="flex flex-col gap-2">
        <button
          type="submit"
          disabled={submitting || !turnstileToken}
          className={cn(
            'bg-primary text-primary-foreground hover:bg-primary-hover inline-flex h-[65px] w-full items-center justify-center rounded-full px-6 text-base font-normal transition-colors',
            (submitting || !turnstileToken) && 'cursor-not-allowed opacity-60',
          )}
        >
          {submitting ? tCommon('submitting') : tCommon('submit')}
        </button>
        <p className="text-text text-center text-base">{tCommon('disclaimer')}</p>
      </div>
    </form>
  )
}

// Underline-only inputs zgodnie z Figmą (node 825:18..44). Stany:
//  - filled / focus: border-b 2px accent (gold), tekst accent — to baza
//  - empty + bez focusu: border-b 1px border-text (dark), tekst muted
// Łączymy `:placeholder-shown:not(:focus)` w jednym selektorze, bo same
// `placeholder-shown:` i `focus:` mają równą specyfikę i o wyniku decyduje
// source-order Tailwinda — gdzie `placeholder-shown` jest później niż `focus`,
// więc focus na pustym inpucie traciłby kolor accentu. Złączenie warunków
// daje (0,3,0) i jednoznacznie wygrywa nad bazą (0,1,0).
// Rozmiar tekstu 14px (mniejszy niż domyślny 16px) per request.
const inputClasses =
  'border-accent text-accent placeholder:text-text-muted h-[48px] w-full rounded-none border-0 border-b-2 bg-transparent px-0 text-[20px] outline-none focus-visible:outline-none transition-colors [&:placeholder-shown:not(:focus)]:border-b [&:placeholder-shown:not(:focus)]:border-text [&:placeholder-shown:not(:focus)]:text-text-muted'

// Select (Radix przez shadcn/ui) — ta sama logika co dla input, ale stan "pusty"
// czytamy z atrybutu `data-placeholder` zamiast pseudo `:placeholder-shown`.
// Open state (`data-state=open`) trzymamy w bazie aktywnej, bo trigger po
// otwarciu zachowuje się jak aktywny — accent + 2px.
// `data-[size=default]:h-[48px]` nadpisuje shadcnowe `data-[size=default]:h-9`
// (selektor atrybutowy ma wyższą specyfikę niż samo `h-[48px]`) — bez tego
// select renderuje się jako 36px i nie pasuje wysokością do inputów.
const selectTriggerClasses =
  'border-accent text-accent h-[48px] data-[size=default]:h-[48px] w-full rounded-none border-0 border-b-2 bg-transparent px-0 py-0 text-[20px] shadow-none outline-none focus-visible:outline-none transition-colors focus-visible:ring-0 [&[data-placeholder]:not(:focus):not([data-state=open])]:border-b [&[data-placeholder]:not(:focus):not([data-state=open])]:border-text [&[data-placeholder]:not(:focus):not([data-state=open])]:text-text-muted [&_svg]:size-[18px] [&_svg]:opacity-100 [&_svg]:text-accent [&[data-placeholder]:not(:focus):not([data-state=open])_svg]:text-text-muted'

function FieldShell({
  error,
  tt,
  children,
}: {
  error?: string
  tt: (key: string) => string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      {children}
      {error && <p className="text-destructive text-sm">{tt(error)}</p>}
    </div>
  )
}
