import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
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
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  document: {
    // Wyłącz "Create new" i "Duplicate" w globalnym menu dla singletonów —
    // klient pracuje wyłącznie z istniejącymi dokumentami o stałym ID.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global'
        ? prev.filter((t) => !SINGLETON_TYPES.has(t.templateId ?? ''))
        : prev,
    actions: (prev, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? prev.filter(({ action }) => action && !['duplicate', 'delete'].includes(action))
        : prev,
  },
})
