import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 outline-none select-none backdrop-blur-xl active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        /* Soft Sky Luminous Glass Button */
        default:
          "bg-primary/85 text-white border border-white/40 shadow-[0_2px_12px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.75)] hover:bg-primary hover:border-white/60 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] dark:bg-primary/80 dark:text-sky-950 dark:border-white/30 dark:hover:bg-primary/95 dark:shadow-[0_2px_12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.35)]",
        
        /* Frosted Soft Sky Translucent Glass Button */
        "primary-glass":
          "bg-primary/20 text-sky-950 border border-primary/35 shadow-[0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_1.5px_rgba(255,255,255,0.85)] hover:bg-primary/30 hover:border-primary/50 hover:shadow-[0_4px_14px_rgba(0,0,0,0.06)] dark:bg-primary/25 dark:text-sky-100 dark:border-primary/40 dark:hover:bg-primary/35",
        
        /* High-Refraction Polished Crystal Glass Button */
        outline:
          "bg-white/70 text-foreground border border-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:bg-white/90 hover:border-white hover:shadow-[0_4px_14px_rgba(0,0,0,0.06)] dark:bg-white/[0.10] dark:text-foreground dark:border-white/20 dark:hover:bg-white/[0.16] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]",
        
        /* Subtle Frosted Slate Glass */
        secondary:
          "bg-slate-200/60 text-slate-800 border border-slate-300/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] hover:bg-slate-200/90 dark:bg-white/[0.08] dark:text-slate-100 dark:border-white/10 dark:hover:bg-white/[0.14]",
        
        /* Bare Ghost Glass */
        ghost:
          "text-foreground/85 hover:bg-white/60 hover:text-foreground hover:shadow-xs dark:hover:bg-white/10",
        
        /* Pure Liquid Crystal Glass */
        glass:
          "bg-white/65 text-foreground border border-white/80 shadow-[0_4px_16px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.95)] hover:bg-white/85 hover:border-white hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] dark:bg-white/12 dark:text-foreground dark:border-white/25 dark:hover:bg-white/18 dark:shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]",
        
        /* Translucent Coral Red Glass */
        destructive:
          "bg-destructive/20 text-destructive border border-destructive/35 shadow-[0_2px_10px_rgba(239,68,68,0.1),inset_0_1px_1px_rgba(255,255,255,0.6)] hover:bg-destructive/30 hover:border-destructive/50 dark:bg-destructive/25 dark:text-red-300",
        
        link: "text-primary underline-offset-4 hover:underline !backdrop-blur-none !shadow-none !border-transparent",
      },
      size: {
        default:
          "h-8.5 gap-1.5 rounded-full px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-6 gap-1 rounded-full px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7.5 gap-1.5 rounded-full px-3 text-[0.8rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-2 rounded-full px-5 text-sm [&_svg:not([class*='size-'])]:size-4",
        icon: "size-8.5 rounded-full",
        "icon-xs": "size-6 rounded-full [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7.5 rounded-full",
        "icon-lg": "size-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
