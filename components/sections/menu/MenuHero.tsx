import type { MENU_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<MENU_PAGE_QUERY_RESULT>['pageIntro']
  locale: Locale
}

export function MenuHero({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const subtitle = pickLocale(data.subtitle, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)

  return (
    <section className="bg-bg flex min-h-[80vh] flex-col items-center justify-center px-6 pt-32 pb-12 text-center md:px-16 md:pt-40">
      {eyebrow && <p className="text-accent text-sm tracking-widest uppercase">{eyebrow}</p>}
      {title && (
        <h1 className="text-text mt-6 max-w-6xl text-5xl leading-tight font-light tracking-tight uppercase md:text-7xl lg:text-[120px]">
          {title}
        </h1>
      )}
      {subtitle && (
        <p className="text-text-muted mt-8 max-w-3xl text-xl leading-relaxed">{subtitle}</p>
      )}
      {ctaLabel && (
        <a
          href="#menu"
          className="bg-primary text-primary-foreground hover:bg-primary-hover mt-10 inline-flex h-[60px] items-center justify-center rounded-full px-8 text-lg uppercase transition-colors"
        >
          {ctaLabel}
        </a>
      )}
    </section>
  )
}
