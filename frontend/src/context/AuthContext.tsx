import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import type { AuthUser, UserRole } from "@/types"
import {
  getStoredUser,
  loginCustomer as authLoginCustomer,
  loginEmployee as authLoginEmployee,
  logout as authLogout,
} from "@/services/auth"

interface AuthContextValue {
  user: AuthUser | null
  loginCustomer: (email: string, password: string) => AuthUser
  loginEmployee: (employeeId: string, password: string) => AuthUser
  logout: () => void
  isRole: (role: UserRole) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser())

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loginCustomer: (email, password) => {
        const next = authLoginCustomer(email, password)
        setUser(next)
        return next
      },
      loginEmployee: (employeeId, password) => {
        const next = authLoginEmployee(employeeId, password)
        setUser(next)
        return next
      },
      logout: () => {
        authLogout()
        setUser(null)
      },
      isRole: (role) => user?.role === role,
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
