import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ currentUser, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAdmin = currentUser?.role === "admin";
  
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "Home" },
    { name: "My Charter", path: "/charter", icon: "FileText" },
    { name: "Export", path: "/export", icon: "Download" },
    ...(isAdmin ? [{ name: "Admin Panel", path: "/admin", icon: "Shield" }] : [])
  ];

  const isCurrentPath = (path) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-lg">
              <ApperIcon name="BookOpen" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text font-display">
                Charter Craft
              </h1>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.button
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isCurrentPath(item.path)
                    ? "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <ApperIcon name={item.icon} size={18} />
                <span className="text-sm">{item.name}</span>
              </motion.button>
            ))}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {currentUser?.fullName || "User"}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {currentUser?.role || "participant"}
              </p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              icon="LogOut"
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              icon={mobileMenuOpen ? "X" : "Menu"}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={false}
        animate={{ height: mobileMenuOpen ? "auto" : 0, opacity: mobileMenuOpen ? 1 : 0 }}
        className="md:hidden overflow-hidden bg-white border-t border-gray-200"
      >
        <div className="px-4 py-2 space-y-1">
          {navItems.map((item) => (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg font-medium text-left transition-all duration-200 ${
                isCurrentPath(item.path)
                  ? "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <ApperIcon name={item.icon} size={20} />
              <span>{item.name}</span>
            </motion.button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-gray-200">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-gray-900">
                {currentUser?.fullName || "User"}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {currentUser?.role || "participant"}
              </p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              icon="LogOut"
              onClick={onLogout}
              className="w-full mt-2 text-gray-600 hover:text-gray-900"
            >
              Logout
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;