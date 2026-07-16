import { useEffect, useRef, useState, type FormEvent } from "react"
import { SendHorizontal, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChatBubble } from "@/components/chat/ChatBubble"
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states"
import type { ChatMessage } from "@/types"
import { cn } from "@/lib/utils"

export function ChatPanel({
  theme,
  messages,
  loading,
  error,
  onSend,
  placeholder,
  emptyTitle,
  emptyDescription,
}: {
  theme: "customer" | "employee"
  messages: ChatMessage[]
  loading: boolean
  error: string | null
  onSend: (message: string) => Promise<void> | void
  placeholder: string
  emptyTitle: string
  emptyDescription: string
}) {
  const [draft, setDraft] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const value = draft.trim()
    if (!value || loading) return
    setDraft("")
    await onSend(value)
  }

  return (
    <div className="flex h-full min-h-[560px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgb(15,23,42,0.06)]">
      <div
        className={cn(
          "flex items-center gap-2 border-b border-slate-100 px-5 py-4",
          theme === "customer"
            ? "bg-gradient-to-r from-blue-50 to-violet-50"
            : "bg-gradient-to-r from-emerald-50 to-teal-50",
        )}
      >
        <Sparkles
          className={cn(
            "h-4 w-4",
            theme === "customer" ? "text-blue-600" : "text-emerald-600",
          )}
        />
        <div>
          <p className="font-[Outfit] text-sm font-semibold text-slate-900">
            Reception Chat
          </p>
          <p className="text-xs text-slate-500">
            Messages are routed through Intent → Sentiment → Decision → Agent
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5">
        {messages.length === 0 && !loading && (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        )}
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} theme={theme} />
        ))}
        {loading && <LoadingState label="Reception agent is analyzing your message…" />}
        {error && <ErrorState description={error} />}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={submit} className="border-t border-slate-100 p-4">
        <div className="flex items-end gap-2">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                void submit(e)
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={loading || !draft.trim()}
            variant={theme === "customer" ? "customer" : "employee"}
            className="h-12 w-12 shrink-0"
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
