// Server-side weryfikacja tokena Cloudflare Turnstile.
// Test keys (dev) zawsze przepuszczają — patrz .env.local.example.
// Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

type TurnstileSuccess = { success: true; challenge_ts?: string; hostname?: string }
type TurnstileFailure = { success: false; 'error-codes': string[] }
type TurnstileResponse = TurnstileSuccess | TurnstileFailure

export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return { ok: false, reason: 'missing-secret' }

  const body = new FormData()
  body.set('secret', secret)
  body.set('response', token)
  if (remoteIp) body.set('remoteip', remoteIp)

  try {
    const res = await fetch(VERIFY_URL, { method: 'POST', body })
    if (!res.ok) return { ok: false, reason: `http-${res.status}` }

    const data = (await res.json()) as TurnstileResponse
    if (data.success) return { ok: true }
    return { ok: false, reason: data['error-codes']?.join(',') ?? 'unknown' }
  } catch (error) {
    return { ok: false, reason: `fetch-error:${(error as Error).message}` }
  }
}
