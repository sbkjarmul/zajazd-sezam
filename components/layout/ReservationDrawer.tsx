'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { useUI } from '@/components/providers/UIProvider'
import { VisuallyHidden } from 'radix-ui'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'

// Formularze laduja sie leniwie, dopiero gdy drawer sie otworzy. Statycznie
// ciagnely react-hook-form + zod + react-day-picker + date-fns + Turnstile do
// bundla KAZDEJ podstrony, mimo ze drawer startuje zamkniety. Radix montuje
// SheetContent dopiero przy otwarciu, wiec import dynamiczny nie opoznia nic,
// co uzytkownik widzi wczesniej.
// ssr:false - formularze i tak sa interaktywne i nie wnosza nic do HTML-a.
const RoomBookingForm = dynamic(
  () => import('@/components/forms/RoomBookingForm').then((m) => m.RoomBookingForm),
  { ssr: false },
)
const EventInquiryForm = dynamic(
  () => import('@/components/forms/EventInquiryForm').then((m) => m.EventInquiryForm),
  { ssr: false },
)

// Wg Figma 676:1750: drawer 632px szerokości, bg-white, p-[32px], gap-[40px].
// Header: "REZERWUJ" text-[40px] font-light + close X 32px.
// Tabs gap-[16px], aktywny = border-b-1 text-bold, oba 20px.
// Backdrop: backdrop-blur-[6px] bg-[rgba(31,31,28,0.5)].
export function ReservationDrawer() {
  const { reservationOpen, closeReservation } = useUI()

  return (
    <Sheet open={reservationOpen} onOpenChange={(open) => (open ? null : closeReservation())}>
      <SheetContent
        side="right"
        showCloseButton={false}
        overlayClassName="backdrop-blur-[6px] bg-[rgba(31,31,28,0.5)]"
        className="bg-surface flex w-full max-w-[632px] flex-col gap-10 overflow-y-auto border-l-0 p-8 sm:max-w-[632px]"
      >
        <VisuallyHidden.Root>
          <SheetDescription>
            Formularz rezerwacji pokoju lub zapytania o organizację imprezy.
          </SheetDescription>
        </VisuallyHidden.Root>

        {/* Cialo drawera jako osobny komponent: montuje sie DOPIERO gdy Radix
            otwiera Content (Presence). Dzieki temu useGSAP (layout effect na mount)
            widzi juz przypiety DOM — animacja odpala sie przy kazdym otwarciu.
            Sterowanie animacja z rodzica po `reservationOpen` NIE dziala, bo ref
            jest jeszcze null gdy Content nie jest zamontowany. */}
        <DrawerBody />
      </SheetContent>
    </Sheet>
  )
}

// Wewnetrzne bloki (naglowek -> zakladki -> formularz) pojawiaja sie staggerem
// GSAP zsynchronizowanym z wjazdem panelu (CSS Radix slide-in-from-right).
// useGSAP bez zaleznosci = odpala raz na mount tego komponentu, czyli przy kazdym
// otwarciu drawera (Radix odmontowuje Content po zamknieciu). reduced-motion:
// fromTo nie odpala, wiec nic nie chowamy — tresc od razu widoczna.
function DrawerBody() {
  const t = useTranslations('reservationDrawer')
  const tCommon = useTranslations('common')
  const { closeReservation, reservationTab, setReservationTab } = useUI()
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = contentRef.current
      if (!el) return
      const items = el.querySelectorAll<HTMLElement>('[data-reveal]')
      if (!items.length) return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out',
            stagger: 0.08,
            delay: 0.12,
            clearProps: 'opacity,visibility,transform',
          },
        )
      })
      return () => mm.revert()
    },
    { scope: contentRef },
  )

  return (
    <div ref={contentRef} className="flex flex-col gap-10">
      <div data-reveal className="flex items-start justify-between">
        <SheetTitle className="text-text text-[40px] font-light tracking-normal">
          {t('title')}
        </SheetTitle>
        <button
          type="button"
          onClick={closeReservation}
          aria-label={tCommon('close')}
          className="text-text hover:text-accent cursor-pointer transition-colors"
        >
          <X className="size-8" />
        </button>
      </div>

      <div data-reveal className="flex flex-col gap-6">
        {/* Zakladki jada jednym rzedem BEZ zawijania i wychodza poza krawedz
            drawera — na mobile "Imprezy okolicznosciowe" nie miesci sie obok
            "Pokoje", wiec zamiast lamac tekst dajemy poziomy scroll (`-mx-8 px-8`
            bleeduje scroller pod padding drawera, zeby etykieta uciekala za
            krawedz ekranu i bylo widac, ze da sie przesunac). Scrollbar ukryty. */}
        <div
          role="tablist"
          className="-mx-8 flex [scrollbar-width:none] items-center gap-4 overflow-x-auto px-8 [&::-webkit-scrollbar]:hidden"
        >
          <button
            type="button"
            role="tab"
            aria-selected={reservationTab === 'room'}
            onClick={() => setReservationTab('room')}
            className={cn(
              'text-text shrink-0 cursor-pointer py-1 text-lg whitespace-nowrap transition-all',
              reservationTab === 'room' ? 'border-text border-b font-bold' : 'font-normal',
            )}
          >
            {t('tabs.room')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={reservationTab === 'event'}
            onClick={() => setReservationTab('event')}
            className={cn(
              'text-text shrink-0 cursor-pointer py-1 text-lg whitespace-nowrap transition-all',
              reservationTab === 'event' ? 'border-text border-b font-bold' : 'font-normal',
            )}
          >
            {t('tabs.event')}
          </button>
        </div>
        <div className="border-text border-t" aria-hidden />
      </div>

      <div data-reveal>
        {reservationTab === 'room' ? <RoomBookingForm /> : <EventInquiryForm />}
      </div>
    </div>
  )
}
