"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

const LoadingScreen = () => {
  const [exit, setExit] = useState(false);

  useEffect(() => {
    // Trigger exit animation before the parent unmounts at 2000ms
    const timer = setTimeout(() => {
      setExit(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: exit ? 0 : 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground"
    >
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full border border-foreground/10 border-t-primary border-r-primary/50"
        />

        {/* Inner reverse rotating ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute w-16 h-16 rounded-full border border-foreground/10 border-b-primary/80"
        />

        {/* Center pulsing core */}
        <motion.div
          animate={{ scale: [1, 0.8, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-4 h-4 rounded-full bg-primary blur-[2px]"
        />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: exit ? 0 : 1, y: exit ? -10 : 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase"
      >
        جاري التحميل
      </motion.p>
    </motion.div>
  );
};

export default LoadingScreen;
