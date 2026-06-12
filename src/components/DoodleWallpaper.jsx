const SIZE = 300

const WALLPAPER_THEMES = {
  dark: {
    base: "linear-gradient(145deg, #1a0c10 0%, #2d1520 35%, #1f1018 70%, #140a0e 100%)",
    patternOpacity: 0.5,
    palette: ["#F4A7B9", "#FFD6A8", "#FFFFFF", "#E8C4A0", "#D48BA0"],
    fillOpacity: 0.12,
    strokeWidth: 1.4,
  },
  light: {
    base: "linear-gradient(145deg, #FFF9F5 0%, #FDEEE6 40%, #FFF5EE 70%, #FCE8DF 100%)",
    patternOpacity: 0.55,
    palette: ["#B76E79", "#D4B896", "#9B4D58", "#E8889A", "#7A4A52"],
    fillOpacity: 0.13,
    strokeWidth: 1.4,
  },
}

function DoodleGroup({ color, fillOpacity, strokeWidth, transform, children }) {
  return (
    <g
      transform={transform}
      stroke={color}
      fill={color}
      fillOpacity={fillOpacity}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </g>
  )
}

function NailPolish({ color, fillOpacity, strokeWidth, transform }) {
  return (
    <DoodleGroup color={color} fillOpacity={fillOpacity} strokeWidth={strokeWidth} transform={transform}>
      <rect x="4" y="14" width="12" height="22" rx="3" />
      <rect x="6" y="8" width="8" height="7" rx="1" />
      <line x1="10" y1="2" x2="10" y2="8" />
      <rect x="8" y="0" width="4" height="3" rx="1" />
    </DoodleGroup>
  )
}

function Scissors({ color, fillOpacity, strokeWidth, transform }) {
  return (
    <DoodleGroup color={color} fillOpacity={fillOpacity} strokeWidth={strokeWidth} transform={transform}>
      <circle cx="4" cy="4" r="4" fillOpacity={fillOpacity * 0.5} />
      <circle cx="4" cy="20" r="4" fillOpacity={fillOpacity * 0.5} />
      <line x1="7" y1="7" x2="24" y2="24" />
      <line x1="7" y1="17" x2="24" y2="0" />
    </DoodleGroup>
  )
}

function Tweezers({ color, fillOpacity, strokeWidth, transform }) {
  return (
    <DoodleGroup color={color} fillOpacity={fillOpacity} strokeWidth={strokeWidth} transform={transform}>
      <path d="M4 0 Q4 18 8 24 Q12 18 12 0" fill="none" />
      <path d="M7 24 Q8 28 9 24" />
    </DoodleGroup>
  )
}

function PolishRemover({ color, fillOpacity, strokeWidth, transform }) {
  return (
    <DoodleGroup color={color} fillOpacity={fillOpacity} strokeWidth={strokeWidth} transform={transform}>
      <rect x="2" y="10" width="18" height="24" rx="3" />
      <rect x="6" y="5" width="10" height="6" rx="2" />
      <rect x="8" y="2" width="6" height="4" rx="1" />
      <line x1="6" y1="18" x2="16" y2="18" />
      <line x1="6" y1="22" x2="14" y2="22" />
    </DoodleGroup>
  )
}

function NailClipper({ color, fillOpacity, strokeWidth, transform }) {
  return (
    <DoodleGroup color={color} fillOpacity={fillOpacity} strokeWidth={strokeWidth} transform={transform}>
      <rect x="0" y="8" width="28" height="8" rx="2" />
      <path d="M4 8 Q14 0 24 8" fill="none" />
      <path d="M4 16 Q14 24 24 16" fill="none" />
      <rect x="11" y="4" width="6" height="5" rx="1" />
    </DoodleGroup>
  )
}

function NailFile({ color, fillOpacity, strokeWidth, transform }) {
  return (
    <DoodleGroup color={color} fillOpacity={fillOpacity} strokeWidth={strokeWidth} transform={transform}>
      <rect x="0" y="0" width="6" height="28" rx="3" />
      <line x1="2" y1="5" x2="4" y2="5" />
      <line x1="2" y1="9" x2="4" y2="9" />
      <line x1="2" y1="13" x2="4" y2="13" />
      <line x1="2" y1="17" x2="4" y2="17" />
      <line x1="2" y1="21" x2="4" y2="21" />
    </DoodleGroup>
  )
}

function Flower({ color, fillOpacity, strokeWidth, transform }) {
  return (
    <DoodleGroup color={color} fillOpacity={fillOpacity} strokeWidth={strokeWidth} transform={transform}>
      <circle cx="8" cy="8" r="3" />
      <circle cx="8" cy="2" r="2" />
      <circle cx="8" cy="14" r="2" />
      <circle cx="2" cy="8" r="2" />
      <circle cx="14" cy="8" r="2" />
      <circle cx="3" cy="3" r="1.5" />
      <circle cx="13" cy="3" r="1.5" />
      <circle cx="3" cy="13" r="1.5" />
      <circle cx="13" cy="13" r="1.5" />
    </DoodleGroup>
  )
}

function Sparkle({ color, fillOpacity, strokeWidth, transform }) {
  return (
    <DoodleGroup color={color} fillOpacity={fillOpacity} strokeWidth={strokeWidth} transform={transform}>
      <path d="M6 0l1.5 4.5L12 6l-4.5 1.5L6 12l-1.5-4.5L0 6l4.5-1.5z" />
    </DoodleGroup>
  )
}

// All available components
const COMPONENTS = [
  NailPolish,
  Scissors,
  Tweezers,
  PolishRemover,
  NailClipper,
  NailFile,
  Flower,
  Sparkle,
]

// Seeded pseudo-random so pattern is consistent (no re-renders flickering)
function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function PatternContent({ variant, palette, fillOpacity, strokeWidth }) {
  const rand = seededRandom(variant.split("").reduce((a, c) => a + c.charCodeAt(0), 42))

  const items = Array.from({ length: 8 }, (_, i) => {
    const Component = COMPONENTS[Math.floor(rand() * COMPONENTS.length)]
    const x = 10 + rand() * 260
    const y = 10 + rand() * 260
    const rotation = Math.floor(rand() * 60) - 30
    const scale = 0.75 + rand() * 0.45
    const colorIndex = Math.floor(rand() * palette.length)

    return { Component, x, y, rotation, scale, colorIndex, key: i }
  })

  return (
    <>
      {items.map(({ Component, x, y, rotation, scale, colorIndex, key }) => (
        <Component
          key={key}
          color={palette[colorIndex]}
          fillOpacity={fillOpacity}
          strokeWidth={strokeWidth}
          transform={`translate(${x},${y}) scale(${scale}) rotate(${rotation})`}
        />
      ))}
    </>
  )
}

export default function DoodleWallpaper({ variant = "home-hero", theme = "dark" }) {
  const config = WALLPAPER_THEMES[theme] ?? WALLPAPER_THEMES.dark
  const patternId = `doodle-${variant}-${theme}`

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: config.base }} />
      <svg
        className="absolute inset-0 h-full w-full"
        style={{ opacity: config.patternOpacity }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width={SIZE}
            height={SIZE}
            patternUnits="userSpaceOnUse"
          >
            <PatternContent
              variant={variant}
              palette={config.palette}
              fillOpacity={config.fillOpacity}
              strokeWidth={config.strokeWidth}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  )
}