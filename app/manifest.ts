import type { MetadataRoute } from "next"
import { SITE } from "@/lib/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.title,
    short_name: SITE.name,
    description: SITE.description,
    lang: SITE.language,
    start_url: "/",
    display: "browser",
    background_color: SITE.colors.background,
    theme_color: SITE.colors.background,
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  }
}
