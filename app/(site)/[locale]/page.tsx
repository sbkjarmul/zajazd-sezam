import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('home')

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
      <p className="text-zinc-600">{t('intro')}</p>
      <p className="font-mono text-xs text-zinc-400">locale: {locale}</p>
    </main>
  )
}
