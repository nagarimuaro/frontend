import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={theme === "light" ? "Aktifkan mode gelap" : "Aktifkan mode terang"}
      className="rounded-lg w-11 h-11 border border-border bg-background hover:bg-muted text-foreground transition-colors"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun aria-hidden="true" className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0 text-amber-600" />
      <Moon aria-hidden="true" className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100 text-nagari-yellow" />
      <span className="sr-only">Ganti tema tampilan</span>
    </Button>
  );
}
