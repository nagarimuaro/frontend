import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Accessibility,
  X,
  RotateCcw,
  Plus,
  Minus,
  Contrast,
  Eye,
  Type,
  Link2,
  ScanLine,
  MousePointer2,
  PauseCircle,
  Volume2,
  Square,
} from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "sinta-a11y-prefs-v1";
const TEXT_SCALES = [100, 112, 125, 138] as const;
const EASE_UI: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

interface A11yPrefs {
  textScaleIndex: number; // 0..3
  highContrast: boolean;
  grayscale: boolean;
  dyslexia: boolean;
  highlightLinks: boolean;
  readingGuide: boolean;
  largeCursor: boolean;
  pauseMotion: boolean;
  clickToRead: boolean;
}

const DEFAULT_PREFS: A11yPrefs = {
  textScaleIndex: 0,
  highContrast: false,
  grayscale: false,
  dyslexia: false,
  highlightLinks: false,
  readingGuide: false,
  largeCursor: false,
  pauseMotion: false,
  clickToRead: false,
};

function loadPrefs(): A11yPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<A11yPrefs>;
    return {
      ...DEFAULT_PREFS,
      ...parsed,
      textScaleIndex: Math.min(
        TEXT_SCALES.length - 1,
        Math.max(0, Number(parsed.textScaleIndex || 0))
      ),
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

function speakIndonesian(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleaned.slice(0, 1800));
  utterance.lang = "id-ID";
  utterance.rate = 0.95;

  const voices = window.speechSynthesis.getVoices();
  const idVoice =
    voices.find((v) => v.lang.toLowerCase().startsWith("id")) ||
    voices.find((v) => v.lang.toLowerCase().includes("ms"));
  if (idVoice) {
    utterance.voice = idVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

export default function AccessibilityWidget() {
  const osReducedMotion = Boolean(useReducedMotion());
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [prefs, setPrefs] = useState<A11yPrefs>(loadPrefs);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [guideY, setGuideY] = useState<number>(240);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const reducedMotion = osReducedMotion || prefs.pauseMotion;
  const speechSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // Apply DOM classes & root font size whenever prefs change
  useEffect(() => {
    const root = document.documentElement;
    const scale = TEXT_SCALES[prefs.textScaleIndex] ?? 100;
    root.style.fontSize = scale === 100 ? "" : `${scale}%`;

    root.classList.toggle("a11y-high-contrast", prefs.highContrast);
    root.classList.toggle("a11y-dyslexia", prefs.dyslexia);
    root.classList.toggle("a11y-highlight-links", prefs.highlightLinks);
    root.classList.toggle("a11y-large-cursor", prefs.largeCursor);
    root.classList.toggle("a11y-pause-motion", prefs.pauseMotion);
    root.classList.toggle("a11y-tts-active", prefs.clickToRead);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Ignore storage quota errors
    }
  }, [prefs]);

  // Stop speech when navigating to a new route
  useEffect(() => {
    if (speechSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [location, speechSupported]);

  // Keyboard shortcut Alt + A and Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Click outside closes panel
  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [isOpen]);

  // Track vertical pointer position for Reading Guide
  useEffect(() => {
    if (!prefs.readingGuide) return;
    const onMove = (e: PointerEvent) => {
      setGuideY(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [prefs.readingGuide]);

  // Click-to-read speech mode
  useEffect(() => {
    if (!prefs.clickToRead || !speechSupported) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return;
      }
      const readable = target.closest(
        "p, h1, h2, h3, h4, li, blockquote, td, th, dt, dd, button, a"
      ) as HTMLElement | null;
      const text = readable?.innerText?.trim();
      if (text && text.length > 1) {
        setIsSpeaking(true);
        speakIndonesian(text, () => setIsSpeaking(false));
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [prefs.clickToRead, speechSupported]);

  const stopSpeech = useCallback(() => {
    if (speechSupported) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, [speechSupported]);

  const readCurrentPage = useCallback(() => {
    if (!speechSupported) return;
    const mainEl = document.getElementById("main") || document.body;
    const text = mainEl?.innerText || "";
    if (!text.trim()) return;
    setIsSpeaking(true);
    speakIndonesian(text, () => setIsSpeaking(false));
  }, [speechSupported]);

  const togglePref = (key: Exclude<keyof A11yPrefs, "textScaleIndex">) => {
    setPrefs((prev) => {
      const nextVal = !prev[key];
      if (key === "clickToRead" && !nextVal) {
        stopSpeech();
      }
      return { ...prev, [key]: nextVal };
    });
  };

  const resetAll = () => {
    stopSpeech();
    setPrefs(DEFAULT_PREFS);
  };

  const activeCount =
    (prefs.textScaleIndex > 0 ? 1 : 0) +
    (prefs.highContrast ? 1 : 0) +
    (prefs.grayscale ? 1 : 0) +
    (prefs.dyslexia ? 1 : 0) +
    (prefs.highlightLinks ? 1 : 0) +
    (prefs.readingGuide ? 1 : 0) +
    (prefs.largeCursor ? 1 : 0) +
    (prefs.pauseMotion ? 1 : 0) +
    (prefs.clickToRead ? 1 : 0);

  const toggleItems: Array<{
    key: Exclude<keyof A11yPrefs, "textScaleIndex" | "clickToRead">;
    label: string;
    icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  }> = [
    { key: "highContrast", label: "Kontras Tinggi", icon: Contrast },
    { key: "grayscale", label: "Skala Abu-abu", icon: Eye },
    { key: "dyslexia", label: "Ramah Disleksia", icon: Type },
    { key: "highlightLinks", label: "Sorot Tautan", icon: Link2 },
    { key: "readingGuide", label: "Panduan Baca", icon: ScanLine },
    { key: "largeCursor", label: "Kursor Besar", icon: MousePointer2 },
    { key: "pauseMotion", label: "Hentikan Animasi", icon: PauseCircle },
  ];

  return (
    <>
      {/* Grayscale overlay (preserves position: fixed elements unlike root filter) */}
      {prefs.grayscale && (
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-[180]"
          style={{ backdropFilter: "grayscale(1)" }}
        />
      )}

      {/* Horizontal Reading Guide */}
      {prefs.readingGuide && (
        <div
          aria-hidden="true"
          className="fixed inset-x-0 pointer-events-none z-[170]"
          style={{ top: `${Math.max(0, guideY - 18)}px` }}
        >
          <div className="h-9 w-full bg-nagari-yellow/15 border-y-2 border-nagari-red/70" />
        </div>
      )}

      {/* Left-edge floating trigger tab (does not collide with WhatsApp right-bottom or VisitorStats left-bottom) */}
      <button
        ref={triggerRef}
        type="button"
        data-a11y-ignore="true"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="a11y-widget-panel"
        aria-label={`Menu Aksesibilitas dan Disabilitas${
          activeCount > 0 ? ` (${activeCount} fitur aktif)` : ""
        } — Pintasan Alt+A`}
        title="Menu Aksesibilitas (Alt + A)"
        className="fixed left-0 top-[44%] -translate-y-1/2 z-[120] inline-flex flex-col items-center justify-center gap-1 bg-nagari-navy text-white border border-l-0 border-white/20 rounded-r-xl shadow-lg w-11 sm:w-12 py-3 hover:w-13 active:scale-[0.98] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nagari-yellow"
      >
        <Accessibility aria-hidden="true" size={22} className="text-nagari-yellow" />
        {activeCount > 0 && (
          <span className="min-w-[20px] h-5 px-1 rounded-full bg-nagari-red text-white text-[13px] font-bold leading-none inline-flex items-center justify-center tabular-nums">
            {activeCount}
          </span>
        )}
      </button>

      {/* Expandable Accessibility Drawer/Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            ref={panelRef}
            id="a11y-widget-panel"
            role="dialog"
            aria-label="Pengaturan Aksesibilitas dan Disabilitas"
            initial={reducedMotion ? false : { opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, x: -16 }}
            transition={{ duration: 0.2, ease: EASE_UI }}
            className="fixed left-3 sm:left-4 top-[84px] max-h-[calc(100vh-110px)] w-[332px] sm:w-[368px] max-w-[calc(100vw-1.5rem)] z-[160] bg-card text-foreground border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-nagari-navy text-white px-5 py-4 flex items-start justify-between gap-3 shrink-0">
              <div className="flex items-start gap-3 min-w-0">
                <span className="w-9 h-9 rounded-lg bg-white/10 text-nagari-yellow flex items-center justify-center shrink-0">
                  <Accessibility aria-hidden="true" size={20} />
                </span>
                <div className="min-w-0">
                  <h2 className="font-serif font-bold text-base text-white leading-snug">
                    Menu Aksesibilitas
                  </h2>
                  <p className="text-[13px] text-white/75 mt-0.5">
                    Ramah disabilitas &amp; lansia (Alt + A)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                aria-label="Tutup menu aksesibilitas"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/75 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              >
                <X aria-hidden="true" size={17} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-4 sm:p-5 space-y-5 overflow-y-auto flex-1">
              {/* 1. Text Size Stepper */}
              <div className="p-4 rounded-xl bg-muted/45 border border-border space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    Ukuran Teks
                  </span>
                  <span className="text-[13px] font-semibold px-2.5 py-0.5 rounded-md bg-card border border-border text-foreground tabular-nums">
                    {TEXT_SCALES[prefs.textScaleIndex]}%
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={prefs.textScaleIndex === 0}
                    onClick={() =>
                      setPrefs((p) => ({
                        ...p,
                        textScaleIndex: Math.max(0, p.textScaleIndex - 1),
                      }))
                    }
                    aria-label="Perkecil ukuran teks"
                    className="flex-1 h-10 rounded-lg border-border bg-card text-foreground font-semibold text-sm"
                  >
                    <Minus aria-hidden="true" size={15} className="mr-1.5" />
                    Perkecil
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={prefs.textScaleIndex === TEXT_SCALES.length - 1}
                    onClick={() =>
                      setPrefs((p) => ({
                        ...p,
                        textScaleIndex: Math.min(
                          TEXT_SCALES.length - 1,
                          p.textScaleIndex + 1
                        ),
                      }))
                    }
                    aria-label="Perbesar ukuran teks"
                    className="flex-1 h-10 rounded-lg border-border bg-card text-foreground font-semibold text-sm"
                  >
                    <Plus aria-hidden="true" size={15} className="mr-1.5" />
                    Perbesar
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
                  {TEXT_SCALES.map((scale, i) => (
                    <span
                      key={scale}
                      className={`h-1.5 rounded-full transition-colors ${
                        i <= prefs.textScaleIndex ? "bg-nagari-red" : "bg-border"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* 2. Mode Suara (Indonesian TTS) */}
              {speechSupported && (
                <div className="p-4 rounded-xl bg-muted/45 border border-border space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground inline-flex items-center gap-2">
                      <Volume2
                        aria-hidden="true"
                        size={16}
                        className="text-nagari-red-ink"
                      />
                      Mode Suara (Bahasa Indonesia)
                    </span>
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-snug">
                    Bacakan isi halaman atau aktifkan klik-untuk-membaca pada teks mana pun.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {isSpeaking ? (
                      <Button
                        type="button"
                        onClick={stopSpeech}
                        className="flex-1 h-10 rounded-lg bg-nagari-red text-white hover:bg-nagari-red-ink text-[13px] font-medium"
                      >
                        <Square aria-hidden="true" size={14} className="mr-1.5" />
                        Hentikan Suara
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={readCurrentPage}
                        className="flex-1 h-10 rounded-lg bg-nagari-navy text-white hover:opacity-90 text-[13px] font-medium"
                      >
                        <Volume2 aria-hidden="true" size={15} className="mr-1.5" />
                        Bacakan Halaman
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant={prefs.clickToRead ? "default" : "outline"}
                      aria-pressed={prefs.clickToRead}
                      onClick={() => togglePref("clickToRead")}
                      className={`flex-1 h-10 rounded-lg text-[13px] font-medium ${
                        prefs.clickToRead
                          ? "bg-nagari-red text-white hover:bg-nagari-red-ink"
                          : "border-border bg-card text-foreground hover:bg-muted"
                      }`}
                    >
                      {prefs.clickToRead ? "Klik Baca: Aktif" : "Aktifkan Klik Baca"}
                    </Button>
                  </div>
                </div>
              )}

              {/* 3. Visual & Motor Toggles */}
              <div className="grid grid-cols-2 gap-2.5">
                {toggleItems.map((item) => {
                  const Icon = item.icon;
                  const active = prefs[item.key];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      aria-pressed={active}
                      onClick={() => togglePref(item.key)}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between gap-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nagari-red ${
                        active
                          ? "bg-nagari-red/10 border-nagari-red text-foreground"
                          : "bg-card border-border text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            active
                              ? "bg-nagari-red text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon aria-hidden={true} size={17} />
                        </span>
                        <span
                          aria-hidden="true"
                          className={`w-2.5 h-2.5 rounded-full ${
                            active ? "bg-nagari-red" : "bg-border"
                          }`}
                        />
                      </div>
                      <span className="text-[13px] font-semibold leading-snug">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-5 py-3.5 border-t border-border bg-muted/40 flex items-center justify-between gap-3 shrink-0">
              <span className="text-[13px] text-muted-foreground tabular-nums">
                {activeCount > 0 ? `${activeCount} fitur aktif` : "Pengaturan standar"}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={activeCount === 0}
                onClick={resetAll}
                className="h-9 px-3 rounded-lg border-border bg-card text-foreground text-[13px] font-medium"
              >
                <RotateCcw aria-hidden="true" size={14} className="mr-1.5" />
                Reset Semua
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
