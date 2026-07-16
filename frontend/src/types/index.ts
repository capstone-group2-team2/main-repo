export type UserRole = "customer" | "employee"

export interface AuthUser {
  role: UserRole
  id: string
  name: string
  email?: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  meta?: MessageMeta
}

export interface MessageMeta {
  intent?: string
  confidence?: number
  sentiment?: string
  sentimentConfidence?: number
  decision?: string
  priority?: string
  assignedTeam?: string
  status?: string
  agentUsed?: string
  escalated?: boolean
  ticketId?: string
}

export interface CustomerReceptionRequest {
  customer_id: string
  message: string
}

export interface CustomerReceptionResponse {
  customer_id: string
  message: string
  timestamp: string
  status: string
  intent: string
  confidence: number
  sentiment: string
  sentiment_confidence: number
  reply: string
}

export interface EmployeeReceptionRequest {
  employee_id: string
  message: string
}

export interface EmployeeReceptionResponse {
  ticket_id?: string
  employee_id: string
  message: string
  intent: string
  sentiment: string
  intent_confidence?: number
  sentiment_confidence?: number
  assigned_team?: string
  priority?: string
  status?: string
  decision?: string
  destination?: string
  reason?: string
  reply?: string
  created_at?: string
  updated_at?: string
  resolved?: boolean
}

export interface TicketRecord {
  ticketId: string
  employeeId: string
  message: string
  intent: string
  sentiment: string
  assignedTeam: string
  priority: string
  status: string
  decision: string
  createdAt: string
}
