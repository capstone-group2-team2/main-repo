import {
  Activity,
  Bot,
  Gauge,
  MessageSquareText,
  Route,
  ShieldAlert,
} from "lucide-react"
import type { ChatMessage } from "@/types"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/states"
import { formatTime, titleCase } from "@/lib/utils"

export function InsightsPanel({
  theme,
  messages,
}: {
  theme: "customer" | "employee"
  messages: ChatMessage[]
}) {
  const assistantMessages = messages.filter((m) => m.role === "assistant" && m.meta)
  const latest = assistantMessages.at(-1)?.meta
  const conversations = messages.filter((m) => m.role === "user").length

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        <MetricCard
          title="Recent Conversations"
          value={String(conversations)}
          description="User messages in this session"
          icon={MessageSquareText}
          tone={theme === "customer" ? "blue" : "green"}
        />
        <MetricCard
          title="Current Sentiment"
          value={latest?.sentiment ? titleCase(latest.sentiment) : "—"}
          description="Latest sentiment prediction"
          icon={Activity}
          tone={
            latest?.sentiment?.toLowerCase() === "negative"
              ? "red"
              : latest?.sentiment?.toLowerCase() === "positive"
                ? "green"
                : "slate"
          }
        />
        <MetricCard
          title="Agent Used"
          value={latest?.agentUsed ?? "—"}
          description="Resolved routing destination"
          icon={Bot}
          tone="purple"
        />
        <MetricCard
          title="Decision"
          value={latest?.decision ? titleCase(latest.decision) : "—"}
          description="Decision Engine output"
          icon={Route}
          tone={theme === "customer" ? "blue" : "green"}
        />
        <MetricCard
          title="Priority"
          value={latest?.priority ?? "—"}
          description="Routing priority"
          icon={Gauge}
          tone={latest?.priority?.toUpperCase() === "URGENT" ? "amber" : "slate"}
        />
        <MetricCard
          title="Ticket Status"
          value={latest?.status ? titleCase(latest.status) : "—"}
          description={latest?.ticketId ? `Ticket ${latest.ticketId}` : "Workflow status"}
          icon={ShieldAlert}
          tone="slate"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conversation History</CardTitle>
          <CardDescription>Latest routed exchanges in this workspace</CardDescription>
        </CardHeader>
        <CardContent>
          {assistantMessages.length === 0 ? (
            <EmptyState
              title="No activity yet"
              description="Send a message to see intent, sentiment, and routing insights."
              className="py-8"
            />
          ) : (
            <div className="space-y-3">
              {assistantMessages
                .slice()
                .reverse()
                .slice(0, 5)
                .map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/80 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {item.meta?.agentUsed ?? "Agent"}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {formatTime(item.timestamp)}
                      </p>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-700">{item.content}</p>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
