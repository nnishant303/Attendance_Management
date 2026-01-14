import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const toggleSidebar = () => setIsOpen(!isOpen);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-x-3 py-2.5 px-3 text-sm rounded-lg transition
    ${isActive
      ? "bg-blue-50 text-blue-600 font-medium"
      : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <>
      {/* Background overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-all duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Header */}
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            {/* DO NOT CHANGE ATTENDIFY LOGO + NAME */}
            <svg
              className="size-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span className="text-xl font-semibold text-black">Attendify</span>
          </div>

          {/* Mobile close */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Menu */}
        <nav className="flex flex-col justify-between h-full pb-20 px-3">
          <ul className="space-y-1">

            {/* Dashboard */}
            <li>
              <NavLink to="/dashboard" className={linkClass}>
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 13h8V3H3v10zM13 21h8V11h-8v10zM13 3v6h8V3h-8zM3 21h8v-6H3v6z" />
                </svg>
                Dashboard
              </NavLink>
            </li>

            {/* Employee */}
            <li>
              <NavLink to="/employee_details" className={linkClass}>
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <circle cx="9" cy="7" r="4" />
                  <path d="M5 21v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2" />
                  <circle cx="17" cy="7" r="3" />
                  <path d="M17 14a3 3 0 0 1 3 3v2" />
                </svg>
                Employee
              </NavLink>
            </li>

            {/* Notifications */}
            <li>
              <NavLink to="/notifications" className={linkClass}>
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Notify
              </NavLink>
            </li>

            {/* Calendar */}
            <li>
              <NavLink to="/calendar" className={linkClass}>
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Calendar
              </NavLink>
            </li>

            {/* Leave Requests */}
            <li>
              <NavLink to="/leave-requests" className={linkClass}>
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M3 10h18M8 2v4M16 2v4" />
                </svg>
                Leave Requests
              </NavLink>
            </li>
          </ul>

          {/* Add Employee - Fixed at bottom */}
          <div className="px-2">
            <NavLink
              to="/add-employee"
              className="block text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg shadow-md"
            >
              + Add Employee
            </NavLink>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
