import type { CONTACT_PAGE_QUERY_RESULT, SITE_SETTINGS_QUERY_RESULT } from '@/types/sanity'
import type { Locale } from '@/i18n/routing'
import { MapPin } from 'lucide-react'
import { SanityImage } from '@/components/SanityImage'
import { pickLocale } from '@/lib/i18n/pickLocale'

type Props = {
  data: NonNullable<CONTACT_PAGE_QUERY_RESULT>['mapSection']
  settings: SITE_SETTINGS_QUERY_RESULT
  locale: Locale
}

// F8 podmieni statyczny placeholder na Google Maps Embed.
export function ContactMap({ data, settings, locale }: Props) {
  const eyebrow = pickLocale(data?.eyebrow, locale)
  const title = pickLocale(data?.title, locale)
  const linkLabel = pickLocale(data?.googleMapsLinkLabel, locale)
  const mapsUrl = settings?.googleMapsUrl
  const address = settings?.address

  return (
    <section className="bg-surface py-20 md:py-32">
      <div className="layout-container flex flex-col gap-10">
        <header className="flex flex-col gap-4">
          {eyebrow && <p className="text-accent text-sm tracking-normal uppercase">{eyebrow}</p>}
          {title && (
            <h2 className="text-text max-w-3xl text-4xl leading-tight font-light tracking-tight md:text-5xl md:tracking-[-0.03em]">
              {title}
            </h2>
          )}
        </header>

        <div className="border-border-subtle relative aspect-[16/9] overflow-hidden rounded-md border md:aspect-[21/9]">
          {data?.mapImage?.asset?.url ? (
            <SanityImage
              image={data.mapImage}
              locale={locale}
              fill
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div
              className="bg-bg flex h-full w-full flex-col items-center justify-center gap-3 text-center"
              aria-label={
                locale === 'pl'
                  ? 'Mapa zostanie podłączona w fazie 8 (Google Maps Embed).'
                  : 'Map will be wired up in phase 8 (Google Maps Embed).'
              }
            >
              <MapPin className="text-accent size-12" aria-hidden />
              {address?.street && (
                <p className="text-text text-lg">
                  {address.street}
                  {address.postalCode && address.city && (
                    <>
                      {' · '}
                      {address.postalCode} {address.city}
                    </>
                  )}
                </p>
              )}
              <p className="text-text-muted text-sm">
                {locale === 'pl'
                  ? 'Interaktywna mapa Google zostanie podłączona w fazie integracji produkcyjnych.'
                  : 'Interactive Google Maps embed will be added during the production-integration phase.'}
              </p>
            </div>
          )}
        </div>

        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text hover:text-accent inline-flex items-center gap-2 self-start text-lg underline-offset-4 hover:underline"
          >
            <MapPin className="size-5" aria-hidden />
            {linkLabel ?? (locale === 'pl' ? 'Otwórz w Mapach Google' : 'Open in Google Maps')}
          </a>
        )}
      </div>
    </section>
  )
}
