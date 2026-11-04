import { FC, PropsWithChildren } from "react"

const CLASS_NAME =
  "bg-primary text-background font-bold uppercase py-3 px-4 rounded-lg cursor-pointer disabled:cursor-wait disabled:opacity-60"

/** Renders as a link when given an href, so the same look can navigate. */
const Button: FC<PropsWithChildren<{ href?: string; disabled?: boolean }>> = ({
  href,
  disabled,
  children,
}) =>
  href ? (
    <a href={href} className={CLASS_NAME}>
      {children}
    </a>
  ) : (
    <button className={CLASS_NAME} disabled={disabled}>{children}</button>
  )

export default Button
