#!/usr/bin/env node
/* Writes public/llms.txt and public/llms-full.txt (https://llmstxt.org) from
   the page `next build` just prerendered, so they always say what the site
   actually says. Runs as npm's `postbuild`; run it by hand with
   `npm run llms` after a build.

   Everything comes from the built HTML: name, summary and URL from the meta
   tags (lib/site.ts), services and contacts from the JSON-LD
   (components/app/structured-data.tsx), and the full text from the body.
   There is nothing to keep in sync here; change the site and rebuild.

   No dependencies: a small tag walker turns the body into Markdown. It drops
   what a reader would not see as text (scripts, SVGs, icon ligatures,
   aria-hidden decoration) and keeps headings, paragraphs, list items and
   links. */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")

/** Prerendered pages to read, by route. Add new pages here. */
const PAGES = [{ route: "/", file: ".next/server/app/index.html" }]

const OUT_DIR = join(ROOT, "public")

/* -------------------------------------------------------------------------
 * HTML helpers
 * ---------------------------------------------------------------------- */

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " }

const decode = (text) =>
  text.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (match, code) => {
    if (code[0] === "#")
      return String.fromCodePoint(
        code[1].toLowerCase() === "x"
          ? parseInt(code.slice(2), 16)
          : parseInt(code.slice(1), 10),
      )
    return ENTITIES[code.toLowerCase()] ?? match
  })

const parseAttributes = (source) => {
  const attributes = {}
  const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g
  for (const [, name, double, single, bare] of source.matchAll(pattern))
    attributes[name.toLowerCase()] = decode(double ?? single ?? bare ?? "")
  return attributes
}

const meta = (html, key) => {
  for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = parseAttributes(tag.slice(5, -1))
    if (attributes.name === key || attributes.property === key)
      return attributes.content
  }
}

const canonical = (html) => {
  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    const attributes = parseAttributes(tag.slice(5, -1))
    if (attributes.rel === "canonical") return attributes.href
  }
}

const jsonLd = (html) =>
  [
    ...html.matchAll(
      /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ].flatMap(([, body]) => {
    try {
      const data = JSON.parse(body)
      return data["@graph"] ?? [data]
    } catch {
      return []
    }
  })

/* -------------------------------------------------------------------------
 * Body → Markdown
 * ---------------------------------------------------------------------- */

/** Never text: dropped with everything inside them. */
const SKIP = new Set([
  "head", "script", "style", "noscript", "template", "svg", "canvas",
  "video", "audio", "iframe", "object", "select", "textarea",
])

const VOID = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
  "meta", "source", "track", "wbr",
])

/** Each of these starts a new paragraph. */
const BLOCK = new Set([
  "address", "article", "aside", "blockquote", "body", "dd", "details",
  "dialog", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer",
  "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "label", "legend",
  "li", "main", "nav", "ol", "p", "section", "summary", "table", "td", "th",
  "tr", "ul", "button",
])

/** Inside one of these, a nested block is a line break, not a new paragraph. */
const TEXT_CONTAINER = /^(h[1-6]|p|li|dt|dd|button|label|figcaption|summary)$/

/** Tailwind classes that make an inline element sit on its own line. */
const BLOCKISH = /(^|\s)(?:[\w-]+:)*(block|flex|grid|table|list-item)(?=\s|$)/

const isHidden = (tag, attributes) =>
  SKIP.has(tag) ||
  "hidden" in attributes ||
  attributes["aria-hidden"] === "true" ||
  /* Opt-out for visible text that is UI chrome rather than content. */
  "data-llms-skip" in attributes ||
  /(^|\s)symbol(\s|$)/.test(attributes.class ?? "")

const toMarkdown = (html, base) => {
  const body = html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html
  const blocks = []
  const stack = []
  let hiddenDepth = 0
  let buffer = ""
  /** A tag sits between the buffer's end and the next text. */
  let boundary = false

  /** `kind` defaults to the innermost open text container. */
  const flush = (kind) => {
    const text = buffer.replace(/\s+/g, " ").trim()
    buffer = ""
    if (!text) return
    const container = [...stack].reverse().find((e) => TEXT_CONTAINER.test(e.tag))
    blocks.push({ kind: kind ?? container?.tag ?? "p", text })
  }

  /* Two spans styled onto separate lines ("Camila Duarte" / "Ecosmart
     Varejo") arrive with nothing between them. A capital straight after a
     tag boundary is taken as a new item rather than the rest of a word. */
  const append = (text) => {
    if (
      boundary &&
      /[\p{L}\p{N}).!?]$/u.test(buffer) &&
      /^[\p{Lu}[]/u.test(text)
    )
      buffer += " · "
    buffer += text
    boundary = false
  }

  const insideText = () => stack.some((e) => TEXT_CONTAINER.test(e.tag))

  /** A block edge: a space inside a heading or paragraph, else a new block. */
  const breakBlock = (kind) => {
    if (insideText()) buffer += " "
    else flush(kind)
  }

  const link = (href) => {
    if (!href || href.startsWith("javascript:")) return
    try {
      return new URL(href, base).href
    } catch {}
  }

  const tokens =
    /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>|([^<]+|<)/g

  for (const [, closing, rawTag, rawAttributes, text] of body.matchAll(tokens)) {
    if (text !== undefined) {
      if (!hiddenDepth) append(decode(text))
      continue
    }
    if (!rawTag) continue // comment

    const tag = rawTag.toLowerCase()
    boundary = true

    if (closing) {
      const index = stack.findLastIndex((e) => e.tag === tag)
      if (index === -1) continue
      for (const element of stack.splice(index).reverse()) {
        if (element.hidden) hiddenDepth--
        else if (!hiddenDepth) {
          if (element.href !== undefined) {
            const start = Math.min(element.start, buffer.length)
            const text =
              buffer.slice(start).replace(/\s+/g, " ").trim() || element.label
            buffer = buffer.slice(0, start)
            boundary = true
            if (text) append(element.href ? `[${text}](${element.href})` : text)
          }
          if (element.block)
            breakBlock(TEXT_CONTAINER.test(element.tag) ? element.tag : undefined)
        }
      }
      continue
    }

    const attributes = parseAttributes(rawAttributes)
    const hidden = isHidden(tag, attributes)

    if (tag === "br" && !hiddenDepth) buffer += " "
    if (VOID.has(tag) || rawAttributes.trimEnd().endsWith("/")) continue

    const block = BLOCK.has(tag) || BLOCKISH.test(attributes.class ?? "")
    if (block && !hidden && !hiddenDepth) breakBlock()

    const element = { tag, hidden, block }
    if (tag === "a" && !hidden && !hiddenDepth) {
      element.href = link(attributes.href) ?? null
      element.label = attributes["aria-label"]
      element.start = buffer.length
    }
    if (hidden) hiddenDepth++
    stack.push(element)
  }
  flush()

  /* Marquees, repeated taglines and the like: say each thing once. */
  const seen = new Set()
  const lines = []
  for (const { kind, text } of blocks) {
    /* Lone letters and numbers are decoration (the I·A·T·I·Z·A diagram). */
    if (seen.has(text) || text.length < 2) continue
    seen.add(text)
    const level = /^h([1-6])$/.exec(kind)?.[1]
    if (level) lines.push("", `${"#".repeat(Math.min(Number(level) + 1, 6))} ${text}`, "")
    else if (kind === "li") lines.push(`- ${text}`)
    else lines.push("", text, "")
  }

  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

/* -------------------------------------------------------------------------
 * Output
 * ---------------------------------------------------------------------- */

const pages = PAGES.map(({ route, file }) => {
  const path = join(ROOT, file)
  if (!existsSync(path)) {
    console.error(
      `[llms] ${file} not found. Run \`next build\` first, and check that ${route} is still prerendered (static).`,
    )
    process.exit(1)
  }
  return { route, html: readFileSync(path, "utf8") }
})

const home = pages.find((page) => page.route === "/") ?? pages[0]
const url = (canonical(home.html) ?? meta(home.html, "og:url") ?? "").replace(/\/+$/, "")
const name = meta(home.html, "og:site_name") ?? meta(home.html, "application-name")
const title = home.html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
const description = meta(home.html, "description")

if (!url || /localhost|127\.0\.0\.1/.test(url))
  console.warn(
    `[llms] The site URL is "${url}". Set NEXT_PUBLIC_SITE_URL to the production domain so links point to the live site.`,
  )

const graph = jsonLd(home.html)
const organization = graph.find((node) => node["@type"] === "Organization") ?? {}
const services = organization.hasOfferCatalog?.itemListElement ?? []
const contact = organization.contactPoint ?? {}

const links = [
  [`${name}`, url, "site oficial"],
  ["Contato", `${url}/#contato`, "formulário para agendar uma conversa"],
  contact.url && ["WhatsApp", contact.url, "fale com a equipe"],
  ...(organization.sameAs ?? []).map((profile) => [
    new URL(profile).hostname.replace(/^www\.|\.com$/g, "").replace(/^./, (c) => c.toUpperCase()),
    profile,
  ]),
].filter(Boolean)

const header = [
  `# ${name}`,
  "",
  `> ${decode(description ?? "")}`,
  "",
  [title && decode(title), organization.slogan].filter(Boolean).join(" — "),
]

const summary = [
  ...header,
  "",
  "## Serviços",
  "",
  ...services.map(({ itemOffered: s }) => `- **${s.name}**: ${s.description}`),
  "",
  "## Links",
  "",
  ...links.map(([label, href, note]) => `- [${label}](${href})${note ? `: ${note}` : ""}`),
  "",
  "## Optional",
  "",
  `- [Conteúdo completo](${url}/llms-full.txt): todo o texto do site em Markdown`,
  "",
].join("\n")

const full = [
  ...header,
  "",
  ...pages.map(({ route, html }) =>
    [
      pages.length > 1 ? `## Página: ${url}${route}\n` : "",
      toMarkdown(html, `${url}${route}`),
    ].join(""),
  ),
  "",
].join("\n")

mkdirSync(OUT_DIR, { recursive: true })
writeFileSync(join(OUT_DIR, "llms.txt"), summary)
writeFileSync(join(OUT_DIR, "llms-full.txt"), full)
console.log(
  `[llms] Wrote public/llms.txt (${summary.length} chars) and public/llms-full.txt (${full.length} chars).`,
)
