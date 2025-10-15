import React from "react";

const AttendanceTable = () => {
  const students = [
    { id: 1, name: "Aarav Sharma" },
    { id: 2, name: "Isha Patel" },
    { id: 3, name: "Rohan Mehta" },
    { id: 4, name: "Neha Gupta" },
  ];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getStatusClass = (status) => {
    switch (status) {
      case "Absent":
        return "bg-red-500 text-white";
      case "Late":
        return "bg-red-100 text-red-600";
      case "On Time":
        return "bg-green-100 text-green-600";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Weekly Attendance</h2>
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 bg-gray-100 text-left px-4 py-2 border-b font-medium">
              Student
            </th>
            {days.map((day, idx) => (
              <th
                key={idx}
                className="px-4 py-2 border-b font-medium text-gray-600"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="sticky left-0 bg-white px-4 py-2 border-b font-medium">
                {student.name}
              </td>
              {days.map((day, idx) => {
                const status =
                  idx % 3 === 0 ? "Absent" : idx % 2 === 0 ? "Late" : "On Time";
                return (
                  <td
                    key={idx}
                    className={`text-center px-4 py-2 border-b ${getStatusClass(
                      status
                    )}`}
                  >
                    {status}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
