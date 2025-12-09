
import { motion } from "framer-motion";
import { 
  AlertTriangle, Send, CheckCircle2 
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
import PageHeader from "@/components/layout/PageHeader";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import complaintImage from "@assets/generated_images/customer_service_counter.png"; // Reuse service image

export default function Complaints() {
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
          <Card className="border-t-4 border-t-primary shadow-lg">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-serif">Formulir Pengaduan Masyarakat</CardTitle>
              <CardDescription>
                Silakan isi formulir di bawah ini dengan data yang valid.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nama Lengkap (Sesuai KTP)</label>
                    <Input placeholder="Nama pelapor" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">NIK</label>
                    <Input placeholder="Nomor Induk Kependudukan" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <label className="text-sm font-medium">Nomor WhatsApp</label>
                    <Input placeholder="08xxxxxxxxxx" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Kategori Pengaduan</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="infrastruktur">Infrastruktur & Pembangunan</SelectItem>
                        <SelectItem value="layanan">Pelayanan Publik</SelectItem>
                        <SelectItem value="sosial">Bantuan Sosial</SelectItem>
                        <SelectItem value="keamanan">Keamanan & Ketertiban</SelectItem>
                        <SelectItem value="lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Judul Laporan</label>
                  <Input placeholder="Inti permasalahan" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Isi Laporan</label>
                  <Textarea placeholder="Jelaskan kronologi atau detail permasalahan secara lengkap..." className="min-h-[150px]" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Lampiran Bukti (Foto/Dokumen)</label>
                  <Input type="file" />
                  <p className="text-xs text-muted-foreground">Format: JPG, PNG, PDF. Max: 5MB.</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3 text-yellow-800 text-sm">
                  <AlertTriangle className="shrink-0 w-5 h-5" />
                  <p>Dengan mengirimkan laporan ini, saya menyatakan bahwa data yang saya sampaikan adalah benar dan dapat dipertanggungjawabkan.</p>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 h-12 text-lg">
                  <Send className="mr-2 h-5 w-5" /> Kirim Laporan
                </Button>
              </form>
            </CardContent>
          </Card>

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
