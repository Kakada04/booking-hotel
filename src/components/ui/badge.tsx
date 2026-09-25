import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap transition-all backdrop-blur-md select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        /* Soft Sky Translucent Glass Badge */
        default:
          "bg-primary/20 text-sky-950 border-primary/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:bg-primary/20 dark:text-sky-100 dark:border-primary/30",
        
        /* Subtle Frosted Surface */
        secondary:
          "bg-black/[0.04] text-foreground border-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:bg-white/[0.08] dark:border-white/[0.12] dark:text-foreground",
        
        /* Crystal Outline Glass */
        outline:
          "bg-white/35 text-foreground border-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:bg-white/[0.06] dark:border-white/20 dark:text-foreground",
        
        /* Dedicated Pure Frosted Glass */
        glass:
          "bg-white/45 text-foreground border-white/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] dark:bg-white/10 dark:border-white/25 dark:text-foreground",
        
        /* Coral Red Glass */
        destructive:
          "bg-destructive/15 text-destructive border-destructive/25 dark:bg-destructive/20 dark:text-red-300",
        
        /* Hotel Status Badges (Glass) */
        available:
          "bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30",
        
        occupied:
          "bg-blue-500/15 text-blue-700 border-blue-500/25 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30",
        
        dirty:
          "bg-amber-500/15 text-amber-800 border-amber-500/25 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30",
        
        cleaning:
          "bg-cyan-500/15 text-cyan-700 border-cyan-500/25 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30",
        
        gold:
          "bg-amber-400/20 text-amber-900 border-amber-400/35 dark:bg-amber-400/20 dark:text-amber-200 dark:border-amber-400/35",
        
        ghost: "border-transparent text-foreground/80 hover:bg-white/30 dark:hover:bg-white/10",
        link: "border-transparent text-primary underline-offset-4 hover:underline !backdrop-blur-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
