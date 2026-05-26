import type { MENU_PAGE_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { SanityImage } from '@/components/SanityImage'

type Props = {
  data: NonNullable<MENU_PAGE_QUERY_RESULT>['photoStrip']
  locale: Locale
}

// Infinity marquee w lewo — content duplikowany 2× w jednym flex-row, animacja
// translateX(0 → -50%) linear infinite. Hover pauzuje (UX dla użytkownika).
// Gap 8px (gap-2) między zdjęciami, kompensowany w keyframie tak żeby loop był seamless.
export function MenuPhotoStrip({ data, locale }: Props) {
  const slots = [0, 1, 2, 3]
  // Duplikujemy listę: pierwsza połowa scrolluje out → druga zajmuje miejsce → reset bez "skoku"
  const loopSlots = [...slots, ...slots]

  return (
    <section className="bg-bg mb-2 overflow-hidden md:mb-0" aria-hidden>
      <div className="animate-marquee-left flex w-max gap-2 hover:[animation-play-state:paused]">
        {loopSlots.map((i, idx) => (
          <div
            key={idx}
            className="relative aspect-square w-[50vw] shrink-0 overflow-hidden md:w-[25vw]"
          >
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
