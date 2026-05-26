'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import {
  EVENT_GUEST_RANGES,
  EVENT_TYPE_IDS,
  eventInquirySchema,
  type EventInquiryValues,
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

// Styling per Figma 676:1763 (tab room) — to samo dla event tab dla spójności.
// Pola h-[63px] border p-[16px] text-[20px], submit h-[65px], disclaimer text-base center.
export function EventInquiryForm() {
  const t = useTranslations('reservationDrawer.event')
  const tErrors = useTranslations()
  const tCommon = useTranslations('reservationDrawer')
  const tEventTypes = useTranslations('reservationDrawer.eventTypeOptions')
  const { submitForm, submitting } = useReservationSubmit()
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstile, setTurnstile] = useState<TurnstileInstance | null>(null)

  const form = useForm<EventInquiryValues>({
    resolver: zodResolver(eventInquirySchema),
    defaultValues: {
      email: '',
      phone: '',
      hall: '',
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
    const ok = await submitForm({ kind: 'event', data: values }, turnstileToken)
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

        <FieldShell error={errors.eventType?.message} tt={tErrors}>
          <Controller
            control={control}
            name="eventType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={selectTriggerClasses} aria-label={t('eventType')}>
                  <SelectValue placeholder={t('eventType')} />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPE_IDS.map((id) => (
                    <SelectItem key={id} value={id}>
                      {tEventTypes(id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FieldShell>

        <FieldShell error={errors.preferredDate?.message} tt={tErrors}>
          <Controller
            control={control}
            name="preferredDate"
            render={({ field }) => (
              <DateField
                value={field.value || ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder={t('preferredDate')}
                ariaLabel={t('preferredDate')}
              />
            )}
          />
        </FieldShell>

        <FieldShell error={errors.guests?.message} tt={tErrors}>
          <Controller
            control={control}
            name="guests"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={selectTriggerClasses} aria-label={t('guests')}>
                  <SelectValue placeholder={t('guests')} />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_GUEST_RANGES.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FieldShell>
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

// Underline-only inputs zgodnie z Figmą. Patrz RoomBookingForm.tsx — bazą jest
// stan aktywny (border-b-2 accent), a `:placeholder-shown:not(:focus)` (input)
// i `[data-placeholder]:not(:focus):not([data-state=open])` (select) przełączają
// na nieaktywny (border-b 1px text dark + tekst muted). Łączymy warunki w jeden
// selector żeby focus na pustym polu nadal trzymał accent.
const inputClasses =
  'border-accent text-accent placeholder:text-text-muted h-[56px] w-full rounded-none border-0 border-b-2 bg-transparent px-0 text-[20px] outline-none focus-visible:outline-none transition-colors [&:placeholder-shown:not(:focus)]:border-b [&:placeholder-shown:not(:focus)]:border-text [&:placeholder-shown:not(:focus)]:text-text-muted'

// `data-[size=default]:h-[56px]` nadpisuje shadcnowe `data-[size=default]:h-9`
// — bez tego select renderuje się jako 36px i nie pasuje do inputów.
const selectTriggerClasses =
  'border-accent text-accent h-[56px] data-[size=default]:h-[56px] w-full rounded-none border-0 border-b-2 bg-transparent px-0 py-0 text-[20px] shadow-none outline-none focus-visible:outline-none transition-colors focus-visible:ring-0 [&[data-placeholder]:not(:focus):not([data-state=open])]:border-b [&[data-placeholder]:not(:focus):not([data-state=open])]:border-text [&[data-placeholder]:not(:focus):not([data-state=open])]:text-text-muted [&_svg]:size-5 [&_svg]:opacity-100 [&_svg]:text-accent [&[data-placeholder]:not(:focus):not([data-state=open])_svg]:text-text-muted'

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
