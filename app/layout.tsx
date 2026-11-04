import type { Metadata, Viewport } from "next"
import { Poppins } from "next/font/google"
import { SITE } from "@/lib/site"
import "./globals.css"

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
})

/* Material Symbols Outlined, straight from Google. It is an icon font, so it
   is not in the next/font/google catalogue and has to come in as a stylesheet.
   `icon_names` keeps the download to the glyphs actually used — without it
   Google serves the whole 5.3 MB variable font — so add a name there when you
   use a new icon. `display=block` because icon names are ligatures: a swap
   period would flash the raw word. See the `.symbol` class in globals.css. */
const MATERIAL_SYMBOLS =
  "https://fonts.googleapis.com/css2" +
  "?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" +
  "&icon_names=arrow_back,bolt,hub,query_stats,school,support_agent,visibility,volume_off,volume_up" +
  "&display=block"

/* The values themselves live in lib/site.ts. The OG image comes from
   app/opengraph-image.tsx and is wired in automatically. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "business",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    locale: SITE.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  /* Stops iOS turning revenue figures in the form into phone links. */
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: SITE.colors.background,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    /* suppressHydrationWarning: the home page's intro script sets data-intro
       on <html> before React hydrates. See components/home/intro.tsx. */
    <html
      lang={SITE.language}
      className={`${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link href={MATERIAL_SYMBOLS} rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
