import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react"
import { SynovaLogo } from "@/components/brand/SynovaLogo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ErrorState } from "@/components/ui/states"
import { useAuth } from "@/context/AuthContext"
import { DEMO_CREDENTIALS } from "@/services/auth"

export function CustomerLoginPage() {
  const { loginCustomer } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(DEMO_CREDENTIALS.customer.email)
  const [password, setPassword] = useState(DEMO_CREDENTIALS.customer.password)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      loginCustomer(email, password)
      navigate("/customer/chat")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F5F8FF]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.22),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(124,58,237,0.18),_transparent_40%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block"
          >
            <SynovaLogo tone="customer" className="mb-6" />
            <h1 className="font-[Outfit] text-4xl font-bold tracking-tight text-slate-950">
              Customer Portal
            </h1>
            <p className="mt-3 max-w-md text-slate-600">
              Chat with Synova&apos;s Customer Reception Agent. Watch Intent, Sentiment, and
              Decision routing unfold for every message.
            </p>
            <div className="mt-8 space-y-3">
              {["Sales & Support routing", "Sentiment-aware escalation", "Live agent insights"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-blue-100 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-blue-100/80 shadow-[0_20px_60px_rgba(37,99,235,0.12)]">
              <CardHeader>
                <div className="mb-2 lg:hidden">
                  <SynovaLogo tone="customer" />
                </div>
                <CardTitle className="text-2xl">Customer Login</CardTitle>
                <CardDescription>Sign in to the blue customer workspace</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={onSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="customer-email">Email</Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="customer-email"
                        type="email"
                        className="pl-10 focus-visible:ring-blue-500/40"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer-password">Password</Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="customer-password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10 focus-visible:ring-blue-500/40"
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

                  <Button type="submit" variant="customer" className="w-full" disabled={loading}>
                    {loading ? "Signing in…" : "Sign in"}
                  </Button>
                </form>

                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-3 text-xs text-blue-800">
                  <p className="font-semibold">Demo credentials</p>
                  <p className="mt-1">Email: customer@synova.ai</p>
                  <p>Password: customer123</p>
                </div>

                <div className="mt-5 flex items-center justify-between text-sm">
                  <Link to="/" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                  </Link>
                  <Link to="/login/employee" className="font-medium text-emerald-700 hover:underline">
                    Employee login
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
