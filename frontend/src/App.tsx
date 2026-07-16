import { Navigate, Route, Routes } from "react-router-dom"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { LandingPage } from "@/pages/LandingPage"
import { CustomerLoginPage } from "@/pages/CustomerLoginPage"
import { EmployeeLoginPage } from "@/pages/EmployeeLoginPage"
import { CustomerLayout } from "@/pages/customer/CustomerLayout"
import { CustomerChatProvider } from "@/pages/customer/CustomerChatContext"
import { CustomerChatPage } from "@/pages/customer/CustomerChatPage"
import { CustomerHistoryPage } from "@/pages/customer/CustomerHistoryPage"
import { EmployeeLayout } from "@/pages/employee/EmployeeLayout"
import { EmployeeChatProvider } from "@/pages/employee/EmployeeChatContext"
import { EmployeeReceptionPage } from "@/pages/employee/EmployeeReceptionPage"
import { EmployeeTicketsPage } from "@/pages/employee/EmployeeTicketsPage"
import { EmployeeReportsPage } from "@/pages/employee/EmployeeReportsPage"
import { EmployeeApiPage } from "@/pages/employee/EmployeeApiPage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login/customer" element={<CustomerLoginPage />} />
      <Route path="/login/employee" element={<EmployeeLoginPage />} />

      <Route element={<ProtectedRoute role="customer" />}>
        <Route
          path="/customer"
          element={
            <CustomerChatProvider>
              <CustomerLayout />
            </CustomerChatProvider>
          }
        >
          <Route index element={<Navigate to="chat" replace />} />
          <Route path="chat" element={<CustomerChatPage />} />
          <Route path="history" element={<CustomerHistoryPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="employee" />}>
        <Route
          path="/employee"
          element={
            <EmployeeChatProvider>
              <EmployeeLayout />
            </EmployeeChatProvider>
          }
        >
          <Route index element={<Navigate to="reception" replace />} />
          <Route path="reception" element={<EmployeeReceptionPage />} />
          <Route path="tickets" element={<EmployeeTicketsPage />} />
          <Route path="reports" element={<EmployeeReportsPage />} />
          <Route path="api" element={<EmployeeApiPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
