// Typografia PL — „sierotki": jednoliterowe wyrazy (a, i, o, u, w, z) nie powinny
// zostawać na końcu wiersza. Zamieniamy spację PO takim wyrazie na twardą spację
// (nbsp, U+00A0), więc łączy się on z następnym słowem i przechodzi do kolejnej linii.
const NBSP = String.fromCharCode(0xa0)

export function preventOrphans(text: string): string {
  return text.replace(/(^|\s)([aiouwzAIOUWZ])\s+/g, (_m, pre: string, letter: string) => pre + letter + NBSP)
}
