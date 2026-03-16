import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  description?: string;
  image?: string;
}

export default function PageHeader({ 
  title, 
  description, 
  image = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop" 
}: PageHeaderProps) {
  return (
    <div className="relative h-[45vh] min-h-[350px] md:min-h-[450px] flex items-center justify-center overflow-hidden">
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-emerald-50/80 dark:from-[#0a1a1c]/80 dark:via-[#0a1a1c]/60 dark:to-[#0a1a1c] transition-colors duration-500" />
      </motion.div>
      
      <div className="container relative z-10 mx-auto px-4 md:px-6 text-center pt-16 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="inline-block w-16 md:w-20 h-1 bg-teal-500 dark:bg-[#3fd5ba] mb-6 rounded-full shadow-sm dark:shadow-[0_0_15px_rgba(63,213,186,0.5)] transition-colors" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 md:mb-6 tracking-tight leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed font-light px-4">
              {description}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
