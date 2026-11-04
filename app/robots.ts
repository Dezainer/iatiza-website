import type { MetadataRoute } from "next"
import { SITE } from "@/lib/site"

/* Open to everyone, AI crawlers included: being read by them is the point of
   llms.txt. Add rules here to keep a specific bot out. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
