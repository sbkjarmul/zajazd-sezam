'use client'

import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'

/**
 * Sam Lenis, wydzielony do osobnego modulu, zeby dalo sie go ladowac leniwie.
 *
 * Powod: `SmoothScroll` wylacza smooth-scroll na stronach z natywnym CSS
 * scroll-snapem (home, hotel, imprezy), ale statyczny import i tak wciagal
 * biblioteke do bundla TYCH stron - ~68 kB kodu, ktory nigdy sie nie wykonywal.
 *
 * Komponent NIE przyjmuje dzieci. W trybie `root` Lenis przejmuje scroll okna
 * i nie dodaje wrappera DOM, wiec moze stac obok tresci zamiast wokol niej.
 * To jest cala sztuczka: dzieci zostaja poza nim, renderuja sie serwerowo jak
 * dotad, a ten modul moze byc `ssr: false` i nie trafiac do bundla stron,
 * ktore go nie uzywaja.
 */
export default function LenisRoot() {
  return <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }} />
}
