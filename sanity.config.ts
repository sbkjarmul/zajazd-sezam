import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { plPLLocale } from '@sanity/locale-pl-pl'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schemaTypes, SINGLETON_IDS } from './sanity/schemas'
import { structure } from './sanity/structure'

const SINGLETON_TYPES = new Set(Object.keys(SINGLETON_IDS))

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Szablon uzywany przez listy "Restauracja"/"Bistro" w structure.ts —
    // nowa kategoria ma z gory ustawiona branze, wiec obsluga nie musi
    // pamietac o radiu `cuisine`.
    templates: (prev) => [
      ...prev,
      {
        id: 'menuCategory-by-cuisine',
        title: 'Kategoria menu (z branżą)',
        schemaType: 'menuCategory',
        parameters: [{ name: 'cuisine', type: 'string' }],
        value: ({ cuisine }: { cuisine: string }) => ({ cuisine }),
      },
    ],
  },
  // plPLLocale dokłada polski do menu uzytkownika w Studio (Menu > Appearance >
  // Language). Wybor zapisuje sie per uzytkownik, wiec kazda osoba z obslugi
  // przestawia go raz u siebie.
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
    plPLLocale(),
  ],
  document: {
    // Wyłącz "Create new" i "Duplicate" w globalnym menu dla singletonów —
    // klient pracuje wyłącznie z istniejącymi dokumentami o stałym ID.
    //
    // `menuCategory` blokujemy tam z innego powodu: kategoria zalozona
    // globalnie nie przechodzi przez szablon `menuCategory-by-cuisine`, wiec
    // nie ma ustawionej branzy i nie pokaze sie na zadnej stronie. Jedyna
    // droga to listy "Restauracja" i "Bistro" w panelu bocznym.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global'
        ? prev.filter(
            (t) => !SINGLETON_TYPES.has(t.templateId ?? '') && t.templateId !== 'menuCategory',
          )
        : prev,
    actions: (prev, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? prev.filter(({ action }) => action && !['duplicate', 'delete'].includes(action))
        : prev,
  },
})
