"use client"

import { FC, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useAnimate } from "motion/react"

import Button from "@/components/app/button"
import Glass from "@/components/app/glass"
import {
  CRITERIA,
  CRITERION,
  SERVICES,
  type Criterion,
  type Service,
} from "@/lib/services"

/* -------------------------------------------------------------------------
 * Pick two
 *
 * The old "fast, cheap, good — choose two" triangle. Three switches, and at
 * most two of them can be on: switching on a third kicks out whichever of the
 * two has been on the longest, so the order they were turned on in is the
 * state, not just which ones are lit. Every service meets exactly two of the
 * criteria, so a full pair always lands on exactly two of the six cards.
 * ---------------------------------------------------------------------- */

/** How many switches may be on at once. */
const LIMIT = 2

interface SwitchProps {
  criterion: Criterion
  on: boolean
  /** Bumped each time this switch is kicked out by a third one. */
  bump: number
  onToggle: (criterion: Criterion) => void
}

const Switch: FC<SwitchProps> = ({ criterion, on, bump, onToggle }) => {
  const [scope, animate] = useAnimate<HTMLButtonElement>()

  // A shudder as it is shoved off, so it is obvious which one gave way.
  useEffect(() => {
    if (bump)
      animate(scope.current, { x: [0, -8, 7, -5, 3, 0] }, { duration: 0.45 })
  }, [bump, animate, scope])

  return (
    <button
      ref={scope}
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onToggle(criterion)}
      className="flex items-center gap-1.5 md:gap-4 py-2 md:py-3 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary rounded-lg"
    >
      <span
        className={`text-sm md:text-2xl font-bold whitespace-nowrap transition-colors duration-300 ${on ? "text-primary" : "text-foreground/30"}`}
      >
        {CRITERION[criterion]}
      </span>
      <span
        className={`w-9 h-5 p-0.5 md:w-14 md:h-8 md:p-1 rounded-full flex shrink-0 transition-colors duration-300 ${on ? "bg-primary" : "bg-foreground/10"}`}
      >
        {/* The track's inner width is two knobs at both sizes, so one knob's
            width is exactly the throw. */}
        <motion.span
          animate={{ x: on ? "100%" : "0%" }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="size-4 md:size-6 rounded-full bg-background shadow-sm"
        />
      </span>
    </button>
  )
}

interface CardProps {
  service: Service
  active: Criterion[]
  onPick: (service: Service) => void
}

const Card: FC<CardProps> = ({ service, active, onPick }) => {
  // Nothing picked means nothing matched, not everything.
  const lit =
    active.length > 0 &&
    active.every((criterion) => service.criteria.includes(criterion))

  return (
    /* Only scale out here. Opacity below 1 would make this a backdrop root,
       and the glass would then frost nothing but its own contents instead of
       the line behind it, flashing solid while the fade runs. The dimming lives inside the plate.

       A div with a button role rather than a <button>, which may only hold
       phrasing content and would rule out the heading and paragraph. */
    <div
      role="button"
      tabIndex={0}
      aria-pressed={lit}
      onClick={() => onPick(service)}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return
        event.preventDefault()
        onPick(service)
      }}
      className={`relative cursor-pointer rounded-xl transition-transform duration-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${lit ? "scale-100" : "scale-95 hover:scale-97"}`}
    >
      <Glass
        className={`p-4 h-full flex flex-col gap-3 *:transition-opacity *:duration-500 ${lit ? "*:opacity-100" : "*:opacity-40"}`}
      >
        <span
          className={`symbol text-2xl size-11 rounded-lg flex items-center justify-center transition-colors duration-500 ${lit ? "bg-primary text-background" : "bg-primary/10 text-primary"}`}
        >
          {service.icon}
        </span>
        <h4 className="text-xl font-bold text-primary">{service.title}</h4>
        <p className="text-sm flex-1">{service.description}</p>
        <div className="flex gap-2">
          {service.criteria.map((criterion) => (
            <span
              key={criterion}
              className={`text-xs font-bold uppercase px-2 py-1 rounded-full transition-colors duration-300 ${active.includes(criterion) ? "bg-primary/10 text-primary" : "text-foreground/40"}`}
            >
              {CRITERION[criterion]}
            </span>
          ))}
        </div>
      </Glass>
    </div>
  )
}

/* -------------------------------------------------------------------------
 * The thread
 *
 * A blurred blue line behind the grid that runs through every lit card. Each
 * change draws a fresh one, coming in from a random side, so the pick reads as
 * the cards being strung together rather than lighting up on their own. It
 * sits under the glass, which frosts it into a glow, the same trick as the
 * shape behind the cases.
 *
 * Card centres come from offsetLeft/Top, which ignore transforms, so the dimmed
 * cards' scale-down does not drag the line around.
 * ---------------------------------------------------------------------- */

type Point = { x: number; y: number }

interface Layout {
  width: number
  height: number
  centers: Point[]
}

/** The random part of one drawing, rolled when the pick changes. */
interface Stroke {
  id: number
  /** Radians the line comes in from, measured from the grid's centre. */
  angle: number
  /** -1 or 1: which way the first wave bows. */
  bow: number
}

/** How far the line reaches past the grid on each end, px. */
const OVERSHOOT = 20

/** How far each wave bows away from the straight run, px. */
const WAVE = 70

/** Max tilt off horizontal for the entry, so it never runs down over text. */
const TILT = Math.PI / 7

const rollStroke = (id: number): Stroke => ({
  id,
  angle: (Math.random() < 0.5 ? 0 : Math.PI) + (Math.random() * 2 - 1) * TILT,
  bow: Math.random() < 0.5 ? -1 : 1,
})

/** Catmull-Rom through every point, as cubic Béziers. */
const smooth = (points: Point[]) => {
  let d = `M${points[0].x},${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }
    d += ` C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`
  }
  return d
}

const threadPath = (layout: Layout, lit: Point[], stroke: Stroke) => {
  const { width, height } = layout
  const reach = Math.max(width, height) / 2 + OVERSHOOT
  const center = { x: width / 2, y: height / 2 }
  const from = {
    x: center.x + Math.cos(stroke.angle) * reach,
    y: center.y + Math.sin(stroke.angle) * reach,
  }
  // Out the far side, mirrored through the centre with a slight vertical
  // kick so it does not read as a ruler line.
  const to = {
    x: center.x - Math.cos(stroke.angle) * reach,
    y: center.y - Math.sin(stroke.angle) * reach * 0.5,
  }

  const stops = [
    from,
    ...[...lit].sort(
      (a, b) =>
        Math.hypot(a.x - from.x, a.y - from.y) -
        Math.hypot(b.x - from.x, b.y - from.y),
    ),
    to,
  ]

  // A bowed midpoint between each pair of stops, alternating sides.
  const points: Point[] = [stops[0]]
  for (let i = 1; i < stops.length; i++) {
    const a = stops[i - 1]
    const b = stops[i]
    const length = Math.hypot(b.x - a.x, b.y - a.y) || 1
    const side = stroke.bow * (i % 2 ? 1 : -1)
    points.push(
      {
        x: (a.x + b.x) / 2 + (-(b.y - a.y) / length) * WAVE * side,
        y: (a.y + b.y) / 2 + ((b.x - a.x) / length) * WAVE * side,
      },
      b,
    )
  }
  return smooth(points)
}

const Thread: FC<{ d: string | null; id: number }> = ({ d, id }) => (
  <svg
    aria-hidden
    className="pointer-events-none absolute inset-0 size-full overflow-visible blur-2xl"
  >
    <AnimatePresence>
      {d && (
        <motion.path
          key={id}
          d={d}
          fill="none"
          stroke="#2937FD"
          strokeWidth={64}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.8 }}
          viewport={{ once: true }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          transition={{
            pathLength: { duration: 1.2, ease: [0.65, 0, 0.35, 1] },
            opacity: { duration: 0.3 },
          }}
        />
      )}
    </AnimatePresence>
  </svg>
)

const Services: FC = () => {
  /* Oldest first, so the head of the list is the one that gets kicked out. */
  const [active, setActive] = useState<Criterion[]>(["rapido", "sob-medida"])
  const [bumps, setBumps] = useState<Record<Criterion, number>>({
    rapido: 0,
    enxuto: 0,
    "sob-medida": 0,
  })

  const grid = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState<Layout | null>(null)
  const [stroke, setStroke] = useState<Stroke>({ id: 0, angle: 0, bow: 1 })

  useEffect(() => {
    const el = grid.current
    if (!el) return
    const measure = () =>
      setLayout({
        width: el.offsetWidth,
        height: el.offsetHeight,
        centers: [...el.children].map((child) => {
          const card = child as HTMLElement
          return {
            x: card.offsetLeft + card.offsetWidth / 2,
            y: card.offsetTop + card.offsetHeight / 2,
          }
        }),
      })
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const lit = SERVICES.flatMap((service, index) =>
    active.length > 0 &&
    active.every((criterion) => service.criteria.includes(criterion))
      ? [layout?.centers[index]]
      : [],
  ).filter((point) => point !== undefined)

  const d = layout && lit.length ? threadPath(layout, lit, stroke) : null

  const toggle = (criterion: Criterion) => {
    setStroke((s) => rollStroke(s.id + 1))
    if (active.includes(criterion)) {
      setActive(active.filter((c) => c !== criterion))
      return
    }
    const next = [...active, criterion]
    if (next.length > LIMIT) {
      const evicted = next.shift()!
      setBumps((b) => ({ ...b, [evicted]: b[evicted] + 1 }))
    }
    setActive(next)
  }

  /* Sets the switches to exactly this card's pair. Whatever was on and is not
     part of it shudders off, same as a switch being kicked out. */
  const pick = (service: Service) => {
    const next = service.criteria
    if (active.length === next.length && next.every((c) => active.includes(c)))
      return
    setStroke((s) => rollStroke(s.id + 1))
    setBumps((b) => {
      const bumped = { ...b }
      for (const c of active) if (!next.includes(c)) bumped[c]++
      return bumped
    })
    setActive([...next])
  }

  return (
    /* Clipped sideways at the screen edges, so the thread behind the cards
       cannot widen the page. See the same wrapper in cases.tsx. */
    <div className="overflow-x-clip">
      <div className="container mt-24 md:mt-32 pb-24 md:pb-32 flex flex-col items-center gap-12 md:gap-16">
        <div className="flex flex-col items-center text-center gap-4">
          <h2 className="text-4xl md:text-6xl font-bold">
            Como podemos
            <br />
            <span className="text-primary">iatizar</span> sua empresa
          </h2>
          <p className="md:w-2/3 text-balance">
            Do diagnóstico à operação, estas são as soluções que a Iatiza coloca
            pra rodar dentro da sua empresa,{" "}
            <b>cada uma feita pra destravar uma parte do negócio</b>.
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-8">
          {/* On phones: a pill held at the foot of the screen while the cards
              scroll past, all in CSS and bound to this block — it starts above
              the first card and is let go at the last one.

              Pinned from the top rather than with bottom: when a phone's
              toolbars come back (scrolling up, typically) the visible area
              gets shorter than the one bottom is measured against, and a pill
              stuck to the bottom ends up behind them. 100svh is the height
              with the toolbars showing, so this stays clear either way. The
              3.75rem is the pill's height (about 45px) plus a 1rem margin. */}
          <div className="flex gap-12 justify-center max-md:sticky max-md:top-[calc(100svh-3.75rem)] max-md:z-20 max-md:gap-3 max-md:rounded-full max-md:bg-background max-md:px-4 max-md:py-1 max-md:shadow-[0_8px_32px_rgb(0_0_0/0.12)]">
            {CRITERIA.map((criterion) => (
              <Switch
                key={criterion}
                criterion={criterion}
                on={active.includes(criterion)}
                bump={bumps[criterion]}
                onToggle={toggle}
              />
            ))}
          </div>
          <div className="w-full relative">
            <Thread d={d} id={stroke.id} />
            <div ref={grid} className="relative grid md:grid-cols-3 gap-4">
              {SERVICES.map((service) => (
                <Card
                  key={service.title}
                  service={service}
                  active={active}
                  onPick={pick}
                />
              ))}
            </div>
          </div>
          {/* Where the pill comes to rest on phones. Sticky only travels as far
              as the end of its parent's content box — padding does not count —
              so the room under the last card has to be an element. With the
              gap above it, the pill settles about 2.5rem clear of the card. */}
          <div aria-hidden className="md:hidden h-14" />
        </div>
        <div className="flex flex-col items-center text-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-2xl md:text-3xl font-bold">
              Não sabe por onde <span className="text-primary">começar?</span>
            </h3>
            <p className="text-sm md:w-3/5 text-balance">
              Em uma conversa rápida a gente entende o momento da sua empresa e{" "}
              <b>indica a solução que faz mais sentido agora</b>.
            </p>
          </div>
          <Button href="#contato">Quero iatizar minha empresa</Button>
        </div>
      </div>
    </div>
  )
}

export default Services
