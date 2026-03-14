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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section className="section-spacing bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIiBmaWxsPSJyZ2JhKDAsMCwwLDAuMDUpIi8+PC9zdmc+')] opacity-40 -z-10" />

      <div className="container mx-auto container-padding relative z-10">
        <motion.div
          className="max-w-3xl mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <motion.p
              className="text-primary font-bold text-sm uppercase tracking-wider mb-3 inline-block px-4 py-1.5 bg-primary/10 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              Layanan Digital
            </motion.p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4 leading-tight">
              Layanan Surat & <span className="text-primary">Administrasi</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base max-w-2xl">
              Ajukan permohonan surat keterangan dan administrasi kependudukan secara online dengan mudah, cepat, dan transparan.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ y: -8 }}
                className="group h-full"
              >
                <Card className="h-full border border-border shadow-lg hover:shadow-xl bg-white rounded-xl overflow-hidden relative transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-primary/0 opacity-0 group-hover:opacity-5 transition-opacity" />

                  <CardHeader className="pb-4 relative z-10">
                    <motion.div
                      className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center mb-4 group-hover:from-primary group-hover:to-primary/80 group-hover:text-white transition-all duration-300"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6, type: "spring" }}
                    >
                      <FileText size={24} strokeWidth={1.5} />
                    </motion.div>
                    <CardTitle className="font-serif text-lg text-foreground leading-snug group-hover:text-primary transition-colors">
                      {service.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pb-4 relative z-10">
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed group-hover:text-foreground transition-colors">
                      {service.description}
                    </p>
                    <div className="space-y-3">
                      <motion.div
                        className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <Clock size={16} className="flex-shrink-0" />
                        <span className="text-xs font-medium">{service.estimated_time}</span>
                      </motion.div>
                      <motion.div
                        className="flex items-center gap-2 group-hover:text-primary transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <CreditCard size={16} className="flex-shrink-0" />
                        <span className="font-bold text-xs">{service.fee}</span>
                      </motion.div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0 relative z-10">
                    <Link href={`/layanan?service=${service.slug}`} className="w-full">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border border-primary transition-all duration-300 rounded-lg h-11 font-semibold text-sm shadow-md hover:shadow-lg">
                          Ajukan Sekarang <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </motion.div>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
