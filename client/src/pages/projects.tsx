import { motion } from "framer-motion";
import { 
  MapPin, Calendar, CheckCircle2, AlertCircle, Clock, HardHat, TrendingUp, ChevronRight, Loader2, FolderKanban
} from "lucide-react";
import { 
  Card, CardContent, CardFooter, CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
import PageBackground from "@/components/layout/PageBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import projectImage from "@assets/generated_images/village_infrastructure_project.png"; // Placeholder
import { Button } from "@/components/ui/button";

export default function Projects() {
  const { data: projectsData, isLoading } = useProjects();
  // API returns paginated data: response.data.data is the array
  const projects = projectsData?.data?.data || [];
  
  // Count projects by status
  const completedCount = projects.filter((p: any) => p.status === 'Selesai').length;
  const ongoingCount = projects.filter((p: any) => p.status === 'Berjalan').length;
  const planningCount = projects.filter((p: any) => p.status === 'Perencanaan').length;

  if (isLoading) {
    return (
      <PageBackground>
        <Navbar />
        <div className="flex items-center justify-center py-32 space-x-3 min-h-[60vh]">
          <div className="w-8 h-8 rounded-full border-b-2 border-teal-300 dark:border-[#3fd5ba] animate-spin" />
          <span className="text-teal-600 dark:text-[#3fd5ba] uppercase tracking-widest text-xs font-bold">Memuat data proyek...</span>
        </div>
        <Footer />
      </PageBackground>
    );
  }

  return (
    <PageBackground>
      <Navbar />
      <PageHeader 
        title="Proyek Pembangunan" 
        description="Pantau progres pembangunan infrastruktur dan pemberdayaan masyarakat Nagari secara transparan."
        image={projectImage}
      />
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 bg-white/80 dark:bg-[#0b2023]/80 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-black/5 dark:border-white/10 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-600/5 dark:bg-[#3fd5ba]/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-teal-600/10 dark:bg-[#3fd5ba]/10 transition-colors" />
          
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-slate-800 dark:text-white mb-3">Tahun Anggaran 2025</h2>
            <p className="text-slate-600 dark:text-white/40 font-light text-sm lg:text-base">Memonitoring realisasi pembangunan dan pemberdayaan desa secara real-time.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 relative z-10">
            <div className="flex items-center gap-3 bg-white/5 border border-black/5 dark:border-white/10 px-5 py-3 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center">
                 <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-slate-600 dark:text-white/40 mb-1">Selesai</div>
                  <div className="text-xl font-bold text-slate-800 dark:text-white leading-none">{completedCount}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/5 border border-black/5 dark:border-white/10 px-5 py-3 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                 <HardHat className="w-5 h-5" />
              </div>
              <div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-slate-600 dark:text-white/40 mb-1">Berjalan</div>
                  <div className="text-xl font-bold text-slate-800 dark:text-white leading-none">{ongoingCount}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 border border-black/5 dark:border-white/10 px-5 py-3 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                 <Clock className="w-5 h-5" />
              </div>
              <div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-slate-600 dark:text-white/40 mb-1">Rencana</div>
                  <div className="text-xl font-bold text-slate-800 dark:text-white leading-none">{planningCount}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {projects.length === 0 ? (
          <div className="text-center py-24 bg-white/80 dark:bg-[#0b2023]/60 backdrop-blur-md rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-2xl relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-[80px]" />
            <FolderKanban className="w-20 h-20 mx-auto text-slate-600 dark:text-white/10 mb-6 relative z-10" />
            <p className="text-slate-600 dark:text-white/60 text-lg font-light relative z-10">Belum ada data proyek pembangunan yang diregistrasi pada tahun ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <Card className="overflow-hidden bg-white/80 dark:bg-[#0b2023]/80 backdrop-blur-md border border-black/5 dark:border-white/10 hover:border-teal-300 dark:border-[#3fd5ba]/30 shadow-xl hover:shadow-[0_0_30px_rgba(63,213,186,0.15)] transition-all duration-500 rounded-[2.5rem] group h-full flex flex-col relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                  
                  <div className="aspect-video relative overflow-hidden">
                    <div className="absolute inset-0 bg-slate-50/90 dark:bg-[#0a1a1c]/80 group-hover:bg-slate-50/90 dark:bg-[#0a1a1c]/40 transition-colors z-10 duration-500" />
                    <div className="w-full h-full bg-gradient-to-br from-[#123136] to-[#0a1a1c] flex items-center justify-center scale-100 group-hover:scale-110 transition-transform duration-700">
                      <FolderKanban className="w-16 h-16 text-teal-600/20 dark:text-[#3fd5ba]/20" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a1c]/90 via-[#0a1a1c]/40 to-transparent z-20" />
                    
                    <div className="absolute top-6 right-6 z-30">
                      <Badge className={`px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold shadow-lg backdrop-blur-md ${
                        project.status === "Selesai" ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                        project.status === "Berjalan" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                        "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                      }`}>
                        {project.status || 'Dalam Proses'}
                      </Badge>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 text-slate-800 dark:text-white z-30">
                      <CardTitle className="font-serif text-2xl lg:text-3xl mb-4 leading-tight group-hover:text-teal-600 dark:text-[#3fd5ba] transition-colors">{project.name || (project as any).nama}</CardTitle>
                      <div className="flex flex-wrap items-center text-xs lg:text-sm text-slate-600 dark:text-white/60 gap-4 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-xl backdrop-blur-md border border-black/5 dark:border-white/10"><Calendar size={14} className="text-teal-600 dark:text-[#3fd5ba]" /> {project.year || (project as any).tahun || new Date().getFullYear()}</span>
                        <span className="flex items-center gap-2 bg-teal-600/10 dark:bg-[#3fd5ba]/10 text-teal-600 dark:text-[#3fd5ba] px-4 py-1.5 rounded-xl backdrop-blur-md border border-teal-300 dark:border-[#3fd5ba]/20"><TrendingUp size={14} /> {project.progress || (project as any).progress_persen}% Rampung</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-8 md:p-10 flex-1 relative z-30">
                    <p className="text-slate-600 dark:text-white/50 text-sm mb-8 line-clamp-3 font-light leading-relaxed">{project.description || (project as any).deskripsi || "Tidak ada rincian proyek yang disertakan."}</p>
                    
                    <div className="space-y-8 mt-auto">
                      <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-black/5 dark:border-white/10 group-hover:bg-teal-600/5 dark:bg-[#3fd5ba]/5 group-hover:border-teal-300 dark:border-[#3fd5ba]/20 transition-colors">
                        <span className="text-slate-600 dark:text-white/40 font-bold uppercase tracking-widest text-[10px]">Nilai Anggaran</span>
                        <span className="font-bold text-xl text-teal-600 dark:text-[#3fd5ba] drop-shadow-[0_0_10px_rgba(63,213,186,0.5)]">
                          Rp {Number(project.budget || (project as any).anggaran || 0).toLocaleString('id-ID')}
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-white/50">
                          <span>Progress Realisasi Fisik</span>
                          <span className={`${
                             project.status === "Selesai" ? "text-green-400" :
                             project.status === "Berjalan" ? "text-blue-400" : "text-orange-400"
                          }`}>{project.progress || (project as any).progress_persen || 0}%</span>
                        </div>
                        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-[2px] border border-black/5 dark:border-white/10">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${project.progress || (project as any).progress_persen || 0}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`h-full rounded-full relative shadow-inner ${
                               project.status === "Selesai" ? "bg-green-400" :
                               project.status === "Berjalan" ? "bg-blue-400" : "bg-orange-400"
                            }`}
                          >
                             <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white/50 rounded-full" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="bg-white/[0.02] border-t border-black/5 dark:border-white/5 p-6 md:px-10 mt-auto relative z-30">
                    <Button variant="ghost" className="w-full justify-between hover:bg-white/10 hover:shadow-md transition-all group/btn text-slate-600 dark:text-white/60 hover:text-slate-800 dark:text-white h-14 rounded-2xl uppercase tracking-widest text-[10px] font-bold">
                      <span className="ml-2">Lihat Laporan Dokumen & Rincian RAB</span>
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center group-hover/btn:bg-teal-500 dark:bg-[#3fd5ba] group-hover/btn:border-teal-300 dark:border-[#3fd5ba] group-hover/btn:text-white dark:text-[#0a1a1c] group-hover/btn:shadow-sm dark:shadow-[0_0_15px_rgba(63,213,186,0.3)] transition-all">
                        <ChevronRight size={18} />
                      </div>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </PageBackground>
  );
}
