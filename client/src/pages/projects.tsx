
import { motion } from "framer-motion";
import { 
  MapPin, Calendar, CheckCircle2, AlertCircle, Clock, HardHat, TrendingUp, ChevronRight, Loader2, FolderKanban
} from "lucide-react";
import { 
  Card, CardContent, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useProjects } from "@/lib/api";
import PageHeader from "@/components/layout/PageHeader";
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">Memuat proyek...</span>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHeader 
        title="Proyek Pembangunan" 
        description="Transparansi progres pembangunan infrastruktur dan pemberdayaan masyarakat Nagari."
        image={projectImage}
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Tahun Anggaran 2025</h2>
            <p className="text-gray-500 font-medium">Memantau realisasi pembangunan desa secara real-time.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="px-4 py-2 bg-green-50 text-green-700 border-green-200 rounded-full text-sm font-bold shadow-sm">
              <CheckCircle2 className="w-4 h-4 mr-2" /> Selesai: {completedCount}
            </Badge>
            <Badge variant="outline" className="px-4 py-2 bg-blue-50 text-blue-700 border-blue-200 rounded-full text-sm font-bold shadow-sm">
              <HardHat className="w-4 h-4 mr-2" /> Berjalan: {ongoingCount}
            </Badge>
            <Badge variant="outline" className="px-4 py-2 bg-orange-50 text-orange-700 border-orange-200 rounded-full text-sm font-bold shadow-sm">
              <Clock className="w-4 h-4 mr-2" /> Perencanaan: {planningCount}
            </Badge>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-3xl">
            <FolderKanban className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">Belum ada data proyek tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-none shadow-md bg-white rounded-3xl group h-full flex flex-col">
                  <div className="aspect-video relative overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/50 flex items-center justify-center">
                      <FolderKanban className="w-16 h-16 text-white/70" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                    
                    <div className="absolute top-6 right-6">
                      <Badge className={`px-4 py-1.5 text-sm font-bold shadow-lg border-none ${
                        project.status === "Selesai" ? "bg-green-500 hover:bg-green-600" :
                        project.status === "Berjalan" ? "bg-blue-500 hover:bg-blue-600" :
                        "bg-orange-500 hover:bg-orange-600"
                      }`}>
                        {project.status || 'Dalam Proses'}
                      </Badge>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <CardTitle className="font-serif text-2xl mb-3 leading-tight">{project.nama}</CardTitle>
                      <div className="flex items-center text-sm text-gray-200 gap-6 font-medium">
                        <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm"><Calendar size={16} /> {project.tahun || new Date().getFullYear()}</span>
                        <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm"><TrendingUp size={16} /> {project.progress_persen}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-8 flex-1">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.deskripsi}</p>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <span className="text-gray-500 font-medium">Nilai Anggaran</span>
                        <span className="font-bold text-xl text-primary">Rp {Number(project.anggaran).toLocaleString('id-ID')}</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm font-bold text-gray-700">
                          <span>Progress Fisik</span>
                          <span>{project.progress_persen || 0}%</span>
                        </div>
                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${project.progress_persen || 0}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                               project.status === "Selesai" ? "bg-green-500" :
                               project.status === "Berjalan" ? "bg-blue-500" : "bg-orange-500"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="bg-gray-50/50 border-t border-gray-100 px-8 py-6 mt-auto">
                    <Button variant="ghost" className="w-full justify-between hover:bg-white hover:shadow-md transition-all group/btn text-gray-600 hover:text-primary h-12 rounded-xl">
                      <span className="font-bold">Lihat Detail RAB & Dokumentasi</span>
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:text-white transition-colors">
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
    </div>
  );
}
