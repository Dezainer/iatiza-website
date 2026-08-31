"use client"

import {
  FC,
  Suspense,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, Lightformer, useGLTF } from "@react-three/drei"
import {
  BackSide,
  BufferAttribute,
  CanvasTexture,
  DataTexture,
  LinearFilter,
  LinearMipmapLinearFilter,
  MathUtils,
  Matrix4,
  RepeatWrapping,
  SRGBColorSpace,
  Vector3,
  type BufferGeometry,
  type Group,
  type Mesh,
} from "three"

/* -------------------------------------------------------------------------
 * Wordmark
 * ---------------------------------------------------------------------- */

const VIEW_WIDTH = 1200
const VIEW_HEIGHT = 269

/** "Potencial" — one path per letter, drawn in the wordmark's viewBox units. */
const LETTERS = [
  // P
  "M43.0928 81.179C47.2928 74.6242 53.0889 69.3299 60.4811 65.2962C67.8732 61.2624 76.5254 59.2456 86.4375 59.2456C98.0297 59.2456 108.53 62.1868 117.938 68.0694C127.346 73.9519 134.738 82.3555 140.114 93.2802C145.659 104.205 148.431 116.894 148.431 131.349C148.431 145.803 145.659 158.576 140.114 169.669C134.738 180.594 127.346 189.082 117.938 195.132C108.53 201.015 98.0297 203.956 86.4375 203.956C76.6934 203.956 68.0412 201.939 60.4811 197.905C53.0889 193.872 47.2928 188.661 43.0928 182.275V269H0V61.2624H43.0928V81.179ZM104.582 131.349C104.582 120.592 101.558 112.188 95.5097 106.138C89.6296 99.9191 82.3215 96.8098 73.5853 96.8098C65.0171 96.8098 57.709 99.9191 51.6609 106.138C45.7808 112.356 42.8408 120.844 42.8408 131.601C42.8408 142.357 45.7808 150.845 51.6609 157.064C57.709 163.282 65.0171 166.392 73.5853 166.392C82.1535 166.392 89.4616 163.282 95.5097 157.064C101.558 150.677 104.582 142.105 104.582 131.349Z",
  // o — the lock hangs here
  "M235.047 203.956C221.271 203.956 208.839 201.015 197.751 195.132C186.83 189.25 178.178 180.846 171.794 169.921C165.578 158.997 162.47 146.223 162.47 131.601C162.47 117.147 165.662 104.457 172.046 93.5323C178.43 82.4396 187.166 73.9519 198.255 68.0694C209.343 62.1868 221.775 59.2456 235.551 59.2456C249.328 59.2456 261.76 62.1868 272.848 68.0694C283.936 73.9519 292.672 82.4396 299.056 93.5323C305.441 104.457 308.633 117.147 308.633 131.601C308.633 146.055 305.357 158.829 298.804 169.921C292.42 180.846 283.6 189.25 272.344 195.132C261.256 201.015 248.824 203.956 235.047 203.956ZM235.047 166.644C243.279 166.644 250.252 163.619 255.964 157.568C261.844 151.517 264.784 142.862 264.784 131.601C264.784 120.34 261.928 111.684 256.216 105.634C250.672 99.583 243.783 96.5577 235.551 96.5577C227.151 96.5577 220.179 99.583 214.635 105.634C209.091 111.516 206.319 120.172 206.319 131.601C206.319 142.862 209.007 151.517 214.383 157.568C219.927 163.619 226.815 166.644 235.047 166.644Z",
  // t
  "M409.868 165.383V201.939H387.943C372.319 201.939 360.139 198.157 351.402 190.594C342.666 182.863 338.298 170.341 338.298 153.03V97.0619H321.162V61.2624H338.298V26.9756H381.391V61.2624H409.616V97.0619H381.391V153.534C381.391 157.736 382.399 160.761 384.415 162.61C386.431 164.459 389.791 165.383 394.495 165.383H409.868Z",
  // e
  "M566.425 129.332C566.425 133.366 566.173 137.567 565.669 141.937H468.144C468.816 150.677 471.588 157.4 476.46 162.106C481.5 166.644 487.632 168.913 494.856 168.913C505.608 168.913 513.084 164.375 517.284 155.299H563.149C560.797 164.543 556.513 172.863 550.297 180.258C544.249 187.653 536.605 193.451 527.365 197.653C518.124 201.855 507.792 203.956 496.368 203.956C482.592 203.956 470.328 201.015 459.575 195.132C448.823 189.25 440.423 180.846 434.375 169.921C428.327 158.997 425.303 146.223 425.303 131.601C425.303 116.978 428.243 104.205 434.123 93.2802C440.171 82.3555 448.571 73.9519 459.323 68.0694C470.076 62.1868 482.424 59.2456 496.368 59.2456C509.976 59.2456 522.073 62.1028 532.657 67.8173C543.241 73.5317 551.473 81.6832 557.353 92.2718C563.401 102.86 566.425 115.214 566.425 129.332ZM522.325 117.987C522.325 110.592 519.805 104.709 514.764 100.339C509.724 95.9694 503.424 93.7845 495.864 93.7845C488.64 93.7845 482.508 95.8854 477.468 100.087C472.596 104.289 469.572 110.256 468.396 117.987H522.325Z",
  // n
  "M674.84 59.7498C691.305 59.7498 704.409 65.1281 714.153 75.8847C724.065 86.4733 729.021 101.096 729.021 119.752V201.939H686.181V125.55C686.181 116.138 683.745 108.827 678.872 103.617C674 98.4064 667.448 95.8013 659.216 95.8013C650.984 95.8013 644.432 98.4064 639.56 103.617C634.688 108.827 632.252 116.138 632.252 125.55V201.939H589.159V61.2624H632.252V79.9185C636.62 73.6998 642.5 68.8257 649.892 65.2962C657.284 61.5986 665.6 59.7498 674.84 59.7498Z",
  // c
  "M750.398 131.601C750.398 116.978 753.338 104.205 759.219 93.2802C765.267 82.3555 773.583 73.9519 784.167 68.0694C794.919 62.1868 807.183 59.2456 820.96 59.2456C838.6 59.2456 853.3 63.8675 865.06 73.1115C876.989 82.3555 884.801 95.3811 888.497 112.188H842.632C838.768 101.432 831.292 96.0534 820.204 96.0534C812.307 96.0534 806.007 99.1628 801.303 105.381C796.599 111.432 794.247 120.172 794.247 131.601C794.247 143.03 796.599 151.854 801.303 158.072C806.007 164.123 812.307 167.148 820.204 167.148C831.292 167.148 838.768 161.77 842.632 151.013H888.497C884.801 167.484 876.989 180.426 865.06 189.838C853.132 199.25 838.432 203.956 820.96 203.956C807.183 203.956 794.919 201.015 784.167 195.132C773.583 189.25 765.267 180.846 759.219 169.921C753.338 158.997 750.398 146.223 750.398 131.601Z",
  // i
  "M933.22 46.6401C925.66 46.6401 919.443 44.4552 914.571 40.0853C909.867 35.5473 907.515 30.0009 907.515 23.4461C907.515 16.7232 909.867 11.1768 914.571 6.80694C919.443 2.26898 925.66 0 933.22 0C940.612 0 946.66 2.26898 951.364 6.80694C956.236 11.1768 958.672 16.7232 958.672 23.4461C958.672 30.0009 956.236 35.5473 951.364 40.0853C946.66 44.4552 940.612 46.6401 933.22 46.6401ZM954.64 61.2624V201.939H911.547V61.2624H954.64Z",
  // a
  "M977.301 131.349C977.301 116.894 979.989 104.205 985.365 93.2802C990.909 82.3555 998.385 73.9519 1007.79 68.0694C1017.2 62.1868 1027.7 59.2456 1039.29 59.2456C1049.21 59.2456 1057.86 61.2624 1065.25 65.2962C1072.81 69.3299 1078.61 74.6242 1082.64 81.179V61.2624H1125.73V201.939H1082.64V182.023C1078.44 188.577 1072.56 193.872 1065 197.905C1057.61 201.939 1048.95 203.956 1039.04 203.956C1027.62 203.956 1017.2 201.015 1007.79 195.132C998.385 189.082 990.909 180.594 985.365 169.669C979.989 158.576 977.301 145.803 977.301 131.349ZM1082.64 131.601C1082.64 120.844 1079.61 112.356 1073.57 106.138C1067.69 99.9191 1060.46 96.8098 1051.89 96.8098C1043.33 96.8098 1036.02 99.9191 1029.97 106.138C1024.09 112.188 1021.15 120.592 1021.15 131.349C1021.15 142.105 1024.09 150.677 1029.97 157.064C1036.02 163.282 1043.33 166.392 1051.89 166.392C1060.46 166.392 1067.69 163.282 1073.57 157.064C1079.61 150.845 1082.64 142.357 1082.64 131.601Z",
  // l
  "M1200 15.3786V201.939H1156.91V15.3786H1200Z",
]

const LETTER_FILL = "var(--primary)"

/** The lock hangs from the second letter, the "o". */
const HOOK_LETTER = 1

/**
 * Where the shackle rests, and the point the lock swings around: just inside
 * the "o"'s top stroke, dead centre. The ring spans x 162.5–308.6 and its top
 * stroke runs from y 59.2 to y 96.6; hooking a little below the top of that
 * bar leaves only the crown of the arch showing above the letter, which is
 * what reads as hooked over the ring rather than perched on it. Raise HOOK_Y
 * to lift the lock and expose more of the arch, lower it to tuck the arch
 * further behind the letter.
 */
const HOOK_X = (162.47 + 308.63) / 2
const HOOK_Y = 166

/**
 * The underside of that same top stroke. Everything above this line is drawn a
 * second time on top of the canvas, so the shackle passes *behind* the ring
 * rather than floating in front of it — that occlusion is what sells the lock
 * as hanging on the letter.
 */
const HOOK_STROKE_BOTTOM = 250

/**
 * How tall the lock is drawn, in viewBox units — the wordmark itself is 269.
 * The shackle has to straddle the ~37 unit thick top stroke of the "o", so
 * shrinking this much stops reading as "hooked on": the arch stops clearing
 * the letter.
 */
const LOCK_HEIGHT = 400

/**
 * How much taller than the wordmark the canvas is, so a lock this size can
 * hang below the baseline without being clipped.
 */
const CANVAS_HEIGHT = 1000

/* -------------------------------------------------------------------------
 * Swing
 * ---------------------------------------------------------------------- */

/** Pendulum frequency in Hz — slower than a real padlock, easier on the eye. */
const SWING_HZ = 0.5
const SWING_OMEGA = 2 * Math.PI * SWING_HZ

/** Fraction of critical damping: low enough that a swing takes ~10s to die. */
const SWING_DAMPING = 0.06

/** The lock arrives already in motion, as if it was just hung up (radians). */
const SWING_START_ANGLE = 0.26

/**
 * A wandering draught, in rad/s². Both frequencies sit well below SWING_OMEGA
 * so it nudges rather than resonates, and the lock never quite settles.
 */
const BREEZE = 0.35

const useReducedMotion = () => {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(query.matches)

    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  return reduced
}

/* -------------------------------------------------------------------------
 * Studio
 * ---------------------------------------------------------------------- */

/**
 * The backdrop the chrome reflects, top to bottom. A mirror only reads as a
 * mirror if there is something structured to mirror: a bright ceiling, a crisp
 * horizon, a dark floor. Without this the shackle just samples flat grey and
 * comes out looking like black and white plastic.
 */
const BACKDROP_STOPS: [number, string][] = [
  [0, "#dfe5f0"],
  [0.38, "#ffffff"],
  [0.5, "#c4cbd9"],
  [0.53, "#575e6e"],
  [0.72, "#1e212a"],
  [1, "#0b0d11"],
]

const useBackdrop = () =>
  useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 4
    canvas.height = 512

    const context = canvas.getContext("2d")!
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height)
    for (const [offset, color] of BACKDROP_STOPS) {
      gradient.addColorStop(offset, color)
    }
    context.fillStyle = gradient
    context.fillRect(0, 0, canvas.width, canvas.height)

    const texture = new CanvasTexture(canvas)
    texture.colorSpace = SRGBColorSpace
    return texture
  }, [])

/**
 * Resolution of the grain textures, and how they tile across the model's UVs.
 * The two maps deliberately tile at different rates, with the normals turned
 * against the roughness, so the two patterns only line up again every 35
 * tiles — long past the edge of the model, which is what stops a repeat this
 * tight from reading as a printed pattern.
 */
const GRAIN_SIZE = 256
const GRAIN_ROUGHNESS_REPEAT = 5
const GRAIN_NORMAL_REPEAT = 7
const GRAIN_NORMAL_ROTATION = 0.7

/** How steep the grain's slopes are before they get encoded as normals. */
const GRAIN_RELIEF = 5

/**
 * A tileable height field: three octaves of value noise. One field feeds both
 * grain maps, so the bumps and the dull patches line up the way they do on a
 * real moulded surface.
 */
const noiseField = (size: number) => {
  const octave = (period: number, seed: number) => {
    const lattice = new Float32Array(period * period)
    for (let i = 0; i < lattice.length; i++) {
      const noise = Math.sin((i + 1) * 127.1 + seed * 311.7) * 43758.5453
      lattice[i] = noise - Math.floor(noise)
    }

    const wrap = (value: number) => ((value % period) + period) % period
    const corner = (x: number, y: number) => lattice[wrap(y) * period + wrap(x)]
    const ease = (t: number) => t * t * (3 - 2 * t)

    return (x: number, y: number) => {
      const fx = (x * period) / size
      const fy = (y * period) / size
      const x0 = Math.floor(fx)
      const y0 = Math.floor(fy)
      const u = ease(fx - x0)
      const v = ease(fy - y0)
      const top = corner(x0, y0) + (corner(x0 + 1, y0) - corner(x0, y0)) * u
      const bottom =
        corner(x0, y0 + 1) + (corner(x0 + 1, y0 + 1) - corner(x0, y0 + 1)) * u
      return top + (bottom - top) * v
    }
  }

  /* Fine periods on purpose: at this size the texture is minified hard, and
     coarse octaves are exactly the blobs that survive to look repetitive. */
  const octaves = [octave(32, 1), octave(88, 2), octave(200, 3)]
  const field = new Float32Array(size * size)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      field[y * size + x] =
        octaves[0](x, y) * 0.5 +
        octaves[1](x, y) * 0.34 +
        octaves[2](x, y) * 0.16
    }
  }

  return field
}

/**
 * Micro-surface for both materials, built in memory rather than shipped as an
 * image. The normal map breaks up the highlights, the roughness map keeps the
 * rubber from reading as one solid slab of colour.
 */
const useGrain = () =>
  useMemo(() => {
    const size = GRAIN_SIZE
    const field = noiseField(size)
    const wrap = (value: number) => ((value % size) + size) % size
    const height = (x: number, y: number) => field[wrap(y) * size + wrap(x)]

    const normals = new Uint8Array(size * size * 4)
    const roughness = new Uint8Array(size * size * 4)

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4

        /* Central differences give the slope; encode it the way a tangent
           space normal map does, with +Z out of the surface. */
        const slopeX = -(height(x + 1, y) - height(x - 1, y)) * GRAIN_RELIEF
        const slopeY = -(height(x, y + 1) - height(x, y - 1)) * GRAIN_RELIEF
        const length = Math.sqrt(slopeX * slopeX + slopeY * slopeY + 1)

        normals[i] = ((slopeX / length) * 0.5 + 0.5) * 255
        normals[i + 1] = ((slopeY / length) * 0.5 + 0.5) * 255
        normals[i + 2] = ((1 / length) * 0.5 + 0.5) * 255
        normals[i + 3] = 255

        /* Multiplied onto each material's own roughness, so this only ever
           polishes patches rather than setting the overall finish. The wider
           the range, the more the highlights break up. */
        const patch = (0.6 + height(x, y) * 0.4) * 255
        roughness[i] = patch
        roughness[i + 1] = patch
        roughness[i + 2] = patch
        roughness[i + 3] = 255
      }
    }

    const toTexture = (data: Uint8Array, repeat: number, rotation = 0) => {
      const texture = new DataTexture(data, size, size)
      texture.wrapS = RepeatWrapping
      texture.wrapT = RepeatWrapping
      texture.repeat.set(repeat, repeat)
      texture.center.set(0.5, 0.5)
      texture.rotation = rotation
      texture.magFilter = LinearFilter
      texture.minFilter = LinearMipmapLinearFilter
      texture.generateMipmaps = true
      texture.anisotropy = 4
      texture.needsUpdate = true
      return texture
    }

    return {
      normalMap: toTexture(normals, GRAIN_NORMAL_REPEAT, GRAIN_NORMAL_ROTATION),
      roughnessMap: toTexture(roughness, GRAIN_ROUGHNESS_REPEAT),
    }
  }, [])

/**
 * Three-point rig plus the environment. The rubber is shaped almost entirely
 * by the direct lights; the chrome is almost entirely the environment, since a
 * metal has no diffuse response to shape.
 */
const Studio: FC = () => {
  const backdrop = useBackdrop()

  return (
    <>
      <ambientLight intensity={0.15} />
      {/* Key, high and to the right, warm. */}
      <directionalLight position={[6, 5, 6]} intensity={3} color="#fff5ea" />
      {/* Fill from the left, cool and weak, so the shadow side keeps detail. */}
      <directionalLight position={[-7, 1, 4]} intensity={4} color="#dbe6ff" />
      {/* Rim from behind, which is what separates the black body from a white
          page instead of letting it go flat. */}
      <directionalLight position={[-4, 3, -6]} intensity={10} />

      <Environment resolution={512}>
        <mesh scale={100}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial
            map={backdrop}
            side={BackSide}
            toneMapped={false}
          />
        </mesh>

        {/* Key softbox — the broad highlight running down the shackle. */}
        <Lightformer
          form="rect"
          intensity={0}
          color="#fff6ec"
          position={[6, 4, 4]}
          scale={[8, 12, 1]}
          target={[0, 0, 0]}
        />
        {/* A narrow strip close in: the hard bright line that reads as polish. */}
        <Lightformer
          form="rect"
          intensity={50}
          position={[-5, 1, 5]}
          scale={[0.7, 10, 1]}
          target={[0, 0, 0]}
        />
        {/* Overhead bank. */}
        <Lightformer
          form="rect"
          intensity={0}
          rotation-x={Math.PI / 2}
          position={[0, 9, 1]}
          scale={[14, 8, 1]}
        />
        {/* Cool kicker from behind, to keep the dark half from going empty. */}
        <Lightformer
          form="rect"
          intensity={2}
          color="#cfe0ff"
          position={[-3, -2, -6]}
          scale={[8, 8, 1]}
          target={[0, 0, 0]}
        />
      </Environment>
    </>
  )
}

/* -------------------------------------------------------------------------
 * Lock
 * ---------------------------------------------------------------------- */

useGLTF.preload("/lock.glb")

/**
 * The lock faces down the X axis in the GLB, so turn it toward the camera —
 * then keep turning. Dead face-on, the shackle is a flat loop pasted over the
 * letter; at an angle you see around the arch and it reads as wrapped around
 * the ring. Both rotations are around Y, which leaves every height below
 * untouched.
 */
const FACE_CAMERA_Y = -Math.PI / 2
const LOCK_YAW = Math.PI / 5
const ORIENTATION_Y = FACE_CAMERA_Y + LOCK_YAW
const ORIENTATION = new Matrix4().makeRotationY(ORIENTATION_Y)

/**
 * Measures the model once it has loaded, so the constants above can be written
 * in viewBox units instead of whatever scale the GLB happens to use. Heights
 * are read off the model's own frame — a yaw can't change them — while the
 * horizontal centre has to come from the turned pose that actually gets drawn.
 */
const useLockRig = (base: Mesh, shackle: Mesh) =>
  useMemo(() => {
    const boxOf = (mesh: Mesh) => {
      mesh.geometry.computeBoundingBox()
      return mesh.geometry.boundingBox!.clone().translate(mesh.position)
    }

    const shackleBox = boxOf(shackle)
    const bounds = boxOf(base).union(shackleBox)
    const turned = bounds.clone().applyMatrix4(ORIENTATION)

    return {
      height: bounds.max.y - bounds.min.y,
      centerX: (turned.min.x + turned.max.x) / 2,
      /* The bit that actually rests on the letter is the inside of the arch:
         one tube diameter — the shackle's thickness, its shortest axis — below
         its top. */
      hookY: shackleBox.max.y - (shackleBox.max.x - shackleBox.min.x),
    }
  }, [base, shackle])

/**
 * Faces meeting more sharply than this keep their own normals. Everything on
 * the body is a bevel — its sharpest edge is only 60° — so this sits above
 * that and rounds all of them off, while the 90° cuts at the ends of the
 * shackle's legs stay crisp.
 */
const CREASE_ANGLE = MathUtils.degToRad(75)

/**
 * Re-shades a mesh smoothly. The GLB is exported flat shaded — the shackle
 * holds 1416 vertices over 360 distinct positions, every facet carrying its
 * own normal — and a shiny finish draws every one of those seams, which is
 * what makes each step around a curve or a bevel visible. Averaging the
 * normals of faces that meet gently, while leaving anything sharper alone,
 * rounds the steps off without melting genuine edges.
 *
 * The silhouettes need no help: at this size their facets land at about a
 * third of a pixel, so it was only ever the shading that gave the low poly
 * away.
 */
const useSmoothGeometry = (geometry: BufferGeometry) =>
  useMemo(() => {
    /* Non-indexed, so every triangle corner owns the normal written to it. */
    const smooth = geometry.toNonIndexed()
    const position = smooth.getAttribute("position")
    const corners = position.count

    const a = new Vector3()
    const edge = new Vector3()
    const other = new Vector3()

    const faces = Array.from({ length: corners / 3 }, (_, face) => {
      a.fromBufferAttribute(position, face * 3)
      edge.fromBufferAttribute(position, face * 3 + 1).sub(a)
      other.fromBufferAttribute(position, face * 3 + 2).sub(a)
      return edge.cross(other).normalize().clone()
    })

    /* Corners sharing a position are the ones with a say in each other. */
    const keys = new Array<string>(corners)
    const sharing = new Map<string, number[]>()

    for (let corner = 0; corner < corners; corner++) {
      const key = [
        position.getX(corner),
        position.getY(corner),
        position.getZ(corner),
      ]
        .map((value) => value.toFixed(4))
        .join("|")

      keys[corner] = key
      const group = sharing.get(key)

      if (group) group.push(corner)
      else sharing.set(key, [corner])
    }

    const normals = new Float32Array(corners * 3)
    const blended = new Vector3()
    const limit = Math.cos(CREASE_ANGLE)

    for (let corner = 0; corner < corners; corner++) {
      const own = faces[(corner / 3) | 0]
      blended.set(0, 0, 0)

      for (const neighbour of sharing.get(keys[corner])!) {
        const normal = faces[(neighbour / 3) | 0]
        if (normal.dot(own) >= limit) blended.add(normal)
      }

      blended.normalize().toArray(normals, corner * 3)
    }

    smooth.setAttribute("normal", new BufferAttribute(normals, 3))

    return smooth
  }, [geometry])

const HangingLock: FC = () => {
  const { nodes } = useGLTF("/lock.glb") as unknown as {
    nodes: { Base: Mesh; Shacle: Mesh }
  }

  /* Note the GLB spells the shackle node "Shacle". */
  const rig = useLockRig(nodes.Base, nodes.Shacle)
  const shackle = useSmoothGeometry(nodes.Shacle.geometry)
  const base = useSmoothGeometry(nodes.Base.geometry)
  const grain = useGrain()
  const size = useThree((state) => state.size)
  const reducedMotion = useReducedMotion()

  const swing = useRef<Group>(null)
  const angle = useRef(SWING_START_ANGLE)
  const angularVelocity = useRef(0)

  /* The canvas covers exactly the wordmark's box and its camera is orthographic
     at zoom 1, so one world unit is one pixel — which makes one viewBox unit
     this many world units. */
  const unit = size.width / VIEW_WIDTH

  useFrame((state, delta) => {
    if (!swing.current) return

    if (reducedMotion) {
      angle.current = 0
      angularVelocity.current = 0
      swing.current.rotation.z = 0
      return
    }

    /* Damped pendulum, plus the draught. Semi-implicit Euler is plenty at this
       frequency; the clamp keeps a dropped frame from launching the lock. */
    const step = Math.min(delta, 1 / 30)
    const time = state.clock.elapsedTime
    const breeze =
      (Math.sin(time * 0.63) + Math.sin(time * 0.27 + 2.1)) * BREEZE
    const acceleration =
      -(SWING_OMEGA ** 2) * Math.sin(angle.current) -
      2 * SWING_DAMPING * SWING_OMEGA * angularVelocity.current +
      breeze

    angularVelocity.current += acceleration * step
    angle.current += angularVelocity.current * step
    swing.current.rotation.z = angle.current
  })

  return (
    /* Pivot: the hook point, in world units, measured from the canvas centre. */
    <group
      position={[
        HOOK_X * unit - size.width / 2,
        size.height / 2 - HOOK_Y * unit,
        0,
      ]}
    >
      <group ref={swing} rotation={[0, 0, SWING_START_ANGLE]}>
        <group scale={(unit * LOCK_HEIGHT) / rig.height}>
          {/* Hang the model off its hook point rather than its origin. */}
          <group position={[-rig.centerX, -rig.hookY, 0]}>
            <group rotation={[0, ORIENTATION_Y, 0]}>
              {/* Shackle — polished chrome. Not a perfect mirror: a little
                  roughness and a whisper of grain give the reflections an edge
                  to catch on, which is what stops chrome looking like paint. */}
              <mesh geometry={shackle} position={nodes.Shacle.position}>
                <meshStandardMaterial
                  color="#eceff4"
                  metalness={1}
                  roughness={0.16}
                  roughnessMap={grain.roughnessMap}
                  normalMap={grain.normalMap}
                  normalScale={[0.08, 0.08]}
                  envMapIntensity={1.4}
                />
              </mesh>

              {/* Base — nearly black, with the form carried by highlights
                  rather than by lit surface. The clearcoat is a dielectric
                  layer, so its specular stays white however dark the body
                  underneath goes: that is what keeps the accents bright while
                  the body itself drops away. */}
              <mesh geometry={base} position={nodes.Base.position}>
                <meshPhysicalMaterial
                  color="#07080b"
                  metalness={0.3}
                  roughness={0.55}
                  roughnessMap={grain.roughnessMap}
                  normalMap={grain.normalMap}
                  normalScale={[0.4, 0.4]}
                  clearcoat={0.45}
                  clearcoatRoughness={0.35}
                  envMapIntensity={1.3}
                />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

/* -------------------------------------------------------------------------
 * Composition
 * ---------------------------------------------------------------------- */

const LockedWordmark: FC = () => {
  const clipId = useId()

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Potencial"
        className="block h-auto w-full"
      >
        {LETTERS.map((d, index) => (
          <path key={index} d={d} fill={LETTER_FILL} />
        ))}
      </svg>

      <Canvas
        dpr={[1, 2]}
        orthographic
        gl={{ antialias: true, toneMappingExposure: 1.15 }}
        camera={{ position: [0, 0, 100], zoom: 1, near: 0.1, far: 1000 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "auto",
          aspectRatio: `${VIEW_WIDTH} / ${CANVAS_HEIGHT}`,
          pointerEvents: "none",
        }}
      >
        {/* Lights and reflections, all built in-scene — no HDRI fetched from
            a CDN. */}
        <Studio />

        <Suspense fallback={null}>
          <HangingLock />
        </Suspense>
      </Canvas>

      {/* The hooked letter again, clipped to its top stroke, so the shackle
          runs behind the ring. */}
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="pointer-events-none absolute inset-0 block h-full w-full"
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={235} y={0} width={100} height={HOOK_STROKE_BOTTOM} />
          </clipPath>
        </defs>
        <path
          d={LETTERS[HOOK_LETTER]}
          fill={LETTER_FILL}
          clipPath={`url(#${clipId})`}
        />
      </svg>
    </div>
  )
}

const Hero: FC = () => (
  <div className="container pt-16">
    <LockedWordmark />
  </div>
)

export default Hero
