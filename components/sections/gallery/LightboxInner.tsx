'use client'

import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'

// Props przyjmowane przez komponent Lightbox (partial — wszystkie maja defaulty).
type Props = React.ComponentProps<typeof Lightbox>

// Wewnetrzna otoczka YARL — laduje sie leniwie (next/dynamic w GalleryLightbox),
// wiec ciezar biblioteki (~15kb gz) i jej style dochodza dopiero przy pierwszym
// otwarciu podgladu, nie przy wejsciu na strone galerii.
// Props (open/index/slides/close/on) sa spreadowane pierwsze, nasze ustawienia
// nadpisuja je swiadomie po spreadzie.
export default function LightboxInner(props: Props) {
  return (
    <Lightbox
      {...props}
      plugins={[Zoom]}
      // Pinch + double-tap na mobile (powod wyboru YARL zamiast naszego lightboxa).
      zoom={{ maxZoomPixelRatio: 3, doubleTapDelay: 250, scrollToZoom: true }}
      // Spokojny, "premium" przesuw taśmy — jak w istniejacym ui/Lightbox.
      animation={{ fade: 300, swipe: 500 }}
      carousel={{ finite: false, padding: 0, spacing: 0, preload: 2 }}
      // Gest w dol zamyka (mobile), klik w tlo zamyka (desktop).
      controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
      styles={{ container: { backgroundColor: 'rgba(0, 0, 0, 0.96)' } }}
    />
  )
}
