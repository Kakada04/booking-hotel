export default function AdminLoading() {
  return (
    <div className="flex flex-1 items-center justify-center min-h-[60vh]">
      {/* Frosted glass loading card */}
      <div
        className="flex flex-col items-center gap-4 px-8 py-7 rounded-[24px]
          bg-background/55 backdrop-blur-2xl
          border border-white/65 dark:border-white/15
          shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.7)]
          dark:shadow-[0_8px_32px_rgba(0,0,0,0.40),inset_0_1px_1px_rgba(255,255,255,0.06)]"
      >
        {/* Spinning ring */}
        <span
          className="size-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin"
          style={{ animationDuration: "0.65s" }}
        />
        <div className="text-center space-y-0.5">
          <p className="text-sm font-bold text-foreground">Loading</p>
          <p className="text-xs text-muted-foreground font-normal">
            Fetching data…
          </p>
        </div>
      </div>
    </div>
  );
}
