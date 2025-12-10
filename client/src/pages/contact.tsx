
import { motion } from "framer-motion";
import { 
  MapPin, Phone, Mail, Clock, Send, MessageCircle, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { useSiteSettings } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import contactImage from "@assets/generated_images/hero_background_of_nagari_sungai_pinang.png"; // Reuse hero for now

export default function Contact() {
  const { data: settingsData, isLoading } = useSiteSettings();
  const settings = settingsData?.data;

  // Fallback values
  const contactInfo = {
    address: settings?.address || settings?.contact?.address || "Kantor Wali Nagari, Kecamatan Koto XI Tarusan",
    phone: settings?.phone || settings?.contact?.phone || "+62 751 123456",
    email: settings?.email || settings?.contact?.email || "nagari@sungaipinang.go.id"
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader 
        title="Hubungi Kami" 
        description="Kami siap melayani Anda. Silakan hubungi kami melalui kontak di bawah ini atau kunjungi kantor kami."
        image={contactImage}
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm mb-4 bg-primary/10 px-4 py-1.5 rounded-full">
                <MessageCircle size={16} />
                <span>Kontak & Lokasi</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                Layanan Informasi & <br/><span className="text-primary">Pengaduan Masyarakat</span>
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Jangan ragu untuk menghubungi kami jika Anda memiliki pertanyaan, saran, atau membutuhkan bantuan terkait layanan nagari. Kami melayani dengan sepenuh hati.
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid gap-6">
                {[
                  { icon: MapPin, title: "Alamat Kantor", content: contactInfo.address, detail: "Buka: Senin - Jumat (08:00 - 16:00)" },
                  { icon: Phone, title: "Telepon & WhatsApp", content: contactInfo.phone, detail: "Layanan 24 Jam via WhatsApp" },
                  { icon: Mail, title: "Email Resmi", content: contactInfo.email, detail: "Untuk keperluan administrasi & kerjasama" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="border-none shadow-md bg-white hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6 flex items-start gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-green-50 text-primary flex items-center justify-center shrink-0 border border-primary/10 shadow-sm">
                          <item.icon size={28} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h3>
                          <p className="text-gray-800 font-medium leading-relaxed mb-1">
                            {item.content}
                          </p>
                          <p className="text-sm text-gray-500">{item.detail}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-full -mr-8 -mt-8" />
            
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2 relative z-10">Kirim Pesan</h2>
            <p className="text-gray-500 mb-8 relative z-10">Isi formulir di bawah ini, tim kami akan membalas secepatnya.</p>
            
            <form className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Nama Lengkap</label>
                  <Input placeholder="Nama anda" className="rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Email</label>
                  <Input type="email" placeholder="email@anda.com" className="rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all h-12" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Subjek</label>
                <Input placeholder="Judul pesan anda" className="rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all h-12" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Pesan</label>
                <Textarea placeholder="Tuliskan pesan anda disini..." className="min-h-[150px] rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-all resize-none p-4" />
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-white h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1">
                <Send className="mr-2 h-5 w-5" /> Kirim Pesan Sekarang
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Map */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 rounded-3xl overflow-hidden shadow-2xl h-[450px] border-8 border-white relative group"
        >
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none z-10" />
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127669.96919056463!2d100.3551061!3d-0.9345797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b942e2b117bb%3A0xb8468cb5c3046ba5!2sPadang%2C%20Padang%20City%2C%20West%20Sumatra!5e0!3m2!1sen!2sid!4v1709823456789!5m2!1sen!2sid" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="filter grayscale-[20%]"
          ></iframe>
          <div className="absolute bottom-6 left-6 z-20">
             <Button variant="secondary" className="shadow-lg font-bold">
                <MapPin className="mr-2 h-4 w-4" /> Buka di Google Maps
             </Button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
