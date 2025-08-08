import React from "react";
import OnboardingForm from "@/components/organisms/OnboardingForm";

const OnboardingPage = ({ currentUser, onComplete }) => {
  return <OnboardingForm currentUser={currentUser} onComplete={onComplete} />;
};

export default OnboardingPage;