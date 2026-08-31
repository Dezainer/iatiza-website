import { FC, PropsWithChildren } from "react"

interface GlassProps {
  className?: string
}

const Glass: FC<PropsWithChildren<GlassProps>> = ({ children, className }) => (
  <div className={`${className}`}>{children}</div>
)

export default Glass
