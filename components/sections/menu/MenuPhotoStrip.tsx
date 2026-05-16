import type { MENU_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'

type Props = {
  data: NonNullable<MENU_PAGE_QUERY_RESULT>['photoStrip']
  locale: Locale
}

export function MenuPhotoStrip({ data, locale }: Props) {
  // Renderuj zawsze 4 sloty — placeholder gdy brak zdjęcia.
  const slots = [0, 1, 2, 3]
  return (
    <section className="bg-bg" aria-hidden>
      <div className="grid grid-cols-2 md:grid-cols-4">
        {slots.map((i) => (
          <div key={i} className="relative aspect-square">
            <SanityImage
              image={data?.[i]}
              locale={locale}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
