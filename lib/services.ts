/* The service catalogue. Lives outside components/home/services.tsx (a client
   module) so server code can read it too — the JSON-LD in
   components/app/structured-data.tsx lists these same services. */

export const CRITERIA = ["rapido", "enxuto", "sob-medida"] as const

export type Criterion = (typeof CRITERIA)[number]

export const CRITERION: Record<Criterion, string> = {
  rapido: "Rápido",
  enxuto: "Enxuto",
  "sob-medida": "Sob medida",
}

export interface Service {
  title: string
  description: string
  /** Material Symbols name — also listed in app/layout.tsx. */
  icon: string
  criteria: [Criterion, Criterion]
}

/* Placeholder copy until the real product list comes in. Keep two services
   per pair so every combination lights up the same number of cards. */
export const SERVICES: Service[] = [
  {
    title: "Diagnóstico de IA",
    description:
      "Um raio-x da operação que aponta onde a IA dá retorno primeiro.",
    icon: "query_stats",
    criteria: ["rapido", "enxuto"],
  },
  {
    title: "Oráculo",
    description:
      "Respostas certeiras sobre o seu negócio, treinadas no seu contexto.",
    icon: "visibility",
    criteria: ["rapido", "sob-medida"],
  },
  {
    title: "Agentes de atendimento",
    description: "Atendimento que resolve de verdade, a qualquer hora do dia.",
    icon: "support_agent",
    criteria: ["enxuto", "sob-medida"],
  },
  {
    title: "Automações",
    description: "Tarefas repetitivas saem da mesa do time e vão pra máquina.",
    icon: "bolt",
    criteria: ["rapido", "sob-medida"],
  },
  {
    title: "Treinamento de equipes",
    description: "Seu time usando IA no dia a dia, com método e sem medo.",
    icon: "school",
    criteria: ["rapido", "enxuto"],
  },
  {
    title: "Integrações",
    description: "A IA conversando com os sistemas que a empresa já usa.",
    icon: "hub",
    criteria: ["enxuto", "sob-medida"],
  },
]
