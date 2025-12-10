
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";

import Home from "@/pages/home";
import Profil from "@/pages/profile";
import Services from "@/pages/services";
import News from "@/pages/news";
import NewsDetail from "@/pages/news-detail";
import UMKM from "@/pages/umkm";
import Facilities from "@/pages/facilities";
import PPID from "@/pages/ppid";
import Complaints from "@/pages/complaints";
import GIS from "@/pages/gis";
import Projects from "@/pages/projects";
import PublicData from "@/pages/public-data";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";
import AIServicePopup from "@/components/shared/AIServicePopup";
import DynamicHead from "@/components/shared/DynamicHead";

// Wrapper for page transitions
const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Switch location={location} key={location}>
        <Route path="/" component={Home} />
        <Route path="/profil">
          <PageWrapper><Profil /></PageWrapper>
        </Route>
        <Route path="/layanan">
          <PageWrapper><Services /></PageWrapper>
        </Route>
        <Route path="/berita">
          <PageWrapper><News /></PageWrapper>
        </Route>
        <Route path="/berita/:slug">
          <PageWrapper><NewsDetail /></PageWrapper>
        </Route>
        <Route path="/umkm">
          <PageWrapper><UMKM /></PageWrapper>
        </Route>
        <Route path="/fasilitas">
          <PageWrapper><Facilities /></PageWrapper>
        </Route>
        <Route path="/ppid">
          <PageWrapper><PPID /></PageWrapper>
        </Route>
        <Route path="/pengaduan">
          <PageWrapper><Complaints /></PageWrapper>
        </Route>
        <Route path="/gis">
          <PageWrapper><GIS /></PageWrapper>
        </Route>
        <Route path="/proyek">
          <PageWrapper><Projects /></PageWrapper>
        </Route>
        <Route path="/data-publik">
          <PageWrapper><PublicData /></PageWrapper>
        </Route>
        <Route path="/kontak">
          <PageWrapper><Contact /></PageWrapper>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DynamicHead />
        <Toaster />
        <Router />
        <AIServicePopup />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
