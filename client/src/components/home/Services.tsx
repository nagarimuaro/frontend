
import { useServices } from "@/lib/api";
import { ArrowRight, Clock, CreditCard, ChevronRight, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Services() {
  const { data: servicesResponse, isLoading } = useServices();
  const services = servicesResponse?.data?.slice(0, 4) || [];

  if (isLoading) {
    return (
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 flex justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="section-spacing bg-accent relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-card/50 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto container-padding relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm mb-4 bg-white px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Layanan Digital
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 leading-tight">
              Pengurusan Surat Kini <br/><span className="text-primary italic">Lebih Mudah</span> & Cepat
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base md:text-lg max-w-xl">
              Ajukan permohonan surat keterangan dan administrasi kependudukan lainnya secara online. Hemat waktu, transparan, dan bebas pungli.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/layanan">
              <Button variant="outline" className="hidden md:flex gap-2 rounded-full px-6 h-12 border-gray-300 hover:border-primary hover:text-primary transition-all">
                Lihat Semua Layanan <ArrowRight size={18} />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
            >
              <Card className="card-hover-lift group h-full border-none shadow-lg bg-card rounded-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/12 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-125 duration-500" />
                
                <CardHeader className="relative pb-3">
                  <div className="w-14 h-14 rounded-xl bg-accent text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                    <FileText size={28} strokeWidth={1.5} />
                  </div>
                  <CardTitle className="font-serif text-xl group-hover:text-primary transition-colors leading-snug min-h-14">
                    {service.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-5 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="space-y-3 bg-accent/50 p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Clock size={16} className="text-primary/60" />
                      <span className="font-medium">Estimasi: {service.estimated_time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CreditCard size={16} className="text-primary/60" />
                      <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded text-xs uppercase tracking-wide border border-primary/20">{service.fee}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-4">
                  <Link href={`/layanan?service=${service.slug}`} className="w-full">
                    <Button className="w-full bg-card text-foreground hover:bg-primary hover:text-primary-foreground border border-border hover:border-primary transition-all duration-300 shadow-sm rounded-lg h-11 font-semibold group/btn justify-between px-5">
                      <span>Ajukan Sekarang</span>
                      <ChevronRight size={18} className="opacity-60 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
          <Link href="/layanan">
            <Button variant="outline" className="w-full rounded-full h-12 font-bold">
              Lihat Semua Layanan
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
