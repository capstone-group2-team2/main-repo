import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Building2,
  Headphones,
  Route,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react"
import { SynovaLogo } from "@/components/brand/SynovaLogo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: BrainCircuit,
    title: "Intent Classification",
    description:
      "Fine-tuned models classify each message so the right specialist agent engages instantly.",
  },
  {
    icon: Sparkles,
    title: "Sentiment Intelligence",
    description:
      "Real-time sentiment scoring detects urgency and protects customer experience.",
  },
  {
    icon: Route,
    title: "Decision Engine",
    description:
      "Business rules route traffic to Sales, Support, Technical, HR, or human escalation.",
  },
  {
    icon: Headphones,
    title: "Specialist Agents",
    description:
      "Sales, Support (RAG), Technical, and HR agents collaborate under one reception layer.",
  },
]

const architectureSteps = [
  { label: "Reception", detail: "Entry agent" },
  { label: "Intent", detail: "Classify need" },
  { label: "Sentiment", detail: "Measure tone" },
  { label: "Decision", detail: "Route request" },
  { label: "Agent", detail: "Resolve & respond" },
]

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.16),_transparent_55%),radial-gradient(ellipse_at_80%_20%,_rgba(124,58,237,0.14),_transparent_45%)]" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <SynovaLogo />
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <a href="#features">Features</a>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/login/employee">Employee</Link>
          </Button>
          <Button asChild>
            <Link to="/login/customer">Customer Login</Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-700">
              <Workflow className="h-3.5 w-3.5" />
              Multi-Agent Service Platform
            </div>
            <h1 className="font-[Outfit] text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Synova
            </h1>
            <p className="mt-3 max-w-xl font-[Outfit] text-xl font-medium text-slate-700 sm:text-2xl">
              Intelligent reception that routes every conversation to the right agent.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">
              An enterprise multi-agent platform for customer support and employee operations —
              unifying Intent, Sentiment, Decisioning, RAG, and ticket workflows in one polished
              experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" variant="customer" asChild>
                <Link to="/login/customer">
                  Customer Login
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="employee" asChild>
                <Link to="/login/employee">
                  Employee Login
                  <Users className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                Register
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-blue-500/20 via-violet-500/15 to-emerald-400/10 blur-2xl" />
            <Card className="relative overflow-hidden border-white/60 bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  Live Routing Preview
                </CardTitle>
                <CardDescription>
                  Customer → Reception → Intent → Sentiment → Decision → Agent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { role: "Customer", value: "Sales inquiry", tone: "blue" },
                  { role: "Employee", value: "VPN / HR request", tone: "green" },
                  { role: "Escalation", value: "Negative → Human", tone: "rose" },
                ].map((row, index) => (
                  <motion.div
                    key={row.role}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.08 }}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3"
                  >
                    <span className="text-sm font-semibold text-slate-700">{row.role}</span>
                    <span
                      className={
                        row.tone === "blue"
                          ? "text-sm font-medium text-blue-600"
                          : row.tone === "green"
                            ? "text-sm font-medium text-emerald-600"
                            : "text-sm font-medium text-rose-600"
                      }
                    >
                      {row.value}
                    </span>
                  </motion.div>
                ))}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 p-4 text-white">
                    <p className="text-xs uppercase tracking-wide text-white/70">Customer</p>
                    <p className="mt-1 font-[Outfit] text-lg font-semibold">Blue pathway</p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 p-4 text-white">
                    <p className="text-xs uppercase tracking-wide text-white/70">Employee</p>
                    <p className="mt-1 font-[Outfit] text-lg font-semibold">Green pathway</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <section id="features" className="border-y border-slate-100 bg-slate-50/70 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">
                Key Features
              </p>
              <h2 className="mt-2 font-[Outfit] text-3xl font-bold tracking-tight">
                Built for enterprise service operations
              </h2>
              <p className="mt-3 text-slate-500">
                Synova demonstrates a complete multi-agent loop with measurable routing decisions
                at every step.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(15,23,42,0.08)] transition">
                    <CardHeader>
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white">
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                  Multi-Agent Architecture
                </p>
                <h2 className="mt-2 font-[Outfit] text-3xl font-bold tracking-tight">
                  One reception layer. Multiple specialists.
                </h2>
              </div>
              <p className="max-w-md text-sm text-slate-500">
                Customer traffic flows through blue pathways. Employee traffic flows through green
                pathways. Escalations surface when sentiment turns urgent.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-violet-50 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8">
              <div className="grid gap-3 md:grid-cols-5">
                {architectureSteps.map((step, index) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06 }}
                    className="relative rounded-2xl border border-white bg-white p-4 text-center shadow-sm"
                  >
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="font-[Outfit] font-semibold text-slate-900">{step.label}</p>
                    <p className="mt-1 text-xs text-slate-500">{step.detail}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                  <div className="mb-2 flex items-center gap-2 text-blue-700">
                    <Building2 className="h-4 w-4" />
                    <p className="font-semibold">Customer pathway</p>
                  </div>
                  <p className="text-sm text-slate-600">
                    Reception → Intent → Sentiment → Decision → Sales / Support / Human ticket
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                  <div className="mb-2 flex items-center gap-2 text-emerald-700">
                    <ShieldCheck className="h-4 w-4" />
                    <p className="font-semibold">Employee pathway</p>
                  </div>
                  <p className="text-sm text-slate-600">
                    Reception → Intent → Sentiment → Decision → Technical / HR / Ticket workflow
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-700 via-violet-700 to-indigo-700 px-6 py-12 text-white shadow-2xl sm:px-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="font-[Outfit] text-3xl font-bold tracking-tight">
                    Ready to experience Synova?
                  </h2>
                  <p className="mt-2 max-w-xl text-white/80">
                    Sign in with the demo portals and watch the multi-agent pipeline classify,
                    score, decide, and respond in real time.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50" asChild>
                    <Link to="/login/customer">Customer Login</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                    asChild
                  >
                    <Link to="/login/employee">Employee Login</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100 py-8 text-center text-sm text-slate-400">
        Synova Multi-Agent Service Platform · Capstone Presentation
      </footer>
    </div>
  )
}
