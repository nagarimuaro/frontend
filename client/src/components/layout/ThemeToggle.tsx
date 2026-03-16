import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full w-9 h-9 border border-black/10 dark:border-white/10 bg-white/5 hover:bg-black/5 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white transition-all shadow-sm dark:shadow-none"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-[#3fd5ba]" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
