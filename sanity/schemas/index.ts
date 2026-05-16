import type { SchemaTypeDefinition } from 'sanity'

import { localeString, localeText } from './objects/localeString'
import { seoMeta } from './objects/seoMeta'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects (reużywalne)
  localeString,
  localeText,
  seoMeta,
  // Documents — dodawane w F2 (siteSettings, homepage, restaurant, ...)
]
