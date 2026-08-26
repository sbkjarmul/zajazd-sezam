'use client'

import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { useLocale } from 'next-intl'
import { forwardRef, type Ref } from 'react'

type Props = {
  onSuccess: (token: string) => void
  onError?: () => void
  onExpire?: () => void
  className?: string
}

// Wrapper na Cloudflare Turnstile widget.
// Test site key 1x00000000000000000000AA (z .env.local.example) zawsze przepuszcza.
//
// `appearance: 'interaction-only'` - widget jest niewidoczny dopoki Cloudflare
// nie uzna, ze gosc musi rozwiazac wyzwanie. W typowym ruchu token powstaje w tle
// i formularz nie pokazuje nic. To wspierany tryb Turnstile; ukrywanie widgetu
// CSS-em lamie warunki uslugi i potrafi zablokowac wyzwanie, gdy jest potrzebne.
export const TurnstileField = forwardRef(function TurnstileField(
  { onSuccess, onError, onExpire, className }: Props,
  ref: Ref<TurnstileInstance | null>,
) {
  const locale = useLocale()
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  if (!siteKey) {
    return <p className="text-destructive text-xs">Brak NEXT_PUBLIC_TURNSTILE_SITE_KEY w .env</p>
  }
  return (
    <Turnstile
      ref={ref}
      siteKey={siteKey}
      options={{
        theme: 'light',
        size: 'flexible',
        appearance: 'interaction-only',
        // Bez tego widget dziedziczy jezyk przegladarki - na /en pokazywal
        // polskie "Powodzenie!".
        language: locale,
      }}
      onSuccess={onSuccess}
      onError={onError}
      onExpire={onExpire}
      className={className}
    />
  )
})
