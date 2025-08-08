import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  message = "There's nothing here yet.",
  actionText = "Get Started",
  onAction,
  icon = "Inbox",
  type = "general"
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "participants":
        return {
          icon: "Users",
          title: "No Participants Yet",
          message: "When participants join and complete their charters, they'll appear here.",
          actionText: "Invite Participants"
        };
      case "responses":
        return {
          icon: "MessageSquare",
          title: "No Responses Yet",
          message: "Start answering the questions to build your family business charter.",
          actionText: "Begin Charter"
        };
      case "search":
        return {
          icon: "Search",
          title: "No Results Found",
          message: "Try adjusting your search terms or filters.",
          actionText: "Clear Filters"
        };
      default:
        return { icon, title, message, actionText };
    }
  };

  const content = getEmptyContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8"
    >
      <div className="text-center max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-6"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
            <ApperIcon 
              name={content.icon} 
              size={40} 
              className="text-slate-400"
            />
          </div>
        </motion.div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 font-display">
          {content.title}
        </h3>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {content.message}
        </p>
        
        {onAction && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAction}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="Plus" size={18} />
            <span>{content.actionText}</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;