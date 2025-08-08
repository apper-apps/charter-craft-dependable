import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import ProgressBar from "@/components/atoms/ProgressBar";
import PillarCard from "@/components/molecules/PillarCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import pillarService from "@/services/api/pillarService";
import responseService from "@/services/api/responseService";

const DashboardOverview = ({ currentUser }) => {
  const navigate = useNavigate();
  const [pillars, setPillars] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, [currentUser.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [pillarsData, responsesData] = await Promise.all([
        pillarService.getAll(),
        responseService.getUserResponses(currentUser.id)
      ]);
      
      setPillars(pillarsData);
      setResponses(responsesData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  // Calculate overall progress
  const totalQuestions = pillars.reduce((sum, pillar) => sum + pillar.questions.length, 0);
  const answeredQuestions = responses.reduce((sum, response) => {
    return sum + Object.values(response.responses || {}).filter(r => r && r.trim()).length;
  }, 0);
  
  const overallProgress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
  const completedPillars = responses.filter(r => r.isComplete).length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">
          Welcome back, {currentUser.fullName.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-600 text-lg">
          Continue building your family business charter by completing the four pillars below.
        </p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card glass className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Target" size={20} className="text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900 font-display">
                  Overall Progress
                </h3>
              </div>
              <ProgressBar
                value={overallProgress}
                className="mb-2"
                variant={overallProgress === 100 ? "success" : "default"}
              />
              <p className="text-sm text-gray-600">
                {answeredQuestions} of {totalQuestions} questions completed
              </p>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-1">
                  {completedPillars}/4
                </div>
                <p className="text-sm text-gray-600">Pillars Complete</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {Math.round(overallProgress)}%
                </div>
                <p className="text-sm text-gray-600">Charter Ready</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Pillars Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-2 mb-6">
          <ApperIcon name="Columns" size={24} className="text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900 font-display">
            Charter Pillars
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (index * 0.1) }}
            >
              <PillarCard pillar={pillar} responses={responses} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ApperIcon name="Zap" size={24} className="text-primary-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-display">
                  Ready to Export?
                </h3>
                <p className="text-gray-600">
                  {overallProgress === 100 
                    ? "Your charter is complete! Export it as a PDF or Word document."
                    : "Complete all pillars to export your family business charter."
                  }
                </p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={overallProgress < 100}
              onClick={() => navigate("/export")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                overallProgress === 100
                  ? "bg-gradient-to-r from-accent-600 to-accent-700 text-white hover:from-accent-700 hover:to-accent-800 shadow-lg hover:shadow-xl"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Export Charter
            </motion.button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;