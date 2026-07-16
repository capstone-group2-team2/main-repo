import type {
  CustomerReceptionRequest,
  CustomerReceptionResponse,
  EmployeeReceptionRequest,
  EmployeeReceptionResponse,
  MessageMeta,
} from "@/types"
import { titleCase } from "@/lib/utils"

const CUSTOMER_API =
  import.meta.env.VITE_CUSTOMER_API_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000"

const EMPLOYEE_API =
  import.meta.env.VITE_EMPLOYEE_API_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8004"

async function postJson<T>(url: string, body: unknown): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error(
      "Unable to reach the reception service. Confirm the backend is running.",
    )
  }

  if (!response.ok) {
    let detail = `Request failed (${response.status})`
    try {
      const payload = (await response.json()) as { detail?: string }
      if (payload.detail) detail = payload.detail
    } catch {
      /* ignore parse errors */
    }
    throw new Error(detail)
  }

  return (await response.json()) as T
}

/** Existing customer endpoint: POST /reception */
export function sendCustomerMessage(payload: CustomerReceptionRequest) {
  return postJson<CustomerReceptionResponse>(
    `${CUSTOMER_API}/reception`,
    payload,
  )
}

/** Existing employee reception endpoint: POST /reception */
export function sendEmployeeMessage(payload: EmployeeReceptionRequest) {
  return postJson<EmployeeReceptionResponse>(
    `${EMPLOYEE_API}/reception`,
    payload,
  )
}

export function isEscalated(
  sentiment: string | undefined,
  reply: string | undefined,
): boolean {
  if (!sentiment || !reply) return false
  const negative = sentiment.toLowerCase() === "negative"
  const escalated = /escalat/i.test(reply)
  return negative && escalated
}

export function deriveCustomerMeta(
  response: CustomerReceptionResponse,
): MessageMeta {
  const escalated = isEscalated(response.sentiment, response.reply)
  const intent = response.intent?.toLowerCase() ?? ""

  let agentUsed = "Reception Agent"
  let decision = "Route via Decision Engine"
  let priority = "NORMAL"
  let assignedTeam = "Reception"
  let status = response.status || "processed"

  if (escalated) {
    agentUsed = "Human Support"
    decision = "human_ticket"
    priority = "URGENT"
    assignedTeam = "Technical Team"
    status = "OPEN"
  } else if (intent === "sales") {
    agentUsed = "Sales Agent"
    decision = "sales_agent"
    assignedTeam = "Sales Team"
    status = "IN_PROGRESS"
  } else if (intent === "support") {
    agentUsed = "Support Agent"
    decision = "support_agent"
    assignedTeam = "Support Team"
    status = "IN_PROGRESS"
  }

  return {
    intent: response.intent,
    confidence: response.confidence,
    sentiment: response.sentiment,
    sentimentConfidence: response.sentiment_confidence,
    decision,
    priority,
    assignedTeam,
    status,
    agentUsed,
    escalated,
  }
}

export function deriveEmployeeMeta(
  response: EmployeeReceptionResponse,
): MessageMeta {
  const decision =
    response.decision ||
    response.destination ||
    inferDecisionFromTeam(response.assigned_team)

  return {
    intent: response.intent,
    confidence: response.intent_confidence,
    sentiment: response.sentiment,
    sentimentConfidence: response.sentiment_confidence,
    decision,
    priority: response.priority,
    assignedTeam: response.assigned_team,
    status: response.status,
    agentUsed: mapAgentFromDecision(decision),
    ticketId: response.ticket_id,
    escalated:
      decision?.toLowerCase().includes("human") ||
      response.priority?.toUpperCase() === "URGENT",
  }
}

function inferDecisionFromTeam(team?: string) {
  const value = team?.toLowerCase() ?? ""
  if (value.includes("technical")) return "technical_agent"
  if (value.includes("hr")) return "hr_agent"
  if (value.includes("support")) return "human_ticket"
  return team ? titleCase(team) : "pending"
}

function mapAgentFromDecision(decision?: string) {
  const value = decision?.toLowerCase() ?? ""
  if (value.includes("technical")) return "Technical Agent"
  if (value.includes("hr")) return "HR Agent"
  if (value.includes("human")) return "Human Support"
  return "Reception Agent"
}

export function buildEmployeeAssistantReply(
  response: EmployeeReceptionResponse,
  meta: MessageMeta,
) {
  if (response.reply?.trim()) return response.reply

  const ticket = meta.ticketId ? ` Ticket ${meta.ticketId} was created.` : ""
  const team = meta.assignedTeam
    ? ` Routed to ${titleCase(meta.assignedTeam)}.`
    : ""
  const priority = meta.priority
    ? ` Priority: ${meta.priority.toUpperCase()}.`
    : ""

  return `Request processed by the Employee Reception Agent.${team}${priority}${ticket}`
}
