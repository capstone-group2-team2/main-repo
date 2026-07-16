import type { AuthUser } from "@/types"

const CUSTOMER_DEMO = {
  email: "customer@synova.ai",
  password: "customer123",
  user: {
    role: "customer" as const,
    id: "CUST-001",
    name: "Alex Rivera",
    email: "customer@synova.ai",
  },
}

const EMPLOYEE_DEMO = {
  employeeId: "EMP001",
  password: "employee123",
  user: {
    role: "employee" as const,
    id: "EMP001",
    name: "Jordan Lee",
    email: "jordan.lee@synova.ai",
  },
}

const STORAGE_KEY = "synova_auth_user"

export function loginCustomer(email: string, password: string): AuthUser {
  if (
    email.trim().toLowerCase() === CUSTOMER_DEMO.email &&
    password === CUSTOMER_DEMO.password
  ) {
    persistUser(CUSTOMER_DEMO.user)
    return CUSTOMER_DEMO.user
  }
  throw new Error("Invalid customer credentials. Use the demo account shown below.")
}

export function loginEmployee(employeeId: string, password: string): AuthUser {
  if (
    employeeId.trim().toUpperCase() === EMPLOYEE_DEMO.employeeId &&
    password === EMPLOYEE_DEMO.password
  ) {
    persistUser(EMPLOYEE_DEMO.user)
    return EMPLOYEE_DEMO.user
  }
  throw new Error("Invalid employee credentials. Use the demo account shown below.")
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

function persistUser(user: AuthUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export const DEMO_CREDENTIALS = {
  customer: CUSTOMER_DEMO,
  employee: EMPLOYEE_DEMO,
}
