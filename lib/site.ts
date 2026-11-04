/* Everything search engines and AI crawlers are told about the site, in one
   place: app/layout.tsx (meta tags), the JSON-LD, robots, sitemap, manifest
   and the OG image all read from here. scripts/generate-llms.mjs then reads
   the built page, so llms.txt follows along without being edited by hand. */

/**
 * The public origin, no trailing slash. Canonical URLs, Open Graph and the
 * sitemap are all built on it, so set NEXT_PUBLIC_SITE_URL to the production
 * domain. On Vercel it falls back to the project's production domain.
 */
const url = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/+$/, "")

export const SITE = {
  name: "IATIZA",
  url,
  /** ~60 characters: what Google shows as the result's title. */
  title: "IATIZA | Consultoria de Inteligência Artificial para Empresas",
  /** ~155 characters: what Google shows under the title. */
  description:
    "Consultoria de IA para empresas: analisamos seu negócio de ponta a ponta, encontramos onde a inteligência artificial gera mais impacto e implementamos.",
  tagline: "Consultoria Inteligente.",
  /** Page language, and the matching Open Graph locale. */
  language: "pt-BR",
  locale: "pt_BR",
  /** Where the business operates, as ISO 3166 codes. */
  areaServed: "BR",
  keywords: [
    "consultoria de IA",
    "consultoria de inteligência artificial",
    "inteligência artificial para empresas",
    "IA para negócios",
    "implementação de IA",
    "diagnóstico de IA",
    "automação com IA",
    "agentes de IA",
    "agentes de atendimento",
    "treinamento em IA",
    "transformação digital",
    "iatização",
  ],
  colors: {
    background: "#ffffff",
    foreground: "#000000",
    primary: "#2937fd",
  },
  social: {
    instagram: "https://www.instagram.com/iatiza.consult/",
    whatsapp: "https://wa.me/554699170048",
  },
  /** E.164, for structured data. */
  phone: "+554699170048",
} as const
