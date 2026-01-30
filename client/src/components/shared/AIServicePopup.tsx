import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bot, MessageCircle, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/lib/api";

export default function AIServicePopup() {
  const [isOpen, setIsOpen] = useState(true); // Always show on initial load
  const { data: siteSettingsData } = useSiteSettings();
  const siteSettings = siteSettingsData?.data;

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleContactAI = () => {
    const whatsappNumber = siteSettings?.contact_whatsapp?.replace(/[^0-9]/g, "") || "6285126290645";
    const message = encodeURIComponent("Halo, saya ingin menggunakan layanan AI Assistant Nagari.");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md"
          >
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              {/* Header with gradient */}
              <div className="bg-gradient-to-br from-primary via-primary to-green-600 p-8 pb-12 text-white relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="relative"
                >
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Bot className="w-10 h-10 text-white" />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Sparkles className="w-6 h-6 text-yellow-300" />
                    </motion.div>
                  </div>
                </motion.div>

                <h2 className="text-2xl font-serif font-bold text-center mb-2">
                  Layanan Sinta AI AGENT 24 Jam
                </h2>
                <p className="text-white/90 text-center text-sm">
                  Nagari
                </p>
              </div>

              {/* Content */}
              <div className="p-6 -mt-4 relative">
                <div className="bg-gradient-to-br from-green-50 to-primary/5 rounded-2xl p-5 border border-primary/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Tersedia 24 Jam</p>
                      <p className="text-xs text-gray-500">Siap melayani kapan saja</p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Kini Nagari memiliki <strong>SintaAI</strong> yang siap membantu warga 
                    untuk mendapatkan informasi layanan, mengajukan pertanyaan, atau melaporkan keluhan 
                    <strong> 24 jam sehari, 7 hari seminggu</strong>.
                  </p>

                  <ul className="space-y-2 mb-4">
                    {[
                      "Informasi layanan publik",
                      "Pertanyaan seputar administrasi",
                      "Panduan prosedur & persyaratan",
                      "Pengaduan & aspirasi warga"
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-3 mt-6">
                  <Button
                    onClick={handleContactAI}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/30 h-12 rounded-xl font-bold"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Hubungi Sinta AI Assistant via WhatsApp
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleClose}
                    className="w-full text-gray-500 hover:text-gray-700 h-10"
                  >
                    Nanti saja
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
