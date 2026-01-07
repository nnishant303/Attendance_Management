// src/router/AppRouter.jsx
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listenToAuthState } from "../redux/slices/authSlice";

// ✅ Pages
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import VerifyOtpPage from "../pages/VerifyOtpPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import DashboardPage from "../pages/AttendancePage";
import CalenderPage from "../pages/CalenderPage";
import EmployeeFormPage from "../pages/EmployeeFormPage";
import EmployeeDetailsPage from "../pages/EmployeeDetailsPage";
import CalenderComPage from "../pages/CalenderComPage";
import EditEmployeePage from "../pages/EditEmployeePage";
import EmployeeCalendarComPage from "../pages/EmployeeCalendarComPage";
import LeaveRequestPage from "../pages/LeaveRequestPage";
import ViewLeaveRequestPage from "../pages/ViewLeaveRequestPage";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { PopupProvider } from "../components/common/popups/PopupProvider";
import ConfirmPopup from "../components/common/popups/ConfirmPopup";
import ToastBar from "../components/common/popups/ToastBar";

const AppRouter = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("AppRouter init: Checking localStorage for existing session...");
    if (localStorage.getItem("user") || localStorage.getItem("authToken")) {
      dispatch(listenToAuthState());
    }
  }, [dispatch]);

  // Debugging state changes in the router
  useEffect(() => {
    console.log("Auth State Changed - isAuthenticated:", isAuthenticated, "user:", user?.email);
  }, [isAuthenticated, user]);

  return (
    <Router>
      <PopupProvider>
        <ConfirmPopup />
        <ToastBar />
        <Routes>
          <Route path="/" element={<Navigate to="/signin" replace />} />

          <Route
            path="/signin"
            element={
              <PublicRoute>
                <SignInPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUpPage />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />
          <Route
            path="/verify-otp"
            element={
              <PublicRoute>
                <VerifyOtpPage />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPasswordPage />
              </PublicRoute>
            }
          />

          {/* Protected Routes (requires login) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalenderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendarcom"
            element={
              <ProtectedRoute>
                <CalenderComPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-employee"
            element={
              <ProtectedRoute>
                <EmployeeFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee_details"
            element={
              <ProtectedRoute>
                <EmployeeDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-employee/:id"
            element={
              <ProtectedRoute>
                <EditEmployeePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee-calendarcom"
            element={
              <ProtectedRoute>
                <EmployeeCalendarComPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leave-requests"
            element={
              <ProtectedRoute>
                <LeaveRequestPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leave-request/:date/:employeeId"
            element={
              <ProtectedRoute>
                <ViewLeaveRequestPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </PopupProvider>
    </Router>
  );
};

export default AppRouter;
