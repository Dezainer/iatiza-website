"use client"

import { CSSProperties, FC, PropsWithChildren, useId } from "react"

/* -------------------------------------------------------------------------
 * Glass
 *
 * The Figma glass shader is a real refraction pass: it re-samples whatever is
 * behind the layer through a rounded-rect lens. The browser has no such
 * primitive, but it has the two halves of one — an SVG `feDisplacementMap`
 * that bends an image by a second image, and `backdrop-filter`, which feeds
 * the page behind an element into a filter chain. Wiring one into the other
 * gets us genuine refraction, dispersion included, not a blur pretending.
 *
 * Two stacked layers do the work, both behind the content:
 *
 *   ::before  bends the backdrop at the rim (SVG displacement)
 *   ::after   frosts and tints what ::before produced, then paints the light
 *
 * They are siblings rather than nested on purpose. `backdrop-filter` on an
 * element hides the page from its *descendants* (the element becomes a
 * backdrop root), so a nested pair would render the inner layer blind. As
 * siblings, ::after simply sees ::before's output painted below it, which is
 * exactly the chain we want: refract, then frost.
 *
 * Refraction via `backdrop-filter: url(#…)` is Chromium-only today. Where it
 * is ignored (Safari, Firefox) ::before stays transparent and ::after still
 * frosts the real page, so the component degrades to a clean frosted plate
 * instead of breaking.
 *
 * The props mirror the shader's sliders 1:1, so values can be read straight
 * off the Figma panel. "Splay" has no browser analogue and is not modelled.
 * ---------------------------------------------------------------------- */

export interface GlassProps {
  className?: string
  style?: CSSProperties
  /** Corner radius, px. */
  radius?: number
  /** 0–100. How hard the rim bends the backdrop. */
  refraction?: number
  /** 0–100. How far that bend reaches in from the rim. */
  depth?: number
  /** 0–100. Chromatic split — red and blue bend by different amounts. */
  dispersion?: number
  /** 0–100. Blur and saturation of the frost. */
  frost?: number
  /** Degrees. 0 = lit from the right, negative swings upward; -45 = top right. */
  lightAngle?: number
  /** 0–100. Strength of the specular rim and the inner shading. */
  lightIntensity?: number
  /** Colour laid over the frosted backdrop. Keep it near-transparent. */
  tint?: string
}

const unit = (n: number) => Math.min(100, Math.max(0, n)) / 100

/**
 * One axis of the displacement map, as a data URI.
 *
 * `feDisplacementMap` reads a pixel's red channel as a horizontal offset and
 * its green channel as a vertical one, with 128 meaning "don't move". So the
 * map is a flat neutral field with a ramp along each rim: 255 on the leading
 * edge, 0 on the trailing one, which makes both rims sample from further
 * inside themselves — the compression you see around the edge of real glass.
 *
 * Each rim returns to neutral in its outermost sliver so that no pixel ever
 * samples from outside the filter region, where there is nothing to sample.
 */
const displacementMap = (axis: "x" | "y", depth: number) => {
  // The outer `ramp` of each side bends; everything between the two is flat.
  const ramp = Math.min(0.45, 0.06 + unit(depth) * 0.22)
  const edge = ramp / 4

  const [flat, lead, trail] =
    axis === "x"
      ? ["rgb(128,0,0)", "rgb(255,0,0)", "rgb(0,0,0)"]
      : ["rgb(0,128,0)", "rgb(0,255,0)", "rgb(0,0,0)"]

  const stops = [
    [0, flat],
    [edge, lead],
    [ramp, flat],
    [1 - ramp, flat],
    [1 - edge, trail],
    [1, flat],
  ] as const

  const vector =
    axis === "x" ? 'x1="0" y1="0" x2="1" y2="0"' : 'x1="0" y1="0" x2="0" y2="1"'

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" preserveAspectRatio="none">` +
    `<linearGradient id="g" ${vector}>` +
    stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("") +
    `</linearGradient>` +
    `<rect width="100" height="100" fill="url(#g)"/>` +
    `</svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const Glass: FC<PropsWithChildren<GlassProps>> = ({
  children,
  className = "",
  style,
  radius = 12,
  refraction = 42,
  depth = 55,
  dispersion = 38,
  frost = 36,
  lightAngle = -45,
  lightIntensity = 80,
  tint = "#2937FD08",
}) => {
  const id = `glass-${useId().replace(/[^a-zA-Z0-9]/g, "")}`

  // How far the rim drags the backdrop, in px, and how far red and blue drift
  // apart on either side of it.
  const bend = unit(refraction) * 40
  const split = unit(dispersion) * bend * 0.4

  // Direction the light comes *from*, in screen coordinates (y grows down).
  const radians = (lightAngle * Math.PI) / 180
  const lx = Math.cos(radians)
  const ly = Math.sin(radians)
  // An inset shadow offset to the right lands on the *left* edge, so the lit
  // edge wants the negated vector.
  const rim = 1 + unit(depth) * 2
  const hx = (-lx * rim).toFixed(2)
  const hy = (-ly * rim).toFixed(2)
  const gx = (-lx * rim * 4).toFixed(2)
  const gy = (-ly * rim * 4).toFixed(2)

  const light = unit(lightIntensity)
  const spread = 8 + unit(depth) * 28

  const vars = {
    "--glass-radius": `${radius}px`,
    "--glass-blur": `${(unit(frost) * 40).toFixed(2)}px`,
    "--glass-saturate": (1 + unit(frost) * 1.2).toFixed(2),
    "--glass-refraction": `url(#${id})`,
    "--glass-tint":
      tint ??
      // Brightest on the side the light comes from.
      `linear-gradient(${((Math.atan2(-lx, ly) * 180) / Math.PI).toFixed(1)}deg, rgb(255 255 255 / ${(
        0.4 * light
      ).toFixed(3)}), rgb(255 255 255 / ${(0.1 * light).toFixed(3)}))`,
    "--glass-inner": [
      // The lit edge, then the weaker bounce caught on the far one.
      `inset ${hx}px ${hy}px 0.5px rgb(255 255 255 / ${(0.95 * light).toFixed(3)})`,
      `inset ${-Number(hx)}px ${-Number(hy)}px 0.5px rgb(255 255 255 / ${(0.45 * light).toFixed(3)})`,
      // Body of the pane: a wash of light falling in, shading on the far side.
      `inset ${gx}px ${gy}px ${spread.toFixed(0)}px rgb(255 255 255 / ${(0.35 * light).toFixed(3)})`,
      `inset ${-Number(gx)}px ${-Number(gy)}px ${spread.toFixed(0)}px rgb(15 23 120 / ${(
        0.1 * light
      ).toFixed(3)})`,
    ].join(", "),
    "--glass-outer": [
      // A hairline so the pane still reads against a white page.
      `0 0 0 1px rgb(41 55 253 / 0.08)`,
      `0 ${(2 + unit(depth) * 6).toFixed(0)}px ${(6 + unit(depth) * 26).toFixed(0)}px rgb(15 23 120 / 0.1)`,
      `0 1px 2px rgb(15 23 120 / 0.06)`,
    ].join(", "),
    ...style,
  } as CSSProperties

  return (
    <div className={`glass ${className}`} style={vars}>
      {children}
      <svg aria-hidden className="glass-defs">
        <filter
          id={id}
          filterUnits="objectBoundingBox"
          colorInterpolationFilters="sRGB"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
        >
          {/* The two axes arrive as separate images — one carrying red, one
              carrying green — and are summed into a single map. */}
          <feImage
            href={displacementMap("x", depth)}
            preserveAspectRatio="none"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            result="mapX"
          />
          <feImage
            href={displacementMap("y", depth)}
            preserveAspectRatio="none"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            result="mapY"
          />
          <feComposite
            in="mapX"
            in2="mapY"
            operator="arithmetic"
            k2="1"
            k3="1"
            result="map"
          />

          {/* Dispersion: the same bend run three times at slightly different
              strengths, then recombined one channel each. Red lags, blue
              leads, and the rim picks up the colour fringe glass has. */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale={bend + split}
            xChannelSelector="R"
            yChannelSelector="G"
            result="bentR"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale={bend}
            xChannelSelector="R"
            yChannelSelector="G"
            result="bentG"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale={bend - split}
            xChannelSelector="R"
            yChannelSelector="G"
            result="bentB"
          />
          <feColorMatrix
            in="bentR"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="onlyR"
          />
          <feColorMatrix
            in="bentG"
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="onlyG"
          />
          <feColorMatrix
            in="bentB"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="onlyB"
          />
          <feComposite
            in="onlyR"
            in2="onlyG"
            operator="arithmetic"
            k2="1"
            k3="1"
            result="rg"
          />
          <feComposite
            in="rg"
            in2="onlyB"
            operator="arithmetic"
            k2="1"
            k3="1"
          />
        </filter>
      </svg>
    </div>
  )
}

export default Glass
