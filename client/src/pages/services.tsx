import { motion } from "framer-motion";
import { 
  FileText, Clock, CreditCard, ChevronRight, Download, CheckCircle, ArrowRight, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { useServices } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import serviceImage from "@assets/generated_images/customer_service_counter.png"; 

export default function Services() {
  const { data: servicesData, isLoading } = useServices();
  const services = servicesData?.data || [];

  if (isLoading) {
    return (
      <PageBackground>
        <Navbar />
        <div className="flex items-center justify-center py-32 space-x-3 min-h-screen">
          <div className="w-8 h-8 rounded-full border-b-2 border-teal-300 dark:border-[#3fd5ba] animate-spin" />
          <span className="text-teal-600 dark:text-[#3fd5ba] uppercase tracking-widest text-xs font-bold">Memuat layanan...</span>
        </div>
        <Footer />
      </PageBackground>
    );
  }

  return (
    <PageBackground>
      <Navbar />
      <PageHeader 
        title="Layanan Mandiri" 
        description="Urus dokumen administrasi kependudukan lebih mudah, cepat, dan transparan tanpa perlu antre lama di kantor Desa."
        image={serviceImage}
      />
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services List */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-black/5 dark:border-white/10 pb-6">
              <div>
                <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-white tracking-tight">Daftar Layanan Tersedia</h2>
                <p className="text-teal-600/80 dark:text-[#3fd5ba]/80 text-sm font-bold uppercase tracking-widest mt-1">Pilih jenis surat pengajuan</p>
              </div>
              <span className="text-sm font-bold text-teal-600 dark:text-[#3fd5ba] bg-teal-600/10 dark:bg-[#3fd5ba]/10 px-4 py-2 border border-teal-300 dark:border-[#3fd5ba]/20 rounded-full shadow-[0_0_15px_rgba(63,213,186,0.1)] inline-block">
                Total: {services.length} Layanan
              </span>
            </div>
            
            {services.length === 0 ? (
              <div className="text-center py-16 bg-white/80 dark:bg-[#0b2023]/60 border border-black/5 dark:border-white/10 rounded-3xl backdrop-blur-md">
                <FileText className="w-16 h-16 mx-auto text-slate-600 dark:text-white/20 mb-4" />
                <p className="text-slate-600 dark:text-white/40 uppercase tracking-widest text-xs font-bold">Belum ada layanan tersedia</p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full space-y-4">
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AccordionItem value={`item-${service.id}`} className="border border-black/5 dark:border-white/10 rounded-2xl px-2 bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md shadow-lg overflow-hidden group hover:border-teal-300 dark:border-[#3fd5ba]/30 transition-colors">
                      <AccordionTrigger className="hover:no-underline py-5 px-4 rounded-xl transition-colors hover:bg-white/[0.02]">
                        <div className="flex items-center gap-5 text-left w-full">
                          <div className="w-14 h-14 rounded-2xl bg-teal-600/10 dark:bg-[#3fd5ba]/10 text-teal-600 dark:text-[#3fd5ba] flex items-center justify-center shrink-0 border border-teal-300 dark:border-[#3fd5ba]/20 shadow-[0_0_15px_rgba(63,213,186,0.15)] group-hover:scale-110 transition-transform">
                            {(service as any).icon ? (
                              <img src={(service as any).icon} alt="" className="w-7 h-7" />
                            ) : (
                              <FileText size={26} strokeWidth={1.5} />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-800 dark:text-white text-lg group-hover:text-teal-600 dark:text-[#3fd5ba] transition-colors">{service.name}</h3>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                              <span className="text-xs text-slate-600 dark:text-white/50 flex items-center gap-1.5 bg-white/5 border border-black/5 dark:border-white/10 px-2.5 py-1 rounded font-medium">
                                <Clock size={12} className="text-teal-600/70 dark:text-[#3fd5ba]/70" /> {service.estimated_time || "1-3 hari kerja"}
                              </span>
                              <span className="text-xs text-teal-600 dark:text-[#3fd5ba] flex items-center gap-1.5 bg-teal-600/10 dark:bg-[#3fd5ba]/10 border border-teal-300 dark:border-[#3fd5ba]/20 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                                <CreditCard size={12} /> {service.fee || "Gratis"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-6 px-6 relative">
                        <div className="absolute top-0 inset-x-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <div className="grid md:grid-cols-2 gap-8 mt-6">
                          <div>
                            <div className="inline-flex items-center gap-2 text-teal-600 dark:text-[#3fd5ba] font-bold uppercase tracking-[0.2em] text-[10px] mb-3">
                              <span>Deskripsi Layanan</span>
                            </div>
                            <p className="text-slate-600 dark:text-white/70 text-sm leading-relaxed mb-6 font-light">{service.description || "Layanan administrasi dari Kantor Nagari"}</p>
                            <div className="flex flex-wrap gap-3 mt-auto">
                              <Button className="bg-teal-500 dark:bg-[#3fd5ba] text-white dark:text-[#0a1a1c] hover:bg-teal-600 dark:hover:bg-white hover:text-white dark:text-[#0a1a1c] shadow-[0_0_20px_rgba(63,213,186,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] rounded-full font-bold uppercase tracking-wider text-xs px-6 py-5 transition-all">
                                Ajukan Sekarang <ArrowRight className="ml-2 w-4 h-4" />
                              </Button>
                              {(service as any).form_url && (
                                <Button variant="outline" className="rounded-full border-black/5 dark:border-white/20 text-slate-800 dark:text-white hover:bg-white/10 hover:text-slate-800 dark:text-white px-5 py-5 text-xs font-bold uppercase tracking-wider transition-colors" asChild>
                                  <a href={(service as any).form_url} target="_blank" rel="noopener noreferrer">
                                    <Download className="mr-2 h-4 w-4" /> Unduh Format
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          {(service as any).requirements && (service as any).requirements.length > 0 && (
                            <div className="bg-teal-50 dark:bg-[#144749]/30 p-6 rounded-2xl border border-teal-300 dark:border-[#3fd5ba]/20 relative overflow-hidden h-full">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-600/5 dark:bg-[#3fd5ba]/5 rounded-full blur-[30px]" />
                              <div className="relative z-10">
                                <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-slate-600 dark:text-white/50 mb-4 border-b border-black/5 dark:border-white/10 pb-3">Syarat Dokumen Khusus:</h4>
                                <ul className="space-y-3">
                                  {(service as any).requirements.map((req: string, i: number) => (
                                    <motion.li 
                                      key={i} 
                                      initial={{ opacity: 0, x: 10 }}
                                      whileInView={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.1 * i }}
                                      className="flex items-start gap-3 text-sm text-slate-600 dark:text-white/80"
                                    >
                                      <CheckCircle size={16} className="text-teal-600 dark:text-[#3fd5ba] mt-0.5 shrink-0" />
                                      <span className="font-light">{req}</span>
                                    </motion.li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            )}
          </motion.div>

          {/* Sidebar Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <Card className="bg-gradient-to-br from-[#123136] to-[#0A1A1C] text-slate-800 dark:text-white border-black/5 dark:border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative overflow-hidden rounded-3xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-600/10 dark:bg-[#3fd5ba]/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-[50px]" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[40px]" />
              
              <CardHeader className="pb-4 relative z-10 border-b border-black/5 dark:border-white/5">
                <CardTitle className="text-teal-600 dark:text-[#3fd5ba] font-serif tracking-wide">Panduan Layanan</CardTitle>
                <CardDescription className="text-slate-600 dark:text-white/50 text-xs font-bold uppercase tracking-widest mt-1">
                  4 Langkah mudah pengajuan
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 pt-6">
                <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:h-[85%] before:w-0.5 before:bg-white/10 before:rounded-full">
                  {[
                    { title: "Pilih Layanan", desc: "Pilih jenis surat dari daftar & lengkapi data NIK" },
                    { title: "Upload Syarat", desc: "Upload / foto KTP & Dokumen Pendukung lainnya" },
                    { title: "Verifikasi Berjenjang", desc: "Diverifikasi Jorong hingga TTE Wali Nagari" },
                    { title: "Dokumen Digital", desc: "Unduh surat sah ber-QRCode, siap cetak" }
                  ].map((step, i) => (
                    <div key={i} className="relative group">
                      <div className="absolute -left-8 w-6 h-6 rounded-full bg-white dark:bg-[#0b2023] text-teal-600 dark:text-[#3fd5ba] border border-teal-300 dark:border-[#3fd5ba]/30 flex items-center justify-center text-xs font-bold group-hover:bg-teal-500 dark:bg-[#3fd5ba] group-hover:text-[#0b2023] transition-colors shadow-[0_0_10px_rgba(63,213,186,0.2)]">
                        {i + 1}
                      </div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">{step.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-white/50 mt-1 font-light leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-[#0b2023]/80 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-lg rounded-3xl text-slate-800 dark:text-white overflow-hidden relative group">
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-teal-600/5 dark:bg-[#3fd5ba]/5 rounded-full blur-[40px] group-hover:bg-teal-600/10 dark:bg-[#3fd5ba]/10 transition-colors" />
              <CardHeader className="border-b border-black/5 dark:border-white/5">
                <CardTitle className="text-base flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-600/10 dark:bg-[#3fd5ba]/10 border border-teal-300 dark:border-[#3fd5ba]/20 text-teal-600 dark:text-[#3fd5ba]">
                    <Clock size={16} />
                  </div>
                  <span className="font-serif">Jam Operasional</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex justify-between items-center text-sm p-3 rounded-xl hover:bg-white/[0.03] border border-transparent hover:border-black/5 dark:border-white/5 transition-colors">
                  <span className="text-slate-600 dark:text-white/60 font-light">Senin - Kamis</span>
                  <span className="font-bold text-slate-800 dark:text-white bg-white/5 px-3 py-1 rounded-md border border-black/5 dark:border-white/5">08:00 - 16:00</span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 rounded-xl hover:bg-white/[0.03] border border-transparent hover:border-black/5 dark:border-white/5 transition-colors">
                  <span className="text-slate-600 dark:text-white/60 font-light">Jumat</span>
                  <span className="font-bold text-slate-800 dark:text-white bg-white/5 px-3 py-1 rounded-md border border-black/5 dark:border-white/5">08:00 - 11:30</span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <span className="text-rose-400 font-medium">Sabtu - Minggu</span>
                  <span className="font-bold text-rose-500 uppercase tracking-widest text-xs">Libur</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </PageBackground>
  );
}
