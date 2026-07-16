import { NavLink, useNavigate } from "react-router-dom"
import { LogOut, Menu, X } from "lucide-react"
import { useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SynovaLogo } from "@/components/brand/SynovaLogo"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

export interface NavItem {
  to: string
  label: string
  icon: ReactNode
}

export function WorkspaceShell({
  theme,
  navItems,
  title,
  subtitle,
  children,
  aside,
}: {
  theme: "customer" | "employee"
  navItems: NavItem[]
  title: string
  subtitle: string
  children: ReactNode
  aside?: ReactNode
}) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const isCustomer = theme === "customer"
  const accent = isCustomer
    ? "from-blue-600/10 via-violet-500/5 to-transparent"
    : "from-emerald-600/10 via-teal-500/5 to-transparent"
  const active = isCustomer
    ? "bg-blue-50 text-blue-700 border-blue-100"
    : "bg-emerald-50 text-emerald-700 border-emerald-100"
  const logoTone = isCustomer ? "customer" : "employee"

  const onLogout = () => {
    logout()
    navigate("/")
  }

  const Nav = (
    <nav className="flex flex-col gap-1.5 p-3">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50",
              isActive && active,
            )
          }
        >
          <span className="opacity-80">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-900">
      <div className={cn("pointer-events-none fixed inset-0 bg-gradient-to-br", accent)} />

      <div className="relative mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200/80 bg-white/80 backdrop-blur-xl lg:flex lg:flex-col">
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-5">
            <SynovaLogo tone={logoTone} />
          </div>
          {Nav}
          <div className="mt-auto border-t border-slate-100 p-4">
            <div className="mb-3 rounded-xl bg-slate-50 px-3 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">Signed in</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.id}</p>
            </div>
            <Button variant="outline" className="w-full" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200/70 bg-white/80 px-4 py-3 backdrop-blur-xl sm:px-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle navigation"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div>
                <h1 className="font-[Outfit] text-lg font-semibold tracking-tight sm:text-xl">
                  {title}
                </h1>
                <p className="text-xs text-slate-500 sm:text-sm">{subtitle}</p>
              </div>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <div
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  isCustomer
                    ? "bg-blue-50 text-blue-700"
                    : "bg-emerald-50 text-emerald-700",
                )}
              >
                {isCustomer ? "Customer Portal" : "Employee Portal"}
              </div>
            </div>
          </header>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-b border-slate-200 bg-white lg:hidden"
              >
                {Nav}
              </motion.div>
            )}
          </AnimatePresence>

          <main
            className={cn(
              "grid flex-1 gap-4 p-4 sm:p-6",
              aside ? "xl:grid-cols-[minmax(0,1fr)_340px]" : "grid-cols-1",
            )}
          >
            <div className="min-w-0">{children}</div>
            {aside && <aside className="min-w-0 space-y-4">{aside}</aside>}
          </main>
        </div>
      </div>
    </div>
  )
}
