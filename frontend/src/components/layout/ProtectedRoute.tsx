import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import type { UserRole } from "@/types"

export function ProtectedRoute({ role }: { role: UserRole }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return (
      <Navigate
        to={role === "customer" ? "/login/customer" : "/login/employee"}
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  if (user.role !== role) {
    return (
      <Navigate
        to={user.role === "customer" ? "/customer/chat" : "/employee/reception"}
        replace
      />
    )
  }

  return <Outlet />
}
