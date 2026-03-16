import { motion } from "framer-motion";
import { 
  MapPin, Phone, Mail, Send, MessageCircle, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, CardContent 
} from "@/components/ui/card";
import { useSiteSettings } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import contactImage from "@assets/generated_images/hero_background_of_nagari_sungai_pinang.png";

export default function Contact() {
  const { data: settingsData, isLoading } = useSiteSettings();
  const settings = settingsData?.data;

  // Use field names that match the API response
  const contactInfo = {
    address: settings?.contact_address || "Kantor Wali Nagari",
    phone: settings?.contact_phone || "+62 751 123456",
    email: settings?.contact_email || "nagari@example.go.id",
    whatsapp: settings?.contact_whatsapp || settings?.whatsapp || null
  };

  return (
    <PageBackground>
      <Navbar />
      <PageHeader 
        title="Hubungi Kami" 
        description="Kami siap melayani Anda. Silakan hubungi kami melalui kontak di bawah ini atau kunjungi kantor kami."
        image={contactImage}
      />
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            <div>
              <div className="inline-flex items-center gap-2 text-teal-600 dark:text-[#3fd5ba] font-bold uppercase tracking-[0.2em] text-[10px] mb-6 border border-teal-300 dark:border-[#3fd5ba]/20 bg-teal-600/5 dark:bg-[#3fd5ba]/5 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(63,213,186,0.1)]">
                <MessageCircle size={14} />
                <span>Pusat Layanan Terpadu</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-800 dark:text-white mb-6 leading-tight drop-shadow-md">
                Layanan Informasi & <br/>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3fd5ba] to-blue-400">Pengaduan Masyarakat</span>
              </h2>
              <p className="text-slate-600 dark:text-white/60 font-light leading-relaxed text-lg max-w-md">
                Jangan ragu menghubungi kami. Kami berkomitmen memberikan pelayanan prima secara langsung maupun digital.
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center gap-3 py-8">
                <Loader2 className="w-5 h-5 animate-spin text-teal-600 dark:text-[#3fd5ba]" />
                <span className="text-slate-600 dark:text-white/40 uppercase tracking-widest text-xs font-bold">Memuat data kontak...</span>
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
                    whileHover={{ y: -5, x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="border-black/5 dark:border-white/10 shadow-lg bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md overflow-hidden relative group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full group-hover:bg-teal-600/10 dark:bg-[#3fd5ba]/10 transition-colors" />
                      <CardContent className="p-6 md:p-8 flex items-start gap-5 relative z-10 text-slate-800 dark:text-white cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-[#143236] text-teal-600 dark:text-[#3fd5ba] flex items-center justify-center shrink-0 border border-black/5 dark:border-white/5 group-hover:bg-teal-500 dark:bg-[#3fd5ba] group-hover:text-white dark:text-[#0a1a1c] group-hover:shadow-md dark:shadow-[0_0_15px_rgba(63,213,186,0.5)] transition-all duration-300">
                          <item.icon size={26} strokeWidth={1.5} />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-600 dark:text-white/90 text-lg mb-2">{item.title}</h3>
                          <p className="text-teal-600 dark:text-[#3fd5ba] tracking-wide font-medium leading-relaxed mb-2 break-all">
                            {item.content}
                          </p>
                          <p className="text-[10px] text-slate-600 dark:text-white/40 uppercase tracking-widest font-bold">{item.detail}</p>
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
            className="bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-black/5 dark:border-white/10 relative overflow-hidden h-fit"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-600/10 dark:bg-[#3fd5ba]/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />
            
            <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-white mb-3 relative z-10">Kirim Pesan</h2>
            <p className="text-slate-600 dark:text-white/50 text-sm font-light mb-10 relative z-10 pb-6 border-b border-black/5 dark:border-white/10">Isi formulir, tim administrator Nagari akan merespon secepatnya.</p>
            
            <form className="space-y-6 relative z-10" onSubmit={(e) => { e.preventDefault(); alert("Pesan kontak UI berhasil dipicu. Integrasikan backend jika perlu."); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-white/50 uppercase tracking-widest">Nama Lengkap</label>
                  <Input placeholder="Identitas pengirim" className="rounded-xl bg-white/5 border-black/5 dark:border-white/10 h-12 text-slate-800 dark:text-white placeholder:text-slate-600 dark:text-white/20 focus:bg-white/10 focus:border-teal-300 dark:border-[#3fd5ba]/50 transition-all font-light" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-600 dark:text-white/50 uppercase tracking-widest">Alamat Email</label>
                  <Input type="email" placeholder="email@anda.com" className="rounded-xl bg-white/5 border-black/5 dark:border-white/10 h-12 text-slate-800 dark:text-white placeholder:text-slate-600 dark:text-white/20 focus:bg-white/10 focus:border-teal-300 dark:border-[#3fd5ba]/50 transition-all font-light" />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-600 dark:text-white/50 uppercase tracking-widest">Topik Bahasan</label>
                <Input placeholder="Perihal..." className="rounded-xl bg-white/5 border-black/5 dark:border-white/10 h-12 text-slate-800 dark:text-white placeholder:text-slate-600 dark:text-white/20 focus:bg-white/10 focus:border-teal-300 dark:border-[#3fd5ba]/50 transition-all font-light" />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-teal-600 dark:text-[#3fd5ba] uppercase tracking-widest">Isi Pesan / Pertanyaan</label>
                <Textarea placeholder="Tuliskan detail pertanyaan atau saran Anda di sini..." className="min-h-[160px] rounded-xl bg-white/5 border-black/5 dark:border-white/10 p-4 text-slate-800 dark:text-white placeholder:text-slate-600 dark:text-white/20 focus:bg-white/10 focus:border-teal-300 dark:border-[#3fd5ba]/50 transition-all resize-none font-light" />
              </div>

              <Button type="submit" className="w-full bg-teal-500 dark:bg-[#3fd5ba] hover:bg-teal-600 dark:hover:bg-white text-white dark:text-[#0a1a1c] h-14 font-bold uppercase tracking-widest text-sm rounded-xl shadow-[0_0_20px_rgba(63,213,186,0.3)] transition-all mt-4 hover:-translate-y-1">
                <Send className="mr-2 h-5 w-5" /> Kirim Pesan via Email
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
          className="mt-24 rounded-[2.5rem] overflow-hidden shadow-2xl h-[500px] border border-black/5 dark:border-white/10 relative group"
        >
          {/* Map Overlay to dark mode the iframe effectively */}
          <div className="absolute inset-0 bg-slate-50/90 dark:bg-[#0a1a1c]/60 mix-blend-color pointer-events-none z-10" />
          <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay pointer-events-none z-10" />
          
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127669.96919056463!2d100.3551061!3d-0.9345797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b942e2b117bb%3A0xb8468cb5c3046ba5!2sPadang%2C%20Padang%20City%2C%20West%20Sumatra!5e0!3m2!1sen!2sid!4v1709823456789!5m2!1sen!2sid" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="filter grayscale-[80%] contrast-[1.2]"
          ></iframe>
          
          <div className="absolute bottom-8 left-8 z-20">
             <Button variant="outline" className="shadow-[0_0_20px_rgba(0,0,0,0.5)] font-bold bg-white/80 dark:bg-[#0b2023]/80 backdrop-blur-md border border-black/5 dark:border-white/20 text-slate-800 dark:text-white hover:bg-teal-500 dark:bg-[#3fd5ba] hover:text-white dark:text-[#0a1a1c] hover:border-teal-300 dark:border-[#3fd5ba] rounded-full px-6 h-12 uppercase tracking-widest text-[10px]">
                <MapPin className="mr-2 h-4 w-4" /> Buka Google Maps
             </Button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </PageBackground>
  );
}
