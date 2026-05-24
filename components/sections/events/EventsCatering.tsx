import type { EVENTS_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'
import { Reveal } from '@/components/Reveal'
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
    <section className="bg-surface pt-20 md:py-32">
      <div className="layout-container grid grid-cols-1 items-center gap-12 px-0 lg:grid-cols-2">
        <Reveal className="flex flex-col gap-10 px-4 md:px-16">
          <div className="flex flex-col gap-4">
            {eyebrow && (
              <p className="text-text text-base wide:text-lg tracking-normal uppercase leading-[normal]">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-text text-2xl leading-none font-normal tracking-tight md:text-5xl md:tracking-[-0.03em] lg:text-6xl">
                {title}
              </h2>
            )}
          </div>
          {description && (
            <p className="text-text max-w-2xl text-xl leading-[normal] whitespace-pre-line lg:text-base xl:text-xl">
              {description}
            </p>
          )}
        </Reveal>

        <Reveal
          delay={120}
          className="relative aspect-square w-full overflow-hidden md:aspect-auto md:min-h-[700px]"
        >
          <SanityImage
            image={data.image}
            locale={locale}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </Reveal>
      </div>
    </section>
  )
}
