// LeaveRequest.ui.jsx
import React from "react";
import { statusClasses } from "./LeaveDummyData";
import { formatDate } from "../../../utils/dateUtils";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LeaveRequestUI = ({ requests, loading }) => {
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading leave requests...
      </div>
    );
  }

  const navigate = useNavigate();

  const pending = requests.filter((r) => r.status.toLowerCase() === "pending").length;
  const approved = requests.filter((r) => r.status.toLowerCase() === "approved").length;
  const rejected = requests.filter((r) => r.status.toLowerCase() === "rejected").length;

  return (
    <div className="p-5 space-y-6">
      {/* TOP CARDS (Ultra-Modern High-Contrast Design) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Pending (Amber) */}
        <div className="bg-white rounded-2xl p-6 shadow-xl flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            {/* Icon Accent Area: Large size, dark background for high contrast */}
            <div className="w-14 h-14 rounded-xl bg-orange-400 flex items-center justify-center shadow-lg">
              {/* Filled Hourglass icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zM12 4a8 8 0 00-8 8c0 4.418 3.582 8 8 8s8-3.582 8-8-3.582-8-8-8zM11 8h2v4.586l3.243 3.243-1.414 1.414L11 14V8z" />
              </svg>
            </div>

            <p className="text-4xl font-extrabold text-gray-900 leading-none">
              {pending}
            </p>
          </div>

          <div className="mt-4">
            <p className="text-lg font-semibold text-gray-800">
              Pending Requests
            </p>
            <p className="text-xs text-gray-500">
              Awaiting review and approval
            </p>
          </div>
        </div>

        {/* Approved (Emerald Green) */}
        <div className="bg-white rounded-2xl p-6 shadow-xl flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            {/* Icon Accent Area: Large size, dark background for high contrast */}
            <div className="w-14 h-14 rounded-xl bg-green-500 flex items-center justify-center shadow-lg">
              {/* Filled Checkmark inside a Circle */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.707 7.293a1 1 0 00-1.414-1.414L10 13.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l5-5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <p className="text-4xl font-extrabold text-gray-900 leading-none">
              {approved}
            </p>
          </div>

          <div className="mt-4">
            <p className="text-lg font-semibold text-gray-800">
              Approved Requests
            </p>
            <p className="text-xs text-gray-500">Successfully processed</p>
          </div>
        </div>

        {/* Rejected (Crimson Red) */}
        <div className="bg-white rounded-2xl p-6 shadow-xl flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            {/* Icon Accent Area: Large size, dark background for high contrast */}
            <div className="w-14 h-14 rounded-xl bg-red-600 flex items-center justify-center shadow-lg">
              {/* Filled Prohibited / No Entry icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 100-16 8 8 0 000 16zM6.929 6.929a1 1 0 011.414 0L17.07 17.071a1 1 0 01-1.414 1.414L6.929 8.343a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <p className="text-4xl font-extrabold text-gray-900 leading-none">
              {rejected}
            </p>
          </div>

          <div className="mt-4">
            <p className="text-lg font-semibold text-gray-800">
              Rejected Requests
            </p>
            <p className="text-xs text-gray-500">Denied by management</p>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Leave Applications</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Employee Name",
                  "Leave Type",
                  "Start Date",
                  "End Date",
                  "Status",
                  "Action",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center gap-3">
                    {/* If employee has photo → show photo */}
                    {req.photo ? (
                      <img
                        src={req.photo}
                        alt={req.name}
                        className="w-10 h-10 rounded-full object-cover shadow"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/100x100/cbd5e1/000?text=P";
                        }}
                      />
                    ) : (
                      /* If no photo → show first letter avatar */
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold shadow">
                        {req.name ? req.name.charAt(0).toUpperCase() : "E"}
                      </div>
                    )}

                    <span className="text-sm font-medium text-gray-800">
                      {req.name}
                    </span>
                  </td>

                  {/* Leave Type */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {req.leaveType}
                  </td>

                  {/* Dates */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(req.startDate)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(req.endDate)}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${req.status.toLowerCase() === "approved" ? "bg-green-100 text-green-800" :
                        req.status.toLowerCase() === "rejected" ? "bg-red-100 text-red-800" :
                          "bg-orange-100 text-orange-800" // Default/Pending
                        }`}
                    >
                      {req.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4">
                    <button
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                      onClick={() =>
                        navigate(`/leave-request/${encodeURIComponent(req.appliedOn)}/${encodeURIComponent(req.employeeId)}`)
                      }
                    >
                      <Eye size={18} className="text-gray-700" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestUI;
