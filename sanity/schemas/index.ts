import type { SchemaTypeDefinition } from 'sanity'

// Obiekty (osadzane, reużywalne)
import { localeString, localeText } from './objects/localeString'
import { seoMeta } from './objects/seoMeta'
import { imageWithAlt } from './objects/imageWithAlt'
import { address } from './objects/address'
import { openingHoursEntry } from './objects/openingHours'
import { hero } from './objects/hero'
import { ctaBlock } from './objects/ctaBlock'

// Dokumenty referencyjne (listy)
import { eventType } from './documents/eventType'
import { menuCategory } from './documents/menuCategory'
import { menuItem } from './documents/menuItem'
import { eventHall } from './documents/eventHall'
import { roomType } from './documents/roomType'

// Dokumenty stron (singletons — patrz sanity/structure.ts)
import { siteSettings } from './documents/siteSettings'
import { homepage } from './documents/homepage'
import { restaurantPage } from './documents/restaurantPage'
import { menuPage } from './documents/menuPage'
import { bistroPage } from './documents/bistroPage'
import { hotelPage } from './documents/hotelPage'
import { eventsPage } from './documents/eventsPage'
import { contactPage } from './documents/contactPage'

// Szkielety (poza zakresem v1)
import { conferenceRoom } from './documents/conferenceRoom'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  localeString,
  localeText,
  seoMeta,
  imageWithAlt,
  address,
  openingHoursEntry,
  hero,
  ctaBlock,
  // List documents
  eventType,
  menuCategory,
  menuItem,
  eventHall,
  roomType,
  // Singleton page documents
  siteSettings,
  homepage,
  restaurantPage,
  menuPage,
  bistroPage,
  hotelPage,
  eventsPage,
  contactPage,
  // Out-of-scope-v1 skeletons
  conferenceRoom,
]

// Stałe ID dla singletonów — używane w structure.ts i GROQ queries.
export const SINGLETON_IDS = {
  siteSettings: 'siteSettings',
  homepage: 'homepage',
  restaurantPage: 'restaurantPage',
  menuPage: 'menuPage',
  bistroPage: 'bistroPage',
  hotelPage: 'hotelPage',
  eventsPage: 'eventsPage',
  contactPage: 'contactPage',
} as const

export type SingletonId = (typeof SINGLETON_IDS)[keyof typeof SINGLETON_IDS]
