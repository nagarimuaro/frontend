
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader 
        title="Layanan Pengaduan" 
        description="Sampaikan aspirasi, saran, dan pengaduan Anda untuk kemajuan Nagari. Identitas pelapor dijamin kerahasiaannya."
        image={complaintImage}
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Track Complaint Section */}
          <Card className="mb-8 border-none shadow-md">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">Lacak Status Pengaduan</h3>
              <div className="flex gap-4">
                <Input 
                  placeholder="Masukkan ID Pengaduan..." 
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleTrackComplaint} disabled={isTracking}>
                  {isTracking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                  Lacak
                </Button>
              </div>
              {trackedComplaint?.data && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900">{trackedComplaint.data.judul}</p>
                      <p className="text-sm text-gray-500 mt-1">Kategori: {trackedComplaint.data.kategori}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      trackedComplaint.data.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                      trackedComplaint.data.status === 'Diproses' ? 'bg-blue-100 text-blue-700' :
                      trackedComplaint.data.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {trackedComplaint.data.status}
                    </span>
                  </div>
                  {trackedComplaint.data.tanggapan && (
                    <div className="mt-3 p-3 bg-white rounded border">
                      <p className="text-sm font-medium text-gray-700">Tanggapan:</p>
                      <p className="text-sm text-gray-600">{trackedComplaint.data.tanggapan}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
          
          {/* Success Message */}
          {submitSuccess && submittedId && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
                <div>
                  <h3 className="font-bold text-green-800 text-lg">Laporan Berhasil Dikirim!</h3>
                  <p className="text-green-700">ID Pengaduan Anda: <span className="font-mono font-bold">{submittedId}</span></p>
                  <p className="text-sm text-green-600 mt-1">Simpan ID ini untuk melacak status pengaduan Anda.</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => { setSubmitSuccess(false); setSubmittedId(null); }}
              >
                Buat Laporan Baru
              </Button>
            </motion.div>
          )}
          
          {!submitSuccess && (
          <Card className="border-t-4 border-t-primary shadow-lg">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-serif">Formulir Pengaduan Masyarakat</CardTitle>
              <CardDescription>
                Silakan isi formulir di bawah ini dengan data yang valid.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nama Lengkap (Opsional)</label>
                    <Input 
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      placeholder="Nama pelapor" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">NIK (Opsional)</label>
                    <Input 
                      name="nik"
                      value={formData.nik}
                      onChange={handleInputChange}
                      placeholder="Nomor Induk Kependudukan" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <label className="text-sm font-medium">Nomor WhatsApp (Opsional)</label>
                    <Input 
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="08xxxxxxxxxx" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Kategori Pengaduan <span className="text-red-500">*</span></label>
                    <Select value={formData.kategori} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={categoriesLoading ? "Memuat..." : "Pilih kategori"} />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesLoading ? (
                          <SelectItem value="loading" disabled>Memuat...</SelectItem>
                        ) : Array.isArray(categories) && categories.length > 0 ? (
                          categories.map((cat: any, idx: number) => (
                            <SelectItem key={idx} value={typeof cat === 'string' ? cat : (cat.slug || cat.name || String(idx))}>
                              {typeof cat === 'string' ? cat : (cat.name || cat)}
                            </SelectItem>
                          ))
                        ) : (
                          <>
                            <SelectItem value="Infrastruktur">Infrastruktur & Pembangunan</SelectItem>
                            <SelectItem value="Pelayanan">Pelayanan Publik</SelectItem>
                            <SelectItem value="Keamanan">Keamanan & Ketertiban</SelectItem>
                            <SelectItem value="Kebersihan">Kebersihan</SelectItem>
                            <SelectItem value="Lainnya">Lainnya</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Judul Laporan <span className="text-red-500">*</span></label>
                  <Input 
                    name="judul"
                    value={formData.judul}
                    onChange={handleInputChange}
                    placeholder="Inti permasalahan" 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Isi Laporan <span className="text-red-500">*</span></label>
                  <Textarea 
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    placeholder="Jelaskan kronologi atau detail permasalahan secara lengkap..." 
                    className="min-h-[150px]" 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Lampiran Bukti (Opsional)</label>
                  <Input type="file" />
                  <p className="text-xs text-muted-foreground">Format: JPG, PNG, PDF. Max: 5MB.</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3 text-yellow-800 text-sm">
                  <AlertTriangle className="shrink-0 w-5 h-5" />
                  <p>Dengan mengirimkan laporan ini, saya menyatakan bahwa data yang saya sampaikan adalah benar dan dapat dipertanggungjawabkan.</p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 h-12 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" /> Kirim Laporan
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          )}

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">1. Kirim Laporan</h3>
              <p className="text-sm text-gray-500">Isi formulir pengaduan dengan lengkap dan jelas.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">2. Verifikasi</h3>
              <p className="text-sm text-gray-500">Admin akan memverifikasi laporan Anda (Max 2x24 Jam).</p>
            </div>
             <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">3. Tindak Lanjut</h3>
              <p className="text-sm text-gray-500">Laporan ditindaklanjuti oleh instansi terkait.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
