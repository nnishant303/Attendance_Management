import React from "react";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10">
      {/* This bar will visually start after the sidebar because parent layout should set left padding/margin.
          But to be safe we add ml-64 for alignment with the fixed sidebar. */}
      <div className="ml-64 bg-white border-b shadow-sm">
        <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Centered wide search */}
          <div className="flex-1 max-w-3xl mx-auto">
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400">🔍</span>
              <input
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Search here..."
              />
            </div>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-md bg-gray-100">🔔</button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">M</div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-800">Mithun Ray</div>
                <div className="text-xs text-gray-500">Student</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
