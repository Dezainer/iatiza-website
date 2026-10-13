"use client"

import Glass from "@/components/app/glass"
import Image, { ImageProps } from "next/image"
import { FC, useEffect, useRef, useState } from "react"

import avatar from "@/public/main-testimony-avatar.png"

interface Case {
  name: string
  role: string
  avatar: ImageProps["src"]
  video: string
}

const CASES: Case[] = [
  {
    name: "Camila Duarte",
    role: "Ecosmart Varejo",
    avatar,
    video: "/testimonies/1.webm",
  },
  {
    name: "Camila Duarte",
    role: "Ecosmart Varejo",
    avatar,
    video: "/testimonies/2.webm",
  },
  {
    name: "Camila Duarte",
    role: "Ecosmart Varejo",
    avatar,
    video: "/testimonies/3.webm",
  },
]

const BackgroundElement: FC = () => (
  <svg
    width="1536"
    height="578"
    viewBox="0 0 1536 578"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-3/5 blur-3xl"
  >
    <path
      d="M-152.832 577.337C-125.419 555.329 -98.0985 536.604 -68.9342 519.406C197.239 363.734 500.974 433.636 810.311 429.67C1117.56 438.154 1470.62 336.27 1663.56 83.5206C1686.02 56.1697 1705.25 29.5709 1725.02 -3.44249e-05C1725.02 -3.44249e-05 1725.02 -3.44249e-05 1725.02 -3.44249e-05C1698.42 23.6126 1673.17 44.0003 1645.63 64.9145C1401.86 256.041 1108.46 297.333 809.852 293.671C520.102 296.381 153.773 267.691 -84.6316 498.88C-109.941 523.405 -131.962 549.053 -152.832 577.337Z"
      fill="#2937FD"
    />
  </svg>
)

interface CaseCardProps {
  item: Case
  audible: boolean
  onToggleSound: () => void
}

const CaseCard: FC<CaseCardProps> = ({ item, audible, onToggleSound }) => {
  const video = useRef<HTMLVideoElement>(null)
  const progress = useRef<HTMLSpanElement>(null)

  // The bar is driven per frame straight on the DOM: `timeupdate` only fires
  // a few times a second, which makes the fill visibly step, and routing 60
  // updates a second through React state would re-render the card for nothing.
  useEffect(() => {
    let frame: number
    const tick = () => {
      const el = video.current
      if (el && progress.current && el.duration) {
        progress.current.style.transform = `scaleX(${el.currentTime / el.duration})`
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  // The `muted` attribute below only covers the initial state autoplay needs;
  // after that the property is driven from here. The click that changed
  // `audible` counts as the user gesture browsers require to unmute.
  useEffect(() => {
    if (video.current) video.current.muted = !audible
  }, [audible])

  return (
    <Glass className="p-4 flex flex-col gap-4" frost={4}>
      <div className="relative overflow-hidden rounded-lg">
        <video
          ref={video}
          src={item.video}
          autoPlay
          muted
          loop
          playsInline
          className="block w-full aspect-9/16 object-cover"
        />
        {/* The whole frame is the control: click anywhere to toggle sound. */}
        <button
          type="button"
          onClick={onToggleSound}
          aria-pressed={audible}
          aria-label={`Ativar o som do depoimento de ${item.name}`}
          className="absolute inset-0 flex items-start justify-end p-3 cursor-pointer"
        >
          <span className="symbol text-2xl text-white drop-shadow-lg">
            {audible ? "volume_up" : "volume_off"}
          </span>
        </button>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-white/30"
        >
          <span
            ref={progress}
            className="block h-full bg-white origin-left"
            // Inline rather than `scale-x-0`: Tailwind v4 compiles that to the
            // `scale` property, which would stack with the `transform` the
            // frame loop writes and pin the bar at zero.
            style={{ transform: "scaleX(0)" }}
          />
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-bold">{item.name}</span>
        <span className="text-xs">{item.role}</span>
      </div>
    </Glass>
  )
}

const Cases: FC = () => {
  // Only one testimony has sound at a time: unmuting one mutes the rest.
  const [audible, setAudible] = useState<number | null>(null)

  return (
    <div className="container flex flex-col items-center pt-12">
      <div className="w-4/5">
        <div className="flex flex-col items-center">
          <h2 className="text-center font-bold">
            <span className="text-4xl block h-2">Conheça alguns</span>
            <br />
            <span className="text-9xl text-primary block h-29">iatizados</span>
          </h2>
        </div>
        <div className="relative">
          <BackgroundElement />
          <div className="relative grid grid-cols-3 gap-6">
            {CASES.map((item, index) => (
              <CaseCard
                key={item.video}
                item={item}
                audible={audible === index}
                onToggleSound={() =>
                  setAudible((current) => (current === index ? null : index))
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cases
