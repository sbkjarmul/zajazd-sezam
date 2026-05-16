import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { sanityClient } from '@/lib/sanity/client'
import { SITE_SETTINGS_QUERY } from '@/lib/sanity/queries'
import { UIProvider } from '@/components/providers/UIProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BurgerMenu } from '@/components/layout/BurgerMenu'
import { ReservationDrawer } from '@/components/layout/ReservationDrawer'
import { Toaster } from '@/components/ui/sonner'
import '../../globals.css'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Zajazd Sezam',
  description: 'Kompleks gastronomiczno-hotelowy w Stalowej Woli.',
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

  const settings = await sanityClient.fetch(SITE_SETTINGS_QUERY)

  return (
    <html lang={locale} className={`${inter.variable} h-full antialiased`}>
      <body className="bg-bg text-text flex min-h-full flex-col font-sans">
        <NextIntlClientProvider>
          <UIProvider>
            <Header />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer settings={settings} locale={locale as Locale} />
            <BurgerMenu settings={settings} />
            <ReservationDrawer />
            <Toaster position="top-center" richColors />
          </UIProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
