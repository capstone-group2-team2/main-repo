import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/states"
import { useEmployeeChat } from "@/pages/employee/EmployeeChatContext"
import { formatTime, titleCase } from "@/lib/utils"

export function EmployeeTicketsPage() {
  const { tickets } = useEmployeeChat()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets</CardTitle>
        <CardDescription>
          Tickets created by the Employee Reception and Ticket Agent flow
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tickets.length === 0 ? (
          <EmptyState
            title="No tickets created"
            description="Submit a reception message to generate and display tickets in this panel."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-3 py-2 font-semibold">Ticket</th>
                  <th className="px-3 py-2 font-semibold">Intent</th>
                  <th className="px-3 py-2 font-semibold">Decision</th>
                  <th className="px-3 py-2 font-semibold">Priority</th>
                  <th className="px-3 py-2 font-semibold">Team</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                  <th className="px-3 py-2 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.ticketId} className="border-b border-slate-50">
                    <td className="px-3 py-3 font-semibold text-emerald-700">
                      {ticket.ticketId}
                    </td>
                    <td className="px-3 py-3">{titleCase(ticket.intent)}</td>
                    <td className="px-3 py-3">{titleCase(ticket.decision)}</td>
                    <td className="px-3 py-3">
                      <Badge
                        variant={
                          ticket.priority.toUpperCase() === "URGENT" ? "amber" : "secondary"
                        }
                      >
                        {ticket.priority}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">{titleCase(ticket.assignedTeam)}</td>
                    <td className="px-3 py-3">
                      <Badge variant="green">{titleCase(ticket.status)}</Badge>
                    </td>
                    <td className="px-3 py-3 text-slate-500">
                      {formatTime(ticket.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
