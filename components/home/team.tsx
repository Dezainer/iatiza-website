"use client"

import Image, { ImageProps } from "next/image"
import { FC, useRef } from "react"
import {
  cubicBezier,
  motion,
  useReducedMotion,
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

type TeammateProps = Teammate & {
  height: number
  invert?: boolean
  className?: string
}

const Teammate: FC<TeammateProps> = ({
  name,
  picture,
  title,
  className,
  height,
  invert,
}) => (
  <div className={`flex flex-col gap-16 items-center ${className}`}>
    <div className="flex flex-col">
      <span className="text-sm font-bold text-background">{name}</span>
      <span className="text-xs text-background">{title}</span>
    </div>
    <Image
      src={picture}
      alt={name}
      className={`w-auto ${invert ? "-scale-x-100" : ""}`}
      style={{ height }}
    />
  </div>
)

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
 *
 * The progress that drives them runs from "section top at viewport top" to
 * "section bottom at viewport top"; the opening is mapped onto the first
 * OPEN_END of that, so it finishes well before the section scrolls away.
 * ---------------------------------------------------------------------- */

/** Fraction of the section's scroll the opening takes. */
const OPEN_END = 0.5

/** Slow in, fast through the middle, slow out — a curtain, not a wipe. */
const OPEN_EASE = cubicBezier(0.76, 0, 0.24, 1)

const Curtains: FC = () => {
  const section = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "end start"],
  })

  const options = { ease: OPEN_EASE }
  const left = useTransform(
    scrollYProgress,
    [0, OPEN_END],
    ["0%", "-100%"],
    options,
  )
  const right = useTransform(
    scrollYProgress,
    [0, OPEN_END],
    ["0%", "100%"],
    options,
  )

  return (
    <div
      ref={section}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10"
    >
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

const Team: FC = () => (
  <div className="pt-16 bg-foreground relative">
    <div className="sticky top-0">
      <div className="absolute inset-0 flex">
        <div className="flex-1 h-full bg-radial-[100%_50%_at_left_center] from-primary to-transparent" />
        <div className="flex-1 h-full bg-radial-[100%_50%_at_right_center] from-primary to-transparent" />
      </div>
      <div className="container flex pt-32 relative">
        <div className="flex-1 flex items-end">
          <Teammate
            height={666}
            className="-ml-50 z-3"
            name={TEAM[0].name}
            title={TEAM[0].title}
            picture={TEAM[0].picture}
          />
          <Teammate
            height={620}
            className="-ml-120 z-2"
            name={TEAM[1].name}
            title={TEAM[1].title}
            picture={TEAM[1].picture}
          />
          <Teammate
            height={570}
            className="-ml-110 z-1"
            name={TEAM[2].name}
            title={TEAM[2].title}
            picture={TEAM[2].picture}
          />
        </div>
        <div className="flex-1 flex items-end justify-end relative">
          <Teammate
            invert
            height={570}
            className="-mr-110"
            name={TEAM[2].name}
            title={TEAM[2].title}
            picture={TEAM[2].picture}
          />
          <Teammate
            invert
            height={620}
            className="-mr-120"
            name={TEAM[1].name}
            title={TEAM[1].title}
            picture={TEAM[1].picture}
          />
          <Teammate
            invert
            height={666}
            className="-mr-50"
            name={TEAM[0].name}
            title={TEAM[0].title}
            picture={TEAM[0].picture}
          />
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2  flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold text-primary">
            Equipe completa
            <br />
            <span className="text-background">pra abrir caminho</span>
          </h2>
          <p className="text-background text-sm w-2/5">
            Um <b>time multidisciplinar pra te acompanhar em cada passo</b> da
            jornada, da implementação até o resultado final.
          </p>
        </div>
      </div>
      <div className="absolute inset-0 flex z-4">
        <div className="flex-1 h-full bg-radial-[100%_50%_at_left_bottom] from-foreground to-transparent" />
        <div className="flex-1 h-full bg-radial-[100%_50%_at_right_bottom] from-foreground to-transparent" />
      </div>
    </div>
    <Curtains />
    <div className="h-dvh" />
  </div>
)

export default Team
