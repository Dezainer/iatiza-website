"use server"

import { appendRow } from "@/lib/sheets"

export type FormState = { status: "idle" | "success" | "error"; message?: string }

// Loose on purpose: the browser's type="email" already did the strict pass,
// this only stops junk from a hand-crafted request.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// The answer lists live with the form, and a "use server" file can't import
// values from client code, so the choices are only checked for shape here.
const answer = (value: FormDataEntryValue | null) => {
  const text = typeof value === "string" ? value.trim() : ""
  return text && text.length <= 64 ? text : undefined
}

export const submitContact = async (
  _prev: FormState,
  formData: FormData,
): Promise<FormState> => {
  const email = String(formData.get("email") ?? "").trim()
  const headcount = answer(formData.get("headcount"))
  const revenue = answer(formData.get("revenue"))

  if (!EMAIL.test(email) || email.length > 254) {
    return { status: "error", message: "Confere esse email pra gente?" }
  }
  if (!headcount || !revenue) {
    return { status: "error", message: "Selecione uma opção em cada pergunta." }
  }

  try {
    await appendRow([new Date().toISOString(), email, headcount, revenue])
  } catch (error) {
    console.error(error)
    return {
      status: "error",
      message: "Não deu pra enviar agora. Tenta de novo em instantes?",
    }
  }

  return { status: "success", message: "Recebido! Em breve a gente te chama." }
}
