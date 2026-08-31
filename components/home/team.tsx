"use client"

import Image, { ImageProps } from "next/image"
import { FC, useRef } from "react"
import {
  cubicBezier,
  easeOut,
  motion,
  MotionValue,
  useScroll,
  useTransform,
} from "motion/react"

import mockTeamate from "@/public/mock-teamate.png"

type Teammate = {
  name: string
  title: string
  picture: ImageProps["src"]
}

const TEAM: Teammate[] = [
  {
    name: "Dionisio Raony",
    title: "Pica do crossfire",
    picture: mockTeamate,
  },
  {
    name: "Dionisio Raony",
    title: "Pica do crossfire",
    picture: mockTeamate,
  },
  {
    name: "Dionisio Raony",
    title: "Pica do crossfire",
    picture: mockTeamate,
  },
  {
    name: "Dionisio Raony",
    title: "Pica do crossfire",
    picture: mockTeamate,
  },
  {
    name: "Dionisio Raony",
    title: "Pica do crossfire",
    picture: mockTeamate,
  },
  {
    name: "Dionisio Raony",
    title: "Pica do crossfire",
    picture: mockTeamate,
  },
]

/* -------------------------------------------------------------------------
 * The reveal
 *
 * One scroll progress, measured across the whole section, drives every moving
 * part. The section reads as a stack of parallax layers, nearest first:
 *
 *   curtain   the two page-coloured panels, travelling a full half-screen
 *   depth 3   the tall outer figures
 *   depth 2   the middle figures
 *   depth 1   the short inner figures, furthest from the camera
 *
 * They all slide the same way at the same time — outwards, away from the
 * centre — and the only thing that separates them is how far they go. The
 * nearer the layer, the further it travels, which is the whole of the
 * parallax: the curtains tear away, the figures drift out behind them at
 * their own speeds, and the depth reads without anything being scaled.
 * ---------------------------------------------------------------------- */

/** Fraction of the section's scroll the curtains take to leave. */
const OPEN_END = 0.5

/**
 * Where the figures come to rest. Deliberately later than OPEN_END so the
 * outward drift is still visibly happening once the curtains have gone —
 * set it to OPEN_END for strict lock-step with the panels instead.
 */
const SETTLE_END = 0.7

/** Slow in, fast through the middle, slow out — a curtain, not a wipe. */
const OPEN_EASE = cubicBezier(0.76, 0, 0.24, 1)

/** 1 is furthest from the camera, 3 is nearest. */
type Depth = 1 | 2 | 3

/**
 * How far, in pixels, each layer is still pulled towards the centre while the
 * curtains are closed. It runs out to 0 as the section scrolls, so every
 * figure lands exactly where the static layout puts it.
 */
const DEPTH_TRAVEL: Record<Depth, number> = { 1: 70, 2: 120, 3: 180 }

/** Written out in full so Tailwind can see the class names. */
const DEPTH_CLASS: Record<Depth, string> = { 1: "z-1", 2: "z-2", 3: "z-3" }

/**
 * Where the name above each figure starts to fade up, by depth. The panels
 * split from the centre outwards, so the inner figures are uncovered first
 * and the outer ones last — the order here follows the sweep, and each label
 * lights up roughly as the edge of the curtain passes it.
 */
const LABEL_START: Record<Depth, number> = { 1: 0.22, 2: 0.28, 3: 0.34 }

/** How much of the section's scroll one label takes to fade up. */
const LABEL_LENGTH = 0.18

/**
 * The centre copy runs earliest of anything in the scene: the panels part
 * from the middle, so the centre of the screen is the first thing uncovered
 * and the headline can come up through the widening slit.
 */
const HEADLINE_FADE = [0.15, 0.45]

/** Enough to read as coming forward, not as a zoom. */
const HEADLINE_SCALE = 0.4

type TeammateProps = Teammate & {
  height: number
  depth: Depth
  progress: MotionValue<number>
  invert?: boolean
  className?: string
}

const Teammate: FC<TeammateProps> = ({
  name,
  picture,
  title,
  className,
  height,
  depth,
  progress,
  invert,
}) => {
  /* `invert` is only ever set on the right-hand half of the scene, so it
     doubles as the direction this figure travels in. */
  const travel = DEPTH_TRAVEL[depth] * (invert ? 1 : -1)
  const x = useTransform(progress, [0, SETTLE_END], [-travel, 0], {
    ease: OPEN_EASE,
  })

  const start = LABEL_START[depth]
  const opacity = useTransform(
    progress,
    [start, start + LABEL_LENGTH],
    [0, 1],
    {
      ease: easeOut,
    },
  )

  return (
    <motion.div
      style={{ x }}
      className={`flex flex-col gap-16 items-center ${DEPTH_CLASS[depth]} ${className}`}
    >
      <motion.div style={{ opacity }} className="flex flex-col">
        <span className="text-sm font-bold text-background">{name}</span>
        <span className="text-xs text-background">{title}</span>
      </motion.div>
      <Image
        src={picture}
        alt={name}
        className={`w-auto ${invert ? "-scale-x-100" : ""}`}
        style={{ height }}
      />
    </motion.div>
  )
}

/* -------------------------------------------------------------------------
 * Curtains
 *
 * Two page-coloured panels, each half the screen wide and a full screen tall,
 * that slide off to the left and right as the section is scrolled — the white
 * page splitting open onto the dark team scene behind it.
 *
 * The panels live in a layer stretched over the whole section (`inset-0`) and
 * are `sticky` inside it, which is what makes them read as full screen: they
 * ride up with the section until the section's top reaches the top of the
 * viewport, at which point they cover it edge to edge and pin there while the
 * opening plays out. `overflow-hidden` sits on the sticky element itself, not
 * on an ancestor, so the panels can be clipped once they leave without
 * breaking the stickiness.
 * ---------------------------------------------------------------------- */

const Headline: FC<{ progress: MotionValue<number> }> = ({ progress }) => {
  const options = { ease: easeOut }
  const opacity = useTransform(progress, HEADLINE_FADE, [0, 1], options)
  const scale = useTransform(
    progress,
    HEADLINE_FADE,
    [HEADLINE_SCALE, 1],
    options,
  )

  /* `-translate-x-1/2` is Tailwind's `translate` property, which the browser
     applies before `transform`, so Motion's `scale` composes with the
     centring rather than replacing it. */
  return (
    <motion.div
      style={{ opacity, scale }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2  flex flex-col items-center text-center"
    >
      <h2 className="text-3xl font-bold text-primary">
        Equipe completa
        <br />
        <span className="text-background">pra abrir caminho</span>
      </h2>
      <p className="text-background text-sm w-2/5">
        Um <b>time multidisciplinar pra te acompanhar em cada passo</b> da
        jornada, da implementação até o resultado final.
      </p>
    </motion.div>
  )
}

const Curtains: FC<{ progress: MotionValue<number> }> = ({ progress }) => {
  const options = { ease: OPEN_EASE }
  const left = useTransform(progress, [0, OPEN_END], ["0%", "-100%"], options)
  const right = useTransform(progress, [0, OPEN_END], ["0%", "100%"], options)

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
      <div className="sticky top-0 flex h-screen overflow-hidden">
        <motion.div
          style={{ x: left }}
          className="h-full flex-1 bg-background"
        />
        {/* Overlapped by a pixel so no seam of the scene shows through
            between the two panels while they are still closed. */}
        <motion.div
          style={{ x: right }}
          className="-ml-px h-full flex-1 bg-background"
        />
      </div>
    </div>
  )
}

const Team: FC = () => {
  const section = useRef<HTMLDivElement>(null)

  /* One observer for the whole section, shared by the curtains and every
     figure, so the layers can never drift out of sync with each other. */
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "end start"],
  })

  return (
    <div ref={section} className="pt-16 bg-foreground relative">
      <div className="sticky top-0">
        <div className="absolute inset-0 flex">
          <div className="flex-1 h-full bg-radial-[100%_50%_at_left_center] from-primary to-transparent" />
          <div className="flex-1 h-full bg-radial-[100%_50%_at_right_center] from-primary to-transparent" />
        </div>
        <div className="container flex pt-32 relative">
          <div className="flex-1 flex items-end">
            <Teammate
              depth={3}
              progress={scrollYProgress}
              height={666}
              className="-ml-50"
              name={TEAM[0].name}
              title={TEAM[0].title}
              picture={TEAM[0].picture}
            />
            <Teammate
              depth={2}
              progress={scrollYProgress}
              height={620}
              className="-ml-120"
              name={TEAM[1].name}
              title={TEAM[1].title}
              picture={TEAM[1].picture}
            />
            <Teammate
              depth={1}
              progress={scrollYProgress}
              height={570}
              className="-ml-110"
              name={TEAM[2].name}
              title={TEAM[2].title}
              picture={TEAM[2].picture}
            />
          </div>
          <div className="flex-1 flex items-end justify-end relative">
            <Teammate
              invert
              depth={1}
              progress={scrollYProgress}
              height={570}
              className="-mr-110"
              name={TEAM[2].name}
              title={TEAM[2].title}
              picture={TEAM[2].picture}
            />
            <Teammate
              invert
              depth={2}
              progress={scrollYProgress}
              height={620}
              className="-mr-120"
              name={TEAM[1].name}
              title={TEAM[1].title}
              picture={TEAM[1].picture}
            />
            <Teammate
              invert
              depth={3}
              progress={scrollYProgress}
              height={666}
              className="-mr-50"
              name={TEAM[0].name}
              title={TEAM[0].title}
              picture={TEAM[0].picture}
            />
          </div>
          <Headline progress={scrollYProgress} />
        </div>
        <div className="absolute inset-0 flex z-4">
          <div className="flex-1 h-full bg-radial-[100%_50%_at_left_bottom] from-foreground to-transparent" />
          <div className="flex-1 h-full bg-radial-[100%_50%_at_right_bottom] from-foreground to-transparent" />
        </div>
      </div>
      <Curtains progress={scrollYProgress} />
      <div className="h-dvh" />
    </div>
  )
}

export default Team
