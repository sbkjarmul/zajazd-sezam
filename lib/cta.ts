import { cn } from '@/lib/utils'

// =============================================================================
// CTA — jedno zrodlo prawdy dla wszystkich pill-buttonow w aplikacji.
//
// Rozmiar jest IDENTYCZNY na mobile i desktop: h-[60px], px-6, text-lg (20px),
// font-normal, tracking-normal. Wczesniej sekcje mialy wlasne warianty
// (h-16/text-xl na mobile, h-[64px], h-[65px], py-3, h-[48px]/text-base), przez
// co przyciski w obrebie jednej strony mialy rozne wysokosci i rozny letter
// spacing. Nie dodawaj lokalnych nadpisan h-*/text-*/tracking-* na CTA —
// dozwolone sa tylko klasy szerokosci (w-full / md:w-auto / min-w-*).
// =============================================================================

export type CtaVariant =
  | 'filled-dark'
  | 'filled-light'
  | 'filled-gold'
  | 'filled-ruby'
  | 'filled-ruby-dark'
  | 'outline-dark'
  | 'outline-light'
  | 'outline-ruby'

export const CTA_BASE =
  'inline-flex h-[60px] cursor-pointer items-center justify-center rounded-full border-2 px-6 text-lg leading-none font-normal tracking-normal transition-colors'

export const CTA_VARIANTS: Record<CtaVariant, string> = {
  'filled-dark': 'bg-primary text-primary-foreground border-primary hover:bg-primary-hover',
  'filled-light':
    'bg-text-inverse text-text border-text-inverse hover:bg-transparent hover:text-text-inverse',
  'filled-gold': 'bg-accent text-text-inverse border-accent hover:bg-accent-hover',
  'filled-ruby': 'bg-ruby-light text-light border-ruby-light hover:bg-ruby',
  'filled-ruby-dark': 'bg-dark-ruby text-text-inverse border-dark-ruby hover:bg-ruby',
  'outline-dark': 'border-primary text-primary hover:bg-primary hover:text-primary-foreground',
  'outline-light': 'border-text-inverse text-text-inverse hover:bg-text-inverse hover:text-text',
  'outline-ruby': 'border-ruby text-ruby hover:bg-ruby hover:text-light',
}

export function ctaClasses(variant: CtaVariant, className?: string): string {
  return cn(CTA_BASE, CTA_VARIANTS[variant], className)
}
