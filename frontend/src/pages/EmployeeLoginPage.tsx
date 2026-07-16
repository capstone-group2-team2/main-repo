import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, BadgeCheck, Eye, EyeOff, Lock } from "lucide-react"
import { SynovaLogo } from "@/components/brand/SynovaLogo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ErrorState } from "@/components/ui/states"
import { useAuth } from "@/context/AuthContext"
import { DEMO_CREDENTIALS } from "@/services/auth"

export function EmployeeLoginPage() {
  const { loginEmployee } = useAuth()
  const navigate = useNavigate()
  const [employeeId, setEmployeeId] = useState(DEMO_CREDENTIALS.employee.employeeId)
  const [password, setPassword] = useState(DEMO_CREDENTIALS.employee.password)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      loginEmployee(employeeId, password)
      navigate("/employee/reception")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F3FBF7]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.22),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.16),_transparent_40%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block"
          >
            <SynovaLogo tone="employee" className="mb-6" />
            <h1 className="font-[Outfit] text-4xl font-bold tracking-tight text-slate-950">
              Employee Portal
            </h1>
            <p className="mt-3 max-w-md text-slate-600">
              Access the Employee Reception Agent for Technical and HR routing with ticket
              generation and priority visibility.
            </p>
            <div className="mt-8 space-y-3">
              {[
                "Technical & HR specialist routing",
                "Ticket workflow side panel",
                "Priority and team assignment",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-emerald-100 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-emerald-100/80 shadow-[0_20px_60px_rgba(16,185,129,0.12)]">
              <CardHeader>
                <div className="mb-2 lg:hidden">
                  <SynovaLogo tone="employee" />
                </div>
                <CardTitle className="text-2xl">Employee Login</CardTitle>
                <CardDescription>Sign in to the green employee workspace</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={onSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="employee-id">Employee ID</Label>
                    <div className="relative">
                      <BadgeCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="employee-id"
                        className="pl-10 focus-visible:ring-emerald-500/40"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employee-password">Password</Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="employee-password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10 focus-visible:ring-emerald-500/40"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {error && <ErrorState description={error} />}

                  <Button type="submit" variant="employee" className="w-full" disabled={loading}>
                    {loading ? "Signing in…" : "Sign in"}
                  </Button>
                </form>

                <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3 text-xs text-emerald-800">
                  <p className="font-semibold">Demo credentials</p>
                  <p className="mt-1">Employee ID: EMP001</p>
                  <p>Password: employee123</p>
                </div>

                <div className="mt-5 flex items-center justify-between text-sm">
                  <Link to="/" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                  </Link>
                  <Link to="/login/customer" className="font-medium text-blue-700 hover:underline">
                    Customer login
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
