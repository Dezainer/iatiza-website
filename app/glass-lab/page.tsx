import Glass from "@/components/app/glass"

export default function GlassLab() {
  return (
    <div className="p-10 flex gap-6">
      {["1", "2"].map((n) => (
        <div key={n} className="flex-1 flex flex-col items-center">
          <Glass className="p-4 flex flex-col gap-2 relative h-80">
            <h3 className="text-2xl text-primary font-bold">Entendemos o negócio</h3>
            <p className="text-sm">
              Mergulhamos na sua operação, processos e dores reais antes de falar em tecnologia.
            </p>
          </Glass>
          <span className="relative -z-10 text-[256px] font-bold text-primary -mt-40">{n}</span>
        </div>
      ))}
    </div>
  )
}
