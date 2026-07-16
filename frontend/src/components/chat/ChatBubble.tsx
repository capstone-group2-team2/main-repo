import { motion } from "framer-motion"
import { Bot, User } from "lucide-react"
import type { ChatMessage } from "@/types"
import { Badge } from "@/components/ui/badge"
import { formatPercent, formatTime, titleCase } from "@/lib/utils"
import { cn } from "@/lib/utils"

export function ChatBubble({
  message,
  theme,
}: {
  message: ChatMessage
  theme: "customer" | "employee"
}) {
  const isUser = message.role === "user"
  const meta = message.meta

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div
          className={cn(
            "mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white",
            theme === "customer"
              ? "bg-gradient-to-br from-blue-600 to-violet-600"
              : "bg-gradient-to-br from-emerald-600 to-teal-500",
          )}
        >
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div className={cn("max-w-[85%] space-y-2", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
            isUser
              ? theme === "customer"
                ? "bg-gradient-to-br from-blue-600 to-violet-600 text-white"
                : "bg-gradient-to-br from-emerald-600 to-teal-500 text-white"
              : "border border-slate-200 bg-white text-slate-800",
          )}
        >
          {message.content}
        </div>

        <div
          className={cn(
            "flex flex-wrap items-center gap-2 text-[11px] text-slate-400",
            isUser && "justify-end",
          )}
        >
          <span>{formatTime(message.timestamp)}</span>
        </div>

        {!isUser && meta && (
          <div className="flex flex-wrap gap-1.5">
            {meta.intent && (
              <Badge variant={theme === "customer" ? "blue" : "green"}>
                Intent: {titleCase(meta.intent)}
              </Badge>
            )}
            {meta.sentiment && (
              <Badge
                variant={
                  meta.sentiment.toLowerCase() === "negative"
                    ? "red"
                    : meta.sentiment.toLowerCase() === "positive"
                      ? "green"
                      : "secondary"
                }
              >
                Sentiment: {titleCase(meta.sentiment)}
                {meta.sentimentConfidence != null
                  ? ` · ${formatPercent(meta.sentimentConfidence)}`
                  : ""}
              </Badge>
            )}
            {meta.confidence != null && (
              <Badge variant="purple">
                Confidence: {formatPercent(meta.confidence)}
              </Badge>
            )}
            {meta.decision && (
              <Badge variant="outline">Decision: {titleCase(meta.decision)}</Badge>
            )}
            {meta.priority && (
              <Badge variant={meta.priority.toUpperCase() === "URGENT" ? "amber" : "secondary"}>
                Priority: {meta.priority}
              </Badge>
            )}
            {meta.assignedTeam && (
              <Badge variant="outline">Team: {titleCase(meta.assignedTeam)}</Badge>
            )}
            {meta.status && <Badge variant="secondary">Status: {titleCase(meta.status)}</Badge>}
            {meta.agentUsed && (
              <Badge variant={theme === "customer" ? "blue" : "green"}>
                Agent: {meta.agentUsed}
              </Badge>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
          <User className="h-4 w-4" />
        </div>
      )}
    </motion.div>
  )
}
