
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signOutUser } from "../../redux/slices/authSlice";
import { listenToEmployees } from "../../redux/slices/employeeSlice";
import api from "../../utils/api";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/navbar/Navbar";
import ToastBar from "../../components/common/popups/ToastBar"; // Assuming global toast usage if available, but I'll implement local for now or use the provider
import { usePopupContext } from "../../components/common/popups/PopupProvider"; // Assuming this exists based on AppRouter

const NotificationPage = () => {
    // Layout State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Data State
    const { list: employees, loading: employeesLoading } = useSelector((state) => state.employees);
    // Local copy for filtering
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Selection State
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [sendToAll, setSendToAll] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [type, setType] = useState("system"); // system, attendance, leave, event
    const [sending, setSending] = useState(false);

    // Popup/Toast
    const { showToast } = usePopupContext() || {}; // Safe access

    // Auth & Init
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/signin");
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        dispatch(listenToEmployees());
    }, [dispatch]);

    useEffect(() => {
        if (employees) {
            setFilteredEmployees(
                employees.filter(emp =>
                    emp.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    emp.EmployeeID.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
    }, [employees, searchQuery]);

    const handleSignOut = () => {
        dispatch(signOutUser());
        navigate("/signin");
    };

    const handleSelectEmployee = (emp) => {
        if (sendToAll) return;
        setSelectedEmployee(emp);
    };

    const toggleSendToAll = () => {
        setSendToAll(!sendToAll);
        if (!sendToAll) {
            setSelectedEmployee(null);
        }
    };

    const handleSendNotification = async (e) => {
        e.preventDefault();

        if (!title.trim() || !message.trim()) {
            alert("Please fill in title and message"); // Fallback
            return;
        }

        if (!sendToAll && !selectedEmployee) {
            alert("Please select an employee or check 'Send to All'");
            return;
        }

        setSending(true);

        try {
            if (sendToAll) {
                // Bulk Send
                await api.post("/notifications/send-to-all", {
                    title,
                    message,
                    type
                });
                if (showToast) showToast("success", "Notifications sent to all employees!");
            } else {
                // Single Send
                // Backend expects 'recipientId' and 'recipientType'
                await api.post("/notifications", {
                    recipientId: selectedEmployee.id,
                    recipientType: 'employee',
                    title,
                    message,
                    type
                });
                if (showToast) showToast("success", `Notification sent to ${selectedEmployee.Name}`);
            }

            // Reset Form (keep selection?)
            setTitle("");
            setMessage("");
            // Optional: setSendToAll(false); setSelectedEmployee(null); 

        } catch (error) {
            console.error("Send Notification Error:", error);
            if (showToast) showToast("error", error.message || "Failed to send notification");
            else alert("Failed to send notification");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                handleSignOut={handleSignOut}
            />

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 flex flex-col h-screen overflow-hidden">
                <Navbar toggleSidebar={toggleSidebar} handleSignOut={handleSignOut} />

                <main className="flex-1 pt-20 p-6 overflow-hidden flex gap-6">

                    {/* LEFT PANEL: User Selection */}
                    <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">Recipients</h2>

                            {/* Search */}
                            <div className="relative mb-3">
                                <input
                                    type="text"
                                    placeholder="Search employee..."
                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    disabled={sendToAll}
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            {/* Send to All Toggle */}
                            <div
                                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${sendToAll ? 'bg-blue-100 border-blue-200' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
                                onClick={toggleSendToAll}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${sendToAll ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <span className={`font-medium ${sendToAll ? 'text-blue-700' : 'text-gray-700'}`}>Send to All Employees</span>
                                </div>
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${sendToAll ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}>
                                    {sendToAll && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                                </div>
                            </div>
                        </div>

                        {/* List */}
                        <div className={`flex-1 overflow-y-auto p-2 ${sendToAll ? 'opacity-50 pointer-events-none' : ''}`}>
                            {employeesLoading ? (
                                <div className="flex justify-center py-4 text-gray-500">Loading...</div>
                            ) : (
                                filteredEmployees.map((emp) => (
                                    <div
                                        key={emp.id}
                                        onClick={() => handleSelectEmployee(emp)}
                                        className={`flex items-center gap-3 p-3 mb-1 rounded-lg cursor-pointer transition-all border ${selectedEmployee?.id === emp.id
                                            ? 'bg-blue-50 border-blue-200 shadow-sm'
                                            : 'bg-white border-transparent hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                            {emp.Photo ? (
                                                <img src={emp.Photo} alt={emp.Name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-500 font-bold">
                                                    {emp.Name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className={`text-sm font-medium ${selectedEmployee?.id === emp.id ? 'text-blue-800' : 'text-gray-800'}`}>{emp.Name}</h3>
                                            <p className="text-xs text-gray-500">{emp.Role} • {emp.EmployeeID}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANEL: Composer */}
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col relative overflow-hidden">
                        {(!selectedEmployee && !sendToAll) ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center animate-fade-in">
                                <div className="p-4 bg-gray-50 rounded-full mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-600">Select a recipient locally</h3>
                                <p className="text-sm max-w-xs mt-2">Choose an employee from the list or select "Send to All" to start composing a notification.</p>
                            </div>
                        ) : (
                            <>
                                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            {sendToAll ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase text-gray-500 font-bold tracking-wider">New Notification To</p>
                                            <h2 className="text-lg font-bold text-gray-800">
                                                {sendToAll ? "All Employees" : selectedEmployee?.Name}
                                            </h2>
                                        </div>
                                    </div>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="system">System</option>
                                        <option value="attendance">Attendance</option>
                                        <option value="leave">Leave</option>
                                        <option value="event">Event</option>
                                    </select>
                                </div>

                                <div className="flex-1 p-6 flex flex-col gap-4 bg-white overflow-y-auto">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">Title</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
                                            placeholder="Notification Title (e.g. Holiday Reminder)"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-1 flex-1 flex flex-col">
                                        <label className="text-sm font-semibold text-gray-700">Message</label>
                                        <textarea
                                            className="w-full flex-1 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm resize-none"
                                            placeholder="Type your message here..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                                    <button
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium transition-all shadow-md ${sending
                                            ? 'bg-blue-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95'
                                            }`}
                                        onClick={handleSendNotification}
                                        disabled={sending}
                                    >
                                        {sending ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <span>Send Notification</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                </main>
            </div>
        </div>
    );
};

export default NotificationPage;
