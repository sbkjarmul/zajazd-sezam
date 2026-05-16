import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

type LogoProps = {
  variant?: 'on-dark' | 'on-light'
  className?: string
}

// Logo Zajazdu Sezam — wordmark "SEZAM" + tagline.
// Świadomie bez SVG ikony — wordmark + tagline są wystarczająco rozpoznawalne.
// Asset ikony można dodać w przyszłości do components/layout/LogoIcon.tsx.
export function Logo({ variant = 'on-light', className }: LogoProps) {
  const t = useTranslations('header')
  const isOnDark = variant === 'on-dark'

  return (
    <Link
      href="/"
      aria-label="Zajazd Sezam — strona główna"
      className={cn(
        'inline-flex flex-col items-start leading-none transition-colors',
        isOnDark ? 'text-text-inverse' : 'text-text',
        className,
      )}
    >
      <span className="text-3xl font-black tracking-tight">SEZAM</span>
      <span className="text-[0.5rem] tracking-widest">{t('tagline')}</span>
    </Link>
  )
}
