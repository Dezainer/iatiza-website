import Glass from "@/components/app/glass"
import Image from "next/image"
import { FC, ReactNode } from "react"

import key from "@/public/key.png"

interface Step {
  title: string
  description: ReactNode
  element: string
}

const STEPS: Step[] = [
  {
    title: "Entendemos o negócio",
    description: (
      <>
        Mergulhamos na sua operação, processos e dores reais{" "}
        <b>antes de falar em tecnologia</b>. IA que não entende o negócio não
        resolve nada.
      </>
    ),
    element: "1",
  },
  {
    title: "Entendemos o negócio",
    description: (
      <>
        Mergulhamos na sua operação, processos e dores reais{" "}
        <b>antes de falar em tecnologia</b>. IA que não entende o negócio não
        resolve nada.
      </>
    ),
    element: "2",
  },
  {
    title: "Entendemos o negócio",
    description: (
      <>
        Mergulhamos na sua operação, processos e dores reais{" "}
        <b>antes de falar em tecnologia</b>. IA que não entende o negócio não
        resolve nada.
      </>
    ),
    element: "3",
  },
  {
    title: "Entendemos o negócio",
    description: (
      <>
        Mergulhamos na sua operação, processos e dores reais{" "}
        <b>antes de falar em tecnologia</b>. IA que não entende o negócio não
        resolve nada.
      </>
    ),
    element: "4",
  },
  {
    title: "Entendemos o negócio",
    description: (
      <>
        Mergulhamos na sua operação, processos e dores reais{" "}
        <b>antes de falar em tecnologia</b>. IA que não entende o negócio não
        resolve nada.
      </>
    ),
    element: "5",
  },
]

const Method: FC = () => (
  <div className="container flex flex-col gap-2">
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
    <div className="flex gap-2">
      {STEPS.map((step) => (
        <div key={step.element} className="flex flex-col items-center">
          <Glass className="p-3 flex flex-col gap-2 relative h-80">
            <h3 className="text-2xl text-primary font-bold">{step.title}</h3>
            <p className="text-sm">{step.description}</p>
          </Glass>
          <span className="text-[256px] font-bold text-primary -mt-36">
            {step.element}
          </span>
        </div>
      ))}
    </div>
  </div>
)

export default Method
