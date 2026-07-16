import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function LoadingState({
  label = "Processing…",
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-sm text-slate-500",
        className,
      )}
    >
      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      {label}
    </div>
  )
}

export function EmptyState({
  title,
  description,
  className,
}: {
  title: string
  description: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center",
        className,
      )}
    >
      <p className="font-[Outfit] text-base font-semibold text-slate-800">{title}</p>
      <p className="max-w-sm text-sm text-slate-500">{description}</p>
    </div>
  )
}

export function ErrorState({
  title = "Something went wrong",
  description,
  className,
}: {
  title?: string
  description: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700",
        className,
      )}
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1 opacity-90">{description}</p>
    </div>
  )
}
