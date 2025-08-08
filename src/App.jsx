import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/molecules/Header";
import DashboardPage from "@/components/pages/DashboardPage";
import PillarPage from "@/components/pages/PillarPage";
import CharterPage from "@/components/pages/CharterPage";
import ExportPage from "@/components/pages/ExportPage";
import AdminPage from "@/components/pages/AdminPage";
import OnboardingPage from "@/components/pages/OnboardingPage";
import Loading from "@/components/ui/Loading";
import useAuth from "@/hooks/useAuth";
import businessProfileService from "@/services/api/businessProfileService";

function App() {
  const { currentUser, loading, isAuthenticated, logout, switchToAdmin, switchToParticipant } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    if (currentUser && currentUser.role === "participant") {
      checkBusinessProfile();
    } else {
      setCheckingProfile(false);
    }
  }, [currentUser]);

  const checkBusinessProfile = async () => {
    try {
      await businessProfileService.getByUserId(currentUser.id);
      setNeedsOnboarding(false);
    } catch (error) {
      setNeedsOnboarding(true);
    } finally {
      setCheckingProfile(false);
    }
  };

  const handleOnboardingComplete = () => {
    setNeedsOnboarding(false);
  };

  const handleLogout = () => {
    logout();
  };

  // Enhanced logout with role switching for demo
  const enhancedLogout = () => {
    if (currentUser?.role === "admin") {
      switchToParticipant();
    } else {
      switchToAdmin();
    }
  };

  if (loading || checkingProfile) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Charter Craft</h1>
          <p className="text-gray-600 mb-6">This is a demo application. You are automatically logged in.</p>
        </div>
      </div>
    );
  }

  if (needsOnboarding && currentUser.role === "participant") {
    return (
      <OnboardingPage 
        currentUser={currentUser} 
        onComplete={handleOnboardingComplete}
      />
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header currentUser={currentUser} onLogout={enhancedLogout} />
        
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/dashboard" 
              element={<DashboardPage currentUser={currentUser} />} 
            />
            <Route 
              path="/pillar/:pillarId" 
              element={<PillarPage currentUser={currentUser} />} 
/>
            <Route 
              path="/charter" 
              element={<CharterPage currentUser={currentUser} />} 
            />
            <Route 
              path="/export" 
              element={<ExportPage currentUser={currentUser} />}
            />
            {currentUser.role === "admin" && (
              <Route 
                path="/admin" 
                element={<AdminPage />} 
              />
            )}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;