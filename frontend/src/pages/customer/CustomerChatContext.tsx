import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react"
import type { ChatMessage } from "@/types"
import { useSessionChat } from "@/hooks/useSessionChat"
import { deriveCustomerMeta, sendCustomerMessage } from "@/services/api"
import { useAuth } from "@/context/AuthContext"

interface CustomerChatContextValue {
  messages: ChatMessage[]
  loading: boolean
  error: string | null
  send: (message: string) => Promise<void>
  clear: () => void
}

const CustomerChatContext = createContext<CustomerChatContextValue | null>(null)

export function CustomerChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const {
    messages,
    loading,
    error,
    setMessages,
    setLoading,
    setError,
    pushUser,
    pushAssistant,
  } = useSessionChat()

  const clear = useCallback(() => {
    setMessages([])
    setError(null)
  }, [setMessages, setError])

  const send = useCallback(
    async (message: string) => {
      if (!user) return
      setError(null)
      pushUser(message)
      setLoading(true)
      try {
        const response = await sendCustomerMessage({
          customer_id: user.id,
          message,
        })
        const meta = deriveCustomerMeta(response)
        pushAssistant(response.reply, meta)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to reach Customer Reception.",
        )
      } finally {
        setLoading(false)
      }
    },
    [user, setError, pushUser, setLoading, pushAssistant],
  )

  const value = useMemo(
    () => ({ messages, loading, error, send, clear }),
    [messages, loading, error, send, clear],
  )

  return (
    <CustomerChatContext.Provider value={value}>{children}</CustomerChatContext.Provider>
  )
}

export function useCustomerChat() {
  const ctx = useContext(CustomerChatContext)
  if (!ctx) throw new Error("useCustomerChat must be used within CustomerChatProvider")
  return ctx
}
