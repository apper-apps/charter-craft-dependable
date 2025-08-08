import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({
  className,
  type = "text",
  label,
  error,
  helperText,
  required = false,
  ...props
}, ref) => {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        type={type}
        id={inputId}
        ref={ref}
        className={cn(
          "w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;