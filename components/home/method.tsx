"use client"

import Glass from "@/components/app/glass"
import Image from "next/image"
import { FC, PointerEvent, ReactNode, useRef } from "react"
import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react"

import { MOBILE, useMediaQuery } from "@/lib/use-media-query"
import key from "@/public/key.png"

interface Step {
  title: string
  description: ReactNode
  element: string
}

/* The letters spell the method's name: I·A·T·I·Z·A. */
const STEPS: Step[] = [
  {
    title: "Investigar a tensão",
    description: (
      <>
        Identificamos a tensão, separamos o real do ideal e entendemos o
        incômodo a resolver. Só avançamos se o problema for{" "}
        <b>relevante, recorrente e representativo</b>.
      </>
    ),
    element: "I",
  },
  {
    title: "Analisar a realidade",
    description: (
      <>
        Mergulhamos na realidade com dados, evidências e observações. Problemas
        complexos têm muitas causas, então{" "}
        <b>focamos nos fatores que mais pesam</b>.
      </>
    ),
    element: "A",
  },
  {
    title: "Trabalhar hipóteses",
    description: (
      <>
        Transformamos a análise em hipóteses testáveis:{" "}
        <b>“se fizermos X, esperamos Y”</b>. Ainda não sabemos se são verdade, e
        é isso que vamos descobrir.
      </>
    ),
    element: "T",
  },
  {
    title: "Implantar experimento",
    description: (
      <>
        Rodamos o experimento na prática, em pequenos ciclos evolutivos.{" "}
        <b>Não precisa resolver tudo de primeira</b>, precisa validar as
        hipóteses.
      </>
    ),
    element: "I",
  },
  {
    title: "Zonas de resultado",
    description: (
      <>
        Observamos o que funcionou, o que não funcionou e{" "}
        <b>quais aprendizados apareceram</b>. Cada volta é um microciclo de
        melhoria contínua.
      </>
    ),
    element: "Z",
  },
  {
    title: "Aprender e escalar",
    description: (
      <>
        Fazemos a retrospectiva e celebramos os aprendizados. O que funcionou{" "}
        <b>vira política, processo e padrão</b>, pronto para ser replicado.
      </>
    ),
    element: "A",
  },
]

/** Cards keep the width they had when five filled the container. */
const VISIBLE = 5

/** The track's gap-4, in px — the letters' positions are worked out from it. */
const GAP = 16

interface LetterProps {
  index: number
  children: string
  /** Pointer x, relative to the container's left edge. */
  pointer: MotionValue<number>
  /** The track's current slide. */
  x: MotionValue<number>
  /** The container's width. */
  width: MotionValue<number>
  /** Phones have no pointer to follow, so the colours are fixed instead. */
  still: boolean
}

/** On phones, this many letters from the start stay blue; the rest are black. */
const STILL_LIT = 2

/** Within this many cards of the pointer a letter is fully blue… */
const HOLD = 0.5
/** …and from this many cards away it is back to the foreground. */
const REACH = 2.5

/* Tints from the foreground to the primary as the pointer gets horizontally
   closer to it. Full blue within HOLD cards of the pointer, fading out by
   REACH, so the neighbours stay lit too and the glow trails the pointer. */
const Letter: FC<LetterProps> = ({
  index,
  children,
  pointer,
  x,
  width,
  still,
}) => {
  const color = useTransform(() => {
    const card = (width.get() - GAP * (VISIBLE - 1)) / VISIBLE
    const center = index * (card + GAP) + card / 2 + x.get()
    const distance = Math.abs(pointer.get() - center) / (card + GAP)
    const near = Math.min(
      1,
      Math.max(0, 1 - (distance - HOLD) / (REACH - HOLD)),
    )
    const mix = near * near * (3 - 2 * near) // smoothstep

    return `color-mix(in srgb, var(--primary) ${mix * 100}%, var(--foreground))`
  })

  return (
    <motion.span
      className="relative -z-10 text-[220px] md:text-[256px] font-bold -mt-32 md:-mt-40"
      style={{
        color: still
          ? index < STILL_LIT
            ? "var(--primary)"
            : "var(--foreground)"
          : color,
      }}
    >
      {children}
    </motion.span>
  )
}

const Method: FC = () => {
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  /* Reverse parallax: the pointer's position across the container maps onto
     how far the track has slid, so moving right pulls the overflowing cards
     in from the right, and the far edge stops flush with the container. */
  const target = useMotionValue(0)
  const x = useSpring(target, { stiffness: 120, damping: 30, mass: 0.6 })

  /* Starts far off-screen so no letter is lit until the pointer arrives. */
  const pointer = useMotionValue(-Infinity)
  const containerWidth = useMotionValue(0)

  /* On phones the track is a plain swipe carousel instead. */
  const still = useMediaQuery(MOBILE)

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (still || !viewport.current || !track.current) return

    const { left, width } = viewport.current.getBoundingClientRect()
    const progress = Math.min(Math.max((event.clientX - left) / width, 0), 1)
    const overflow = track.current.scrollWidth - width

    target.set(-progress * Math.max(overflow, 0))
    pointer.set(event.clientX - left)
    containerWidth.set(width)
  }

  return (
    /* Clipped sideways at the screen edges, which is what cuts the key off
       on phones instead of letting it widen the page. */
    <div className="overflow-x-clip">
      <div
        id="metodo"
        className="container flex flex-col gap-2"
        onPointerMove={onPointerMove}
      >
        <div className="flex max-md:flex-col md:items-end gap-4">
          {/* On phones the key leaves the title and sits above it, as the
              divider between the hero and this section, running off the right
              edge of the screen: -mr-17 is the gutter plus a sixth of the key,
              and the page's overflow-x clip cuts it off there. */}
          <div className="flex-3 relative max-md:flex max-md:flex-col">
            <h2 className="text-5xl md:text-8xl font-bold">
              A chave
              <br />
              tem método
            </h2>
            <Image
              src={key}
              alt="Chave"
              className="absolute right-0 top-[2.5%] w-[285px] max-md:static max-md:order-first max-md:self-end max-md:-mr-17 max-md:w-72 max-md:h-auto max-md:mb-4"
            />
          </div>
          <p className="flex-2 md:pb-9">
            Destravar o potencial da sua empresa com IA{" "}
            <b>não é sorte, é processo</b>. Um método testado que vai do
            entendimento do negócio até o acompanhamento dos resultados.
          </p>
        </div>
        <div ref={viewport}>
          {/* On phones: full bleed, swiped, snapping each card to the gutter. */}
          <motion.div
            ref={track}
            className="flex gap-4 max-md:-mx-gutter max-md:px-gutter max-md:scroll-px-gutter max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory no-scrollbar"
            style={{ x }}
          >
            {STEPS.map((step, index) => (
              <div
                key={step.title}
                /* VISIBLE cards across the container, less the gaps between. */
                className="shrink-0 flex flex-col items-center basis-[60%] max-md:snap-start md:basis-[calc((100%-4rem)/5)]"
              >
                <Glass className="p-4 flex flex-col gap-2 relative h-80">
                  <h3 className="text-xl md:text-2xl text-primary font-bold">
                    {step.title}
                  </h3>
                  <p className="text-sm">{step.description}</p>
                </Glass>
                {/* Behind the pane, so the glass has something to bend and frost. */}
                <Letter
                  index={index}
                  pointer={pointer}
                  x={x}
                  width={containerWidth}
                  still={still}
                >
                  {step.element}
                </Letter>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Method
