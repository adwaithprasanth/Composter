import React from "react";
import composterLogo from "@/assets/composter-logos/no_bg.png";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const ComposterLoading = ({ size = 64, className = "" }) => {
  // Calculate proportional values based on size
  const borderHeight = Math.max(2, size * 0.02);
  const slideAmount = size * 0.33;

  return (
    <div className={`relative bg-[#8B5CF6] ${className}`} style={{ width: size, height: size }}>
      <div 
        className="absolute top-0 left-0 w-full bg-[#8B5CF6] z-20" 
        style={{ height: borderHeight }}
      />
      <motion.img
        src={composterLogo}
        alt="Loading..."
        className="absolute top-0 left-0 z-10 w-full h-full object-contain"
        animate={{ y: [0, -slideAmount, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          times: [0, 0.5, 1],
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default ComposterLoading;
