import Logo from "@/components/app/logo"
import { FC } from "react"

const Header: FC = () => (
  <div className="container flex justify-between items-center pt-12">
    <Logo />
    <span>Consultoria Inteligente.</span>
  </div>
)

export default Header
