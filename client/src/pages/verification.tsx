import { useState, useEffect, useRef, useCallback } from "react";
import { useRoute } from "wouter";
import jsQR from "jsqr";
import {
  ShieldCheck,
  Search,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  QrCode,
  ArrowRight,
  Camera,
  CameraOff,
  User,
  Building2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { PUBLIC_API } from "@/lib/api/endpoints";
import { getTenantHeaders } from "@/lib/api/hooks";
import type { VerificationDocumentData } from "@/lib/api/types";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/layout/PageHeader";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import signatureImage from "@assets/generated_images/document_archive_shelves.png";

/**
 * Extract verification token from raw code OR full QR URL
 * e.g. "https://nagarimuaro.id/verifikasi-surat/ABC123" -> "ABC123"
 */
function extractVerificationToken(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const urlMatch = trimmed.match(/verifikasi-surat\/([^/?#]+)/i);
  if (urlMatch?.[1]) {
    try {
      return decodeURIComponent(urlMatch[1]).trim();
    } catch {
      return urlMatch[1].trim();
    }
  }

  const verifyMatch = trimmed.match(/\/verify\/([^/?#]+)/i);
  if (verifyMatch?.[1]) {
    try {
      return decodeURIComponent(verifyMatch[1]).trim();
    } catch {
      return verifyMatch[1].trim();
    }
  }

  return trimmed;
}

function formatDateIndonesian(raw?: string | null): string {
  if (!raw) return "—";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Verification() {
  const { toast } = useToast();
  const [, routeParams] = useRoute("/verifikasi-surat/:token");
  const initialToken = routeParams?.token
    ? extractVerificationToken(routeParams.token)
    : "";

  const [verificationCode, setVerificationCode] = useState(initialToken);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] =
    useState<VerificationDocumentData | null>(null);
  const [errorStatus, setErrorStatus] = useState<"not_found" | "invalid" | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  // QR Camera Scanner state
  const [scannerOpen, setScannerOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);

  const stopCamera = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const runVerification = useCallback(async (rawInput: string) => {
    const token = extractVerificationToken(rawInput);
    if (!token) {
      toast({
        title: "Kode diperlukan",
        description:
          "Masukkan kode registrasi, nomor surat, atau pindai QR Code dokumen.",
        variant: "destructive",
      });
      return;
    }

    setVerificationCode(token);
    setIsVerifying(true);
    setErrorStatus(null);
    setErrorMessage("");
    setVerificationResult(null);

    try {
      const response = await fetch(PUBLIC_API.VERIFY_SURAT(token), {
        headers: getTenantHeaders(),
      });
      const payload = await response.json();

      if (response.ok && (payload.valid || payload.success) && payload.data) {
        setVerificationResult(payload.data as VerificationDocumentData);
      } else if (response.status === 404) {
        setErrorStatus("not_found");
        setErrorMessage(
          payload?.message ||
            "Dokumen tidak tercatat dalam arsip resmi nagari ini."
        );
      } else {
        setErrorStatus("invalid");
        setErrorMessage(
          payload?.message ||
            "Format kode registrasi tidak sesuai atau verifikasi gagal."
        );
      }
    } catch {
      setErrorStatus("invalid");
      setErrorMessage("Tidak dapat terhubung ke server verifikasi. Coba lagi.");
    } finally {
      setIsVerifying(false);
    }
  }, [toast]);

  // Auto-verify when opened via /verifikasi-surat/:token
  useEffect(() => {
    if (initialToken) {
      runVerification(initialToken);
    }
  }, [initialToken, runVerification]);

  // Camera lifecycle & jsQR scan loop
  useEffect(() => {
    if (!scannerOpen) {
      stopCamera();
      return;
    }

    let cancelled = false;
    setCameraError(null);

    const startScanner = async () => {
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        setCameraError(
          "Perangkat atau browser Anda tidak mendukung akses kamera langsung. Silakan masukkan kode secara manual."
        );
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        video.setAttribute("playsinline", "true");
        await video.play();

        const scanFrame = () => {
          if (cancelled || !videoRef.current || !canvasRef.current) return;
          const v = videoRef.current;
          if (v.readyState === v.HAVE_ENOUGH_DATA && v.videoWidth > 0) {
            const canvas = canvasRef.current;
            canvas.width = v.videoWidth;
            canvas.height = v.videoHeight;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            if (ctx) {
              ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
              const imageData = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
              );
              const decoded = jsQR(
                imageData.data,
                imageData.width,
                imageData.height,
                { inversionAttempts: "dontInvert" }
              );
              if (decoded?.data) {
                const token = extractVerificationToken(decoded.data);
                stopCamera();
                setScannerOpen(false);
                toast({
                  title: "QR Code Terbaca",
                  description: "Memeriksa keaslian dokumen...",
                });
                runVerification(token);
                return;
              }
            }
          }
          rafRef.current = requestAnimationFrame(scanFrame);
        };

        rafRef.current = requestAnimationFrame(scanFrame);
      } catch {
        setCameraError(
          "Izin kamera ditolak atau kamera sedang digunakan aplikasi lain. Aktifkan izin kamera atau ketik kode surat secara manual."
        );
      }
    };

    startScanner();
    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [scannerOpen, stopCamera, runVerification, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runVerification(verificationCode);
  };

  return (
    <PageBackground>
      <Navbar />
      <PageHeader
        title="Validasi E-Dokumen (TTE)"
        description="Periksa keaslian Tanda Tangan Elektronik pada surat resmi nagari dengan memindai QR Code lewat kamera HP atau memasukkan kode surat."
        image={signatureImage}
      />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 flex flex-col items-center">
        <Card className="w-full max-w-2xl bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-6 md:p-8 text-center border-b border-border">
            <div className="w-16 h-16 bg-nagari-navy rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck
                aria-hidden="true"
                size={30}
                className="text-nagari-yellow"
              />
            </div>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
              Portal Verifikasi Dokumen
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
              Pindai QR Code yang tercetak pada surat resmi nagari atau ketik Kode Tracking / Nomor Surat di bawah ini.
            </p>
          </div>

          <CardContent className="p-6 md:p-8 space-y-6">
            {/* QR Camera Scanner Panel */}
            {scannerOpen && (
              <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground inline-flex items-center gap-2">
                    <Camera aria-hidden="true" size={16} className="text-nagari-red-ink" />
                    Arahkan Kamera ke QR Code Surat
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setScannerOpen(false)}
                    className="h-9 px-3 rounded-lg border-border text-[13px]"
                  >
                    <CameraOff aria-hidden="true" size={14} className="mr-1.5" />
                    Tutup Kamera
                  </Button>
                </div>

                {cameraError ? (
                  <p className="text-[13px] text-nagari-red-ink bg-nagari-red/10 border border-nagari-red/25 rounded-lg p-3.5 leading-relaxed">
                    {cameraError}
                  </p>
                ) : (
                  <div className="relative aspect-[4/3] w-full max-w-md mx-auto overflow-hidden rounded-xl bg-black border border-border">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                    {/* Clean viewfinder frame */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-48 h-48 rounded-2xl border-2 border-nagari-yellow shadow-[0_0_0_9999px_rgba(9,20,38,0.45)]" />
                    </div>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2.5">
                <Label
                  htmlFor="verification-code"
                  className="text-sm font-semibold text-foreground block text-center"
                >
                  Kode Verifikasi / Nomor Surat / Kode Tracking
                </Label>
                <div className="relative max-w-md mx-auto">
                  <FileText
                    aria-hidden="true"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  />
                  <Input
                    id="verification-code"
                    placeholder="Ketik kode surat atau tempel tautan QR..."
                    className="pl-10 h-12 rounded-xl text-center font-mono text-base"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button
                  type="submit"
                  disabled={isVerifying || !verificationCode.trim()}
                  className="bg-nagari-red text-white hover:bg-nagari-red-ink rounded-lg h-12 px-7 font-medium text-sm transition-colors disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <Loader2
                        aria-hidden="true"
                        className="mr-2 h-4 w-4 animate-spin"
                      />
                      Memeriksa...
                    </>
                  ) : (
                    <>
                      <Search aria-hidden="true" className="mr-2 h-4 w-4" />
                      Validasi Dokumen
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setScannerOpen((prev) => !prev)}
                  className="rounded-lg h-12 px-6 border-border text-foreground hover:bg-muted font-medium text-sm"
                >
                  {scannerOpen ? (
                    <>
                      <CameraOff aria-hidden="true" className="mr-2 h-4 w-4" />
                      Tutup Pemindai
                    </>
                  ) : (
                    <>
                      <Camera aria-hidden="true" className="mr-2 h-4 w-4 text-nagari-red-ink" />
                      Pindai QR Kamera
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Verification Result Area */}
        <div className="w-full max-w-2xl mt-8">
          {verificationResult && (
            <div className="bg-nagari-navy text-white border border-white/15 rounded-2xl overflow-hidden">
              <div className="py-5 px-6 border-b border-white/15 flex items-center gap-4">
                <div className="w-11 h-11 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle2
                    aria-hidden="true"
                    size={22}
                    className="text-emerald-300"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif text-white">
                    Dokumen Sah &amp; Tervalidasi
                  </h3>
                  <p className="text-nagari-yellow text-[13px] font-medium">
                    Tanda Tangan Elektronik Resmi Nagari
                  </p>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-3.5">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-white/70 text-[13px] mb-1">
                        Nomor / Kode Surat
                      </p>
                      <p className="font-mono font-semibold text-white text-sm break-all">
                        {verificationResult.nomor_surat || verificationCode}
                      </p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-white/70 text-[13px] mb-1">
                        Jenis Dokumen
                      </p>
                      <p className="font-semibold text-white text-sm">
                        {verificationResult.jenis_surat}
                      </p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-white/70 text-[13px] mb-1">
                        Tanggal Pengesahan
                      </p>
                      <p className="font-medium text-white text-sm">
                        {formatDateIndonesian(verificationResult.tanggal_surat)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3.5 flex flex-col">
                    <div className="bg-white/5 p-5 rounded-xl border border-white/10 text-center flex flex-col justify-center items-center flex-1">
                      <QrCode
                        aria-hidden="true"
                        size={34}
                        className="text-nagari-yellow mb-2.5"
                      />
                      <p className="text-white/70 text-[13px] mb-1">
                        Penandatangan Dokumen
                      </p>
                      <p className="text-lg font-bold font-serif text-white leading-snug mb-1">
                        {verificationResult.penandatangan?.nama || "Wali Nagari"}
                      </p>
                      <p className="text-nagari-yellow text-[13px] font-medium">
                        {verificationResult.penandatangan?.jabatan ||
                          "Wali Nagari"}
                      </p>
                      {verificationResult.nagari && (
                        <Badge className="mt-3 bg-white/10 text-white border border-white/15 text-[13px] font-medium">
                          <Building2
                            aria-hidden="true"
                            size={13}
                            className="mr-1.5"
                          />
                          {verificationResult.nagari}
                        </Badge>
                      )}
                    </div>

                    {verificationResult.pemohon && (
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <p className="text-white/70 text-[13px] mb-1 inline-flex items-center gap-1.5">
                          <User aria-hidden="true" size={13} />
                          Pemohon (Terlindungi)
                        </p>
                        <p className="font-semibold text-white text-sm">
                          {verificationResult.pemohon.nama}
                        </p>
                        <p className="font-mono text-[13px] text-white/75 mt-0.5 tabular-nums">
                          NIK: {verificationResult.pemohon.nik_masked}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/15 flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-lg border-white/25 bg-white/10 text-white hover:bg-white/20 px-6 h-11 text-sm font-medium"
                    onClick={() => {
                      setVerificationResult(null);
                      setVerificationCode("");
                    }}
                  >
                    Verifikasi Dokumen Lain
                    <ArrowRight aria-hidden="true" className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {errorStatus === "not_found" && (
            <div className="bg-card border border-nagari-red/40 rounded-2xl text-center p-8 md:p-10">
              <div className="w-14 h-14 bg-nagari-red/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle
                  aria-hidden="true"
                  size={28}
                  className="text-nagari-red-ink"
                />
              </div>
              <h3 className="text-xl font-bold font-serif text-foreground mb-2">
                Dokumen Tidak Ditemukan
              </h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6 leading-relaxed">
                {errorMessage ||
                  `Kode "${verificationCode}" tidak tercatat dalam arsip resmi nagari ini.`}
              </p>
              <Button
                type="button"
                variant="outline"
                className="rounded-lg h-11 px-6 text-sm font-medium"
                onClick={() => setErrorStatus(null)}
              >
                Coba Kembali
              </Button>
            </div>
          )}

          {errorStatus === "invalid" && (
            <div className="bg-card border border-nagari-red/40 rounded-2xl text-center p-8 md:p-10">
              <div className="w-14 h-14 bg-nagari-red/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <XCircle
                  aria-hidden="true"
                  size={28}
                  className="text-nagari-red-ink"
                />
              </div>
              <h3 className="text-xl font-bold font-serif text-foreground mb-2">
                Verifikasi Gagal
              </h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6 leading-relaxed">
                {errorMessage ||
                  "Terjadi gangguan saat memeriksa spesimen atau format kode registrasi tidak sesuai."}
              </p>
              <Button
                type="button"
                variant="outline"
                className="rounded-lg h-11 px-6 text-sm font-medium"
                onClick={() => setErrorStatus(null)}
              >
                Ulangi Validasi
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </PageBackground>
  );
}
