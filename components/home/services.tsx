"use client"

import { FC, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useAnimate } from "motion/react"

import Button from "@/components/app/button"
import Glass from "@/components/app/glass"

/* -------------------------------------------------------------------------
 * Pick two
 *
 * The old "fast, cheap, good — choose two" triangle. Three switches, and at
 * most two of them can be on: switching on a third kicks out whichever of the
 * two has been on the longest, so the order they were turned on in is the
 * state, not just which ones are lit. Every service meets exactly two of the
 * criteria, so a full pair always lands on exactly two of the six cards.
 * ---------------------------------------------------------------------- */

const CRITERIA = ["rapido", "enxuto", "sob-medida"] as const

type Criterion = (typeof CRITERIA)[number]

const CRITERION: Record<Criterion, string> = {
  rapido: "Rápido",
  enxuto: "Enxuto",
  "sob-medida": "Sob medida",
}

/** How many switches may be on at once. */
const LIMIT = 2

interface Service {
  title: string
  description: string
  /** Material Symbols name — also listed in app/layout.tsx. */
  icon: string
  criteria: [Criterion, Criterion]
}

/* Placeholder copy until the real product list comes in. Keep two services
   per pair so every combination lights up the same number of cards. */
const SERVICES: Service[] = [
  {
    title: "Diagnóstico de IA",
    description:
      "Um raio-x da operação que aponta onde a IA dá retorno primeiro.",
    icon: "query_stats",
    criteria: ["rapido", "enxuto"],
  },
  {
    title: "Oráculo",
    description:
      "Respostas certeiras sobre o seu negócio, treinadas no seu contexto.",
    icon: "visibility",
    criteria: ["rapido", "sob-medida"],
  },
  {
    title: "Agentes de atendimento",
    description: "Atendimento que resolve de verdade, a qualquer hora do dia.",
    icon: "support_agent",
    criteria: ["enxuto", "sob-medida"],
  },
  {
    title: "Automações",
    description: "Tarefas repetitivas saem da mesa do time e vão pra máquina.",
    icon: "bolt",
    criteria: ["rapido", "sob-medida"],
  },
  {
    title: "Treinamento de equipes",
    description: "Seu time usando IA no dia a dia, com método e sem medo.",
    icon: "school",
    criteria: ["rapido", "enxuto"],
  },
  {
    title: "Integrações",
    description: "A IA conversando com os sistemas que a empresa já usa.",
    icon: "hub",
    criteria: ["enxuto", "sob-medida"],
  },
]

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
      className="flex items-center gap-4 py-3 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary rounded-lg"
    >
      <span
        className={`text-2xl font-bold transition-colors duration-300 ${on ? "text-primary" : "text-foreground/30"}`}
      >
        {CRITERION[criterion]}
      </span>
      <span
        className={`w-14 h-8 p-1 rounded-full flex shrink-0 transition-colors duration-300 ${on ? "bg-primary" : "bg-foreground/10"}`}
      >
        <motion.span
          animate={{ x: on ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="size-6 rounded-full bg-background shadow-sm"
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
    <div className="container mt-32 pb-32 flex flex-col items-center gap-16">
      <div className="flex flex-col items-center text-center gap-4">
        <h2 className="text-6xl font-bold">
          Como podemos
          <br />
          <span className="text-primary">iatizar</span> sua empresa
        </h2>
        <p className="w-2/3 text-balance">
          Do diagnóstico à operação, estas são as soluções que a Iatiza coloca
          pra rodar dentro da sua empresa,{" "}
          <b>cada uma feita pra destravar uma parte do negócio</b>.
        </p>
      </div>
      <div className="w-full flex flex-col items-center gap-8">
        <div className="flex gap-12 justify-center">
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
          <div ref={grid} className="relative grid grid-cols-3 gap-4">
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
      </div>
      <div className="flex flex-col items-center text-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-3xl font-bold">
            Não sabe por onde <span className="text-primary">começar?</span>
          </h3>
          <p className="text-sm w-3/5 text-balance">
            Em uma conversa rápida a gente entende o momento da sua empresa e{" "}
            <b>indica a solução que faz mais sentido agora</b>.
          </p>
        </div>
        <Button href="#contato">Quero iatizar minha empresa</Button>
      </div>
    </div>
  )
}

export default Services
