import { NavLayoutToggle } from "@/features/admin/settings/components/nav-layout-toggle";

export const metadata = {
  title: "Settings — SrokHotel PMS",
  description: "Hotel policy, configuration, and display preferences.",
};

export default function SettingsGeneralPage() {
  return (
    <div className="max-w-2xl space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-base font-bold text-foreground tracking-tight">
          Settings
        </h1>
        <p className="text-xs text-muted-foreground font-normal mt-0.5">
          Hotel policy, configuration & display preferences.
        </p>
      </div>

      {/* Display & Navigation section */}
      <section
        className="p-5 rounded-[20px]
          bg-background/60 dark:bg-white/4
          border border-white/65 dark:border-white/10
          backdrop-blur-xl
          shadow-[0_4px_20px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.6)]
          dark:shadow-[0_4px_20px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.04)]
          space-y-5"
      >
        <div className="pb-3 border-b border-border">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
            Display & Navigation
          </p>
        </div>

        <NavLayoutToggle />
      </section>
    </div>
  );
}

