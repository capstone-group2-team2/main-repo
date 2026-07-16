import { History, MessageSquare } from "lucide-react"
import { Outlet } from "react-router-dom"
import { WorkspaceShell } from "@/components/layout/WorkspaceShell"
import { useAuth } from "@/context/AuthContext"

export function CustomerLayout() {
  const { user } = useAuth()

  return (
    <WorkspaceShell
      theme="customer"
      title="Customer Workspace"
      subtitle={`${user?.name ?? "Customer"} · ${user?.email ?? ""}`}
      navItems={[
        {
          to: "/customer/chat",
          label: "Chat",
          icon: <MessageSquare className="h-4 w-4" />,
        },
        {
          to: "/customer/history",
          label: "History",
          icon: <History className="h-4 w-4" />,
        },
      ]}
    >
      <Outlet />
    </WorkspaceShell>
  )
}
