import Header from "@/components/app/header"
import Cases from "@/components/home/cases"
import GraphLine from "@/components/home/graph-line"
import Hero from "@/components/home/hero"
import MainCase from "@/components/home/main-case"
import Method from "@/components/home/method"
import Oracle from "@/components/home/oracle"
import Team from "@/components/home/team"

export default function Home() {
  return (
    <>
      <Header />
      {/* The graph runs behind both sections, so it is anchored to the pair of
          them rather than living inside either one. */}
      <div className="relative">
        <GraphLine className="pointer-events-none absolute inset-x-0 top-0 -z-10" />
        <Hero />
        <Method />
        <MainCase />
        <Cases />
        <Oracle />
        <Team />
      </div>
    </>
  )
}
