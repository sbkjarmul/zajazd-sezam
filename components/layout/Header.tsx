'use client'

import { useTranslations } from 'next-intl'
import { Menu } from 'lucide-react'
import { useScrollDirection } from '@/hooks/useScrollDirection'
import { useUI } from '@/components/providers/UIProvider'
import { Logo } from './Logo'
import { cn } from '@/lib/utils'

export function Header() {
  const direction = useScrollDirection()
  const t = useTranslations('common')
  const { openReservation, openBurger } = useUI()

  const isTop = direction === 'top'
  const isHidden = direction === 'down'

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out',
        isHidden && '-translate-y-full',
        !isTop && 'bg-bg/85 backdrop-blur-md',
      )}
      data-state={direction}
    >
      <div className="mx-auto flex w-full max-w-[1512px] items-center justify-between gap-6 px-6 py-5 md:px-10 md:py-6">
        <Logo variant={isTop ? 'on-dark' : 'on-light'} />

        <div className="flex items-center gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => openReservation('room')}
            className={cn(
              'inline-flex h-12 cursor-pointer items-center justify-center rounded-full border-2 px-5 text-base font-normal whitespace-nowrap transition-colors md:h-[60px] md:px-6 md:text-lg',
              isTop
                ? 'border-primary bg-primary text-primary-foreground hover:bg-primary-hover'
                : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground',
            )}
          >
            {t('reserve')}
          </button>
          <button
            type="button"
            onClick={openBurger}
            aria-label={t('openMenu')}
            className={cn(
              'inline-flex aspect-square h-12 cursor-pointer items-center justify-center rounded-full border-2 transition-colors md:h-[60px]',
              isTop
                ? 'border-text-inverse text-text-inverse hover:bg-text-inverse hover:text-text'
                : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground',
            )}
          >
            <Menu className="size-5 md:size-6" aria-hidden />
          </button>
        </div>
      </div>
    </header>
  )
}
