import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Search, FileText, CheckCircle2, XCircle, AlertTriangle, Loader2, QrCode, Scan, ArrowRight
} from "lucide-react";
import { 
  Card, CardContent 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { API_BASE_URL } from "@/lib/api/endpoints";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/layout/PageHeader";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import signatureImage from "@assets/generated_images/document_archive_shelves.png";

export default function Verification() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [errorStatus, setErrorStatus] = useState<"not_found" | "invalid" | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      toast({
        title: "Peringatan",
        description: "Masukkan kode registrasi surat atau scan QR Code.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    setErrorStatus(null);
    setVerificationResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/public/verify/${verificationCode}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setVerificationResult(data.data);
      } else {
        setErrorStatus("invalid");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      setErrorStatus("invalid");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <PageBackground>
      <Navbar />
      <PageHeader 
        title="Validasi E-Dokumen" 
        description="Periksa keaslian tanda tangan elektronik (TTE) pada surat administrasi dan SK yang diterbitkan secara resmi oleh sistem Nagari Portal."
        image={signatureImage}
      />
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 flex flex-col items-center">
        
        <Card className="w-full max-w-2xl bg-white/80 dark:bg-[#0b2023]/80 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-2xl rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-600/5 dark:bg-[#3fd5ba]/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-teal-600/10 dark:bg-[#3fd5ba]/10 transition-colors" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-[0.03] pointer-events-none" />
          
          <div className="p-8 md:p-12 text-center relative z-10 border-b border-black/5 dark:border-white/5">
            <div className="w-20 h-20 bg-[#123136] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-black/5 dark:border-white/10 relative">
              <div className="absolute inset-0 rounded-full border border-teal-300 dark:border-[#3fd5ba]/30 animate-ping opacity-20" />
              <ShieldCheck size={36} className="text-teal-600 dark:text-[#3fd5ba] drop-shadow-[0_0_10px_rgba(63,213,186,0.5)]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-800 dark:text-white mb-3">Portal Verifikasi</h2>
            <p className="text-slate-600 dark:text-white/50 text-sm font-light leading-relaxed max-w-md mx-auto">
              Silakan masukkan Kode Registrasi Arsip (KRA) yang tercetak pada dokumen, atau pindai QR Code TTE menggunakan kamera scanner.
            </p>
          </div>

          <CardContent className="p-8 md:p-12 relative z-10 bg-white/[0.02]">
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="code" className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-600 dark:text-white/50 block text-center">Kode Unik Registrasi Dokumen</Label>
                <div className="relative max-w-md mx-auto group/input">
                  <div className="absolute inset-0 bg-teal-600/20 dark:bg-[#3fd5ba]/20 blur-xl rounded-full opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
                  <FileText className="absolute left-5 top-5 h-5 w-5 text-teal-600/50 dark:text-[#3fd5ba]/50 z-10" />
                  <Input 
                    id="code"
                    placeholder="Contoh: SR-2025-00123-X" 
                    className="pl-14 h-16 rounded-2xl bg-slate-50/90 dark:bg-[#0a1a1c]/80 text-center font-mono text-lg border-black/5 dark:border-white/10 text-slate-800 dark:text-white placeholder:text-slate-600 dark:text-white/20 focus:border-teal-300 dark:border-[#3fd5ba]/50 transition-all font-light shadow-inner uppercase tracking-widest relative z-10"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                  />
                  <div className="absolute right-4 top-4 z-20">
                    <Button type="button" variant="ghost" size="icon" className="hover:bg-white/5 text-slate-600 dark:text-white/40 hover:text-slate-800 dark:text-white rounded-xl">
                       <Scan className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-center">
                <Button 
                  type="submit" 
                  disabled={isVerifying || !verificationCode.trim()} 
                  className="bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] hover:bg-teal-600 dark:hover:bg-white rounded-full h-14 px-10 font-bold uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(63,213,186,0.3)] transition-all disabled:opacity-50 disabled:shadow-none min-w-[200px]"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Memeriksa Database...
                    </>
                  ) : (
                    <>
                      <Search className="mr-3 h-5 w-5" />
                      Validasi Spesimen
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Verification Result Area */}
        <div className="w-full max-w-2xl mt-12">
          <AnimatePresence mode="wait">
            {verificationResult && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full"
              >
                <div className="bg-gradient-to-br from-[#123136] to-[#0a1a1c] border border-teal-300 dark:border-[#3fd5ba]/30 rounded-[2.5rem] shadow-[0_0_40px_rgba(63,213,186,0.15)] overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-teal-600/10 dark:bg-[#3fd5ba]/10 rounded-full blur-[60px] pointer-events-none" />
                  
                  <div className="bg-teal-600/10 dark:bg-[#3fd5ba]/10 py-6 px-8 border-b border-teal-300 dark:border-[#3fd5ba]/20 flex items-center justify-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-teal-500 dark:bg-[#3fd5ba] rounded-full flex items-center justify-center shadow-md dark:shadow-[0_0_15px_rgba(63,213,186,0.5)] shrink-0">
                      <CheckCircle2 size={24} className="text-white dark:text-[#0a1a1c]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-serif text-slate-800 dark:text-white tracking-wide">Dokumen Sah & Tervalidasi</h3>
                      <p className="text-teal-600 dark:text-[#3fd5ba] text-[10px] font-bold uppercase tracking-widest mt-1">Tanda Tangan Elektronik Asli</p>
                    </div>
                  </div>
                  
                  <div className="p-8 md:p-12 space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5">
                          <p className="text-slate-600 dark:text-white/40 text-[9px] uppercase font-bold tracking-widest mb-1.5">Nomor Registrasi Surat</p>
                          <p className="font-mono font-medium text-slate-600 dark:text-white/90 text-sm">{verificationResult.nomor_surat || verificationCode}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5">
                          <p className="text-slate-600 dark:text-white/40 text-[9px] uppercase font-bold tracking-widest mb-1.5">Jenis Dokumen</p>
                          <p className="font-semibold text-slate-600 dark:text-white/90 text-sm">{verificationResult.jenis_surat || "Surat Keterangan Nagari"}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/5">
                          <p className="text-slate-600 dark:text-white/40 text-[9px] uppercase font-bold tracking-widest mb-1.5">Tanggal Terbit & Pengesahan</p>
                          <p className="font-medium text-slate-600 dark:text-white/90 text-sm">{verificationResult.tanggal_terbit || new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="bg-white dark:bg-[#0b2023] p-5 rounded-3xl border border-teal-300 dark:border-[#3fd5ba]/20 text-center h-full flex flex-col justify-center items-center relative overflow-hidden">
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-teal-600/5 dark:bg-[#3fd5ba]/5 rounded-full blur-[40px] pointer-events-none" />
                           <QrCode size={40} className="text-teal-600/30 dark:text-[#3fd5ba]/30 mb-4" />
                           <p className="text-slate-600 dark:text-white/40 text-[9px] uppercase font-bold tracking-widest mb-2">Penandatangan Dokumen</p>
                           <p className="text-lg font-bold font-serif text-slate-800 dark:text-white leading-tight mb-1">{verificationResult.penandatangan || "Wali Nagari"}</p>
                           <p className="text-teal-600 dark:text-[#3fd5ba] text-xs font-medium">Digital Signature System</p>
                           {verificationResult.jabatan && (
                             <Badge className="mt-4 bg-white/5 text-slate-600 dark:text-white/60 border border-black/5 dark:border-white/10 text-[9px] uppercase tracking-widest">{verificationResult.jabatan}</Badge>
                           )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-black/5 dark:border-white/10 flex justify-center">
                      <Button variant="outline" className="rounded-full border-teal-300 dark:border-[#3fd5ba]/30 text-teal-600 dark:text-[#3fd5ba] hover:bg-teal-600/10 dark:bg-[#3fd5ba]/10 px-8 h-12 uppercase tracking-widest text-[10px] font-bold transition-all shadow-inner" onClick={() => {setVerificationResult(null); setVerificationCode("")}}>
                        Verifikasi Dokumen Lain <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {errorStatus === "not_found" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full"
              >
                <div className="bg-[#35101a] border border-rose-500/30 rounded-[2.5rem] shadow-[0_0_40px_rgba(244,63,94,0.15)] overflow-hidden text-center p-12 relative isolate">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/10 rounded-full blur-[60px] pointer-events-none -z-10" />
                  
                  <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/30 shadow-inner">
                    <AlertTriangle size={36} className="text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-slate-800 dark:text-white mb-3">Dokumen Tidak Ditemukan</h3>
                  <p className="text-rose-200/60 font-light text-sm max-w-sm mx-auto mb-8">
                    Kode registrasi dokumen <strong>{verificationCode}</strong> tidak tercatat dalam basis data arsip Nagari.
                  </p>
                  <Button variant="outline" className="rounded-full border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:text-slate-800 dark:text-white px-8 h-12 uppercase tracking-widest text-[10px] font-bold" onClick={() => setErrorStatus(null)}>
                    Coba Kembali
                  </Button>
                </div>
              </motion.div>
            )}

            {errorStatus === "invalid" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full"
              >
                <div className="bg-[#1a0f02] border border-orange-500/30 rounded-[2.5rem] shadow-[0_0_40px_rgba(249,115,22,0.15)] overflow-hidden text-center p-12 relative isolate">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-[60px] pointer-events-none -z-10" />
                  
                  <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-500/30 shadow-inner">
                    <XCircle size={36} className="text-orange-400 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif text-slate-800 dark:text-white mb-3">Verifikasi Gagal</h3>
                  <p className="text-orange-200/60 font-light text-sm max-w-sm mx-auto mb-8">
                    Terdapat gangguan saat melakukan validasi spesimen, atau kode unik diinput dengan format yang salah.
                  </p>
                  <Button variant="outline" className="rounded-full border-orange-500/30 text-orange-400 hover:bg-orange-500/20 hover:text-slate-800 dark:text-white px-8 h-12 uppercase tracking-widest text-[10px] font-bold" onClick={() => setErrorStatus(null)}>
                    Ulangi Validasi
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
      </div>
      <Footer />
    </PageBackground>
  );
}
