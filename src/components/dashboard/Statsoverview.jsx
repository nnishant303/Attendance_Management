import React from "react";

const StatsOverview = ({ dateRange = "23 Sep - 29 Sep 2024" }) => {
  return (
    <section className="max-w-screen-xl mx-auto">
      <div className="flex items-start justify-between md:items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Attendance</h2>
          <p className="text-sm text-gray-500">Manage and review records.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">{dateRange}</div>
          <select className="rounded bg-gray-100 px-3 py-1 text-sm border border-gray-100">
            <option>September</option>
          </select>
        </div>
      </div>

      {/* Pill-style stats */}
      <div className="flex flex-wrap gap-3 items-center mb-2">
        <div className="inline-flex items-center gap-3 bg-white px-3 py-2 rounded shadow-sm">
          <span className="w-3 h-3 bg-green-500 rounded-full" />
          <div>
            <div className="text-xs text-gray-500">On time</div>
            <div className="text-sm font-semibold">82%</div>
          </div>
        </div>

        <div className="inline-flex items-center gap-3 bg-white px-3 py-2 rounded shadow-sm">
          <span className="w-3 h-3 bg-yellow-400 rounded-full" />
          <div>
            <div className="text-xs text-gray-500">Late</div>
            <div className="text-sm font-semibold">10%</div>
          </div>
        </div>

        <div className="inline-flex items-center gap-3 bg-white px-3 py-2 rounded shadow-sm">
          <span className="w-3 h-3 bg-red-500 rounded-full" />
          <div>
            <div className="text-xs text-gray-500">Absent</div>
            <div className="text-sm font-semibold">8%</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsOverview;
