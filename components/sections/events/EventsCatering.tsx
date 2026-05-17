import type { EVENTS_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<EVENTS_PAGE_QUERY_RESULT>['cateringSection']
  locale: Locale
}

export function EventsCatering({ data, locale }: Props) {
  if (!data) return null
  const eyebrow = pickLocale(data.eyebrow, locale)
  const title = pickLocale(data.title, locale)
  const description = pickLocale(data.description, locale)

  return (
    <section className="bg-surface py-20 md:py-32">
      <div className="layout-container grid grid-cols-1 items-center gap-12 md:px-0 lg:grid-cols-2">
        <div className="flex flex-col gap-10 md:px-16">
          <div className="flex flex-col gap-4">
            {eyebrow && <p className="text-text text-base tracking-normal uppercase">{eyebrow}</p>}
            {title && (
              <h2 className="text-text text-4xl leading-tight font-normal tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-6xl">
                {title}
              </h2>
            )}
          </div>
          {description && (
            <p className="text-text max-w-2xl text-xl leading-relaxed whitespace-pre-line">
              {description}
            </p>
          )}
        </div>

        <div className="relative aspect-[3/4] w-full overflow-hidden md:aspect-auto md:min-h-[700px]">
          <SanityImage
            image={data.image}
            locale={locale}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
