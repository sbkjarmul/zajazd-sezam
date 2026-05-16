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
import { cn } from '@/lib/utils'

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
      fullName: '',
      email: '',
      phone: '',
      guests: 2,
      notes: '',
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
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <p className="text-text text-2xl">{t('intro')}</p>

      <FieldRow label={t('fullName')} error={errors.fullName?.message} tt={tErrors}>
        <Input {...register('fullName')} autoComplete="name" />
      </FieldRow>

      <FieldRow label={t('email')} error={errors.email?.message} tt={tErrors}>
        <Input {...register('email')} type="email" autoComplete="email" inputMode="email" />
      </FieldRow>

      <FieldRow label={t('phone')} error={errors.phone?.message} tt={tErrors}>
        <Input {...register('phone')} type="tel" autoComplete="tel" inputMode="tel" />
      </FieldRow>

      <FieldRow label={t('roomType')} error={errors.roomType?.message} tt={tErrors}>
        <Controller
          control={control}
          name="roomType"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="—" />
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
      </FieldRow>

      <div className="grid grid-cols-2 gap-3">
        <FieldRow label={t('checkIn')} error={errors.checkIn?.message} tt={tErrors}>
          <Input {...register('checkIn')} type="date" />
        </FieldRow>
        <FieldRow label={t('checkOut')} error={errors.checkOut?.message} tt={tErrors}>
          <Input {...register('checkOut')} type="date" />
        </FieldRow>
      </div>

      <FieldRow label={t('guests')} error={errors.guests?.message} tt={tErrors}>
        <Input
          {...register('guests', { valueAsNumber: true })}
          type="number"
          min={1}
          max={20}
          inputMode="numeric"
        />
      </FieldRow>

      <FieldRow label={t('notes')} error={errors.notes?.message} tt={tErrors}>
        <Textarea {...register('notes')} rows={3} />
      </FieldRow>

      <TurnstileField
        ref={setTurnstile}
        onSuccess={setTurnstileToken}
        onExpire={() => setTurnstileToken('')}
        onError={() => setTurnstileToken('')}
      />

      <button
        type="submit"
        disabled={submitting || !turnstileToken}
        className={cn(
          'bg-primary text-primary-foreground hover:bg-primary-hover inline-flex h-[60px] w-full items-center justify-center rounded-full px-6 text-lg font-normal transition-colors',
          (submitting || !turnstileToken) && 'cursor-not-allowed opacity-60',
        )}
      >
        {submitting ? tCommon('submitting') : tCommon('submit')}
      </button>
      <p className="text-text-muted text-center text-sm">{tCommon('disclaimer')}</p>
    </form>
  )
}

function FieldRow({
  label,
  error,
  tt,
  children,
}: {
  label: string
  error?: string
  tt: (key: string) => string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-text-muted text-xs tracking-wide uppercase">{label}</Label>
      {children}
      {error && <p className="text-destructive text-sm">{tt(error)}</p>}
    </div>
  )
}
