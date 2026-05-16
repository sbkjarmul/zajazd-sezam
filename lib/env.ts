function assertEnv(name: string, value: string | undefined, fallback?: string): string {
  if (value && value.length > 0) return value
  if (fallback !== undefined) return fallback
  throw new Error(`Missing environment variable: ${name}`)
}

// Pełny URL strony, bez końcowego slasha.
// Lokalnie: http://localhost:3000. Produkcja: https://zajazdsezam.pl.
export const SITE_URL = assertEnv(
  'NEXT_PUBLIC_SITE_URL',
  process.env.NEXT_PUBLIC_SITE_URL,
  'http://localhost:3000',
).replace(/\/$/, '')
