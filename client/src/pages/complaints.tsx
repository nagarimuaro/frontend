import { useState } from "react";
import { motion } from "framer-motion";
import { 
  AlertTriangle, Send, CheckCircle2, Loader2, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { useComplaintCategories, useComplaintStats, useSubmitComplaint, useTrackComplaint } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import complaintImage from "@assets/generated_images/customer_service_counter.png"; // Reuse service image

export default function Complaints() {
  const { data: categoriesData, isLoading: categoriesLoading } = useComplaintCategories();
  const { data: statsData } = useComplaintStats();
  const submitComplaint = useSubmitComplaint();
  const { toast } = useToast();
  
  const categories = categoriesData?.data || [];
  
  // Form state
  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    whatsapp: "",
    kategori: "",
    judul: "",
    deskripsi: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  
  // Track complaint state
  const [trackingId, setTrackingId] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const { data: trackedComplaint, refetch: refetchTracking } = useTrackComplaint(trackingId);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, kategori: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.judul || !formData.deskripsi || !formData.kategori) {
      toast({
        title: "Validasi Gagal",
        description: "Mohon lengkapi judul, kategori, dan isi laporan.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await submitComplaint.mutateAsync({
        judul: formData.judul,
        deskripsi: formData.deskripsi,
        kategori: formData.kategori,
        prioritas: "Sedang",
        lokasi: {
          address: formData.nama ? `Pelapor: ${formData.nama}` : undefined
        }
      });
      
      setSubmitSuccess(true);
      setSubmittedId(response.data?.id?.toString() || null);
      
      toast({
        title: "Laporan Terkirim!",
        description: `ID Pengaduan Anda: ${response.data?.id}. Simpan ID ini untuk melacak status.`,
      });
      
      // Reset form
      setFormData({
        nama: "",
        nik: "",
        whatsapp: "",
        kategori: "",
        judul: "",
        deskripsi: "",
      });
      
    } catch (error) {
      toast({
        title: "Gagal Mengirim",
        description: "Terjadi kesalahan saat mengirim laporan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleTrackComplaint = async () => {
    if (!trackingId) {
      toast({
        title: "ID Diperlukan",
        description: "Masukkan ID pengaduan untuk melacak status.",
        variant: "destructive",
      });
      return;
    }
    setIsTracking(true);
    await refetchTracking();
    setIsTracking(false);
  };

  return (
    <PageBackground>
      <Navbar />
      <PageHeader 
        title="Layanan Pengaduan" 
        description="Sampaikan aspirasi, saran, dan pengaduan Anda untuk kemajuan Nagari. Identitas pelapor dijamin kerahasiaannya."
        image={complaintImage}
      />
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Card untuk Lacak Laporan */}
          <Card className="bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-lg relative overflow-hidden rounded-3xl">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-600/5 dark:bg-[#3fd5ba]/5 rounded-full blur-[50px] pointer-events-none" />
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Search className="text-teal-600 dark:text-[#3fd5ba] w-5 h-5" />
                <h3 className="font-serif font-bold text-xl text-slate-800 dark:text-white">Lacak Status Pengaduan</h3>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full">
                <Input 
                  placeholder="Ketik ID Pengaduan Anda..." 
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="flex-1 bg-white/5 border-black/5 dark:border-white/10 text-slate-800 dark:text-white placeholder:text-slate-600 dark:text-white/30 h-12 rounded-xl focus:border-teal-300 dark:border-[#3fd5ba]/50 focus:bg-white/10 transition-colors"
                />
                <Button 
                  onClick={handleTrackComplaint} 
                  disabled={isTracking}
                  className="bg-teal-500 dark:bg-[#3fd5ba] hover:bg-teal-600 dark:hover:bg-white text-white dark:text-[#0a1a1c] h-12 px-8 rounded-xl shrink-0 font-bold uppercase tracking-wider text-xs shadow-sm dark:shadow-[0_0_15px_rgba(63,213,186,0.3)]"
                >
                  {isTracking ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
                  Lacak
                </Button>
              </div>
              
              {/* Hasil Lacak */}
              {trackedComplaint?.data && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-6 bg-[#143236] border border-teal-300 dark:border-[#3fd5ba]/20 rounded-2xl"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-4">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white text-lg">{trackedComplaint.data.judul}</p>
                      <p className="text-sm text-slate-600 dark:text-white/50 mt-1 uppercase tracking-widest font-bold text-[10px]">Kategori: {trackedComplaint.data.kategori}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg ${
                      trackedComplaint.data.status === 'Selesai' ? 'bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c]' :
                      trackedComplaint.data.status === 'Diproses' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' :
                      trackedComplaint.data.status === 'Ditolak' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                      'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50'
                    }`}>
                      {trackedComplaint.data.status}
                    </span>
                  </div>
                  {trackedComplaint.data.tanggapan && (
                    <div className="mt-5 p-5 bg-slate-50 dark:bg-[#0a1a1c] rounded-xl border border-black/5 dark:border-white/5">
                      <p className="text-xs uppercase tracking-widest font-bold text-teal-600 dark:text-[#3fd5ba] mb-2">Tanggapan Resmi:</p>
                      <p className="text-sm text-slate-600 dark:text-white/80 leading-relaxed font-light">{trackedComplaint.data.tanggapan}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
          
          {/* Laporan Berhasil Dikirim */}
          {submitSuccess && submittedId && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 bg-[#143236] border border-teal-300 dark:border-[#3fd5ba]/50 rounded-3xl shadow-[0_0_30px_rgba(63,213,186,0.1)] text-center"
            >
              <div className="w-20 h-20 mx-auto bg-teal-600/10 dark:bg-[#3fd5ba]/10 rounded-full flex items-center justify-center mb-6">
                 <CheckCircle2 className="w-10 h-10 text-teal-600 dark:text-[#3fd5ba]" />
              </div>
              <h3 className="font-serif font-bold text-slate-800 dark:text-white text-2xl mb-2">Laporan Berhasil Terkirim!</h3>
              <p className="text-slate-600 dark:text-white/60 font-light mb-6">Terima kasih atas aspirasi Anda. ID Pengaduan Anda:</p>
              
              <div className="bg-slate-50 dark:bg-[#0a1a1c] p-4 rounded-xl border border-black/5 dark:border-white/10 inline-block mb-8">
                 <span className="font-mono text-2xl font-bold text-teal-600 dark:text-[#3fd5ba] tracking-widest">{submittedId}</span>
              </div>
              
              <p className="text-xs text-slate-600 dark:text-white/40 uppercase tracking-widest font-bold mb-8">
                *Simpan ID ini untuk melacak status respon dari Nagari
              </p>

              <Button 
                variant="outline" 
                className="rounded-full bg-white/5 border-black/5 dark:border-white/10 text-slate-800 dark:text-white hover:bg-teal-600/20 dark:bg-[#3fd5ba]/20 hover:text-teal-600 dark:text-[#3fd5ba] transition-colors"
                onClick={() => { setSubmitSuccess(false); setSubmittedId(null); }}
              >
                Buat Laporan Baru
              </Button>
            </motion.div>
          )}
          
          {/* Formulir */}
          {!submitSuccess && (
          <Card className="bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md shadow-2xl rounded-[2.5rem] border border-black/5 dark:border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3fd5ba] to-transparent" />
            
            <CardHeader className="text-center pb-8 pt-12 relative z-10 border-b border-black/5 dark:border-white/5">
              <CardTitle className="text-3xl font-serif text-slate-800 dark:text-white mb-3">Formulir Pengaduan</CardTitle>
              <CardDescription className="text-slate-600 dark:text-white/50 text-base font-light">
                Silakan isi formulir di bawah dengan data valid agar kami mudah menindaklanjuti.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 md:p-12 relative z-10">
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-white/50 uppercase tracking-widest">Nama Lengkap (Opsional)</label>
                    <Input 
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      placeholder="Identitas Anda..." 
                      className="bg-white/5 border-black/5 dark:border-white/10 text-slate-800 dark:text-white placeholder:text-slate-600 dark:text-white/20 rounded-xl h-12 focus:border-teal-300 dark:border-[#3fd5ba]/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-white/50 uppercase tracking-widest">NIK (Opsional)</label>
                    <Input 
                      name="nik"
                      value={formData.nik}
                      onChange={handleInputChange}
                      placeholder="16 Digit NIK..." 
                      className="bg-white/5 border-black/5 dark:border-white/10 text-slate-800 dark:text-white placeholder:text-slate-600 dark:text-white/20 rounded-xl h-12 focus:border-teal-300 dark:border-[#3fd5ba]/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-600 dark:text-white/50 uppercase tracking-widest">Nomor WhatsApp (Opsional)</label>
                    <Input 
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="08xxxxxxxxxx" 
                      className="bg-white/5 border-black/5 dark:border-white/10 text-slate-800 dark:text-white placeholder:text-slate-600 dark:text-white/20 rounded-xl h-12 focus:border-teal-300 dark:border-[#3fd5ba]/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-teal-600 dark:text-[#3fd5ba] uppercase tracking-widest flex items-center gap-1">Kategori Laporan <span className="text-red-400">*</span></label>
                    <Select value={formData.kategori} onValueChange={handleCategoryChange}>
                      <SelectTrigger className="bg-white/5 border-black/5 dark:border-white/10 text-slate-800 dark:text-white rounded-xl h-12 focus:border-teal-300 dark:border-[#3fd5ba]/50 focus:ring-0">
                        <SelectValue placeholder={categoriesLoading ? "Memuat..." : "-- Pilih Kategori --"} />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-[#0b2023] border border-black/5 dark:border-white/10 text-slate-800 dark:text-white rounded-xl shadow-xl">
                        {categoriesLoading ? (
                          <SelectItem value="loading" disabled>Memuat...</SelectItem>
                        ) : Array.isArray(categories) && categories.length > 0 ? (
                          categories.map((cat: any, idx: number) => (
                            <SelectItem key={idx} value={typeof cat === 'string' ? cat : (cat.slug || cat.name || String(idx))} className="focus:bg-white/10 focus:text-slate-800 dark:text-white cursor-pointer py-3 rounded-lg mx-1">
                              {typeof cat === 'string' ? cat : (cat.name || cat)}
                            </SelectItem>
                          ))
                        ) : (
                          <>
                            <SelectItem value="Infrastruktur" className="focus:bg-white/10 focus:text-slate-800 dark:text-white cursor-pointer py-3 rounded-lg mx-1">Infrastruktur & Pembangunan</SelectItem>
                            <SelectItem value="Pelayanan" className="focus:bg-white/10 focus:text-slate-800 dark:text-white cursor-pointer py-3 rounded-lg mx-1">Pelayanan Publik</SelectItem>
                            <SelectItem value="Keamanan" className="focus:bg-white/10 focus:text-slate-800 dark:text-white cursor-pointer py-3 rounded-lg mx-1">Keamanan & Ketertiban</SelectItem>
                            <SelectItem value="Kebersihan" className="focus:bg-white/10 focus:text-slate-800 dark:text-white cursor-pointer py-3 rounded-lg mx-1">Kebersihan</SelectItem>
                            <SelectItem value="Lainnya" className="focus:bg-white/10 focus:text-slate-800 dark:text-white cursor-pointer py-3 rounded-lg mx-1">Lainnya</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-teal-600 dark:text-[#3fd5ba] uppercase tracking-widest flex items-center gap-1">Judul Laporan <span className="text-red-400">*</span></label>
                  <Input 
                    name="judul"
                    value={formData.judul}
                    onChange={handleInputChange}
                    placeholder="Contoh: Lampu penerangan jalan RT 01 mati total" 
                    required
                    className="bg-white/5 border-black/5 dark:border-white/10 text-slate-800 dark:text-white placeholder:text-slate-600 dark:text-white/20 rounded-xl h-12 focus:border-teal-300 dark:border-[#3fd5ba]/50 transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-teal-600 dark:text-[#3fd5ba] uppercase tracking-widest flex items-center gap-1">Isi Laporan Spesifik <span className="text-red-400">*</span></label>
                  <Textarea 
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    placeholder="Sebutkan detail, lokasi yang jelas, waktu kejadian, dll..." 
                    className="min-h-[160px] bg-white/5 border-black/5 dark:border-white/10 text-slate-800 dark:text-white placeholder:text-slate-600 dark:text-white/20 rounded-xl p-4 focus:border-teal-300 dark:border-[#3fd5ba]/50 transition-colors resize-none" 
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-white/50 uppercase tracking-widest">Lampiran Bukti Foto/PDF (Opsional)</label>
                  <div className="relative group/upload">
                    <Input type="file" className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10" />
                    <div className="bg-white/5 border border-dashed border-black/5 dark:border-white/20 group-hover/upload:border-teal-300 dark:border-[#3fd5ba]/50 group-hover/upload:bg-teal-600/5 dark:bg-[#3fd5ba]/5 rounded-xl text-center py-6 px-4 transition-all flex flex-col items-center justify-center">
                       <Send className="w-8 h-8 text-slate-600 dark:text-white/30 mb-2 group-hover/upload:text-teal-600 dark:text-[#3fd5ba] transition-colors" />
                       <span className="text-slate-600 dark:text-white/60 text-sm group-hover/upload:text-slate-800 dark:text-white">Klik atau seret file ke sini</span>
                       <span className="text-slate-600 dark:text-white/30 text-xs mt-1">Format: JPG/PNG/PDF (Maks 5MB)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5 flex gap-4 text-yellow-500/80 text-sm">
                  <AlertTriangle className="shrink-0 w-5 h-5 text-yellow-500 mt-0.5" />
                  <p className="font-light leading-relaxed">
                    Dengan mengirimkan laporan ini, saya bersedia mempertanggungjawabkan data yang disampaikan. Identitas Anda akan dirahasiakan jika diperlukan.
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-teal-500 dark:bg-[#3fd5ba] hover:bg-teal-600 dark:hover:bg-white text-white dark:text-[#0a1a1c] h-14 rounded-xl shadow-[0_0_20px_rgba(63,213,186,0.3)] transition-all uppercase tracking-widest font-bold text-sm hover:-translate-y-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" /> Kirim Laporan Sekarang
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          )}

          {/* How It Works Steps */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {[
               { icon: Send, title: "1. Kirim Laporan", desc: "Sampaikan aspirasi dengan detail valid." },
               { icon: CheckCircle2, title: "2. Verifikasi Info", desc: "Admin cek validitas (Maks 2x24 Jam)." },
               { icon: AlertTriangle, title: "3. Tindak Lanjut", desc: "Pihak Nagari eksekusi & beri respon." }
            ].map((step, idx) => (
              <div key={idx} className="bg-white/80 dark:bg-[#0b2023]/40 backdrop-blur border border-black/5 dark:border-white/5 rounded-2xl p-6 text-center group hover:bg-white/5 hover:border-black/5 dark:border-white/10 transition-all">
                <div className="w-14 h-14 mx-auto rounded-full bg-white/5 flex items-center justify-center text-slate-600 dark:text-white/50 mb-5 group-hover:scale-110 group-hover:text-teal-600 dark:text-[#3fd5ba] group-hover:bg-teal-600/10 dark:bg-[#3fd5ba]/10 transition-all duration-300">
                   <step.icon size={24} />
                </div>
                <h3 className="text-slate-800 dark:text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-slate-600 dark:text-white/40 text-sm font-light leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </PageBackground>
  );
}
