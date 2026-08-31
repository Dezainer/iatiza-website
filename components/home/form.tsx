import Button from "@/components/app/button"
import Glass from "@/components/app/glass"
import { FC, PropsWithChildren } from "react"

interface OptionProps {
  active?: boolean
}

const Option: FC<PropsWithChildren<OptionProps>> = ({ children, active }) => (
  <div className="relative flex-1 flex">
    <div
      className={`absolute bg-primary w-3/4 h-1/2 left-1/2 top-1/2 -translate-1/2 ${active ? "opacity-75" : "opacity-0"}`}
    />
    <Glass className="py-3 px-4 flex-1 flex justify-center text-background font-bold uppercase text-sm">
      <span className={active ? "opacity-100" : "opacity-26"}>{children}</span>
    </Glass>
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

const Form: FC = () => (
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
          <h4 className="text-2xl font-bold text-background">
            Quantas <span className="text-primary">pessoas</span> tem sua
            empresa?
          </h4>
          <div className="flex gap-4">
            <Option active>1 À 20</Option>
            <Option>20 À 50</Option>
            <Option>50 À 100</Option>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-2xl font-bold text-background">
            Qual o <span className="text-primary">faturamento</span> da sua
            empresa?
          </h4>
          <div className="flex gap-4">
            <Option active>MENOS DE R$ 1.000.000 </Option>
            <Option>R$ 1.000.000 À 10.000.000 </Option>
            <Option>MAIS DE R$ 10.000.000</Option>
          </div>
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

export default Form
