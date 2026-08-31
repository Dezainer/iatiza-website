"use client"

import Image from "next/image"
import { FC, ReactNode, useEffect, useRef } from "react"

import eyeBack from "@/public/eye/back.png"
import eyePupil from "@/public/eye/pupil.png"
import eyeBorder from "@/public/eye/border.png"
import Glass from "@/components/app/glass"

const Circles: FC = () => (
  <svg
    width="1204"
    height="1204"
    viewBox="0 0 1204 1204"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M750.515 602C750.515 684.022 684.022 750.515 602 750.515C519.978 750.515 453.485 684.022 453.485 602C453.485 519.978 519.978 453.485 602 453.485C684.022 453.485 750.515 519.978 750.515 602Z"
      stroke="url(#paint0_radial_18_497)"
      strokeWidth="4"
      strokeDasharray="8 8"
    />
    <path
      d="M774.277 602C774.277 697.146 697.146 774.277 602 774.277C506.854 774.277 429.723 697.146 429.723 602C429.723 506.854 506.854 429.723 602 429.723C697.146 429.723 774.277 506.854 774.277 602Z"
      stroke="url(#paint1_radial_18_497)"
      strokeWidth="4"
      strokeDasharray="8 8"
    />
    <path
      d="M798.04 602C798.04 710.27 710.27 798.04 602 798.04C493.73 798.04 405.96 710.27 405.96 602C405.96 493.73 493.73 405.96 602 405.96C710.27 405.96 798.04 493.73 798.04 602Z"
      stroke="url(#paint2_radial_18_497)"
      strokeWidth="4"
      strokeDasharray="8 8"
    />
    <path
      d="M821.802 602C821.802 723.393 723.393 821.802 602 821.802C480.607 821.802 382.198 723.393 382.198 602C382.198 480.607 480.607 382.198 602 382.198C723.393 382.198 821.802 480.607 821.802 602Z"
      stroke="url(#paint3_radial_18_497)"
      strokeWidth="4"
      strokeDasharray="8 8"
    />
    <path
      d="M845.564 602C845.564 736.517 736.517 845.564 602 845.564C467.483 845.564 358.436 736.517 358.436 602C358.436 467.483 467.483 358.436 602 358.436C736.517 358.436 845.564 467.483 845.564 602Z"
      stroke="url(#paint4_radial_18_497)"
      strokeWidth="4"
      strokeDasharray="8 8"
    />
    <path
      d="M869.327 602C869.327 749.64 749.64 869.327 602 869.327C454.36 869.327 334.673 749.64 334.673 602C334.673 454.36 454.36 334.673 602 334.673C749.64 334.673 869.327 454.36 869.327 602Z"
      stroke="url(#paint5_radial_18_497)"
      strokeWidth="4"
      strokeDasharray="8 8"
    />
    <path
      d="M893.089 602C893.089 762.764 762.764 893.089 602 893.089C441.236 893.089 310.911 762.764 310.911 602C310.911 441.236 441.236 310.911 602 310.911C762.764 310.911 893.089 441.236 893.089 602Z"
      stroke="url(#paint6_radial_18_497)"
      strokeWidth="4"
      strokeDasharray="8 8"
    />
    <path
      d="M916.851 602C916.851 775.888 775.888 916.851 602 916.851C428.112 916.851 287.149 775.888 287.149 602C287.149 428.112 428.112 287.149 602 287.149C775.888 287.149 916.851 428.112 916.851 602Z"
      stroke="url(#paint7_radial_18_497)"
      strokeWidth="4"
      strokeDasharray="8 8"
    />
    <path
      d="M940.614 602C940.614 789.011 789.011 940.614 602 940.614C414.989 940.614 263.386 789.011 263.386 602C263.386 414.989 414.989 263.386 602 263.386C789.011 263.386 940.614 414.989 940.614 602Z"
      stroke="url(#paint8_radial_18_497)"
      strokeWidth="4"
      strokeDasharray="8 8"
    />
    <path
      d="M964.376 602C964.376 802.135 802.135 964.376 602 964.376C401.865 964.376 239.624 802.135 239.624 602C239.624 401.865 401.865 239.624 602 239.624C802.135 239.624 964.376 401.865 964.376 602Z"
      stroke="url(#paint9_radial_18_497)"
      strokeWidth="4"
      strokeDasharray="8 8"
    />
    <path
      d="M988.139 602C988.139 815.258 815.258 988.139 602 988.139C388.742 988.139 215.861 815.258 215.861 602C215.861 388.742 388.742 215.861 602 215.861C815.258 215.861 988.139 388.742 988.139 602Z"
      stroke="url(#paint10_radial_18_497)"
      strokeWidth="4"
      strokeDasharray="8 8"
    />
    <path
      d="M1011.9 602C1011.9 828.382 828.382 1011.9 602 1011.9C375.618 1011.9 192.099 828.382 192.099 602C192.099 375.618 375.618 192.099 602 192.099C828.382 192.099 1011.9 375.618 1011.9 602Z"
      stroke="url(#paint11_radial_18_497)"
      strokeWidth="4"
      strokeDasharray="8 8"
    />
    <path
      d="M1035.66 602C1035.66 841.506 841.506 1035.66 602 1035.66C362.494 1035.66 168.337 841.506 168.337 602C168.337 362.494 362.494 168.337 602 168.337C841.506 168.337 1035.66 362.494 1035.66 602Z"
      stroke="url(#paint12_radial_18_497)"
      strokeWidth="4"
      strokeDasharray="8 8"
    />
    <path
      d="M1059.43 602C1059.43 854.629 854.629 1059.43 602 1059.43C349.371 1059.43 144.574 854.629 144.574 602C144.574 349.371 349.371 144.574 602 144.574C854.629 144.574 1059.43 349.371 1059.43 602Z"
      stroke="url(#paint13_radial_18_497)"
      strokeWidth="4"
      strokeDasharray="8 8"
    />
    <path
      d="M1083.19 602C1083.19 867.753 867.753 1083.19 602 1083.19C336.247 1083.19 120.812 867.753 120.812 602C120.812 336.247 336.247 120.812 602 120.812C867.753 120.812 1083.19 336.247 1083.19 602Z"
      stroke="url(#paint14_radial_18_497)"
      strokeWidth="4"
      strokeDasharray="8 8"
    />
    <path
      d="M1106.95 602C1106.95 880.876 880.876 1106.95 602 1106.95C323.124 1106.95 97.0495 880.876 97.0495 602C97.0495 323.124 323.124 97.0495 602 97.0495C880.876 97.0495 1106.95 323.124 1106.95 602Z"
      stroke="url(#paint15_radial_18_497)"
      strokeWidth="4"
      strokeDasharray="8 8"
    />
    <path
      d="M1130.71 602C1130.71 894 894 1130.71 602 1130.71C310 1130.71 73.2871 894 73.2871 602C73.2871 310 310 73.2871 602 73.2871C894 73.2871 1130.71 310 1130.71 602Z"
      stroke="url(#paint16_radial_18_497)"
      strokeWidth="4"
      strokeDasharray="8 8"
    />
    <path
      d="M1154.48 602C1154.48 907.124 907.124 1154.48 602 1154.48C296.876 1154.48 49.5248 907.124 49.5248 602C49.5248 296.876 296.876 49.5248 602 49.5248C907.124 49.5248 1154.48 296.876 1154.48 602Z"
      stroke="url(#paint17_radial_18_497)"
      strokeWidth="4"
      strokeDasharray="8 8"
    />
    <path
      d="M1178.24 602C1178.24 920.247 920.247 1178.24 602 1178.24C283.753 1178.24 25.7624 920.247 25.7624 602C25.7624 283.753 283.753 25.7624 602 25.7624C920.247 25.7624 1178.24 283.753 1178.24 602Z"
      stroke="url(#paint18_radial_18_497)"
      strokeWidth="4"
      strokeDasharray="8 8"
    />
    <path
      d="M1202 602C1202 933.371 933.371 1202 602 1202C270.629 1202 2 933.371 2 602C2 270.629 270.629 2 602 2C933.371 2 1202 270.629 1202 602Z"
      stroke="url(#paint19_radial_18_497)"
      strokeWidth="4"
      strokeDasharray="8 8"
    />
    <defs>
      <radialGradient
        id="paint0_radial_18_497"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(602 602) rotate(60) scale(608.911)"
      >
        <stop stopColor="#2934D1" stopOpacity="0.26" />
        <stop offset="0.5" stopColor="#2934D1" />
        <stop offset="1" stopColor="#2934D1" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        id="paint1_radial_18_497"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(602 602) rotate(60) scale(608.911)"
      >
        <stop stopColor="#2934D1" stopOpacity="0.26" />
        <stop offset="0.5" stopColor="#2934D1" />
        <stop offset="1" stopColor="#2934D1" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        id="paint2_radial_18_497"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(602 602) rotate(60) scale(608.911)"
      >
        <stop stopColor="#2934D1" stopOpacity="0.26" />
        <stop offset="0.5" stopColor="#2934D1" />
        <stop offset="1" stopColor="#2934D1" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        id="paint3_radial_18_497"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(602 602) rotate(60) scale(608.911)"
      >
        <stop stopColor="#2934D1" stopOpacity="0.26" />
        <stop offset="0.5" stopColor="#2934D1" />
        <stop offset="1" stopColor="#2934D1" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        id="paint4_radial_18_497"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(602 602) rotate(60) scale(608.911)"
      >
        <stop stopColor="#2934D1" stopOpacity="0.26" />
        <stop offset="0.5" stopColor="#2934D1" />
        <stop offset="1" stopColor="#2934D1" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        id="paint5_radial_18_497"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(602 602) rotate(60) scale(608.911)"
      >
        <stop stopColor="#2934D1" stopOpacity="0.26" />
        <stop offset="0.5" stopColor="#2934D1" />
        <stop offset="1" stopColor="#2934D1" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        id="paint6_radial_18_497"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(602 602) rotate(60) scale(608.911)"
      >
        <stop stopColor="#2934D1" stopOpacity="0.26" />
        <stop offset="0.5" stopColor="#2934D1" />
        <stop offset="1" stopColor="#2934D1" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        id="paint7_radial_18_497"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(602 602) rotate(60) scale(608.911)"
      >
        <stop stopColor="#2934D1" stopOpacity="0.26" />
        <stop offset="0.5" stopColor="#2934D1" />
        <stop offset="1" stopColor="#2934D1" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        id="paint8_radial_18_497"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(602 602) rotate(60) scale(608.911)"
      >
        <stop stopColor="#2934D1" stopOpacity="0.26" />
        <stop offset="0.5" stopColor="#2934D1" />
        <stop offset="1" stopColor="#2934D1" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        id="paint9_radial_18_497"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(602 602) rotate(60) scale(608.911)"
      >
        <stop stopColor="#2934D1" stopOpacity="0.26" />
        <stop offset="0.5" stopColor="#2934D1" />
        <stop offset="1" stopColor="#2934D1" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        id="paint10_radial_18_497"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(602 602) rotate(60) scale(608.911)"
      >
        <stop stopColor="#2934D1" stopOpacity="0.26" />
        <stop offset="0.5" stopColor="#2934D1" />
        <stop offset="1" stopColor="#2934D1" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        id="paint11_radial_18_497"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(602 602) rotate(60) scale(608.911)"
      >
        <stop stopColor="#2934D1" stopOpacity="0.26" />
        <stop offset="0.5" stopColor="#2934D1" />
        <stop offset="1" stopColor="#2934D1" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        id="paint12_radial_18_497"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(602 602) rotate(60) scale(608.911)"
      >
        <stop stopColor="#2934D1" stopOpacity="0.26" />
        <stop offset="0.5" stopColor="#2934D1" />
        <stop offset="1" stopColor="#2934D1" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        id="paint13_radial_18_497"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(602 602) rotate(60) scale(608.911)"
      >
        <stop stopColor="#2934D1" stopOpacity="0.26" />
        <stop offset="0.5" stopColor="#2934D1" />
        <stop offset="1" stopColor="#2934D1" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        id="paint14_radial_18_497"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(602 602) rotate(60) scale(608.911)"
      >
        <stop stopColor="#2934D1" stopOpacity="0.26" />
        <stop offset="0.5" stopColor="#2934D1" />
        <stop offset="1" stopColor="#2934D1" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        id="paint15_radial_18_497"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(602 602) rotate(60) scale(608.911)"
      >
        <stop stopColor="#2934D1" stopOpacity="0.26" />
        <stop offset="0.5" stopColor="#2934D1" />
        <stop offset="1" stopColor="#2934D1" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        id="paint16_radial_18_497"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(602 602) rotate(60) scale(608.911)"
      >
        <stop stopColor="#2934D1" stopOpacity="0.26" />
        <stop offset="0.5" stopColor="#2934D1" />
        <stop offset="1" stopColor="#2934D1" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        id="paint17_radial_18_497"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(602 602) rotate(60) scale(608.911)"
      >
        <stop stopColor="#2934D1" stopOpacity="0.26" />
        <stop offset="0.5" stopColor="#2934D1" />
        <stop offset="1" stopColor="#2934D1" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        id="paint18_radial_18_497"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(602 602) rotate(60) scale(608.911)"
      >
        <stop stopColor="#2934D1" stopOpacity="0.26" />
        <stop offset="0.5" stopColor="#2934D1" />
        <stop offset="1" stopColor="#2934D1" stopOpacity="0" />
      </radialGradient>
      <radialGradient
        id="paint19_radial_18_497"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(602 602) rotate(60) scale(608.911)"
      >
        <stop stopColor="#2934D1" stopOpacity="0.26" />
        <stop offset="0.5" stopColor="#2934D1" />
        <stop offset="1" stopColor="#2934D1" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
)

// The ring in border.png opens a hole of radius 218/810 of its own width, so at
// w-[405] the socket has 109 of radius. The pupil travels until its own center
// reaches that rim, which tucks most of it under the ring at full deflection.
const PUPIL_TRAVEL = 109

// Radius of the eyeball the pupil is painted on. Larger than PUPIL_TRAVEL so
// the pupil never reaches the sphere's silhouette, where it would vanish.
const SPHERE = 150

// Distance from the viewer to the eye, for the perspective shrink. Deliberately
// close, so the pupil visibly recedes as it swings out instead of staying flat.
const VIEW = 200

// How far the pointer has to be for the eye to look all the way over.
const reach = () => Math.max(window.innerWidth, window.innerHeight) / 2

const Eye: FC = () => {
  const border = useRef<HTMLImageElement>(null)
  const pupil = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const target = { x: 0, y: 0 }
    const at = { x: 0, y: 0 }
    let frame = 0

    // The border never moves, so its box gives the socket center even while the
    // page scrolls or the pupil is off to one side.
    const look = (event: PointerEvent) => {
      const box = border.current?.getBoundingClientRect()
      if (!box) return

      const dx = event.clientX - (box.left + box.width / 2)
      const dy = event.clientY - (box.top + box.height / 2)
      const distance = Math.hypot(dx, dy)
      if (!distance) return

      const pull = (Math.min(distance, reach()) / reach()) * PUPIL_TRAVEL
      target.x = (dx / distance) * pull
      target.y = (dy / distance) * pull
      if (!frame) frame = requestAnimationFrame(follow)
    }

    // A disc riding on a sphere: turning the eyeball by `tilt` foreshortens the
    // pupil along the direction it travelled, leaving it round across that axis,
    // and carries it `sunk` further from the viewer, which shrinks it.
    const follow = () => {
      at.x += (target.x - at.x) * 0.12
      at.y += (target.y - at.y) * 0.12

      const drift = Math.hypot(at.x, at.y)
      const tilt = Math.asin(Math.min(drift / SPHERE, 1))
      const squash = Math.cos(tilt)
      const sunk = SPHERE * (1 - squash)
      const scale = VIEW / (VIEW + sunk)
      const axis = (Math.atan2(at.y, at.x) * 180) / Math.PI

      if (pupil.current)
        pupil.current.style.transform =
          `translate(${at.x}px, ${at.y}px) scale(${scale}) ` +
          `rotate(${axis}deg) scaleX(${squash}) rotate(${-axis}deg)`

      const settled = Math.hypot(target.x - at.x, target.y - at.y) < 0.05
      frame = settled ? 0 : requestAnimationFrame(follow)
    }

    window.addEventListener("pointermove", look)
    return () => {
      window.removeEventListener("pointermove", look)
      cancelAnimationFrame(frame)
    }
  }, [])

  const className = "absolute top-1/2 left-1/2 -translate-1/2"

  return (
    <>
      <Image className={`${className} w-[237]`} src={eyeBack} alt="Eye Back" />
      <Image
        ref={pupil}
        className={`${className} w-[174] will-change-transform`}
        src={eyePupil}
        alt="Eye Pupil"
      />
      <Image
        ref={border}
        className={`${className} w-[405]`}
        src={eyeBorder}
        alt="Eye Border"
      />
    </>
  )
}

interface CardProps {
  title: string
  description: ReactNode
  className?: string
}

const Card: FC<CardProps> = ({ title, description, className }) => (
  <Glass
    className={`p-4 flex flex-col gap-3 w-[227] h-[324] ${className}`}
    frost={10}
  >
    <h4 className="text-2xl font-bold text-primary">{title}</h4>
    <p className="text-sm">{description}</p>
  </Glass>
)

const Backlight: FC = () => (
  <svg
    width="1011"
    height="865"
    viewBox="0 0 1011 865"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute top-1/2 left-1/2 -translate-1/2 blur-[156px]"
  >
    <mask id="path-1-inside-1_90_70" fill="white">
      <ellipse
        cx="505.303"
        cy="432.079"
        rx="607.31"
        ry="270.173"
        transform="rotate(-38.2994 505.303 432.079)"
      />
    </mask>
    <path
      d="M1010.75 32.9104C991.523 48.0948 972.296 63.2792 953.069 78.4636C967.086 109.509 961.652 144.868 948.419 181.412C886.976 329.672 747.898 457.492 612.01 567.198C525.138 635.649 429.749 694.396 330.929 733.168C237.561 774.305 112.153 778.958 100.264 751.952C72.0061 736.094 101.647 609.176 160.724 524.296C218.664 433.03 295.997 349.241 381.724 275.598C518.095 160.956 684.583 54.4273 852.569 44.9888C893.177 44.4203 930.602 53.9614 953.069 78.4636C972.296 63.2792 991.523 48.0948 1010.75 32.9104C973.423 -19.1769 910.442 -39.2321 857.131 -44.1834C638.922 -53.1642 456.603 50.1625 293.992 164.507C193.081 238.821 100.201 325.577 23.7366 431.649C-14.082 484.986 -48.3632 542.867 -70.9456 612.429C-91.4667 678.842 -108.888 776.311 -42.8718 864.992C26.2133 951.371 126.206 960.134 196.683 957.633C270.784 953.991 336.579 936.005 398.913 913.367C523.21 867.132 633.173 799.827 733.485 721.015C733.485 721.015 733.485 721.015 733.485 721.015C889.643 592.952 1035.55 430.101 1064.06 202.788C1068.33 146.955 1057.38 77.7812 1010.75 32.9104ZM953.069 78.4636L1010.75 32.9104L953.069 78.4636Z"
      fill="#2937FD"
      mask="url(#path-1-inside-1_90_70)"
    />
  </svg>
)

const Fade: FC = () => (
  <svg
    width="470"
    height="726"
    viewBox="0 0 470 726"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/6 blur-[128px]"
  >
    <ellipse cx="235" cy="363" rx="235" ry="363" fill="#FEFEFE" />
  </svg>
)

const Headline: FC = () => (
  <h2 className="text-6xl text-center font-bold absolute top-1/6 left-1/2 -translate-x-1/2 -translate-y-1/4">
    Nada escapa
    <br />
    do <span className="text-primary">oráculo</span>
  </h2>
)

const Oracle: FC = () => (
  <div className="container mt-32">
    <div className="relative">
      <Circles />
      <Backlight />
      <Fade />
      <Eye />
      <Headline />
      <Card
        className="absolute top-1/2 left-1/12 -translate-y-1/2"
        title="Respostas que ajudam de fato"
        description={
          <>
            Nada de bate-papo aberto que erra o alvo. O Oráculo{" "}
            <b>entrega exatamente o que o seu negócio precisa saber</b>, sem
            enrolação e sem achismo.
          </>
        }
      />
      <Card
        className="absolute top-1/2 right-1/12 -translate-y-1/2"
        title="Limitado e com propósito"
        description={
          <>
            Diferente de um agente genérico, o Oráculo foi construído com escopo
            definido, <b>menos é mais quando o objetivo é resultado certeiro</b>
            , não conversa infinita.
          </>
        }
      />
      <Card
        className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/12"
        title="Direto ao ponto do seu negócio"
        description={
          <>
            Treinado com o contexto real da sua empresa, o Oráculo enxerga
            exatamente onde procurar e{" "}
            <b>entrega a resposta certa na velocidade que o negócio exige</b>.
          </>
        }
      />
    </div>
  </div>
)

export default Oracle
