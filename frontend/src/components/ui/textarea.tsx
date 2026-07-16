import type { TextareaHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className,
      )}
      {...props}
    />
  )
}
