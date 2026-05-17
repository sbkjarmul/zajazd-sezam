import type { RESTAURANT_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<RESTAURANT_PAGE_QUERY_RESULT>['pitchSection']
  locale: Locale
}

// Pitch ma dwa zdania o różnej stylistyce — pierwsze (bold uppercase) i drugie (regular).
// Seed rozdziela je znakiem nowej linii.
export function RestaurantPitch({ data, locale }: Props) {
  if (!data) return null
  const text = pickLocale(data.text, locale)
  const ctaLabel = pickLocale(data.ctaLabel, locale)
  const [first, ...rest] = (text ?? '').split(/\n+/).filter(Boolean)
  const second = rest.join(' ')

  return (
    <section className="bg-bg py-24 md:py-40">
      <div className="layout-container flex flex-col items-center gap-10 text-center">
        {first && (
          <p className="text-secondary max-w-5xl text-3xl leading-[1.1] tracking-[-0.01em] md:text-5xl lg:text-[58px]">
            <span className="block font-bold uppercase">{first}</span>
            {second && <span className="block font-normal">{second}</span>}
          </p>
        )}
        {ctaLabel && (
          <Link
            href="/restauracja/menu"
            className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground inline-flex h-[60px] items-center justify-center rounded-full border-2 px-6 text-lg transition-colors"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </section>
  )
}
