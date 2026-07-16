import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:brightness-105 focus-visible:ring-blue-500",
        customer:
          "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/25 hover:brightness-105 focus-visible:ring-blue-500",
        employee:
          "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:brightness-105 focus-visible:ring-emerald-500",
        outline:
          "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-400",
        ghost: "text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400",
        secondary:
          "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-700",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-2xl px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"
