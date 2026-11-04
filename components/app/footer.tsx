import Logo from "@/components/app/logo"
import { SiInstagram, SiWhatsapp } from "@icons-pack/react-simple-icons"
import { FC } from "react"

const Footer: FC = () => (
  <div className="bg-foreground pt-20 md:pt-36">
    <div className="container flex flex-col items-center">
      <div className="flex gap-6 md:gap-12 items-center">
        <span className="text-background text-xl md:text-2xl">
          Consultoria Inteligente.
        </span>
        <div className="flex items-center gap-6 md:gap-8 text-background">
          <a
            href="https://www.instagram.com/iatiza.consult/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="transition-opacity hover:opacity-70"
          >
            <SiInstagram className="size-6" />
          </a>
          <a
            href="https://wa.me/554699170048"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="transition-opacity hover:opacity-70"
          >
            <SiWhatsapp className="size-6" />
          </a>
        </div>
      </div>
      <div className="w-full pt-12 relative max-md:-mx-gutter max-md:w-auto max-md:self-stretch">
        <div className="absolute inset-0 bg-linear-to-b from-foreground to-transparent" />
        {/* On phones the clip keeps the same proportion as the desktop crop
            (176 of the 197px logo), since a fixed h-44 would show it whole. */}
        <div className="w-full h-44 overflow-clip max-md:h-auto max-md:aspect-[122/18]">
          <Logo inverted className="w-full h-auto" />
        </div>
      </div>
    </div>
  </div>
)

export default Footer
