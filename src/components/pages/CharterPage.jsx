import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ProgressBar from '@/components/atoms/ProgressBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import pillarService from '@/services/api/pillarService';
import responseService from '@/services/api/responseService';
import { toast } from 'react-toastify';

function CharterPage({ currentUser }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pillars, setPillars] = useState([]);
  const [responses, setResponses] = useState([]);
  const [charterData, setCharterData] = useState(null);

  useEffect(() => {
    loadCharterData();
  }, [currentUser]);

const loadCharterData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate currentUser and currentUser.Id exist
      if (!currentUser?.Id) {
        throw new Error('User information is not available');
      }

const [pillarsData, responsesData] = await Promise.all([
        pillarService.getAll(),
        responseService.getUserResponses(currentUser.Id)
      ]);

      setPillars(pillarsData);
      setResponses(responsesData);
      generateCharterData(pillarsData, responsesData);
    } catch (err) {
      console.error('Error loading charter data:', err);
      setError('Failed to load your charter. Please try again.');
      toast.error('Failed to load charter data');
    } finally {
      setLoading(false);
    }
  };

  const generateCharterData = (pillarsData, responsesData) => {
    const pillarSummaries = pillarsData.map(pillar => {
      const pillarResponses = responsesData.filter(r => r.pillarId === pillar.Id);
      const totalQuestions = pillar.questions?.length || 0;
      const answeredQuestions = pillarResponses.length;
      const completionRate = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

      // Calculate average score for this pillar
      const avgScore = pillarResponses.length > 0 
        ? pillarResponses.reduce((sum, r) => sum + r.value, 0) / pillarResponses.length
        : 0;

      return {
        pillar,
        responses: pillarResponses,
        completionRate,
        avgScore,
        answeredQuestions,
        totalQuestions
      };
    });

    const overallCompletion = pillarSummaries.length > 0 
      ? pillarSummaries.reduce((sum, p) => sum + p.completionRate, 0) / pillarSummaries.length
      : 0;

    const overallScore = pillarSummaries.length > 0
      ? pillarSummaries.reduce((sum, p) => sum + p.avgScore, 0) / pillarSummaries.length
      : 0;

    setCharterData({
      pillarSummaries,
      overallCompletion: Math.round(overallCompletion),
      overallScore: Math.round(overallScore * 10) / 10,
      isComplete: overallCompletion >= 100,
      totalQuestions: pillarSummaries.reduce((sum, p) => sum + p.totalQuestions, 0),
      answeredQuestions: pillarSummaries.reduce((sum, p) => sum + p.answeredQuestions, 0)
    });
  };

  const getScoreColor = (score) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 4) return 'Excellent';
    if (score >= 3) return 'Good';
    if (score >= 2) return 'Fair';
    return 'Needs Improvement';
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCharterData} />;
  if (!charterData) return <Empty message="No charter data available" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold gradient-text">My Charter</h1>
          <p className="text-gray-600">
            Your personalized business charter based on your responses
          </p>
        </motion.div>

        {/* Overall Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Charter Progress</h2>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                charterData.isComplete 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {charterData.isComplete ? 'Complete' : 'In Progress'}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {charterData.overallCompletion}%
                </div>
                <div className="text-sm text-gray-600">Overall Progress</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(charterData.overallScore)}`}>
                  {charterData.overallScore}/5
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {charterData.answeredQuestions}/{charterData.totalQuestions}
                </div>
                <div className="text-sm text-gray-600">Questions Answered</div>
              </div>
            </div>

            <ProgressBar 
              progress={charterData.overallCompletion} 
              className="mb-4"
            />
            
            <div className="text-center">
              <span className={`font-medium ${getScoreColor(charterData.overallScore)}`}>
                {getScoreLabel(charterData.overallScore)}
              </span>
            </div>
          </Card>
        </motion.div>

        {/* Pillar Summaries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold">Pillar Details</h2>
          
          <div className="grid gap-4">
            {charterData.pillarSummaries.map((summary, index) => (
              <motion.div
                key={summary.pillar.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="glass-card p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">
                        {summary.pillar.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {summary.pillar.description}
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      <div className={`text-xl font-bold ${getScoreColor(summary.avgScore)}`}>
                        {summary.avgScore.toFixed(1)}/5
                      </div>
                      <div className="text-sm text-gray-500">
                        {getScoreLabel(summary.avgScore)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">
                        {summary.answeredQuestions}/{summary.totalQuestions} questions
                      </span>
                    </div>
                    
                    <ProgressBar progress={summary.completionRate} />

                    <div className="flex items-center justify-between">
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        summary.completionRate >= 100 
                          ? 'bg-green-100 text-green-800' 
                          : summary.completionRate >= 50
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {summary.completionRate >= 100 ? 'Complete' : 
                         summary.completionRate >= 50 ? 'In Progress' : 'Started'}
                      </span>
                      
                      <div className="text-sm text-gray-600">
                        {Math.round(summary.completionRate)}% complete
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Section */}
        {charterData.isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-card p-6 text-center">
              <ApperIcon name="CheckCircle" size={48} className="mx-auto text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Charter Complete!</h3>
              <p className="text-gray-600 mb-6">
                Congratulations! You've completed your business charter. 
                You can now export your results or continue refining your responses.
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => window.location.href = '/export'}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <ApperIcon name="Download" size={16} className="mr-2" />
                  Export Charter
                </Button>
                <Button 
                  onClick={() => window.location.href = '/dashboard'}
                  variant="outline"
                >
                  <ApperIcon name="Edit" size={16} className="mr-2" />
                  Review Responses
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Incomplete Charter Message */}
        {!charterData.isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-card p-6 text-center">
              <ApperIcon name="Clock" size={48} className="mx-auto text-yellow-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Charter In Progress</h3>
              <p className="text-gray-600 mb-6">
                Complete all pillar questions to generate your full business charter.
                You're {charterData.overallCompletion}% of the way there!
              </p>
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ApperIcon name="ArrowRight" size={16} className="mr-2" />
                Continue Charter
              </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default CharterPage;