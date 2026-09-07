import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import api from "../../utils/api";

let socket;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://attendmate-backend-1.onrender.com/api";

export const listenToEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching employees from API...");
      const response = await api.get("/employees");
      const data = response.data;

      console.log("🔍 Raw backend employee data (first employee - full):", JSON.stringify(data[0], null, 2));

      // Normalize data to match application expectations (PascalCase for UI)
      const employees = data.map(emp => ({
        ...emp,
        id: emp._id, // Internal Redux ID

        // UI Expected Fields (PascalCase)
        Name: emp.name,
        EmployeeID: emp.employeeId,
        Email: emp.email,
        Department: emp.department,
        Designation: emp.designation,
        Role: emp.designation, // UI displays job title/designation, not permission role
        Gender: emp.gender || "Male", // Default to Male if not set
        ContactNumber: emp.contactNumber || emp.phone,
        DateOfJoining: emp.joiningDate,
        DateOfBirth: emp.dateOfBirth || emp.dob,
        Address: emp.address,
        Photo: emp.image,

        // Keep lowercase for different consumers if needed
        empId: emp.employeeId,
        role: emp.role || "employee", // Default to employee role if not set
        gender: emp.gender || "Male", // Keep lowercase gender for compatibility
      }));

      console.log(`Fetched ${employees.length} employees`);
      return employees;

    } catch (err) {
      console.error("Employee fetch error:", err);
      return rejectWithValue(err.message);
    }
  }
);

// Subscribe to real-time employee updates
export const subscribeToEmployeeUpdates = () => (dispatch) => {
  if (!socket) {
    socket = io(API_BASE_URL.replace('/api', ''), { withCredentials: true });
  }

  socket.off("employeeUpdated");
  socket.on("employeeUpdated", (employee) => {
    console.log("Employee update received:", employee);
    // Re-fetch all employees to ensure consistency
    dispatch(listenToEmployees());
  });

  return () => {
    if (socket) socket.off("employeeUpdated");
  };
};


export const createEmployee = createAsyncThunk(
  "employees/createEmployee",
  async (employeeData, { rejectWithValue }) => {
    try {
      console.log("🌐 POSTING to /employees/add with body:", JSON.stringify(employeeData, null, 2));

      const response = await api.post("/employees/add", employeeData);
      const newEmployee = response.data;

      console.log("✨ Backend response after creating employee:", JSON.stringify(newEmployee, null, 2));

      // Backend returns { message: "...", employee: {...} }
      const emp = newEmployee.employee || newEmployee;

      // Normalize to match listenToEmployees format EXACTLY
      return {
        ...emp,
        id: emp._id,

        // UI Expected Fields (PascalCase) - must match listenToEmployees
        Name: emp.name,
        EmployeeID: emp.employeeId,
        Email: emp.email,
        Department: emp.department,
        Designation: emp.designation,
        Role: emp.designation, // Map designation to Role for UI consistency
        Gender: emp.gender || "Male", // Default to Male if not set
        ContactNumber: emp.contactNumber || emp.phone,
        DateOfJoining: emp.joiningDate,
        DateOfBirth: emp.dateOfBirth || emp.dob,
        Address: emp.address,
        Photo: emp.image,

        // Keep lowercase for different consumers if needed
        empId: emp.employeeId,
        role: emp.role || "employee", // Default to employee role if not set
        gender: emp.gender || "Male", // Keep lowercase gender for compatibility
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const updateEmployeeAsync = createAsyncThunk(
  "employees/updateEmployee",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      await api.put(`/employees/${id}`, updatedData);
      // returning arg data to update local store optimistically
      return { id, updatedData };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const deleteEmployeeAsync = createAsyncThunk(
  "employees/deleteEmployee",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/employees/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    list: [],
    loading: false,
    currentEmployee: null,
    error: null,
  },
  reducers: {
    setEmployees(state, action) {
      state.list = action.payload;
      state.loading = false;
    },
    clearCurrentEmployee(state) {
      state.currentEmployee = null;
    },
    clearEmployees(state) {
      state.list = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listenToEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listenToEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(listenToEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.list = [];
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateEmployeeAsync.fulfilled, (state, action) => {
        const { id, updatedData } = action.payload;
        const index = state.list.findIndex((emp) => emp.id === id);
        if (index !== -1) state.list[index] = { ...state.list[index], ...updatedData };
      })
      .addCase(deleteEmployeeAsync.fulfilled, (state, action) => {
        state.list = state.list.filter((emp) => emp.id !== action.payload);
      });
  },
});

export const { setEmployees, clearCurrentEmployee, clearEmployees } = employeeSlice.actions;
export default employeeSlice.reducer;