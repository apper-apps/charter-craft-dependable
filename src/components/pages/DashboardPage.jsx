import React from "react";
import DashboardOverview from "@/components/organisms/DashboardOverview";

const DashboardPage = ({ currentUser }) => {
  return <DashboardOverview currentUser={currentUser} />;
};

export default DashboardPage;