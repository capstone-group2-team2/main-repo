import { AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

export function EscalationBanner({ visible }: { visible: boolean }) {
  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 to-orange-50 px-4 py-3 text-rose-800 shadow-sm"
    >
      <div className="mt-0.5 rounded-lg bg-rose-100 p-2">
        <AlertTriangle className="h-4 w-4 text-rose-600" />
      </div>
      <div>
        <p className="font-[Outfit] text-sm font-semibold">Escalated to Human Support</p>
        <p className="mt-0.5 text-xs text-rose-700/80">
          Negative sentiment triggered an urgent handoff through the Decision Engine.
        </p>
      </div>
    </motion.div>
  )
}
