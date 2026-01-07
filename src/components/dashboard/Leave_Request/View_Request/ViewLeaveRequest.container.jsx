import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchLeaveRequests, subscribeToLeaveRequests, updateLeaveStatus } from "../../../../redux/slices/leaveSlice";
import { formatDate } from "../../../../utils/dateUtils";
import ViewLeaveRequestUI from "./ViewLeaveRequest.ui";
import { SkeletonLoader } from "../../../common/skeleton/Skeleton";
import { usePopupContext } from "../../../common/popups/PopupProvider";

/**
 * Container component for View Leave Request Detail page
 * 
 * Real-time behavior:
 * - Sets up Firestore listener for ALL leave requests
 * - Filters to show specific employee's requests
 * - When status is updated (Approve/Reject):
 *   1. updateLeaveStatus updates Firestore
 *   2. onSnapshot listener detects the change
 *   3. Redux state updates automatically
 *   4. Component re-renders with new status
 *   5. UI shows updated status badge - NO refresh needed!
 */
const ViewLeaveRequestContainer = () => {
  const { date, employeeId } = useParams();
  const dispatch = useDispatch();
  const [updatingStatus, setUpdatingStatus] = useState(null); // 'Approved' | 'Rejected' | null
  const { showToast, showConfirm } = usePopupContext();

  const { list: leaves, loading } = useSelector((state) => state.leaves);
  const { list: employees } = useSelector((state) => state.employees);

  // 🔥 FIX 1: Load data + listener ONCE on mount
  useEffect(() => {
    dispatch(fetchLeaveRequests()); // Load initial data

    const unsubscribe = subscribeToLeaveRequests()(dispatch);
    return () => { if (unsubscribe) unsubscribe(); };
  }, [dispatch]);

  // 🔥 FIX 2: Wait for data to load
  if (loading || leaves.length === 0) {
    return <div className="p-10"><SkeletonLoader type="table" rows={5} /></div>;
  }

  // 🔥 FIX 3: Find by backend structure (date + employeeId)
  const selectedLeave = leaves.find(
    (leave) =>
      String(leave.date) === String(date) &&
      leave.employees?.some(emp => String(emp.employeeId) === String(employeeId))
  );

  if (!selectedLeave) {
    return <div className="p-10 text-center text-gray-500">Leave request not found.</div>;
  }

  // 🔥 FIX 4: Get specific employee record from nested array
  const selectedEmployee = selectedLeave.employees.find(
    emp => String(emp.employeeId) === String(employeeId)
  );

  // Find employee details
  const employee = employees.find(
    (emp) =>
      String(emp.EmployeeID || emp.id || emp.employeeId) === String(employeeId)
  );

  // Get all requests for history
  const employeeRequests = leaves
    .flatMap(leave =>
      leave.employees
        .filter(emp => String(emp.employeeId) === String(employeeId))
        .map(emp => ({ ...emp, date: leave.date }))
    );

  // 🔥 FIX 5: Update status with backend format (date/employeeId)
  const executeStatusUpdate = async (newStatus) => {
    setUpdatingStatus(newStatus);
    try {
      await dispatch(updateLeaveStatus({
        date,           // Backend expects: /leaves/:date/:employeeId
        employeeId,
        status: newStatus
      })).unwrap();

      showToast("success", `Leave request ${newStatus.toLowerCase()}d successfully!`);
    } catch (error) {
      console.error("Failed to update status:", error);
      showToast("error", "Failed to update status. Please try again.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleApprove = () => {
    showConfirm(
      "Are you sure you want to approve this leave request?",
      () => executeStatusUpdate("Approved"),
      "Approve"
    );
  };

  const handleReject = () => {
    showConfirm(
      "Are you sure you want to reject this leave request?",
      () => executeStatusUpdate("Rejected"),
      "Reject"
    );
  };

  // Construct data object for UI
  const finalData = {
    status: selectedEmployee.status || "Pending",
    employeeId: selectedEmployee.employeeId,
    employee: {
      // 🔥 FIX: Check both selectedEmployee (from leave) AND employee (from users list)
      name: selectedEmployee?.Name || selectedEmployee?.name || employee?.Name || employee?.name || "Unknown",
      photo: selectedEmployee?.Photo || selectedEmployee?.photo || employee?.Photo || employee?.photo || null,
      position: employee?.Position || employee?.position || "Employee",
      department: employee?.Department || employee?.department || "General",
    },
    leaveDetails: {
      type: selectedEmployee.leaveType,
      startDate: formatDate(selectedEmployee.fromDate),
      endDate: formatDate(selectedEmployee.toDate),
      totalDays: (Math.ceil((new Date(selectedEmployee.toDate) - new Date(selectedEmployee.fromDate)) / (1000 * 60 * 60 * 24)) + 1),   // 🔥 FIX: Use existing totalDays OR calculate it if missing      reason: selectedEmployee.reason,
      document: selectedEmployee.document || null,
    },
    employeeHistory: {
      leaveBalance: { annual: 12, sick: 5, personal: 2 },
      attendanceSummary: { worked: 140, late: 2, unexcused: 0 },
      requestsThisYear: {
        submitted: employeeRequests.length,
        approved: employeeRequests.filter(req => req.status === "Approved").length,
        rejected: employeeRequests.filter(req => req.status === "Rejected").length
      },
      recentHistory: employeeRequests.slice(0, 5).map(req => ({
        type: req.leaveType,
        dates: `${formatDate(req.fromDate)} - ${formatDate(req.toDate)}`,
        days: req.totalDays,
        status: req.status || "Pending"
      }))
    }
  };

  return (
    <ViewLeaveRequestUI
      data={finalData}
      onApprove={handleApprove}
      onReject={handleReject}
      updatingStatus={updatingStatus}
    />
  );
};

export default ViewLeaveRequestContainer;
