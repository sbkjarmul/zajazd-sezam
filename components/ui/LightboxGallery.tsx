'use client'

import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { Dialog as DialogPrimitive, VisuallyHidden } from 'radix-ui'
import { SanityImage } from '@/components/SanityImage'
import type { Locale } from '@/i18n/routing'
import { cn } from '@/lib/utils'

type GalleryImage = Parameters<typeof SanityImage>[0]['image']

type Props = {
  images: GalleryImage[]
  locale: Locale
  trigger: React.ReactNode
  title: string
}

export function LightboxGallery({ images, locale, trigger, title }: Props) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const total = images.length

  const goNext = useCallback(() => setIndex((i) => (i + 1) % total), [total])
  const goPrev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total])

  useEffect(() => {
    if (!open) return
    function handle(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [open, goNext, goPrev])

  if (!total) return <>{trigger}</>

  const handleOpenChange = (next: boolean) => {
    if (next) setIndex(0)
    setOpen(next)
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/85" />
        <DialogPrimitive.Content
          className="data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-50 flex flex-col outline-none"
          aria-label={title}
        >
          <VisuallyHidden.Root asChild>
            <DialogPrimitive.Title>{title}</DialogPrimitive.Title>
          </VisuallyHidden.Root>

          <header className="flex items-center justify-between px-6 py-5 text-white md:px-10">
            <p className="text-sm tracking-normal uppercase">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </p>
            <DialogPrimitive.Close
              aria-label={locale === 'pl' ? 'Zamknij galerię' : 'Close gallery'}
              className="flex size-12 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10"
            >
              <X className="size-6" />
            </DialogPrimitive.Close>
          </header>

          <div className="relative flex flex-1 items-center justify-center px-4 pb-8 md:px-16">
            <button
              type="button"
              onClick={goPrev}
              aria-label={locale === 'pl' ? 'Poprzednie zdjęcie' : 'Previous image'}
              className={cn(
                'absolute top-1/2 left-2 z-10 flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:left-6 md:size-16',
                total < 2 && 'hidden',
              )}
            >
              <ArrowLeft className="size-6" />
            </button>

            <div className="relative h-full w-full max-w-[1400px]">
              <SanityImage
                image={images[index]}
                locale={locale}
                fill
                sizes="100vw"
                className="!object-contain"
              />
            </div>

            <button
              type="button"
              onClick={goNext}
              aria-label={locale === 'pl' ? 'Następne zdjęcie' : 'Next image'}
              className={cn(
                'absolute top-1/2 right-2 z-10 flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:right-6 md:size-16',
                total < 2 && 'hidden',
              )}
            >
              <ArrowRight className="size-6" />
            </button>
          </div>

          {total > 1 && (
            <div className="flex justify-center gap-2 pb-8">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`${i + 1}`}
                  className={cn(
                    'h-2 rounded-full transition-all',
                    i === index ? 'w-8 bg-white' : 'w-2 bg-white/30',
                  )}
                />
              ))}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
