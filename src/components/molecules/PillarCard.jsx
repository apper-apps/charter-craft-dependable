import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import CircularProgress from "@/components/atoms/CircularProgress";

const PillarCard = ({ pillar, responses }) => {
  const navigate = useNavigate();
  
  const pillarResponse = responses?.find(r => r.pillarId === pillar.Id);
  const completionPercentage = pillarResponse ? 
    (Object.values(pillarResponse.responses || {}).filter(r => r && r.trim()).length / pillar.questions.length) * 100 : 0;
  
  const isComplete = completionPercentage === 100;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        glass
        className="p-6 cursor-pointer h-full"
        onClick={() => navigate(`/pillar/${pillar.Id}`)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isComplete ? 
                "bg-gradient-to-br from-accent-500 to-accent-600" : 
                "bg-gradient-to-br from-primary-500 to-primary-600"
            }`}>
              <ApperIcon 
                name={pillar.icon} 
                size={24} 
                className="text-white" 
              />
            </div>
          </div>
          
          <CircularProgress
            value={completionPercentage}
            size={56}
            strokeWidth={4}
            variant={isComplete ? "success" : "default"}
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-900 font-display">
            {pillar.title}
          </h3>
          
          <p className="text-sm text-gray-600 leading-relaxed">
            {pillar.description}
          </p>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-500">
              {Math.round(completionPercentage)}% complete
            </span>
            
            {isComplete && (
              <div className="flex items-center space-x-1 text-accent-600">
                <ApperIcon name="CheckCircle" size={16} />
                <span className="text-xs font-medium">Complete</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              {pillar.questions.length} questions
            </span>
            
            <div className="flex items-center space-x-1 text-primary-600">
              <span className="font-medium">Continue</span>
              <ApperIcon name="ArrowRight" size={16} />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PillarCard;