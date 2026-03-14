
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
    <section className="section-spacing bg-white relative">
      <div className="container mx-auto container-padding relative z-10">
        <div className="max-w-3xl mb-12 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-primary font-bold text-sm uppercase tracking-wider mb-3">Layanan Digital</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 leading-tight">
              Layanan Surat & Administrasi
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base max-w-2xl">
              Ajukan permohonan surat keterangan dan administrasi kependudukan secara online dengan mudah, cepat, dan transparan.
            </p>
            </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Card className="professional-hover group h-full border border-border shadow-sm bg-white rounded-lg overflow-hidden relative">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-200">
                    <FileText size={24} strokeWidth={1.5} />
                  </div>
                  <CardTitle className="font-serif text-lg text-foreground leading-snug">
                    {service.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pb-4">
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock size={14} className="text-primary" />
                      <span className="text-xs">{service.estimated_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard size={14} className="text-primary" />
                      <span className="text-primary font-bold text-xs">{service.fee}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Link href={`/layanan?service=${service.slug}`} className="w-full">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border border-primary transition-all duration-200 rounded-lg h-10 font-medium text-sm">
                      Ajukan Sekarang
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
