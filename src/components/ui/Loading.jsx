import React from "react";
import { motion } from "framer-motion";

const Loading = ({ type = "dashboard" }) => {
  if (type === "dashboard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 w-64 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg mb-4 animate-pulse"></div>
            <div className="h-6 w-96 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse"></div>
          </div>
          
          {/* Progress Card Skeleton */}
          <div className="glass-card rounded-xl p-6 shadow-lg mb-8">
            <div className="h-6 w-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg mb-4 animate-pulse"></div>
            <div className="h-4 w-full bg-gradient-to-r from-slate-200 to-slate-300 rounded-full animate-pulse"></div>
          </div>
          
          {/* Pillar Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: item * 0.1 }}
                className="glass-card rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full animate-pulse"></div>
                  <div className="h-16 w-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full animate-pulse"></div>
                </div>
                <div className="h-6 w-48 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg mb-2 animate-pulse"></div>
                <div className="h-4 w-full bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (type === "pillar") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 w-64 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg mb-4 animate-pulse"></div>
            <div className="h-6 w-96 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse"></div>
          </div>
          
          {/* Question Cards Skeleton */}
          {[1, 2, 3, 4].map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: item * 0.1 }}
              className="glass-card rounded-xl p-6 shadow-lg mb-6"
            >
              <div className="h-6 w-3/4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg mb-4 animate-pulse"></div>
              <div className="h-32 w-full bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse"></div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }
  
  if (type === "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 w-64 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg mb-4 animate-pulse"></div>
            <div className="h-6 w-96 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse"></div>
          </div>
          
          {/* Table Skeleton */}
          <div className="glass-card rounded-xl p-6 shadow-lg">
            <div className="grid grid-cols-6 gap-4 pb-4 mb-4 border-b border-gray-200">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse"></div>
              ))}
            </div>
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="grid grid-cols-6 gap-4 py-4">
                {[1, 2, 3, 4, 5, 6].map((col) => (
                  <div key={col} className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex space-x-2">
        {[1, 2, 3].map((dot) => (
          <motion.div
            key={dot}
            className="w-3 h-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: dot * 0.2
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loading;