"use client"

/* -------------------------------------------------------------------------
 * Intro
 *
 * The page opens on nothing but the header and the wordmark, and the rest
 * waits — scroll and all — until the lock is opened for the first time. It is
 * driven entirely by an attribute on <html>:
 *
 *   data-intro="loading"  everything hidden, waiting on the lock's model
 *   data-intro="locked"   [data-reveal="stage"] shown, [data-reveal="rest"] not
 *   (absent)              everything shown, scroll free
 *
 * The content itself is always server-rendered and only hidden by CSS (see
 * globals.css), so crawlers and no-JS visitors get the whole page.
 * ---------------------------------------------------------------------- */

/** If the model has not turned up by now, give up on the intro altogether. */
const FAILSAFE_MS = 8000

/* Runs while the HTML is still parsing, so nothing paints before it. Manual
   scroll restoration keeps a reload from coming back halfway down the page with
   the scroll locked. */
const SCRIPT = `(function(){var h=document.documentElement;h.dataset.intro="loading";history.scrollRestoration="manual";scrollTo({top:0,behavior:"instant"});setTimeout(function(){if(h.dataset.intro==="loading")delete h.dataset.intro},${FAILSAFE_MS})})()`

/**
 * Goes first in the page, ahead of anything it hides. On a client-side
 * navigation the script does not run, so the page simply arrives open. The
 * type swap keeps React from warning about rendering a script on the client.
 */
export const IntroGate = () => (
  <script
    type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
    suppressHydrationWarning
    dangerouslySetInnerHTML={{ __html: SCRIPT }}
  />
)

/** The lock is in: bring up the header and the wordmark. */
export const showStage = () => {
  const root = document.documentElement
  if (root.dataset.intro === "loading") root.dataset.intro = "locked"
}

/** The lock has been opened: bring up everything else. Only acts once. */
export const releaseIntro = () => {
  delete document.documentElement.dataset.intro
}
