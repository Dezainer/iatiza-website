import { FC } from "react"
import { SERVICES } from "@/lib/services"
import { SITE } from "@/lib/site"

/* JSON-LD: tells Google, and the AI engines that read it, who the company is,
   what it sells and how to reach it, as data rather than prose. Check it at
   https://search.google.com/test/rich-results after deploying. */

const ORGANIZATION = `${SITE.url}/#organization`
const WEBSITE = `${SITE.url}/#website`

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION,
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      slogan: SITE.tagline,
      image: `${SITE.url}/opengraph-image`,
      areaServed: SITE.areaServed,
      knowsAbout: SITE.keywords,
      sameAs: [SITE.social.instagram],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: SITE.phone,
        url: SITE.social.whatsapp,
        areaServed: SITE.areaServed,
        availableLanguage: "Portuguese",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Serviços de IA",
        itemListElement: SERVICES.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.title,
            description: service.description,
            provider: { "@id": ORGANIZATION },
            areaServed: SITE.areaServed,
          },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE,
      url: SITE.url,
      name: SITE.name,
      description: SITE.description,
      inLanguage: SITE.language,
      publisher: { "@id": ORGANIZATION },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE.url}/#webpage`,
      url: SITE.url,
      name: SITE.title,
      description: SITE.description,
      inLanguage: SITE.language,
      isPartOf: { "@id": WEBSITE },
      about: { "@id": ORGANIZATION },
    },
  ],
}

/* `<` escaped so nothing in the data can close the script tag early. */
const StructuredData: FC = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
    }}
  />
)

export default StructuredData
