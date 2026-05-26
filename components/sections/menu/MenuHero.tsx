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
    <section className="bg-bg text-dark-ruby pt-40 pb-16 md:pt-48 md:pb-24">
      <div className="layout-container flex flex-col items-center gap-6 text-center md:gap-8">
        {eyebrow && (
          <p className="text-dark-ruby wide:text-lg text-base tracking-normal uppercase">
            {eyebrow}
          </p>
        )}
        {title && (
          <h1 className="text-dark-ruby text-[42px] leading-none font-black tracking-tight uppercase md:text-[51px] md:tracking-[-0.03em] lg:text-[90px]">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-dark-ruby max-w-3xl text-lg leading-[1.2] md:text-xl">{subtitle}</p>
        )}
        {ctaLabel && (
          <a
            href="#menu"
            className="border-dark-ruby text-dark-ruby hover:bg-dark-ruby hover:text-text-inverse mt-2 inline-flex h-[60px] items-center justify-center rounded-full border-2 px-8 text-lg uppercase transition-colors md:mt-4 md:h-[65px] md:px-10"
          >
            {ctaLabel}
          </a>
        )}
      </div>
    </section>
  )
}
