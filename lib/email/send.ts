// Email dispatcher.
// Dev: zapisuje pliki HTML do tmp/mails/ (do podglądu w przeglądarce).
// Produkcja (F8): podmieni mock na Resend gdy RESEND_API_KEY będzie ustawione.

import fs from 'node:fs/promises'
import path from 'node:path'

export type EmailPayload = {
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
}

export async function sendEmail(payload: EmailPayload): Promise<{ id: string }> {
  const resendApiKey = process.env.RESEND_API_KEY
  if (resendApiKey) {
    // F8: tu podłączymy Resend (require lazy żeby nie ładować w dev).
    throw new Error('Resend integration pending (F8). Usuń RESEND_API_KEY by skorzystać z mocka.')
  }
  return mockSend(payload)
}

async function mockSend(payload: EmailPayload): Promise<{ id: string }> {
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
