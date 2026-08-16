import type { MetadataRoute } from 'next'
import { IS_INDEXABLE_DEPLOYMENT, SITE_URL } from '@/lib/env'

export default function robots(): MetadataRoute.Robots {
  if (!IS_INDEXABLE_DEPLOYMENT) {
    // Dev / preview — zablokuj indeksowanie wszystkiego.
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/studio/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
