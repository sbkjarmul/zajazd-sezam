import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { sanityClient } from '@/lib/sanity/client'
import { SITE_SETTINGS_QUERY } from '@/lib/sanity/queries'
import { UIProvider } from '@/components/providers/UIProvider'
import { BurgerMenu } from '@/components/layout/BurgerMenu'
import { ReservationDrawer } from '@/components/layout/ReservationDrawer'
import { Toaster } from '@/components/ui/sonner'
import { SmoothScroll } from '@/components/SmoothScroll'
import '../../globals.css'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
})

// Westbourne Serif — akcentowa kursywa dla wyróżnionej frazy w hero
// ("rodzinnej atmosferze"). Tylko waga 400 (regular + italic). Wystawiana jako
// --font-westbourne → mapowana na utility `font-serif` w globals.css.
const westbourne = localFont({
  src: [
    { path: '../../../public/font/WestbourneSerif-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../../public/font/WestbourneSerif-Italic.ttf', weight: '400', style: 'italic' },
  ],
  variable: '--font-westbourne',
  display: 'swap',
  // Wyłączamy auto-fallback next/font — generował metric-adjusted `local("Arial")`
  // (sans), który zawsze jest dostępny, więc w oknie FOUT akcent „rodzinnej
  // atmosferze" migał prostym sansem zamiast kursywy szeryfowej. Bez niego
  // łańcuch spada do serif stacku z `.font-accent` (Georgia → serif italic).
  adjustFontFallback: false,
})

const DEFAULT_FAVICON = '/images/icons/sezam-hotel-brandmark.svg'

export async function generateMetadata(): Promise<Metadata> {
  // Favicon: jeśli CMS ma własny, użyj; inaczej domyślne sezam-hotel-brandmark.svg.
  // Cast: query typegen wnioskuje `favicon: null` dopóki pole nie jest wypełnione w żadnym dokumencie.
  const settings = await sanityClient.fetch(SITE_SETTINGS_QUERY)
  const favicon = settings?.favicon as { asset?: { url?: string | null } | null } | null | undefined
  const customFaviconUrl = favicon?.asset?.url
  const iconUrl = customFaviconUrl || DEFAULT_FAVICON
  return {
    title: 'Zajazd Sezam',
    description: 'Kompleks gastronomiczno-hotelowy w Stalowej Woli.',
    icons: {
      icon: iconUrl,
      shortcut: iconUrl,
      apple: iconUrl,
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  setRequestLocale(locale)

  // settings.phone trafia do UIProvider → ReservationCtaButton używa go do
  // tap-to-call (tel:) na mobile zamiast otwierania drawer formularza.
  const settings = await sanityClient.fetch(SITE_SETTINGS_QUERY)

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${westbourne.variable} h-full antialiased`}
    >
      <body className="bg-bg text-text flex min-h-full flex-col font-sans">
        <NextIntlClientProvider>
          <UIProvider phone={settings?.phone}>
            <SmoothScroll>
              {/* Header + Footer renderowane per-strona (per-route logo, theme, brand) */}
              <main className="flex flex-1 flex-col">{children}</main>
              <BurgerMenu />
              <ReservationDrawer />
              <Toaster position="top-center" richColors />
            </SmoothScroll>
          </UIProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
