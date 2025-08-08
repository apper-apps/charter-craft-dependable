import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import userService from "@/services/api/userService";

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // For demo purposes, automatically log in as a participant
      const demoUser = {
        id: "1",
        fullName: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        role: "participant"
      };
      
      setCurrentUser(demoUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to initialize auth:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const user = await userService.login(email, password);
      setCurrentUser(user);
      setIsAuthenticated(true);
      toast.success("Logged in successfully!");
      return user;
    } catch (error) {
      toast.error("Login failed. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    toast.success("Logged out successfully!");
  };

  const switchToAdmin = () => {
    const adminUser = {
      id: "5",
      fullName: "Lisa Anderson",
      email: "lisa.anderson@cilc.com",
      role: "admin"
    };
    setCurrentUser(adminUser);
    toast.success("Switched to admin view!");
  };

  const switchToParticipant = () => {
    const participantUser = {
      id: "1",
      fullName: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      role: "participant"
    };
    setCurrentUser(participantUser);
    toast.success("Switched to participant view!");
  };

  return {
    currentUser,
    loading,
    isAuthenticated,
    login,
    logout,
    switchToAdmin,
    switchToParticipant
  };
};

export default useAuth;