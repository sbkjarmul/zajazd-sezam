'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useUI } from '@/components/providers/UIProvider'
import type {
  EventInquiryValues,
  RoomBookingValues,
  SendFormRequest,
} from '@/lib/validators/reservation'

type SubmitInput =
  | { kind: 'room'; data: RoomBookingValues }
  | { kind: 'event'; data: EventInquiryValues }

// Wspólna logika wysyłki dla obu formularzy rezerwacji.
// Zwraca submitForm() — wywołaj z tokenem Turnstile.
export function useReservationSubmit() {
  const [submitting, setSubmitting] = useState(false)
  const locale = useLocale() as 'pl' | 'en'
  const t = useTranslations('reservationDrawer.toasts')
  const { closeReservation } = useUI()

  async function submitForm(input: SubmitInput, turnstileToken: string): Promise<boolean> {
    if (!turnstileToken) {
      toast.error(t('turnstileMissing'))
      return false
    }

    setSubmitting(true)
    try {
      const payload: SendFormRequest = {
        kind: input.kind,
        locale,
        turnstileToken,
        // Typescript: data type matches the kind via discriminated union.
        data: input.data as never,
      }

      const res = await fetch('/api/send-form', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        const reason = body.error ?? 'server-error'
        toast.error(t(reason in toastErrorKeys ? `errors.${reason}` : 'errors.server'))
        return false
      }

      toast.success(t('success'))
      closeReservation()
      return true
    } catch (error) {
      console.error('[reservation] submit failed', error)
      toast.error(t('errors.network'))
      return false
    } finally {
      setSubmitting(false)
    }
  }

  return { submitForm, submitting }
}

const toastErrorKeys = {
  validation: true,
  turnstile: true,
  'send-failed': true,
  'invalid-json': true,
  server: true,
  network: true,
} as const
