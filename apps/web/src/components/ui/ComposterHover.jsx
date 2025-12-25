import React from "react";
import composterLogo from "@/assets/composter-logos/no_bg.png";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const ComposterHover = ({ size = 300, className = "" }) => {
  // Calculate proportional values based on size
  const borderHeight = Math.max(2, size * 0.02);
  const slideAmount = size * 0.33;

  return (
    <motion.div
      className={`relative bg-[#8B5CF6] cursor-pointer ${className}`}
      style={{ width: size, height: size }}
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <div 
        className="absolute top-0 left-0 w-full bg-[#8B5CF6] z-20" 
        style={{ height: borderHeight }}
      />
      <motion.img
        src={composterLogo}
        alt="Composter"
        className="absolute top-0 left-0 z-10 w-full h-full object-contain"
        variants={{
          rest: {
            y: 0,
            transition: {
              duration: 0.4,
              ease: [0.5, 0, 0, 1],
            },
          },
          hover: {
            y: -slideAmount,
            transition: {
              duration: 0.4,
              ease: [0.58, 0, 0, 1],
            },
          },
        }}
      />
    </motion.div>
  );
};

export default ComposterHover;

