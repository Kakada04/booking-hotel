import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-24 w-full min-w-0 rounded-[14px] border border-black/10 bg-white/40 px-3.5 py-2.5 text-sm backdrop-blur-md shadow-[inset_0_1px_1px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.7)] transition-all duration-200 outline-none placeholder:text-muted-foreground/70 hover:bg-white/50 focus-visible:bg-white/60 focus-visible:border-primary/60 focus-visible:ring-3 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-white/[0.06] dark:border-white/15 dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)] dark:placeholder:text-muted-foreground/60 dark:hover:bg-white/[0.09] dark:focus-visible:bg-white/[0.12] dark:focus-visible:border-primary dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 resize-y",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
