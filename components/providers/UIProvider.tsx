'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

type ReservationTab = 'room' | 'event'

type UIContextValue = {
  reservationOpen: boolean
  reservationTab: ReservationTab
  burgerOpen: boolean
  openReservation: (tab?: ReservationTab) => void
  closeReservation: () => void
  setReservationTab: (tab: ReservationTab) => void
  openBurger: () => void
  closeBurger: () => void
}

const UIContext = createContext<UIContextValue | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [reservationOpen, setReservationOpen] = useState(false)
  const [reservationTab, setReservationTab] = useState<ReservationTab>('room')
  const [burgerOpen, setBurgerOpen] = useState(false)

  const openReservation = useCallback((tab?: ReservationTab) => {
    if (tab) setReservationTab(tab)
    setReservationOpen(true)
  }, [])

  const closeReservation = useCallback(() => setReservationOpen(false), [])
  const openBurger = useCallback(() => setBurgerOpen(true), [])
  const closeBurger = useCallback(() => setBurgerOpen(false), [])

  const value = useMemo<UIContextValue>(
    () => ({
      reservationOpen,
      reservationTab,
      burgerOpen,
      openReservation,
      closeReservation,
      setReservationTab,
      openBurger,
      closeBurger,
    }),
    [
      reservationOpen,
      reservationTab,
      burgerOpen,
      openReservation,
      closeReservation,
      openBurger,
      closeBurger,
    ],
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within <UIProvider>')
  return ctx
}
