import { ChatPanel } from "@/components/chat/ChatPanel"
import { EscalationBanner } from "@/components/dashboard/EscalationBanner"
import { InsightsPanel } from "@/components/dashboard/InsightsPanel"
import { TicketPanel } from "@/components/dashboard/TicketPanel"
import { useEmployeeChat } from "@/pages/employee/EmployeeChatContext"

export function EmployeeReceptionPage() {
  const { messages, tickets, loading, error, send } = useEmployeeChat()
  const escalated = Boolean(messages.at(-1)?.meta?.escalated)

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px_300px]">
      <div className="space-y-4 xl:col-span-1">
        <EscalationBanner visible={escalated} />
        <ChatPanel
          theme="employee"
          messages={messages}
          loading={loading}
          error={error}
          onSend={send}
          placeholder="Describe a technical or HR issue…"
          emptyTitle="Employee Reception is ready"
          emptyDescription="Messages go to the Employee Reception Agent for intent, sentiment, decisioning, and ticket creation."
        />
      </div>
      <InsightsPanel theme="employee" messages={messages} />
      <TicketPanel tickets={tickets} />
    </div>
  )
}
