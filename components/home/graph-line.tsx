"use client"

import { CSSProperties, FC, useEffect, useRef, useState } from "react"

/* -------------------------------------------------------------------------
 * GraphLine
 *
 * The blue line that climbs out of the left edge of the screen, peaks behind
 * the lock, dips behind the key and leaves again to the upper right. It is a
 * filled polygon rather than a stroke, because the band is not one thickness:
 * it starts at nothing on the left edge and swells to its full width by the
 * time it reaches the key, which no stroke-width can do.
 *
 * Coordinates are written in the wordmark's own units — 1200 across the
 * container, y running down from the top of this layer — so a point can be
 * read straight off the hero's viewBox and one unit is one pixel at the
 * design width. The two end points are authored at the container's edges and
 * the component extends them the rest of the way to the edges of the screen,
 * which is the only part that has to know how wide the window actually is.
 * ---------------------------------------------------------------------- */

/** The wordmark's viewBox width, and the container it is drawn across. */
const GRID = 1200

interface Point {
  x: number
  y: number
}

interface GraphLineProps {
  className?: string
  style?: CSSProperties
  /** Centre line, in grid units. First and last sit on the container's edges. */
  points?: Point[]
  /** Full thickness of the band once the taper is done, in grid units. */
  width?: number
  /**
   * Index the taper finishes on — the vertex behind the key. Before it the
   * band ramps up from nothing by distance travelled; after it, it holds.
   */
  taperTo?: number
  color?: string
}

/**
 * Eyeballed off the Figma frame: left edge, behind the lock, behind the key,
 * right edge. Nudge these rather than anything below.
 */
const DEFAULT_POINTS: Point[] = [
  { x: -25, y: 666 },
  { x: 220, y: 444 },
  { x: 625, y: 965 },
  { x: GRID, y: 496 },
]

/** Unit normal pointing to the left of a → b. */
const normalOf = (a: Point, b: Point): Point => {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const length = Math.hypot(dx, dy) || 1
  return { x: -dy / length, y: dx / length }
}

/** Slides `to` along the line from `from` until it lands on the vertical x. */
const extendTo = (from: Point, to: Point, x: number): Point => {
  const dx = to.x - from.x
  if (Math.abs(dx) < 1e-6) return to
  return { x, y: from.y + ((to.y - from.y) * (x - from.x)) / dx }
}

/**
 * Walks the centre line twice — once up the left side, once back down the
 * right — offsetting each vertex by its own half width. Interior vertices are
 * offset along the angle bisector and stretched by the miter length, so the
 * two edges meet cleanly at the peak and the trough instead of notching.
 */
const outline = (points: Point[], half: number[]) => {
  const last = points.length - 1
  const normals = points.slice(0, -1).map((p, i) => normalOf(p, points[i + 1]))

  const offsets = points.map((_, i) => {
    if (i === 0) return normals[0]
    if (i === last) return normals[last - 1]

    const before = normals[i - 1]
    const after = normals[i]
    const length = Math.hypot(before.x + after.x, before.y + after.y) || 1
    const bisector = {
      x: (before.x + after.x) / length,
      y: (before.y + after.y) / length,
    }
    // 1/cos(half the turn). Capped so a hairpin can't fire off a spike.
    const miter = Math.min(
      4,
      1 / (bisector.x * before.x + bisector.y * before.y),
    )
    return { x: bisector.x * miter, y: bisector.y * miter }
  })

  const side = (sign: number) =>
    points.map((p, i) => ({
      x: p.x + sign * offsets[i].x * half[i],
      y: p.y + sign * offsets[i].y * half[i],
    }))

  const edge = [...side(1), ...side(-1).reverse()]

  return `${edge.map((p, i) => `${i ? "L" : "M"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ")} Z`
}

const GraphLine: FC<GraphLineProps> = ({
  className = "",
  style,
  points = DEFAULT_POINTS,
  width = 64,
  taperTo = points.length - 2,
  color = "var(--primary)",
}) => {
  const layer = useRef<HTMLDivElement>(null)
  // Nothing is drawn until the layer has been measured: where the band leaves
  // the screen depends on how much wider than the container the window is.
  const [screen, setScreen] = useState(0)

  useEffect(() => {
    const element = layer.current
    if (!element) return

    const observer = new ResizeObserver(([entry]) =>
      setScreen(entry.contentRect.width),
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const unit = Math.min(screen, GRID) / GRID
  const margin = (screen - Math.min(screen, GRID)) / 2

  let path = ""
  let height = 0

  if (screen > 0) {
    const drawn = points.map((p) => ({ x: margin + p.x * unit, y: p.y * unit }))
    const last = drawn.length - 1
    // The left end stops on the edge exactly — at zero width there is no cap
    // to see. The right end is carried a band's width past it instead, so its
    // cap is cut off by the edge of the drawing rather than shown on screen.
    drawn[0] = extendTo(drawn[1], drawn[0], 0)
    drawn[last] = extendTo(drawn[last - 1], drawn[last], screen + width * unit)

    // Distance travelled at each vertex, which is what the taper ramps on.
    const travelled = drawn.map((p, i) =>
      i === 0 ? 0 : Math.hypot(p.x - drawn[i - 1].x, p.y - drawn[i - 1].y),
    )
    travelled.forEach((d, i) => {
      if (i) travelled[i] = travelled[i - 1] + d
    })

    const full = (width * unit) / 2
    const half = drawn.map((_, i) =>
      i >= taperTo ? full : (travelled[i] / travelled[taperTo]) * full,
    )

    path = outline(drawn, half)
    height = Math.max(...drawn.map((p, i) => p.y + half[i]))
  }

  return (
    <div ref={layer} className={className} style={style} aria-hidden>
      {path && (
        <svg
          width={screen}
          height={height}
          viewBox={`0 0 ${screen} ${height}`}
          className="block"
        >
          <path d={path} fill={color} />
        </svg>
      )}
    </div>
  )
}

export default GraphLine
