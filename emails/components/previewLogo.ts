// Logo uzywane wylacznie w PreviewProps szablonow (react-email dev server).
// W produkcji URL powstaje z Sanity w lib/email/logo.ts - tutaj jest zaszyty,
// bo podglad nie ma dostepu do zapytan GROQ.

import type { EmailLogo } from '@/lib/email/types'

export const PREVIEW_LOGO: EmailLogo = {
  src: 'https://cdn.sanity.io/images/9a0pa99d/production/82818311467dab9cfa91874f5098f362c9d15b8f-255x39.svg?w=564&h=80&fit=fill&bg=ffffff&fm=png&q=90',
  width: 282,
  height: 40,
  alt: 'Zajazd Sezam — restauracja, hotel i sale weselne w Stalowej Woli',
}
