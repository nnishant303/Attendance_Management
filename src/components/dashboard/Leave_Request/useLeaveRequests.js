import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaveRequests, subscribeToLeaveRequests } from "../../../redux/slices/leaveSlice";

/**
 * Custom hook for managing leave requests with real-time updates
 * 
 * This hook:
 * 1. Sets up a Firestore listener that watches ALL leave requests
 * 2. Automatically updates when ANY leave is added/modified/deleted
 * 3. Merges leave data with employee details for display
 * 4. Cleans up listener when component unmounts
 */
export const useLeaveRequests = () => {
  const dispatch = useDispatch();
  const { list: leaves, loading: leavesLoading } = useSelector((state) => state.leaves);
  const { list: employees } = useSelector((state) => state.employees);

  // 🔥 Set up real-time listener - runs ONCE on mount
  useEffect(() => {
    const unsubscribe = subscribeToLeaveRequests()(dispatch);

    // Cleanup function - removes listener when component unmounts
    return () => {
      if (unsubscribe) unsubscribe();
      dispatch(fetchLeaveRequests()); // Refresh data on unmount
    };
  }, [dispatch]); // Only dispatch in dependency array - listener runs once

  // Merge leave request with employee details
  // This computation happens on EVERY render, but that's OK because:
  // 1. It's fast (just array mapping)
  // 2. It ensures UI always shows latest data from Redux
  const requests = leaves.flatMap((leave) => {
    // Loop through employees inside each leave request
    return leave.employees.map((leaveEmployee) => {
      // Find employee by EmployeeID (string match)
      const employee = employees.find(
        (emp) =>
          String(emp.EmployeeID) === String(leaveEmployee.employeeId) ||
          String(emp.id) === String(leaveEmployee.employeeId)
      );
      
      return {
        id: leave.requestId, // The date string or doc ID
        employeeId: leaveEmployee.employeeId,

        // Employee Details
        name: employee?.name || "Unknown Employee",
        photo: employee?.Photo || null,
        // Leave Details
        leaveType: leaveEmployee.leaveType,
        startDate: leaveEmployee.fromDate,
        endDate: leaveEmployee.toDate,
        status: leave.status || "Pending",
        reason: leaveEmployee.reason,
        totalDays: leaveEmployee.totalDays,

        // Raw data if needed
        ...leave
      };
    }) || [];
  });

  return { requests, loading: leavesLoading };
};
