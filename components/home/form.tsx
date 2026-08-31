"use client"

import Button from "@/components/app/button"
import Glass from "@/components/app/glass"
import { FC, PropsWithChildren, useState } from "react"

/* -------------------------------------------------------------------------
 * The questions
 *
 * Both are single-select, so they are built on real radio inputs rather than
 * click handlers on divs. The input is visually hidden and the Glass plate is
 * the visible control, which costs nothing and hands us exclusivity within a
 * group, arrow-key navigation, focus, and a working payload the day this is
 * wrapped in a real <form>.
 *
 * The option lists are `as const`, so the state below is typed to the answers
 * that actually exist — a typo in a value is a compile error, not a silently
 * unselected group.
 * ---------------------------------------------------------------------- */

const HEADCOUNT = ["1 À 20", "20 À 50", "50 À 100"] as const
const REVENUE = [
  "MENOS DE R$ 1.000.000",
  "R$ 1.000.000 À 10.000.000",
  "MAIS DE R$ 10.000.000",
] as const

type Headcount = (typeof HEADCOUNT)[number]
type Revenue = (typeof REVENUE)[number]

interface OptionProps<T extends string> {
  /** Shared by every option in a group — this is what makes them exclusive. */
  name: string
  value: T
  checked: boolean
  onChange: (value: T) => void
}

const Option = <T extends string>({
  children,
  name,
  value,
  checked,
  onChange,
}: PropsWithChildren<OptionProps<T>>) => (
  <label className="relative flex-1 flex cursor-pointer">
    <input
      type="radio"
      className="peer sr-only"
      name={name}
      value={value}
      checked={checked}
      onChange={() => onChange(value)}
    />
    {/* The glow sits before the plate on purpose: Glass opens a stacking
        context, so anything after it would paint on top of the frost instead
        of blooming up through it. */}
    <div
      className={`absolute bg-primary w-3/4 h-1/2 left-1/2 top-1/2 -translate-1/2 transition-opacity duration-200 ${checked ? "opacity-75" : "opacity-0"}`}
    />
    {/* `outline` rather than `ring`, which would take over the box-shadow the
        glass uses for its rim. */}
    <Glass className="py-3 px-4 flex-1 flex justify-center text-background font-bold uppercase text-sm peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-background">
      <span
        className={`transition-opacity duration-200 ${checked ? "opacity-100" : "opacity-26"}`}
      >
        {children}
      </span>
    </Glass>
  </label>
)

interface OptionGroupProps<T extends string> {
  name: string
  /** id of the heading that asks the question. */
  labelledBy: string
  options: readonly T[]
  value: T
  onChange: (value: T) => void
}

const OptionGroup = <T extends string>({
  name,
  labelledBy,
  options,
  value,
  onChange,
}: OptionGroupProps<T>) => (
  <div role="radiogroup" aria-labelledby={labelledBy} className="flex gap-4">
    {options.map((option) => (
      <Option
        key={option}
        name={name}
        value={option}
        checked={option === value}
        onChange={onChange}
      >
        {option}
      </Option>
    ))}
  </div>
)

interface DividerProps {
  className?: string
}

const Divider: FC<DividerProps> = ({ className }) => (
  <svg
    width="746"
    height="4"
    viewBox="0 0 746 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M-1.74846e-07 2C12.4333 2.13333 24.8667 2.26 37.3 2.38C149.2 3.45999 261.1 3.99998 373 3.99997C484.9 3.99996 596.8 3.45995 708.7 2.37994C721.133 2.25994 733.567 2.13327 746 1.99993C733.567 1.8666 721.133 1.73994 708.7 1.61994C596.8 0.539948 484.9 -4.23913e-05 373 -3.26087e-05C261.1 -2.28261e-05 149.2 0.539987 37.3 1.62C24.8667 1.74 12.4333 1.86667 -1.74846e-07 2Z"
      fill="white"
    />
  </svg>
)

const Form: FC = () => {
  const [headcount, setHeadcount] = useState<Headcount>(HEADCOUNT[0])
  const [revenue, setRevenue] = useState<Revenue>(REVENUE[0])

  return (
    <div className="bg-foreground">
      <div className="container flex flex-col items-center bg-radial-[50%_100%_at_top_center] from-primary/26 to-transparent">
        <Divider className="w-3/5" />
        <h2 className="text-8xl font-bold text-background pt-24">
          E ai, bora <span className="text-primary">iatizar?</span>
        </h2>
        <p className="text-sm w-3/5 text-balance text-background text-center">
          Selecione o tamanho da sua empresa e escolha um horário. Sem
          compromisso, sem enrolação,{" "}
          <b>só uma conversa pra entender se e como podemos ajudar</b>.
        </p>
        <div className="w-3/5 flex flex-col gap-9 pt-12">
          <div className="flex flex-col gap-2">
            <h4
              id="headcount-question"
              className="text-2xl font-bold text-background"
            >
              Quantas <span className="text-primary">pessoas</span> tem sua
              empresa?
            </h4>
            <OptionGroup
              name="headcount"
              labelledBy="headcount-question"
              options={HEADCOUNT}
              value={headcount}
              onChange={setHeadcount}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h4
              id="revenue-question"
              className="text-2xl font-bold text-background"
            >
              Qual o <span className="text-primary">faturamento</span> da sua
              empresa?
            </h4>
            <OptionGroup
              name="revenue"
              labelledBy="revenue-question"
              options={REVENUE}
              value={revenue}
              onChange={setRevenue}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-2xl font-bold text-background">
              Seu melhor <span className="text-primary">email</span>:
            </h4>
            <div className="flex gap-4">
              <Glass className="flex-1">
                <input
                  className="w-full h-full text-background"
                  placeholder="fui@iatizado.ia"
                />
              </Glass>
              <Button>IATIZAR MINHA EMPRESA</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Form
