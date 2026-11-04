"use client"

import Button from "@/components/app/button"
import Glass from "@/components/app/glass"
import confetti from "canvas-confetti"
import { AnimatePresence, motion } from "motion/react"
import {
  FC,
  PropsWithChildren,
  useActionState,
  useEffect,
  useState,
} from "react"
import { FormState, submitContact } from "@/actions/contact"

/* -------------------------------------------------------------------------
 * The questions
 *
 * Both are single-select, so they are built on real radio inputs rather than
 * click handlers on divs. The input is visually hidden and the Glass plate is
 * the visible control, which costs nothing and hands us exclusivity within a
 * group, arrow-key navigation, focus, and the payload the server action reads.
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
    <Glass className="py-3 px-2 md:px-4 flex-1 flex justify-center max-md:whitespace-nowrap text-background font-bold uppercase text-sm peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-background">
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
  /** Keep the options side by side on phones too, for short labels. */
  inline?: boolean
}

const OptionGroup = <T extends string>({
  name,
  labelledBy,
  options,
  value,
  onChange,
  inline,
}: OptionGroupProps<T>) => (
  <div
    role="radiogroup"
    aria-labelledby={labelledBy}
    className={`flex gap-3 md:gap-4 ${inline ? "" : "max-md:flex-col"}`}
  >
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

/* -------------------------------------------------------------------------
 * Celebration
 *
 * Two bursts from the bottom corners, in the brand blue plus white so they
 * read on both the dark form and the light sections. canvas-confetti skips
 * itself under prefers-reduced-motion; the toast still says it in words.
 * ---------------------------------------------------------------------- */

const CONFETTI_COLORS = ["#2937fd", "#ffffff", "#8a92ff"]

const celebrate = () => {
  const shared = {
    particleCount: 90,
    spread: 70,
    startVelocity: 60,
    colors: CONFETTI_COLORS,
    disableForReducedMotion: true,
  }
  confetti({ ...shared, angle: 60, origin: { x: 0, y: 1 } })
  confetti({ ...shared, angle: 120, origin: { x: 1, y: 1 } })
}

const TOAST_MS = 5000

const Form: FC = () => {
  const [headcount, setHeadcount] = useState<Headcount>(HEADCOUNT[0])
  const [revenue, setRevenue] = useState<Revenue>(REVENUE[0])
  const [toast, setToast] = useState(false)
  // Celebrating from the action rather than an effect on `state` ties it to
  // the submission itself, so it fires once per success and never on render.
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    async (prev, formData) => {
      const next = await submitContact(prev, formData)
      if (next.status === "success") {
        celebrate()
        setToast(true)
      }
      return next
    },
    { status: "idle" },
  )

  useEffect(() => {
    if (!toast) return
    const timeout = setTimeout(() => setToast(false), TOAST_MS)
    return () => clearTimeout(timeout)
  }, [toast])

  return (
    <div id="contato" className="bg-foreground">
      {/* The divider and glow that open this section live at the foot of the
          team scene instead, so they travel with its pinned figures. This is
          positioned only so its content paints over that glow. */}
      <div className="container relative flex flex-col items-center">
        <h2 className="text-5xl md:text-8xl font-bold text-background max-md:text-center pt-24">
          E ai, bora <span className="text-primary">iatizar?</span>
        </h2>
        <p className="text-sm md:w-3/5 text-balance text-background text-center max-md:pt-4">
          Selecione o tamanho da sua empresa e escolha um horário. Sem
          compromisso, sem enrolação,{" "}
          <b>só uma conversa pra entender se e como podemos ajudar</b>.
        </p>
        <form
          action={formAction}
          className="w-full md:w-3/5 flex flex-col gap-9 pt-12"
        >
          <div className="flex flex-col gap-2">
            <h4
              id="headcount-question"
              className="text-xl md:text-2xl font-bold text-background"
            >
              Quantas <span className="text-primary">pessoas</span> tem sua
              empresa?
            </h4>
            <OptionGroup
              name="headcount"
              labelledBy="headcount-question"
              options={HEADCOUNT}
              inline
              value={headcount}
              onChange={setHeadcount}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h4
              id="revenue-question"
              className="text-xl md:text-2xl font-bold text-background"
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
            <h4
              id="email-question"
              className="text-xl md:text-2xl font-bold text-background"
            >
              Seu melhor <span className="text-primary">email</span>:
            </h4>
            <div className="flex max-md:flex-col gap-3 md:gap-4">
              {/* flex-none on phones: stacked, flex-1 would make its basis 0 and
                  override the height. */}
              <Glass className="flex-1 max-md:flex-none max-md:h-12">
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  aria-labelledby="email-question"
                  className="w-full h-full text-background"
                  placeholder="fui@iatizado.ia"
                />
              </Glass>
              <Button disabled={pending}>
                {/* Both labels share one grid cell, so the button is always as
                    wide as the longer one and swapping them moves nothing. */}
                <span className="grid">
                  <span
                    className={`col-start-1 row-start-1 ${pending ? "invisible" : ""}`}
                  >
                    IATIZAR MINHA EMPRESA
                  </span>
                  <span
                    aria-hidden={!pending}
                    className={`col-start-1 row-start-1 ${pending ? "" : "invisible"}`}
                  >
                    ENVIANDO...
                  </span>
                </span>
              </Button>
            </div>
            <p
              aria-live="polite"
              className="text-sm font-bold min-h-5 text-primary"
            >
              {state.status === "error" ? state.message : null}
            </p>
          </div>
        </form>
      </div>
      <div
        role="status"
        className="fixed inset-x-0 bottom-8 z-50 flex justify-center pointer-events-none"
      >
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="pointer-events-auto bg-primary text-background font-bold py-4 px-6 rounded-lg shadow-2xl"
            >
              Sua IATIZAção foi encomendada!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Form
