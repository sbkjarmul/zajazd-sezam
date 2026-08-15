// Prosta strona tekstowa (Regulamin / Polityka prywatnosci). Tresc to zwykly
// tekst (localeText) — `whitespace-pre-line` zachowuje akapity i puste linie.
// Opis/tresc 16px wg DESIGN-RULES. pt duzy — przeswit pod fixed headerem.
type Props = {
  title: string
  intro?: string
  body?: string
}

export function LegalArticle({ title, intro, body }: Props) {
  return (
    <section className="bg-bg text-text min-h-[70svh] pt-[120px] pb-20 md:pt-[160px]">
      <div className="layout-container flex max-w-3xl flex-col gap-8">
        <h1 className="text-3xl leading-none font-normal tracking-tight uppercase md:text-4xl md:tracking-[-0.03em] lg:text-[48px]">
          {title}
        </h1>
        {intro && <p className="text-base whitespace-pre-line">{intro}</p>}
        {body && <div className="text-base leading-[1.4] whitespace-pre-line">{body}</div>}
      </div>
    </section>
  )
}
