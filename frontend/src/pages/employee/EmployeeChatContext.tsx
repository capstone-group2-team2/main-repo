import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { ChatMessage, TicketRecord } from "@/types"
import { useSessionChat } from "@/hooks/useSessionChat"
import {
  buildEmployeeAssistantReply,
  deriveEmployeeMeta,
  sendEmployeeMessage,
} from "@/services/api"
import { useAuth } from "@/context/AuthContext"

interface EmployeeChatContextValue {
  messages: ChatMessage[]
  tickets: TicketRecord[]
  loading: boolean
  error: string | null
  send: (message: string) => Promise<void>
  clear: () => void
}

const EmployeeChatContext = createContext<EmployeeChatContextValue | null>(null)

export function EmployeeChatProvider({ children }: { children: ReactNode }) {
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
  const [tickets, setTickets] = useState<TicketRecord[]>([])

  const clear = useCallback(() => {
    setMessages([])
    setError(null)
    setTickets([])
  }, [setMessages, setError])

  const send = useCallback(
    async (message: string) => {
      if (!user) return
      setError(null)
      pushUser(message)
      setLoading(true)
      try {
        const response = await sendEmployeeMessage({
          employee_id: user.id,
          message,
        })
        const meta = deriveEmployeeMeta(response)
        const reply = buildEmployeeAssistantReply(response, meta)
        pushAssistant(reply, meta)

        if (response.ticket_id) {
          const ticket: TicketRecord = {
            ticketId: response.ticket_id,
            employeeId: response.employee_id,
            message: response.message,
            intent: response.intent,
            sentiment: response.sentiment,
            assignedTeam: response.assigned_team ?? "Unassigned",
            priority: response.priority ?? "NORMAL",
            status: response.status ?? "OPEN",
            decision: meta.decision ?? "pending",
            createdAt: response.created_at ?? new Date().toISOString(),
          }
          setTickets((prev) => [
            ticket,
            ...prev.filter((t) => t.ticketId !== ticket.ticketId),
          ])
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to reach Employee Reception.",
        )
      } finally {
        setLoading(false)
      }
    },
    [user, setError, pushUser, setLoading, pushAssistant],
  )

  const value = useMemo(
    () => ({ messages, tickets, loading, error, send, clear }),
    [messages, tickets, loading, error, send, clear],
  )

  return (
    <EmployeeChatContext.Provider value={value}>{children}</EmployeeChatContext.Provider>
  )
}

export function useEmployeeChat() {
  const ctx = useContext(EmployeeChatContext)
  if (!ctx) throw new Error("useEmployeeChat must be used within EmployeeChatProvider")
  return ctx
}
