import { ImageResponse } from "next/og"
import { SITE } from "@/lib/site"

/* The preview card shown when the site is shared (WhatsApp, LinkedIn, X…).
   Rendered once at build time. Satori only does flexbox, and every element
   with more than one child needs display: flex. */

export const alt = `${SITE.name} — ${SITE.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  const { background, foreground, primary } = SITE.colors

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background,
        color: foreground,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 32,
        }}
      >
        <span style={{ fontWeight: 700, color: primary, letterSpacing: 4 }}>
          {SITE.name}
        </span>
        <span>{SITE.tagline}</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 76,
          lineHeight: 1.1,
          letterSpacing: -2,
        }}
      >
        <span>Iatize seu negócio e</span>
        <span style={{ fontWeight: 700, color: primary }}>
          abra portas para o seu crescimento
        </span>
      </div>
      <div style={{ display: "flex", fontSize: 28, opacity: 0.6 }}>
        Do diagnóstico à implementação de IA na sua empresa.
      </div>
    </div>,
    size,
  )
}
