import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/states"
import { useCustomerChat } from "@/pages/customer/CustomerChatContext"
import { formatPercent, formatTime, titleCase } from "@/lib/utils"

export function CustomerHistoryPage() {
  const { messages, clear } = useCustomerChat()
  const turns = messages.filter((m) => m.role === "assistant" && m.meta)

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>Conversation History</CardTitle>
          <CardDescription>
            Reviewed responses from the Customer Reception pipeline
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={clear} disabled={messages.length === 0}>
          Clear session
        </Button>
      </CardHeader>
      <CardContent>
        {turns.length === 0 ? (
          <EmptyState
            title="No history yet"
            description="Chat with the reception agent first. Routed replies will appear here with metadata."
          />
        ) : (
          <div className="space-y-3">
            {turns
              .slice()
              .reverse()
              .map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                >
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                      {item.meta?.agentUsed}
                    </p>
                    <p className="text-xs text-slate-400">{formatTime(item.timestamp)}</p>
                  </div>
                  <p className="text-sm text-slate-700">{item.content}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.meta?.intent && (
                      <Badge variant="blue">Intent: {titleCase(item.meta.intent)}</Badge>
                    )}
                    {item.meta?.sentiment && (
                      <Badge
                        variant={
                          item.meta.sentiment.toLowerCase() === "negative" ? "red" : "secondary"
                        }
                      >
                        Sentiment: {titleCase(item.meta.sentiment)}
                      </Badge>
                    )}
                    {item.meta?.confidence != null && (
                      <Badge variant="purple">
                        Confidence: {formatPercent(item.meta.confidence)}
                      </Badge>
                    )}
                    {item.meta?.escalated && (
                      <Badge variant="red">Escalated to Human Support</Badge>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
