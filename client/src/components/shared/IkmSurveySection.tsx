import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  Star,
  CheckCircle2,
  Send,
  Loader2,
  Award,
  MessageSquareText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSurveySummary, useSubmitSurvey, useSiteSettings } from "@/lib/api";
import { getTenantName } from "@/lib/tenant-name";

const RATING_OPTIONS = [
  { value: 4, label: "Sangat Puas", short: "4 / 4" },
  { value: 3, label: "Puas", short: "3 / 4" },
  { value: 2, label: "Cukup", short: "2 / 4" },
  { value: 1, label: "Kurang Puas", short: "1 / 4" },
] as const;

function getTodayStorageKey(): string {
  if (typeof window === "undefined") return "";
  const today = new Date().toISOString().slice(0, 10);
  return `${window.location.hostname}:ikm-voted:${today}`;
}

export default function IkmSurveySection({
  category = "Portal & Layanan Nagari",
}: {
  category?: string;
}) {
  const [location] = useLocation();
  const queryClient = useQueryClient();
  const { data: summaryResponse } = useSurveySummary();
  const { data: settingsResponse } = useSiteSettings();
  const submitSurvey = useSubmitSurvey();

  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submittedToday, setSubmittedToday] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const summary = summaryResponse?.data;
  const tenantName = getTenantName(settingsResponse?.data);

  const storageKey = useMemo(() => getTodayStorageKey(), []);

  useEffect(() => {
    if (!storageKey) return;
    try {
      if (localStorage.getItem(storageKey) === "1") {
        setSubmittedToday(true);
      }
    } catch {
      // Ignore storage errors
    }
  }, [storageKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRating) {
      setFeedbackError("Pilih salah satu tingkat kepuasan terlebih dahulu.");
      return;
    }

    setFeedbackError(null);
    try {
      const res = await submitSurvey.mutateAsync({
        rating: selectedRating,
        category,
        comment: comment.trim() || undefined,
        page_path: location,
      });

      if (res?.data) {
        queryClient.setQueryData(["public-survey-summary"], res);
      } else {
        queryClient.invalidateQueries({ queryKey: ["public-survey-summary"] });
      }

      setSubmittedToday(true);
      setComment("");
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, "1");
        } catch {
          // Ignore
        }
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menyimpan penilaian. Coba lagi.";
      setFeedbackError(msg);
      if (msg.toLowerCase().includes("sudah mengisi")) {
        setSubmittedToday(true);
      }
    }
  };

  const totalRespondents = summary?.total_respondents ?? 0;
  const ikmScore = summary?.ikm_score ?? 0;
  const predicate = summary?.predicate ?? null;

  return (
    <section
      aria-label="Survei Kepuasan Masyarakat"
      className="py-12 md:py-16 px-4 md:px-6 bg-background"
    >
      <div className="container mx-auto">
        <Card className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="grid lg:grid-cols-12">
            {/* Left Score Anchor */}
            <div className="lg:col-span-5 bg-nagari-navy text-white p-6 md:p-8 flex flex-col justify-between gap-6">
              <div>
                <p className="inline-flex items-center gap-2 text-nagari-yellow text-[13px] font-semibold mb-3">
                  <Award aria-hidden="true" size={15} />
                  Indeks Kepuasan Masyarakat (IKM)
                </p>
                <h2 className="font-serif font-bold text-2xl md:text-3xl text-white leading-snug">
                  Bagaimana pelayanan {tenantName}?
                </h2>
                <p className="text-sm text-white/80 mt-2 leading-relaxed">
                  Penilaian singkat Anda membantu perangkat nagari meningkatkan kualitas layanan publik secara berkelanjutan.
                </p>
              </div>

              <div className="pt-5 border-t border-white/15 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[13px] text-white/75 mb-1">
                    Skor IKM Terkini
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-serif font-bold text-white tabular-nums leading-none">
                      {totalRespondents > 0
                        ? ikmScore.toLocaleString("id-ID", {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                          })
                        : "—"}
                    </span>
                    {totalRespondents > 0 && (
                      <span className="text-sm text-white/70 tabular-nums">
                        / 100
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  {predicate && (
                    <span className="inline-block px-3 py-1 rounded-md bg-white/10 border border-white/15 text-nagari-yellow text-[13px] font-semibold">
                      {predicate}
                    </span>
                  )}
                  <p className="text-[13px] text-white/75 mt-1.5 tabular-nums">
                    {totalRespondents > 0
                      ? `${totalRespondents.toLocaleString("id-ID")} responden`
                      : "Jadilah responden pertama"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Interactive Rating Form */}
            <CardContent className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-center">
              {submittedToday ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-cat-3/10 text-cat-3 flex items-center justify-center mx-auto">
                    <CheckCircle2 aria-hidden="true" size={26} />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-foreground">
                    Terima Kasih atas Penilaian Anda
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Masukan Anda sudah dicatat untuk {tenantName} dan akan menjadi bahan evaluasi peningkatan layanan nagari.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-3">
                      Pilih tingkat kepuasan Anda:
                    </p>
                    <div
                      role="radiogroup"
                      aria-label="Tingkat kepuasan layanan nagari"
                      className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                    >
                      {RATING_OPTIONS.map((opt) => {
                        const active = selectedRating === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => {
                              setSelectedRating(opt.value);
                              setFeedbackError(null);
                            }}
                            className={`p-3.5 rounded-xl border text-left transition-all duration-150 active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nagari-red ${
                              active
                                ? "bg-nagari-red text-white border-nagari-red"
                                : "bg-muted/40 text-foreground border-border hover:bg-muted hover:border-foreground/25"
                            }`}
                          >
                            <div className="flex items-center gap-0.5 mb-2" aria-hidden="true">
                              {Array.from({ length: opt.value }).map((_, idx) => (
                                <Star
                                  key={idx}
                                  size={14}
                                  className={
                                    active
                                      ? "fill-nagari-yellow text-nagari-yellow"
                                      : "fill-nagari-red text-nagari-red"
                                  }
                                />
                              ))}
                            </div>
                            <p className="text-sm font-semibold leading-snug">
                              {opt.label}
                            </p>
                            <p
                              className={`text-[13px] tabular-nums mt-0.5 ${
                                active ? "text-white/80" : "text-muted-foreground"
                              }`}
                            >
                              {opt.short}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="ikm-comment"
                      className="text-sm font-medium text-foreground inline-flex items-center gap-1.5"
                    >
                      <MessageSquareText
                        aria-hidden="true"
                        size={15}
                        className="text-muted-foreground"
                      />
                      Saran atau masukan singkat (opsional)
                    </label>
                    <Textarea
                      id="ikm-comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      maxLength={500}
                      rows={2}
                      placeholder="Tuliskan saran agar layanan nagari semakin baik..."
                      className="rounded-xl bg-background border-border text-base resize-none"
                    />
                  </div>

                  {feedbackError && (
                    <p
                      role="alert"
                      className="text-[13px] font-medium text-nagari-red-ink"
                    >
                      {feedbackError}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[13px] text-muted-foreground">
                      Anonim · 1 penilaian per hari per perangkat.
                    </p>
                    <Button
                      type="submit"
                      disabled={submitSurvey.isPending || !selectedRating}
                      className="bg-nagari-red text-white hover:bg-nagari-red-ink rounded-lg h-11 px-6 text-sm font-medium active:scale-[0.985]"
                    >
                      {submitSurvey.isPending ? (
                        <>
                          <Loader2
                            aria-hidden="true"
                            size={16}
                            className="mr-2 animate-spin"
                          />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Send aria-hidden="true" size={15} className="mr-2" />
                          Kirim Penilaian
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </div>
        </Card>
      </div>
    </section>
  );
}
