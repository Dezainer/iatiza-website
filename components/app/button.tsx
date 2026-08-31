import { FC, PropsWithChildren } from "react"

const Button: FC<PropsWithChildren> = ({ children }) => (
  <button className="bg-primary text-background font-bold uppercase py-3 px-4 rounded-lg">
    {children}
  </button>
)

export default Button
