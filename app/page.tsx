import Footer from "@/components/app/footer"
import Header from "@/components/app/header"
import Cases from "@/components/home/cases"
import Form from "@/components/home/form"
import GraphLine from "@/components/home/graph-line"
import Hero from "@/components/home/hero"
import { IntroGate } from "@/components/home/intro"
import Method from "@/components/home/method"
import Oracle from "@/components/home/oracle"
import Team from "@/components/home/team"

export default function Home() {
  return (
    <>
      <IntroGate />
      <Header />
      {/* The graph runs behind both sections, so it is anchored to the pair of
          them rather than living inside either one. */}
      <div className="relative">
        <div
          data-reveal="rest"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10"
        >
          <GraphLine />
        </div>
        <Hero />
        <div data-reveal="rest">
          <Method />
          <Cases />
          <Oracle />
          <Team />
          <Form />
          <Footer />
        </div>
      </div>
    </>
  )
}
