import DoodleWallpaper from "./DoodleWallpaper"

export default function PageShell({
  children,
  variant,
  theme = "dark",
  className = "",
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <DoodleWallpaper variant={variant} theme={theme} />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
