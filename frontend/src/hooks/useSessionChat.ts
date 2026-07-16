import { useCallback, useMemo, useState } from "react"
import type { ChatMessage, MessageMeta } from "@/types"

export function useSessionChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const latestMeta = useMemo(
    () => [...messages].reverse().find((m) => m.role === "assistant" && m.meta)?.meta,
    [messages],
  )

  const pushUser = useCallback((content: string) => {
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, message])
    return message
  }, [])

  const pushAssistant = useCallback((content: string, meta?: MessageMeta) => {
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content,
      timestamp: new Date().toISOString(),
      meta,
    }
    setMessages((prev) => [...prev, message])
    return message
  }, [])

  return {
    messages,
    setMessages,
    loading,
    setLoading,
    error,
    setError,
    latestMeta,
    pushUser,
    pushAssistant,
  }
}
