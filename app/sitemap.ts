import type { MetadataRoute } from "next"
import { SITE } from "@/lib/site"

/* Built once at build time, so lastModified is the deploy date. Add an entry
   here for every new page. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ]
}
