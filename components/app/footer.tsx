import Logo from "@/components/app/logo"
import { SiInstagram, SiWhatsapp } from "@icons-pack/react-simple-icons"
import { FC } from "react"

const Footer: FC = () => (
  <div className="bg-foreground pt-36">
    <div className="container flex flex-col items-center">
      <div className="flex gap-12 items-center">
        <span className="text-background text-2xl">
          Consultoria Inteligente.
        </span>
        <div className="flex items-center gap-8 text-background">
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="transition-opacity hover:opacity-70"
          >
            <SiInstagram className="size-6" />
          </a>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="transition-opacity hover:opacity-70"
          >
            <SiWhatsapp className="size-6" />
          </a>
        </div>
      </div>
      <div className="w-full pt-12 relative">
        <div className="absolute inset-0 bg-linear-to-b from-foreground to-transparent" />
        <div className="w-full h-44 overflow-clip">
          <Logo inverted className="w-full h-auto" />
        </div>
      </div>
    </div>
  </div>
)

export default Footer
