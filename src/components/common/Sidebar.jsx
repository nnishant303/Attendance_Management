import React from "react";
import { Home, User, Calendar, HelpCircle, Settings, LogOut } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-white shadow-lg flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Scholarly</h1>
          <p className="text-sm text-gray-500 mt-1">Attendance System</p>
        </div>

        <nav className="mt-6 px-4 space-y-3">
          <a
            href="#"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 text-gray-700"
          >
            <Home className="w-5 h-5" />
            Dashboard
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 text-gray-700"
          >
            <User className="w-5 h-5" />
            Students
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 text-gray-700"
          >
            <Calendar className="w-5 h-5" />
            Attendance
          </a>
        </nav>

        {/* Quick Add Section */}
        <div className="bg-blue-50 mx-4 mt-6 p-4 rounded-xl text-center">
          <p className="text-sm text-gray-700 mb-2 font-medium">Quick Add</p>
          <button className="bg-blue-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-blue-700 transition">
            + Add Student
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t space-y-3 text-gray-600">
        <a href="#" className="flex items-center gap-3 hover:text-blue-600">
          <HelpCircle className="w-5 h-5" />
          Help Center
        </a>
        <a href="#" className="flex items-center gap-3 hover:text-blue-600">
          <Settings className="w-5 h-5" />
          Settings
        </a>
        <a href="#" className="flex items-center gap-3 text-red-500 hover:text-red-600">
          <LogOut className="w-5 h-5" />
          Sign Out
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
