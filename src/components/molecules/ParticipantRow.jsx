import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ParticipantRow = ({ participant, businessProfile, responses }) => {
  const navigate = useNavigate();
  
  // Calculate completion for each pillar
  const getPillarCompletion = (pillarId) => {
    const pillarResponse = responses.find(r => r.pillarId === pillarId);
    if (!pillarResponse) return 0;
    
    const answeredQuestions = Object.values(pillarResponse.responses || {})
      .filter(response => response && response.trim()).length;
    
    // Assuming 4 questions per pillar based on requirements
    return (answeredQuestions / 4) * 100;
  };

  const overallCompletion = [1, 2, 3, 4].reduce((acc, pillarId) => {
    return acc + getPillarCompletion(pillarId);
  }, 0) / 4;

  const isComplete = overallCompletion === 100;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
      className="border-b border-gray-100 transition-colors duration-200"
    >
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {participant.fullName.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {participant.fullName}
            </p>
            <p className="text-xs text-gray-500">
              {participant.email}
            </p>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div>
          <p className="text-sm font-medium text-gray-900">
            {businessProfile?.businessName || "N/A"}
          </p>
          <p className="text-xs text-gray-500">
            {businessProfile?.businessType || "Not specified"}
          </p>
        </div>
      </td>
      
      {/* Pillar completion checkmarks */}
      {[1, 2, 3, 4].map((pillarId) => {
        const completion = getPillarCompletion(pillarId);
        const isComplete = completion === 100;
        
        return (
          <td key={pillarId} className="px-6 py-4 text-center">
            {isComplete ? (
              <ApperIcon 
                name="CheckCircle" 
                size={20} 
                className="text-accent-500 mx-auto" 
              />
            ) : completion > 0 ? (
              <div className="w-5 h-5 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
              </div>
            ) : (
              <ApperIcon 
                name="Circle" 
                size={20} 
                className="text-gray-300 mx-auto" 
              />
            )}
          </td>
        );
      })}
      
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallCompletion}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <span className="text-xs font-medium text-gray-700 w-10">
            {Math.round(overallCompletion)}%
          </span>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <Button
          variant="outline"
          size="sm"
          icon="Eye"
          onClick={() => navigate(`/admin/participant/${participant.id}`)}
        >
          View
        </Button>
      </td>
    </motion.tr>
  );
};

export default ParticipantRow;