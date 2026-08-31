import type { Metadata } from "next"
import { Poppins } from "next/font/google"
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
  "&icon_names=pause,play_arrow" +
  "&display=block"

export const metadata: Metadata = {
  title: "IATIZA",
  description: "",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} h-full antialiased`}>
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
