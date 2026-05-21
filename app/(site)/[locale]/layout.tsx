import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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
import '../../globals.css'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
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

  return (
    <html lang={locale} className={`${inter.variable} h-full antialiased`}>
      <body className="bg-bg text-text flex min-h-full flex-col font-sans">
        <NextIntlClientProvider>
          <UIProvider>
            {/* Header + Footer renderowane per-strona (per-route logo, theme, brand) */}
            <main className="flex flex-1 flex-col">{children}</main>
            <BurgerMenu />
            <ReservationDrawer />
            <Toaster position="top-center" richColors />
          </UIProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
