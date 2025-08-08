import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import TextArea from "@/components/atoms/TextArea";
import Card from "@/components/atoms/Card";
import businessProfileService from "@/services/api/businessProfileService";

const OnboardingForm = ({ currentUser, onComplete }) => {
  const [formData, setFormData] = useState({
    businessName: "",
    position: "",
    otherOwners: "",
    businessType: "",
    customBusinessType: "",
    yearsInBusiness: "",
    annualRevenue: "",
    country: "",
    city: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const businessTypeOptions = [
    { value: "manufacturing", label: "Manufacturing" },
    { value: "retail", label: "Retail" },
    { value: "services", label: "Services" },
    { value: "technology", label: "Technology" },
    { value: "construction", label: "Construction" },
    { value: "agriculture", label: "Agriculture" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance" },
    { value: "real-estate", label: "Real Estate" },
    { value: "hospitality", label: "Hospitality" },
    { value: "other", label: "Other" }
  ];
  
  const revenueOptions = [
    { value: "under-100k", label: "Under $100,000" },
    { value: "100k-500k", label: "$100,000 - $500,000" },
    { value: "500k-1m", label: "$500,000 - $1,000,000" },
    { value: "1m-5m", label: "$1,000,000 - $5,000,000" },
    { value: "5m-10m", label: "$5,000,000 - $10,000,000" },
    { value: "over-10m", label: "Over $10,000,000" },
    { value: "prefer-not-to-say", label: "Prefer not to say" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const profileData = {
        userId: currentUser.id,
        businessName: formData.businessName,
        position: formData.position,
        otherOwners: formData.otherOwners,
        businessType: formData.businessType === "other" ? formData.customBusinessType : formData.businessType,
        yearsInBusiness: parseInt(formData.yearsInBusiness),
        annualRevenue: formData.annualRevenue,
        country: formData.country,
        city: formData.city
      };
      
      await businessProfileService.create(profileData);
      
      toast.success("Business profile created successfully!");
      onComplete();
    } catch (error) {
      toast.error("Failed to save business profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData.businessName && formData.position;
      case 2:
        return formData.businessType && formData.yearsInBusiness && formData.annualRevenue;
      case 3:
        return formData.country && formData.city;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card glass className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mb-4">
              <ApperIcon name="Building" size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">
              Welcome to Charter Craft
            </h1>
            <p className="text-gray-600">
              Let's set up your business profile to get started on your family business charter.
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step <= currentStep
                      ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step < currentStep ? (
                    <ApperIcon name="Check" size={16} />
                  ) : (
                    <span className="text-sm font-medium">{step}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-primary-600 to-primary-700 h-2 rounded-full"
                initial={{ width: "33%" }}
                animate={{ width: `${(currentStep / 3) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">
                  Business Information
                </h2>
                
                <Input
                  label="Family Business Name"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange("businessName", e.target.value)}
                  placeholder="Enter your business name"
                  required
                />
                
                <Input
                  label="Your Position in the Business"
                  value={formData.position}
                  onChange={(e) => handleInputChange("position", e.target.value)}
                  placeholder="e.g., CEO, Owner, Manager"
                  required
                />
                
                <TextArea
                  label="Names of Other Owners"
                  value={formData.otherOwners}
                  onChange={(e) => handleInputChange("otherOwners", e.target.value)}
                  placeholder="List other family members who own shares in the business"
                  rows={3}
                />
              </motion.div>
            )}

            {/* Step 2: Business Details */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">
                  Business Details
                </h2>
                
                <Select
                  label="Type of Business"
                  options={businessTypeOptions}
                  value={formData.businessType}
                  onChange={(e) => handleInputChange("businessType", e.target.value)}
                  placeholder="Select business type"
                  required
                />
                
                {formData.businessType === "other" && (
                  <Input
                    label="Please specify business type"
                    value={formData.customBusinessType}
                    onChange={(e) => handleInputChange("customBusinessType", e.target.value)}
                    placeholder="Describe your business type"
                    required
                  />
                )}
                
                <Input
                  type="number"
                  label="Number of Years in Business"
                  value={formData.yearsInBusiness}
                  onChange={(e) => handleInputChange("yearsInBusiness", e.target.value)}
                  placeholder="Enter number of years"
                  min="0"
                  required
                />
                
                <Select
                  label="Annual Revenue Range"
                  options={revenueOptions}
                  value={formData.annualRevenue}
                  onChange={(e) => handleInputChange("annualRevenue", e.target.value)}
                  placeholder="Select revenue range"
                  required
                />
              </motion.div>
            )}

            {/* Step 3: Location */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">
                  Business Location
                </h2>
                
                <Input
                  label="Country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder="Enter your country"
                  required
                />
                
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Enter your city"
                  required
                />
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <ApperIcon name="Info" size={20} className="text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">
                        Ready to Begin
                      </h4>
                      <p className="text-sm text-blue-700">
                        Once you complete this setup, you'll be able to start working on your 
                        family business charter through our guided four-pillar framework.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                icon="ChevronLeft"
              >
                Previous
              </Button>
              
              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid(currentStep)}
                  icon="ChevronRight"
                  iconPosition="right"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  loading={loading}
                  disabled={!isStepValid(currentStep)}
                  icon="Check"
                >
                  Complete Setup
                </Button>
              )}
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingForm;