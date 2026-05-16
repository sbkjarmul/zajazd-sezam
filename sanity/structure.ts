import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list().title('Treści').items([
    // Items będą dodawane w F2 wraz ze schematami document
    // (siteSettings, homepage, restaurant, bistro, hotel, menuCategory, ...)
  ])
