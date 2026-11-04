import Logo from "@/components/app/logo"
import { FC } from "react"

const Header: FC = () => (
  <div
    data-reveal="stage"
    className="container flex justify-between items-center pt-8 md:pt-12"
  >
    <Logo className="max-md:w-24 max-md:h-auto" />
    <span>Consultoria Inteligente.</span>
  </div>
)

export default Header
