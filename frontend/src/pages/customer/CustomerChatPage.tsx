import type { ReactNode } from "react"
import { Mail, UserRound } from "lucide-react"
import { ChatPanel } from "@/components/chat/ChatPanel"
import { EscalationBanner } from "@/components/dashboard/EscalationBanner"
import { InsightsPanel } from "@/components/dashboard/InsightsPanel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/AuthContext"
import { useCustomerChat } from "@/pages/customer/CustomerChatContext"

export function CustomerChatPage() {
  const { user } = useAuth()
  const { messages, loading, error, send } = useCustomerChat()
  const escalated = messages.some((m) => m.meta?.escalated)

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-4">
        <Card className="border-blue-100/80 bg-gradient-to-r from-white to-blue-50/40">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserRound className="h-5 w-5 text-blue-600" />
              Customer Information
            </CardTitle>
            <CardDescription>
              Authenticated demo session connected to Customer Reception
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <Info label="Name" value={user?.name ?? "—"} />
            <Info label="Customer ID" value={user?.id ?? "—"} />
            <Info
              label="Email"
              value={user?.email ?? "—"}
              icon={<Mail className="h-3.5 w-3.5 text-blue-500" />}
            />
          </CardContent>
        </Card>

        <EscalationBanner visible={escalated} />

        <ChatPanel
          theme="customer"
          messages={messages}
          loading={loading}
          error={error}
          onSend={send}
          placeholder="Ask about pricing, support, billing…"
          emptyTitle="Start a customer conversation"
          emptyDescription="Your message will hit the Customer Reception endpoint and return intent, sentiment, and a routed reply."
        />
      </div>

      <InsightsPanel theme="customer" messages={messages} />
    </div>
  )
}

function Info({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: ReactNode
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white px-3 py-2.5">
      <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
        {icon}
        {value}
      </p>
    </div>
  )
}
