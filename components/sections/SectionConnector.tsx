import { cn } from '@/lib/utils'

type Props = {
  // Gradient CSS laczacy dwie sasiednie sekcje: gora = kolor sekcji powyzej,
  // dol = kolor sekcji ponizej.
  gradient: string
  className?: string
}

// Lacznik miedzy sekcjami (TYLKO mobile) - pasek 7.75rem z gradientem wtapiajacym
// jedna sekcje w nastepna (jak przejscia na satius.app). To zwykly <div> (nie
// <section>), wiec NIE jest punktem scroll-snap - scroll sie na nim nie
// zatrzymuje, panele przewijaja sie przez niego jako plynne przejscie. Na
// desktopie ukryty (`lg:hidden`).
export function SectionConnector({ gradient, className }: Props) {
  return (
    <div
      aria-hidden
      className={cn('h-[7.75rem] w-full lg:hidden', className)}
      style={{ backgroundImage: gradient }}
    />
  )
}
