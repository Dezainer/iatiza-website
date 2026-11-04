import "server-only"

import { createSign } from "node:crypto"

/* -------------------------------------------------------------------------
 * Google Sheets, by hand
 *
 * Appending a row needs two requests: trade a signed JWT for an access token,
 * then POST the row. That is small enough that pulling in `googleapis` (tens
 * of MB) isn't worth it, so this signs the JWT with node:crypto instead.
 *
 * Auth is a service account. Share the spreadsheet with its email as an
 * editor and set:
 *
 *   GOOGLE_SHEETS_CLIENT_EMAIL     the service account's `client_email`
 *   GOOGLE_SHEETS_PRIVATE_KEY      its `private_key`; literal "\n" is fine
 *   GOOGLE_SHEETS_SPREADSHEET_ID   the id in the sheet's URL
 *   GOOGLE_SHEETS_RANGE            optional, e.g. "Leads!A:D"; defaults to
 *                                  the first tab
 * ---------------------------------------------------------------------- */

const SCOPE = "https://www.googleapis.com/auth/spreadsheets"
const TOKEN_URL = "https://oauth2.googleapis.com/token"

const env = (name: string) => {
  const value = process.env[name]
  if (!value) throw new Error(`Missing env var ${name}`)
  return value
}

const base64url = (input: string | Buffer) =>
  Buffer.from(input).toString("base64url")

/** Reused across requests until a minute before it expires. */
let cached: { token: string; expiresAt: number } | undefined

const getAccessToken = async () => {
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token

  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))
  const claims = base64url(
    JSON.stringify({
      iss: env("GOOGLE_SHEETS_CLIENT_EMAIL"),
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  )
  // Env files and dashboards tend to store the key on one line with escaped
  // newlines, which the PEM parser won't accept.
  const key = env("GOOGLE_SHEETS_PRIVATE_KEY").replace(/\\n/g, "\n")
  const signature = createSign("RSA-SHA256")
    .update(`${header}.${claims}`)
    .sign(key, "base64url")

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claims}.${signature}`,
    }),
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error(`Google token request failed: ${res.status} ${await res.text()}`)
  }

  const { access_token, expires_in } = (await res.json()) as {
    access_token: string
    expires_in: number
  }
  cached = { token: access_token, expiresAt: Date.now() + expires_in * 1000 }
  return access_token
}

/** Appends one row below the last filled row of the configured range. */
export const appendRow = async (row: string[]) => {
  const id = env("GOOGLE_SHEETS_SPREADSHEET_ID")
  const range = encodeURIComponent(process.env.GOOGLE_SHEETS_RANGE || "A1")
  // RAW so a submitted "=IMPORTXML(...)" lands as text, not as a formula.
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: [row] }),
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error(`Google Sheets append failed: ${res.status} ${await res.text()}`)
  }
}
