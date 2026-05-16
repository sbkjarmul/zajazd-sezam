import { defineQuery } from 'next-sanity'

// =============================================================================
// Reużywalne fragmenty projekcji
// =============================================================================

const SEO_FRAGMENT = /* groq */ `
  metaTitle,
  metaDescription,
  ogImage,
  noIndex
`

const IMAGE_WITH_ALT_FRAGMENT = /* groq */ `
  ...,
  asset->{
    _id,
    url,
    metadata { dimensions, lqip, palette }
  },
  alt
`

const HERO_FRAGMENT = /* groq */ `
  headline,
  subheadline,
  primaryCtaLabel,
  image { ${IMAGE_WITH_ALT_FRAGMENT} }
`

// =============================================================================
// siteSettings (singleton) — używane przez każdą stronę (JSON-LD, footer, header)
// =============================================================================

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    companyName,
    legalName,
    shortDescription,
    address,
    phone,
    receptionEmail,
    publicEmail,
    openingHoursRestaurant,
    openingHoursReception,
    googleBusinessProfileUrl,
    googleMapsUrl,
    defaultSeo {
      ${SEO_FRAGMENT}
    }
  }
`)

// =============================================================================
// Strony — singletony
// =============================================================================

export const HOMEPAGE_QUERY = defineQuery(`
  *[_type == "homepage" && _id == "homepage"][0]{
    hero { ${HERO_FRAGMENT} },
    problemSection {
      title,
      cards[]{ title, description }
    },
    solutionSection {
      title,
      description,
      pillars[]{ title, description }
    },
    eventHallsSection {
      title,
      description,
      ctaLabel,
      halls[]->{
        _id,
        name,
        capacity,
        "slug": slug.current,
        images[]{ ${IMAGE_WITH_ALT_FRAGMENT} }
      }
    },
    restaurantSection {
      title,
      description,
      menuLinkLabel,
      dishImages[]{ ${IMAGE_WITH_ALT_FRAGMENT} }
    },
    stepsSection {
      title,
      steps[]{ title, description }
    },
    reviewsSection {
      title,
      description
    },
    hotelUpsellSection {
      title,
      description,
      ctaLabel,
      image { ${IMAGE_WITH_ALT_FRAGMENT} }
    },
    finalCta {
      title,
      description,
      ctaLabel
    },
    seo { ${SEO_FRAGMENT} }
  }
`)

export const RESTAURANT_PAGE_QUERY = defineQuery(`
  *[_type == "restaurantPage" && _id == "restaurantPage"][0]{
    hero { ${HERO_FRAGMENT} },
    intro,
    highlights,
    gallery[]{ ${IMAGE_WITH_ALT_FRAGMENT} },
    menuCtaLabel,
    finalCta { title, description, ctaLabel },
    seo { ${SEO_FRAGMENT} }
  }
`)

export const MENU_PAGE_QUERY = defineQuery(`
  *[_type == "menuPage" && _id == "menuPage"][0]{
    hero { ${HERO_FRAGMENT} },
    dietaryInfo,
    allergenInfo,
    seo { ${SEO_FRAGMENT} }
  }
`)

export const BISTRO_PAGE_QUERY = defineQuery(`
  *[_type == "bistroPage" && _id == "bistroPage"][0]{
    hero { ${HERO_FRAGMENT} },
    intro,
    highlights,
    openingHours,
    gallery[]{ ${IMAGE_WITH_ALT_FRAGMENT} },
    finalCta { title, description, ctaLabel },
    seo { ${SEO_FRAGMENT} }
  }
`)

export const HOTEL_PAGE_QUERY = defineQuery(`
  *[_type == "hotelPage" && _id == "hotelPage"][0]{
    hero { ${HERO_FRAGMENT} },
    intro,
    amenities[]{ title, description },
    rooms[]->{
      _id,
      name,
      identifier,
      description,
      capacity,
      amenities,
      order,
      images[]{ ${IMAGE_WITH_ALT_FRAGMENT} }
    },
    finalCta { title, description, ctaLabel },
    seo { ${SEO_FRAGMENT} }
  }
`)

export const EVENTS_PAGE_QUERY = defineQuery(`
  *[_type == "eventsPage" && _id == "eventsPage"][0]{
    hero { ${HERO_FRAGMENT} },
    intro,
    eventTypes[]->{
      _id,
      name,
      "slug": slug.current,
      description,
      order
    } | order(order asc),
    halls[]->{
      _id,
      name,
      "slug": slug.current,
      capacity,
      description,
      amenities,
      order,
      images[]{ ${IMAGE_WITH_ALT_FRAGMENT} }
    } | order(order asc),
    finalCta { title, description, ctaLabel },
    seo { ${SEO_FRAGMENT} }
  }
`)

export const CONTACT_PAGE_QUERY = defineQuery(`
  *[_type == "contactPage" && _id == "contactPage"][0]{
    hero { ${HERO_FRAGMENT} },
    intro,
    directions,
    seo { ${SEO_FRAGMENT} }
  }
`)

// =============================================================================
// Listy — używane przez konkretne sekcje (np. menu, sale)
// =============================================================================

export const MENU_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "menuCategory"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    order,
    "items": *[_type == "menuItem" && references(^._id) && available == true] | order(order asc) {
      _id,
      name,
      description,
      price,
      diet,
      image { ${IMAGE_WITH_ALT_FRAGMENT} }
    }
  }
`)

export const ALL_EVENT_HALLS_QUERY = defineQuery(`
  *[_type == "eventHall"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    capacity,
    description,
    amenities,
    order,
    images[]{ ${IMAGE_WITH_ALT_FRAGMENT} }
  }
`)

export const ALL_ROOM_TYPES_QUERY = defineQuery(`
  *[_type == "roomType"] | order(order asc) {
    _id,
    name,
    identifier,
    capacity,
    description,
    amenities,
    order,
    images[]{ ${IMAGE_WITH_ALT_FRAGMENT} }
  }
`)
