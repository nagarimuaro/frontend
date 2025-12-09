
import { motion } from "framer-motion";
import { 
  FileText, Clock, CreditCard, ChevronRight, Download, CheckCircle, ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { services } from "@/lib/data";
import PageHeader from "@/components/layout/PageHeader";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import serviceImage from "@assets/generated_images/customer_service_counter.png"; 

export default function Services() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader 
        title="Layanan Surat Online" 
        description="Urus dokumen administrasi kependudukan lebih mudah, cepat, dan transparan tanpa perlu antre lama."
        image={serviceImage}
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services List */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-gray-900">Daftar Layanan Tersedia</h2>
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border">Total: {services.length} Layanan</span>
            </div>
            
            <Accordion type="single" collapsible className="w-full space-y-4">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AccordionItem value={`item-${service.id}`} className="border border-gray-100 rounded-2xl px-2 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <AccordionTrigger className="hover:no-underline py-4 px-4 hover:bg-gray-50/50 rounded-xl transition-colors">
                      <div className="flex items-center gap-4 text-left w-full">
                        <div className="w-12 h-12 rounded-xl bg-green-50 text-primary flex items-center justify-center shrink-0 shadow-sm border border-green-100">
                          <service.icon size={22} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg">{service.name}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded">
                              <Clock size={10} /> {service.estimatedTime}
                            </span>
                            <span className="text-xs text-green-600 font-medium flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded">
                              <CreditCard size={10} /> {service.fee}
                            </span>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6 px-6 border-t border-dashed border-gray-100 mt-2">
                      <div className="grid md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <h4 className="font-bold text-sm mb-3 text-gray-900">Deskripsi Layanan</h4>
                          <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.description}</p>
                          <div className="flex gap-3 mt-4">
                            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-full">
                              Ajukan Sekarang <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                            <Button variant="outline" className="rounded-full border-gray-200">
                              <Download className="mr-2 h-4 w-4" /> Formulir
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                          <h4 className="font-bold text-sm mb-3 text-blue-900">Persyaratan Dokumen:</h4>
                          <ul className="space-y-3">
                            {service.requirements?.map((req: string, i: number) => (
                              <motion.li 
                                key={i} 
                                initial={{ opacity: 0, x: 10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * i }}
                                className="flex items-start gap-3 text-sm text-gray-700"
                              >
                                <CheckCircle size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                <span>{req}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>

          {/* Sidebar Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <Card className="bg-gradient-to-br from-primary to-green-700 text-white border-none shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
              
              <CardHeader>
                <CardTitle className="text-white text-xl">Panduan Layanan</CardTitle>
                <CardDescription className="text-green-100">
                  4 Langkah mudah pengajuan surat
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:h-[85%] before:w-0.5 before:bg-white/20 before:rounded-full">
                  {[
                    { title: "Pilih Layanan", desc: "Pilih jenis surat dari daftar tersedia" },
                    { title: "Isi Formulir", desc: "Lengkapi data & upload dokumen" },
                    { title: "Verifikasi", desc: "Petugas memvalidasi data (Max 24 jam)" },
                    { title: "Selesai", desc: "Unduh surat digital atau ambil di kantor" }
                  ].map((step, i) => (
                    <div key={i} className="relative group">
                      <div className="absolute -left-8 w-6 h-6 rounded-full bg-white text-primary flex items-center justify-center text-xs font-bold ring-4 ring-primary-foreground/10 group-hover:scale-110 transition-transform shadow-lg">
                        {i + 1}
                      </div>
                      <h4 className="font-bold text-sm">{step.title}</h4>
                      <p className="text-xs text-green-100 mt-1">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock size={18} className="text-primary" /> Jam Operasional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm p-2 rounded hover:bg-gray-50 transition-colors">
                  <span className="text-gray-600">Senin - Kamis</span>
                  <span className="font-bold text-gray-900">08:00 - 16:00</span>
                </div>
                <div className="flex justify-between text-sm p-2 rounded hover:bg-gray-50 transition-colors">
                  <span className="text-gray-600">Jumat</span>
                  <span className="font-bold text-gray-900">08:00 - 11:30</span>
                </div>
                <div className="flex justify-between text-sm p-2 rounded bg-red-50 border border-red-100">
                  <span className="text-red-600">Sabtu - Minggu</span>
                  <span className="font-bold text-red-600">Libur</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
