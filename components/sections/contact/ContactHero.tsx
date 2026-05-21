import type { CONTACT_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<CONTACT_PAGE_QUERY_RESULT>['hero']
  locale: Locale
}

export function ContactHero({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const subtitle = pickLocale(data.subtitle, locale)

  return (
    <section className="relative flex min-h-[60vh] w-full flex-col justify-end overflow-hidden">
      {data.image ? (
        <SanityImage
          image={data.image}
          locale={locale}
          fill
          priority
          sizes="100vw"
          className="-z-10"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 -z-20"
          style={{
            background: 'linear-gradient(180deg, var(--color-gold) 0%, var(--color-dark) 100%)',
          }}
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(180deg, rgba(31,31,28,0.25) 0%, rgba(31,31,28,0.65) 100%)',
        }}
      />

      <div className="text-text-inverse layout-container pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="flex max-w-4xl flex-col gap-6">
          {eyebrow && (
            <p className="text-text-inverse text-sm tracking-normal uppercase md:text-base">
              {eyebrow}
            </p>
          )}
          {title && (
            <h1 className="text-text-inverse text-5xl leading-none font-normal tracking-tight md:text-6xl md:tracking-[-0.03em] lg:text-7xl">
              {title}
            </h1>
          )}
          {subtitle && <p className="max-w-2xl text-lg md:text-xl">{subtitle}</p>}
        </div>
      </div>
    </section>
  )
}
