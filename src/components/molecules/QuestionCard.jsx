import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import TextArea from "@/components/atoms/TextArea";

const QuestionCard = ({ question, questionId, initialValue = "", onSave }) => {
  const [response, setResponse] = useState(initialValue);
  const [isLoading, setSaveLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(Date.now());

  // Auto-save with debounce
  useEffect(() => {
    if (response !== initialValue) {
      const timer = setTimeout(async () => {
        setSaveLoading(true);
        try {
          await onSave(questionId, response);
          setLastSaved(Date.now());
          toast.success("Response saved automatically", {
            position: "top-right",
            autoClose: 2000
          });
        } catch (error) {
          toast.error("Failed to save response");
        } finally {
          setSaveLoading(false);
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [response, questionId, onSave, initialValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card gradient className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 leading-relaxed font-display pr-4">
            {question}
          </h3>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500 ml-4 flex-shrink-0">
            {isLoading ? (
              <div className="flex items-center space-x-1">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <ApperIcon name="Loader2" size={16} />
                </motion.div>
                <span>Saving...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <ApperIcon name="Check" size={16} className="text-accent-500" />
                <span>Saved</span>
              </div>
            )}
          </div>
        </div>
        
        <TextArea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Share your thoughts and reflections here..."
          rows={6}
          className="resize-none"
        />
        
        <div className="mt-3 text-xs text-gray-500">
          {response.length > 0 && (
            <span>{response.length} characters</span>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default QuestionCard;