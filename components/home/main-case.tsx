import Glass from "@/components/app/glass"
import Image from "next/image"
import { FC } from "react"

import avatar from "@/public/main-testimony-avatar.png"

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

const MainCase: FC = () => (
  <div className="container flex flex-col items-center pt-12">
    <div className="w-3/5">
      <div className="flex flex-col items-center">
        <h2 className="text-center font-bold">
          <span className="text-4xl block h-2">Conheça alguns</span>
          <br />
          <span className="text-9xl text-primary block h-29">iatizados</span>
        </h2>
      </div>
      <div className="relative">
        <BackgroundElement />
        <Glass className="p-4 flex flex-col gap-4" frost={4}>
          <div className="relative">
            <video src="/mock-testimony.mp4" controls={false} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center gap-2">
              <Image src={avatar} alt="Avatar" className="rounded-full w-11" />
              <div className="flex flex-col">
                <span className="font-bold">Camila Duarte</span>
                <span className="text-xs">Ecosmart Varejo</span>
              </div>
            </div>
            <p className="w-3/5 text-sm text-right text-balance">
              Neste vídeo, <b>Camila</b> conta como identificamos os gargalos do
              negócio, redesenhamos processos com IA e acompanhamos os
              resultados mês a mês.
            </p>
          </div>
        </Glass>
      </div>
    </div>
  </div>
)

export default MainCase
