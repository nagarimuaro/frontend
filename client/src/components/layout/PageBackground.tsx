import { ReactNode } from "react";

/**
 * Page background scaffold for inner routes. Neutral surface in both themes so
 * the navy/red/yellow Nagari identity (set by PageHeader and the section
 * rails) is what carries the colour — no competing teal/emerald wash.
 */
export default function PageBackground({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen font-sans bg-background transition-colors duration-200">
      <main id="main" className="relative z-10 pt-[72px]">
        {children}
      </main>
    </div>
  );
}
