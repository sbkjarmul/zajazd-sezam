// Dispatcher maili.
// Produkcja: Resend (gdy RESEND_API_KEY jest ustawione).
// Dev: mock zapisujacy HTML do tmp/mails/ - bez klucza nie robimy zadnych
// zapytan sieciowych, wiec formularz da sie testowac lokalnie.

import { Resend } from 'resend'

export type EmailPayload = {
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
  // Tagi Resend (dashboard/analytics). Tylko ASCII: [a-zA-Z0-9_-].
  tags?: { name: string; value: string }[]
}

const FROM_NAME = 'Zajazd Sezam'

// Klient tworzony leniwie i cache'owany - jeden na proces (lambda warm start).
let client: Resend | null = null

function getClient(apiKey: string): Resend {
  client ??= new Resend(apiKey)
  return client
}

function getFromAddress(): string {
  const from = process.env.REPLY_FROM_EMAIL
  if (!from) {
    throw new Error(
      'Missing REPLY_FROM_EMAIL — Resend wymaga adresu nadawcy na zweryfikowanej domenie.',
    )
  }
  return `${FROM_NAME} <${from}>`
}

export async function sendEmail(payload: EmailPayload): Promise<{ id: string }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return mockSend(payload)

  const { data, error } = await getClient(apiKey).emails.send({
    from: getFromAddress(),
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
    replyTo: payload.replyTo,
    tags: payload.tags,
  })

  if (error) {
    throw new Error(`Resend: ${error.name} — ${error.message}`)
  }
  if (!data) {
    throw new Error('Resend: pusta odpowiedź API (brak id wiadomości).')
  }

  return { id: data.id }
}

// ============================================================================
// Dev mock
// ============================================================================
async function mockSend(payload: EmailPayload): Promise<{ id: string }> {
  // Import dynamiczny: `node:fs` nie moze trafic do bundla edge/produkcyjnego,
  // gdzie i tak zawsze idziemy sciezka Resend.
  const [fs, path] = await Promise.all([import('node:fs/promises'), import('node:path')])

  const dir = path.join(process.cwd(), 'tmp', 'mails')
  await fs.mkdir(dir, { recursive: true })

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const safeTo = payload.to.replace(/[^a-z0-9@._-]/gi, '_')
  const safeSubject = payload.subject.slice(0, 60).replace(/[^a-z0-9._-]/gi, '_')
  const filename = `${timestamp}__${safeTo}__${safeSubject}.html`
  const fullPath = path.join(dir, filename)

  const wrapper = `<!doctype html><html><head><meta charset="utf-8">
<title>${payload.subject}</title>
<style>
  body { margin: 0; font-family: system-ui; }
  .meta { background: #1f1f1c; color: #f6f5ef; padding: 16px; font-size: 12px; font-family: monospace; }
  .meta p { margin: 2px 0; }
  .content { margin: 0; }
</style>
</head><body>
<div class="meta">
  <p><b>To:</b> ${payload.to}</p>
  <p><b>Reply-To:</b> ${payload.replyTo ?? '—'}</p>
  <p><b>Subject:</b> ${payload.subject}</p>
  <p><b>Saved:</b> ${new Date().toISOString()}</p>
</div>
<iframe class="content" style="width:100%;height:90vh;border:0;" srcdoc="${payload.html.replace(/"/g, '&quot;')}"></iframe>
</body></html>`

  await fs.writeFile(fullPath, wrapper, 'utf-8')

  // Log do konsoli dev — łatwy klik z terminala.
  console.info(`[email mock] ${payload.subject}\n  → file://${fullPath}\n  → to: ${payload.to}`)

  return { id: filename }
}
