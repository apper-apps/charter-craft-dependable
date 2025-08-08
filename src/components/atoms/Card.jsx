import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = forwardRef(({
  children,
  className,
  hover = false,
  gradient = false,
  glass = false,
  ...props
}, ref) => {
  const baseClasses = "rounded-xl overflow-hidden";
  
  const variants = {
    default: "bg-white border border-gray-200 shadow-lg",
    gradient: "bg-gradient-to-br from-white to-slate-50 border border-gray-100 shadow-xl",
    glass: "glass-card shadow-xl"
  };
  
  const getVariant = () => {
    if (glass) return "glass";
    if (gradient) return "gradient";
    return "default";
  };

  const cardClasses = cn(
    baseClasses,
    variants[getVariant()],
    className
  );

  const CardComponent = hover ? motion.div : "div";
  const hoverProps = hover ? {
    whileHover: { scale: 1.02, y: -4 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <CardComponent
      ref={ref}
      className={cardClasses}
      {...hoverProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
});

Card.displayName = "Card";

export default Card;