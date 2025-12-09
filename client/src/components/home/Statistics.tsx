
import { statistics } from "@/lib/data";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

// Counter component for animated numbers
const Counter = ({ value, suffix }: { value: string, suffix: string }) => {
  const [count, setCount] = useState(0);
  // Parse numeric value (removing commas/dots if any for simple counting)
  const numericValue = parseFloat(value.replace(/[,.]/g, ""));
  const isDecimal = value.includes(".");
  
  // Very basic animation simulation (in a real app, use useSpring or similar)
  useEffect(() => {
    let start = 0;
    const end = numericValue;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [numericValue]);

  // Format back for display
  const displayValue = isDecimal ? count.toFixed(1) : Math.floor(count).toLocaleString();

  return <span>{displayValue}{suffix && <span className="text-sm ml-1 font-normal text-muted-foreground">{suffix}</span>}</span>;
};

export default function Statistics() {
  return (
    <section className="py-12 -mt-24 relative z-20 px-4 md:px-6 pointer-events-none">
      <div className="container mx-auto pointer-events-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statistics.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <Card className="border-none shadow-xl bg-white/90 backdrop-blur-xl h-full overflow-hidden group hover:ring-2 hover:ring-primary/20 transition-all">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                <CardContent className="p-6 flex flex-col items-center text-center relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-green-100 flex items-center justify-center text-primary mb-3 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                    <stat.icon size={22} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif tracking-tight">
                    {/* For simplicity using static value here, but wrapped in motion for effect */}
                    {stat.value}
                    <span className="text-xs text-gray-500 font-sans ml-1 font-normal">{stat.suffix}</span>
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-gray-500 mt-1 font-medium group-hover:text-primary transition-colors">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
