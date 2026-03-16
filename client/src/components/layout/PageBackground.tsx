import { ReactNode } from "react";

export default function PageBackground({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen font-sans overflow-x-hidden bg-emerald-50/30 dark:bg-[#0a1a1c] transition-colors duration-500">
      {/* ===== LIGHTWEIGHT STATIC BACKGROUND ===== */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Simple static gradient — no blur, no animation, GPU-friendly */}
        <div className="absolute inset-0 bg-gradient-to-b from-teal-100/40 via-emerald-50/30 to-teal-100/30 dark:from-[#123136] dark:via-[#0a1a1c] dark:to-[#061011]" />
      </div>

      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
}
