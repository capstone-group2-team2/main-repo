import { Activity, Bot, Gauge, Ticket } from "lucide-react"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEmployeeChat } from "@/pages/employee/EmployeeChatContext"
import { titleCase } from "@/lib/utils"

export function EmployeeReportsPage() {
  const { messages, tickets } = useEmployeeChat()
  const assistant = messages.filter((m) => m.role === "assistant" && m.meta)
  const urgent = tickets.filter((t) => t.priority.toUpperCase() === "URGENT").length
  const technical = tickets.filter((t) =>
    t.assignedTeam.toLowerCase().includes("technical"),
  ).length
  const hr = tickets.filter((t) => t.assignedTeam.toLowerCase().includes("hr")).length
  const latestSentiment = assistant.at(-1)?.meta?.sentiment

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Tickets Generated"
          value={String(tickets.length)}
          icon={Ticket}
          tone="green"
        />
        <MetricCard
          title="Urgent Priority"
          value={String(urgent)}
          icon={Gauge}
          tone={urgent > 0 ? "amber" : "slate"}
        />
        <MetricCard
          title="Technical Routed"
          value={String(technical)}
          icon={Bot}
          tone="blue"
        />
        <MetricCard
          title="Current Sentiment"
          value={latestSentiment ? titleCase(latestSentiment) : "—"}
          icon={Activity}
          tone={
            latestSentiment?.toLowerCase() === "negative"
              ? "red"
              : latestSentiment?.toLowerCase() === "positive"
                ? "green"
                : "slate"
          }
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Report</CardTitle>
          <CardDescription>
            Snapshot of Employee Reception routing for this workspace session
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <Stat label="HR assignments" value={String(hr)} />
          <Stat label="Assistant replies" value={String(assistant.length)} />
          <Stat
            label="Latest decision"
            value={titleCase(assistant.at(-1)?.meta?.decision) || "—"}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-[Outfit] text-lg font-semibold text-slate-900">{value}</p>
    </div>
  )
}
