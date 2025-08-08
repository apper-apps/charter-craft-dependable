import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ParticipantRow from "@/components/molecules/ParticipantRow";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import userService from "@/services/api/userService";
import businessProfileService from "@/services/api/businessProfileService";
import responseService from "@/services/api/responseService";

const AdminDashboard = () => {
  const [participants, setParticipants] = useState([]);
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [allResponses, setAllResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [users, profiles, responses] = await Promise.all([
        userService.getParticipants(),
        businessProfileService.getAll(),
        responseService.getAll()
      ]);
      
      setParticipants(users);
      setBusinessProfiles(profiles);
      setAllResponses(responses);
    } catch (err) {
      setError("Failed to load admin data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="admin" />;
  if (error) return <Error message={error} onRetry={loadAdminData} />;

  // Filter and search participants
  const getParticipantCompletion = (participantId) => {
    const userResponses = allResponses.filter(r => r.userId === participantId);
    const completedPillars = userResponses.filter(r => r.isComplete).length;
    return (completedPillars / 4) * 100;
  };

  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = participant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filterStatus === "all") return true;
    
    const completion = getParticipantCompletion(participant.id);
    if (filterStatus === "complete") return completion === 100;
    if (filterStatus === "incomplete") return completion < 100;
    if (filterStatus === "started") return completion > 0 && completion < 100;
    if (filterStatus === "not-started") return completion === 0;
    
    return true;
  });

  // Calculate stats
  const totalParticipants = participants.length;
  const completedCharters = participants.filter(p => getParticipantCompletion(p.id) === 100).length;
  const inProgressCharters = participants.filter(p => {
    const completion = getParticipantCompletion(p.id);
    return completion > 0 && completion < 100;
  }).length;

  const statusOptions = [
    { value: "all", label: "All Participants" },
    { value: "complete", label: "Completed" },
    { value: "incomplete", label: "Incomplete" },
    { value: "started", label: "In Progress" },
    { value: "not-started", label: "Not Started" }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <ApperIcon name="Shield" size={32} className="text-primary-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Monitor participant progress and manage family business charters.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <Card gradient className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Participants</p>
              <p className="text-2xl font-bold text-gray-900">{totalParticipants}</p>
            </div>
          </div>
        </Card>

        <Card gradient className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed Charters</p>
              <p className="text-2xl font-bold text-gray-900">{completedCharters}</p>
            </div>
          </div>
        </Card>

        <Card gradient className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-warning to-orange-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressCharters}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            
            <Select
              options={statusOptions}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full"
            />
          </div>
        </Card>
      </motion.div>

      {/* Participants Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="overflow-hidden">
          {filteredParticipants.length === 0 ? (
            <div className="p-8">
              <Empty
                type={searchTerm || filterStatus !== "all" ? "search" : "participants"}
                onAction={searchTerm || filterStatus !== "all" ? () => {
                  setSearchTerm("");
                  setFilterStatus("all");
                } : undefined}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expectations
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Extinction
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredParticipants.map((participant) => {
                    const businessProfile = businessProfiles.find(bp => bp.userId === participant.id);
                    const userResponses = allResponses.filter(r => r.userId === participant.id);
                    
                    return (
                      <ParticipantRow
                        key={participant.id}
                        participant={participant}
                        businessProfile={businessProfile}
                        responses={userResponses}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;