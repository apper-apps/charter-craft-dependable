import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import QuestionCard from "@/components/molecules/QuestionCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import pillarService from "@/services/api/pillarService";
import responseService from "@/services/api/responseService";

const PillarQuestions = ({ currentUser }) => {
  const { pillarId } = useParams();
  const navigate = useNavigate();
  
  const [pillar, setPillar] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPillarData();
  }, [pillarId, currentUser.id]);

  const loadPillarData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const pillarData = await pillarService.getById(parseInt(pillarId));
      setPillar(pillarData);
      
      // Load existing responses
      const userResponses = await responseService.getUserResponses(currentUser.id);
      const pillarResponse = userResponses.find(r => r.pillarId === parseInt(pillarId));
      
      if (pillarResponse) {
        setResponses(pillarResponse.responses || {});
      }
    } catch (err) {
      setError("Failed to load pillar questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResponse = async (questionId, response) => {
    const updatedResponses = {
      ...responses,
      [questionId]: response
    };
    
    setResponses(updatedResponses);
    
    // Check if pillar is complete
    const isComplete = pillar.questions.every(q => 
      updatedResponses[`question_${q.Id}`] && updatedResponses[`question_${q.Id}`].trim()
    );
    
    // Save to backend
    await responseService.saveResponse({
      userId: currentUser.id,
      pillarId: parseInt(pillarId),
      responses: updatedResponses,
      isComplete,
      lastUpdated: new Date().toISOString()
    });
  };

  if (loading) return <Loading type="pillar" />;
  if (error) return <Error message={error} onRetry={loadPillarData} />;
  if (!pillar) return <Error message="Pillar not found" type="notFound" />;

  const completedQuestions = pillar.questions.filter(q => 
    responses[`question_${q.Id}`] && responses[`question_${q.Id}`].trim()
  ).length;
  
  const progressPercentage = (completedQuestions / pillar.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Button
          variant="ghost"
          icon="ArrowLeft"
          onClick={() => navigate("/dashboard")}
          className="mb-4"
        >
          Back to Dashboard
        </Button>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <ApperIcon name={pillar.icon} size={32} className="text-white" />
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 font-display">
              {pillar.title}
            </h1>
            <p className="text-gray-600 leading-relaxed">
              {pillar.description}
            </p>
          </div>
        </div>
        
        {/* Progress */}
        <Card glass className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question Progress
            </span>
            <span className="text-sm font-medium text-gray-900">
              {completedQuestions} of {pillar.questions.length} completed
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </Card>
      </motion.div>

      {/* Questions */}
      <div className="space-y-6 mb-8">
        {pillar.questions.map((question, index) => (
          <motion.div
            key={question.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <QuestionCard
              question={question.text}
              questionId={`question_${question.Id}`}
              initialValue={responses[`question_${question.Id}`] || ""}
              onSave={handleSaveResponse}
            />
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ApperIcon 
                name={progressPercentage === 100 ? "CheckCircle" : "Clock"} 
                size={24} 
                className={progressPercentage === 100 ? "text-accent-500" : "text-primary-600"} 
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-display">
                  {progressPercentage === 100 ? "Pillar Complete!" : "Keep Going"}
                </h3>
                <p className="text-gray-600">
                  {progressPercentage === 100 
                    ? "Great work! Your responses are automatically saved."
                    : "Your responses are saved automatically as you type."
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {pillarId > 1 && (
                <Button
                  variant="outline"
                  icon="ChevronLeft"
                  onClick={() => navigate(`/pillar/${parseInt(pillarId) - 1}`)}
                >
                  Previous Pillar
                </Button>
              )}
              
              {pillarId < 4 ? (
                <Button
                  icon="ChevronRight"
                  iconPosition="right"
                  onClick={() => navigate(`/pillar/${parseInt(pillarId) + 1}`)}
                >
                  Next Pillar
                </Button>
              ) : (
                <Button
                  variant="success"
                  icon="Download"
                  onClick={() => navigate("/export")}
                  disabled={progressPercentage < 100}
                >
                  Export Charter
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default PillarQuestions;