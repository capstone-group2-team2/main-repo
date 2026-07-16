import {
  BarChart3,
  MessageSquare,
  Network,
  Ticket,
} from "lucide-react"
import { Outlet } from "react-router-dom"
import { WorkspaceShell } from "@/components/layout/WorkspaceShell"
import { useAuth } from "@/context/AuthContext"

export function EmployeeLayout() {
  const { user } = useAuth()

  return (
    <WorkspaceShell
      theme="employee"
      title="Employee Workspace"
      subtitle={`${user?.name ?? "Employee"} · ${user?.id ?? ""}`}
      navItems={[
        {
          to: "/employee/reception",
          label: "Reception",
          icon: <MessageSquare className="h-4 w-4" />,
        },
        {
          to: "/employee/tickets",
          label: "Tickets",
          icon: <Ticket className="h-4 w-4" />,
        },
        {
          to: "/employee/reports",
          label: "Reports",
          icon: <BarChart3 className="h-4 w-4" />,
        },
        {
          to: "/employee/api",
          label: "API Integration",
          icon: <Network className="h-4 w-4" />,
        },
      ]}
    >
      <Outlet />
    </WorkspaceShell>
  )
}
