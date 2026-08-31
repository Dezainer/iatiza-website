"use client"

import Image, { ImageProps } from "next/image"
import { FC, ReactNode, useEffect, useRef, useState } from "react"

import logo from "@/public/mock-logo.png"
import avatar from "@/public/main-testimony-avatar.png"

interface Case {
  name: string
  role: string
  logo: ImageProps["src"]
  avatar: ImageProps["src"]
  quote: ReactNode
}

const CASES: Case[] = [
  {
    name: "Camila Duarte",
    role: "Diretora de Operações",
    logo,
    avatar,
    quote: (
      <>
        Em três meses reorganizamos processos que travavam a operação há anos.{" "}
        <b>A IA deixou de ser ideia distante</b> e virou parte do dia a dia da
        equipe(1).
      </>
    ),
  },
  {
    name: "Camila Duarte",
    role: "Diretora de Operações",
    logo,
    avatar,
    quote: (
      <>
        Em três meses reorganizamos processos que travavam a operação há anos.{" "}
        <b>A IA deixou de ser ideia distante</b> e virou parte do dia a dia da
        equipe(2).
      </>
    ),
  },
  {
    name: "Camila Duarte",
    role: "Diretora de Operações",
    logo,
    avatar,
    quote: (
      <>
        Em três meses reorganizamos processos que travavam a operação há anos.{" "}
        <b>A IA deixou de ser ideia distante</b> e virou parte do dia a dia da
        equipe(3).
      </>
    ),
  },
  {
    name: "Camila Duarte",
    role: "Diretora de Operações",
    logo,
    avatar,
    quote: (
      <>
        Em três meses reorganizamos processos que travavam a operação há anos.{" "}
        <b>A IA deixou de ser ideia distante</b> e virou parte do dia a dia da
        equipe(4).
      </>
    ),
  },
  {
    name: "Camila Duarte",
    role: "Diretora de Operações",
    logo,
    avatar,
    quote: (
      <>
        Em três meses reorganizamos processos que travavam a operação há anos.{" "}
        <b>A IA deixou de ser ideia distante</b> e virou parte do dia a dia da
        equipe(5).
      </>
    ),
  },
]

/** How long each case is shown before the row advances on its own. */
const AUTOPLAY_MS = 3000

const Cases: FC = () => {
  const [selected, setSelected] = useState(0)
  const [paused, setPaused] = useState(false)

  // Advances on a timeout keyed to `selected` rather than a standing
  // interval, so a click (or leaving a hover) restarts the full 3s instead of
  // landing mid-cycle and flicking to the next case straight away.
  useEffect(() => {
    if (paused) return
    const timer = setTimeout(
      () => setSelected((current) => (current + 1) % CASES.length),
      AUTOPLAY_MS,
    )
    return () => clearTimeout(timer)
  }, [selected, paused])

  // The indicator is one bar that slides, not a border per logo, so it can
  // animate between them. That means measuring the active logo: the widths
  // come from the images, so they are only known at layout time.
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const list = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  // Nothing to slide from on the first measurement — without this the bar
  // would grow out of the left edge on mount.
  const [measured, setMeasured] = useState(false)

  useEffect(() => {
    const tab = tabs.current[selected]
    if (!tab) return

    const measure = () => {
      setIndicator({ left: tab.offsetLeft, width: tab.offsetWidth })
      setMeasured(true)
    }
    measure()

    // Catches the logos loading in and the row reflowing on resize, both of
    // which move the tab without React re-rendering.
    const observer = new ResizeObserver(measure)
    observer.observe(tab)
    if (list.current) observer.observe(list.current)
    return () => observer.disconnect()
  }, [selected])

  const active = CASES[selected]

  return (
    <div
      className="container flex flex-col items-center pt-32 gap-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      // Keyboard equivalent of the hover pause: tabbing through the logos
      // should not have the case changing underneath.
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="w-3/5 flex flex-col items-center gap-4">
        <h4 className="text-2xl text-center">&ldquo;{active.quote}&rdquo;</h4>
        <div className="flex-1 flex items-center gap-2">
          <Image
            src={active.avatar}
            alt="Avatar"
            className="rounded-full w-11"
          />
          <div className="flex flex-col">
            <span className="font-bold">{active.name}</span>
            <span className="text-xs">{active.role}</span>
          </div>
        </div>
      </div>
      <div
        ref={list}
        className="relative flex gap-2 border-t border-foreground"
      >
        <span
          aria-hidden
          className={`absolute top-0 h-1 bg-primary ${
            measured ? "transition-[left,width] duration-300 ease-out" : ""
          }`}
          style={{ left: indicator.left, width: indicator.width }}
        />
        {CASES.map((item, index) => (
          <button
            key={index}
            type="button"
            ref={(tab) => {
              tabs.current[index] = tab
            }}
            onClick={() => setSelected(index)}
            aria-pressed={index === selected}
            aria-label={`Ver o depoimento de ${item.name}`}
            className={`p-8 cursor-pointer transition duration-300 ${
              index === selected ? "grayscale-0" : "grayscale hover:grayscale-0"
            }`}
          >
            <Image src={item.logo} alt={item.name} />
          </button>
        ))}
      </div>
    </div>
  )
}

export default Cases
