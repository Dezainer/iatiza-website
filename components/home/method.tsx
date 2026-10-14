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
}

/** Within this many cards of the pointer a letter is fully blue… */
const HOLD = 0.5
/** …and from this many cards away it is back to the foreground. */
const REACH = 2.5

/* Tints from the foreground to the primary as the pointer gets horizontally
   closer to it. Full blue within HOLD cards of the pointer, fading out by
   REACH, so the neighbours stay lit too and the glow trails the pointer. */
const Letter: FC<LetterProps> = ({ index, children, pointer, x, width }) => {
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
      className="relative -z-10 text-[256px] font-bold -mt-40"
      style={{ color }}
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

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!viewport.current || !track.current) return

    const { left, width } = viewport.current.getBoundingClientRect()
    const progress = Math.min(Math.max((event.clientX - left) / width, 0), 1)
    const overflow = track.current.scrollWidth - width

    target.set(-progress * Math.max(overflow, 0))
    pointer.set(event.clientX - left)
    containerWidth.set(width)
  }

  return (
    <div
      id="metodo"
      className="container flex flex-col gap-2"
      onPointerMove={onPointerMove}
    >
      <div className="flex items-end gap-4">
        <div className="flex-3 relative">
          <h2 className="text-8xl font-bold">
            A chave
            <br />
            tem método
          </h2>
          <Image
            src={key}
            alt="Chave"
            style={{ position: "absolute", right: 0, top: "2.5%", width: 285 }}
          />
        </div>
        <p className="flex-2 pb-9">
          Destravar o potencial da sua empresa com IA{" "}
          <b>não é sorte, é processo</b>. Um método testado que vai do
          entendimento do negócio até o acompanhamento dos resultados.
        </p>
      </div>
      <div ref={viewport}>
        <motion.div ref={track} className="flex gap-4" style={{ x }}>
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="shrink-0 flex flex-col items-center"
              style={{
                flexBasis: `calc((100% - ${VISIBLE - 1}rem) / ${VISIBLE})`,
              }}
            >
              <Glass className="p-4 flex flex-col gap-2 relative h-80">
                <h3 className="text-2xl text-primary font-bold">
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
              >
                {step.element}
              </Letter>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default Method
