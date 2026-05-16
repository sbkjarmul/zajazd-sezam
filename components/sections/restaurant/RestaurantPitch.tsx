import type { RESTAURANT_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<RESTAURANT_PAGE_QUERY_RESULT>['pitchSection']
  locale: Locale
}

export function RestaurantPitch({ data, locale }: Props) {
  if (!data) return null
  const text = pickLocale(data.text, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)

  return (
    <section className="bg-bg py-24 md:py-40">
      <div className="mx-auto flex w-full max-w-[1384px] flex-col items-center gap-12 px-6 text-center md:px-16">
        {text && (
          <p className="text-text max-w-5xl text-3xl leading-[1.15] font-light uppercase md:text-5xl lg:text-6xl">
            {text}
          </p>
        )}
        {ctaLabel && (
          <Link
            href="/restauracja/menu"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground inline-flex h-[60px] items-center justify-center rounded-full border-2 px-6 text-lg transition-colors"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </section>
  )
}
