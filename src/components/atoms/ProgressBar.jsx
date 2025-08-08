import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const ProgressBar = ({
  value = 0,
  max = 100,
  className,
  showLabel = true,
  size = "default",
  variant = "default"
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizes = {
    sm: "h-2",
    default: "h-3",
    lg: "h-4"
  };
  
  const variants = {
    default: "from-primary-500 to-primary-600",
    success: "from-accent-500 to-accent-600",
    warning: "from-yellow-500 to-orange-500",
    error: "from-red-500 to-red-600"
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      
      <div className={cn(
        "w-full bg-gray-200 rounded-full overflow-hidden",
        sizes[size]
      )}>
        <motion.div
          className={cn(
            "h-full bg-gradient-to-r rounded-full",
            variants[variant]
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;