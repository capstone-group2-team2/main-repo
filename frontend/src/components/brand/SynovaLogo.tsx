import { cn } from "@/lib/utils"

export function SynovaLogo({
  className,
  showWordmark = true,
  tone = "brand",
}: {
  className?: string
  showWordmark?: boolean
  tone?: "brand" | "customer" | "employee" | "light"
}) {
  const gradient =
    tone === "employee"
      ? "from-emerald-500 to-teal-500"
      : tone === "customer"
        ? "from-blue-600 to-sky-500"
        : tone === "light"
          ? "from-white to-white/80"
          : "from-blue-600 to-violet-600"

  const text =
    tone === "light" ? "text-white" : "text-slate-900"

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br shadow-md",
          gradient,
        )}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none">
          <circle cx="12" cy="7" r="2.2" fill="currentColor" />
          <circle cx="6.5" cy="16" r="2.2" fill="currentColor" opacity="0.9" />
          <circle cx="17.5" cy="16" r="2.2" fill="currentColor" opacity="0.9" />
          <path
            d="M12 9.2v4.2M12 13.4 8.2 16M12 13.4l3.8 2.6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {showWordmark && (
        <span className={cn("font-[Outfit] text-xl font-bold tracking-tight", text)}>
          Synova
        </span>
      )}
    </div>
  )
}
