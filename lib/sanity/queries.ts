import { defineQuery } from 'next-sanity'

// =============================================================================
// Reużywalne fragmenty projekcji
// =============================================================================

const SEO_FRAGMENT = /* groq */ `
  metaTitle,
  metaDescription,
  ogImage { ..., asset->{ _id, url } },
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
  headlineMobile,
  subheadline,
  subheadlineMobile,
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
    defaultHeaderLogo { ${IMAGE_WITH_ALT_FRAGMENT} },
    favicon { asset->{ url } },
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
    headerLogo { ${IMAGE_WITH_ALT_FRAGMENT} },
    hero { ${HERO_FRAGMENT} },
    aboutSection {
      intro,
      introMobile,
      stats[]{ value, label }
    },
    servicesIntro { eyebrow, title },
    eventsBlock {
      eyebrow, title, description, ctaLabel,
      mainImage { ${IMAGE_WITH_ALT_FRAGMENT} },
      secondaryImage { ${IMAGE_WITH_ALT_FRAGMENT} }
    },
    restaurantBlock {
      eyebrow, title, description, ctaLabel,
      image { ${IMAGE_WITH_ALT_FRAGMENT} }
    },
    hotelBlock {
      eyebrow, title, description, ctaLabel,
      images[]{ ${IMAGE_WITH_ALT_FRAGMENT} }
    },
    bistroBlock {
      eyebrow, title, description, ctaLabel,
      image { ${IMAGE_WITH_ALT_FRAGMENT} }
    },
    reviewsBlock {
      eyebrow, title, ratingValue, ratingSource, ratingCount
    },
    contactBlock {
      eyebrow, title,
      image { ${IMAGE_WITH_ALT_FRAGMENT} }
    },
    seo { ${SEO_FRAGMENT} }
  }
`)

export const RESTAURANT_PAGE_QUERY = defineQuery(`
  *[_type == "restaurantPage" && _id == "restaurantPage"][0]{
    headerLogo { ${IMAGE_WITH_ALT_FRAGMENT} },
    heroHeadline,
    heroImage { ${IMAGE_WITH_ALT_FRAGMENT} },
    pitchSection { text, ctaLabel },
    craftSection {
      title, description, ctaLabel,
      primaryImage { ${IMAGE_WITH_ALT_FRAGMENT} },
      secondaryImage { ${IMAGE_WITH_ALT_FRAGMENT} }
    },
    ambianceSection {
      title, tagline, ctaLabel,
      image { ${IMAGE_WITH_ALT_FRAGMENT} }
    },
    reservationSection { title, description },
    seo { ${SEO_FRAGMENT} }
  }
`)

// Logo headera dla /restauracja/menu pochodzi z restaurantPage.headerLogo
// (kontent menu nie ma własnego override).
export const MENU_PAGE_QUERY = defineQuery(`
  *[_type == "menuPage" && _id == "menuPage"][0]{
    "restaurantHeaderLogo": *[_type == "restaurantPage" && _id == "restaurantPage"][0].headerLogo { ${IMAGE_WITH_ALT_FRAGMENT} },
    pageIntro { eyebrow, title, subtitle, ctaLabel },
    photoStrip[]{ ${IMAGE_WITH_ALT_FRAGMENT} },
    reservationSection { title, description },
    dietaryInfo,
    seo { ${SEO_FRAGMENT} }
  }
`)

export const BISTRO_PAGE_QUERY = defineQuery(`
  *[_type == "bistroPage" && _id == "bistroPage"][0]{
    headerLogo { ${IMAGE_WITH_ALT_FRAGMENT} },
    heroHeadline,
    menuIntroHeading,
    menuIntroBody,
    centralBanner,
    hoursText,
    seo { ${SEO_FRAGMENT} }
  }
`)

// Kategorie bistro — własne, niezależne od restauracji.
export const BISTRO_MENU_QUERY = defineQuery(`
  *[_type == "menuCategory" && cuisine == "bistro"]
    | order(order asc) {
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

export const HOTEL_PAGE_QUERY = defineQuery(`
  *[_type == "hotelPage" && _id == "hotelPage"][0]{
    headerLogo { ${IMAGE_WITH_ALT_FRAGMENT} },
    hero {
      eyebrow, title, subtitle, primaryCtaLabel, secondaryCtaLabel,
      image { ${IMAGE_WITH_ALT_FRAGMENT} }
    },
    quote,
    amenitiesSection {
      eyebrow, title,
      items[]{ title, description, icon }
    },
    reviewsSection { eyebrow, title, ratingValue, ratingSource, ratingCount },
    discoverSection {
      eyebrow, title,
      cards[]{
        eyebrow, title, description, ctaLabel, ctaHref,
        image { ${IMAGE_WITH_ALT_FRAGMENT} }
      }
    },
    reservationSection {
      eyebrow, title, description, ctaLabel,
      image { ${IMAGE_WITH_ALT_FRAGMENT} }
    },
    seo { ${SEO_FRAGMENT} }
  }
`)

export const EVENTS_PAGE_QUERY = defineQuery(`
  *[_type == "eventsPage" && _id == "eventsPage"][0]{
    headerLogo { ${IMAGE_WITH_ALT_FRAGMENT} },
    hero {
      eyebrow, title, subtitle, primaryCtaLabel, secondaryCtaLabel,
      image { ${IMAGE_WITH_ALT_FRAGMENT} }
    },
    promiseSection { leadText, highlightedText, tailText, ctaLabel },
    eventTypesSection { eyebrow, title, description },
    eventTypes[]->{
      _id,
      name,
      "slug": slug.current,
      description,
      order,
      image { ${IMAGE_WITH_ALT_FRAGMENT} }
    } | order(order asc),
    hallsSection { eyebrow, title, description },
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
    hotelUpsellSection { eyebrow, title, description, ctaLabel },
    cateringSection {
      eyebrow, title, description,
      image { ${IMAGE_WITH_ALT_FRAGMENT} }
    },
    reviewsSection { eyebrow, title, ratingValue, ratingSource, ratingCount },
    stepsSection {
      eyebrow, title,
      steps[]{ text }
    },
    reservationSection {
      eyebrow, title, description,
      formInvitationTitle, formInvitationText, ctaLabel
    },
    seo { ${SEO_FRAGMENT} }
  }
`)

export const CONTACT_PAGE_QUERY = defineQuery(`
  *[_type == "contactPage" && _id == "contactPage"][0]{
    headerLogo { ${IMAGE_WITH_ALT_FRAGMENT} },
    heroImage { ${IMAGE_WITH_ALT_FRAGMENT} },
    contactSection {
      eyebrow, title,
      addressLabel, phoneLabel, emailLabel
    },
    seo { ${SEO_FRAGMENT} }
  }
`)

// =============================================================================
// Listy — używane przez konkretne sekcje (np. menu, sale)
// =============================================================================

// Menu restauracji — wyklucza kategorie bistro.
export const MENU_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "menuCategory" && cuisine == "restaurant"] | order(order asc) {
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
