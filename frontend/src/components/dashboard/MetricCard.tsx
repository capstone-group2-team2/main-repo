import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "slate",
}: {
  title: string
  value: string
  description?: string
  icon: LucideIcon
  tone?: "slate" | "blue" | "green" | "purple" | "amber" | "red"
}) {
  const tones = {
    slate: "from-slate-50 to-white text-slate-700",
    blue: "from-blue-50 to-white text-blue-700",
    green: "from-emerald-50 to-white text-emerald-700",
    purple: "from-violet-50 to-white text-violet-700",
    amber: "from-amber-50 to-white text-amber-700",
    red: "from-rose-50 to-white text-rose-700",
  }

  return (
    <Card className={cn("overflow-hidden bg-gradient-to-br", tones[tone])}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardDescription className="text-xs uppercase tracking-wide">
            {title}
          </CardDescription>
          <CardTitle className="mt-1 text-lg">{value}</CardTitle>
        </div>
        <div className="rounded-xl bg-white/80 p-2 shadow-sm">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      {description && (
        <CardContent>
          <p className="text-xs text-slate-500">{description}</p>
        </CardContent>
      )}
    </Card>
  )
}
