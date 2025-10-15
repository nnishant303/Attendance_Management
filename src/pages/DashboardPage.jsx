import React from "react";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import StatsOverview from "../components/dashboard/StatsOverview";
import AttendanceTable from "../components/dashboard/AttendanceTable";

const DashboardPage = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Fixed Navbar */}
        <Navbar />

        {/* Main Section */}
        <main className="pt-20 px-6 pb-10">
          {/* Stats Overview Section */}
          <StatsOverview />

          {/* Attendance Table Section */}
          <div className="mt-8">
            <AttendanceTable />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
