import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import api, { API_BASE_URL } from "../../utils/api";

let socket;

// Normalize a single employee attendance entry into the flat shape the UI expects
const normalizeEmployeeRecord = (emp, parentDate) => {
  const date = parentDate || emp.date || (emp.checkInTime ? emp.checkInTime.split("T")[0] : null);
  return {
    ...emp,
    id: emp._id || emp.id || emp.employeeId,
    employeeId: emp.employeeId || emp.id || emp.employeeId,
    checkInTime: emp.checkInTime || emp.CheckIn || null,
    checkOutTime: emp.checkOutTime || emp.CheckOut || null,
    // Backwards-compatible aliases used across the app
    CheckIn: emp.checkInTime || emp.CheckIn || null,
    CheckOut: emp.checkOutTime || emp.CheckOut || null,
    duration: emp.duration != null ? emp.duration : emp.duration,
    lateBy: emp.lateBy != null ? emp.lateBy : emp.lateBy,
    status: emp.status || emp.Status || null,
    date,
  };
};

// Accept backend response which may be:
// - an array of per-date documents where each doc has `date` and `employees` array
// - a single per-date document
// - an array of already-flat per-employee records
// Return a flattened array of per-employee records
const flattenAttendanceResponse = (data) => {
  const out = [];

  if (!data) return out;

  const pushEmployee = (emp, parentDate) => {
    out.push(normalizeEmployeeRecord(emp, parentDate));
  };

  // If data is an object (single document), handle it uniformly
  if (!Array.isArray(data)) {
    // A per-date doc with employees?
    if (data.employees && Array.isArray(data.employees)) {
      data.employees.forEach(emp => pushEmployee(emp, data.date));
    } else if (data.employeeId || data.checkInTime || data.checkOutTime) {
      // Already an employee-level record
      pushEmployee(data, data.date);
    }
    return out;
  }

  // Array case
  data.forEach(item => {
    if (!item) return;
    if (item.employees && Array.isArray(item.employees)) {
      item.employees.forEach(emp => pushEmployee(emp, item.date));
    } else if (item.employeeId || item.checkInTime || item.checkOutTime) {
      pushEmployee(item, item.date);
    } else if (item.date) {
      // Defensive: maybe it's a date doc without employees
      // skip
    }
  });

  return out;
};

export const listenToAttendance = createAsyncThunk(
  "attendance/listenToAttendance",
  async (dateInput, { rejectWithValue }) => {
    try {
      let dateStr = dateInput;
      if (dateInput instanceof Date) {
        dateStr = dateInput.toISOString().split("T")[0];
      }

      const response = await api.get(`/attendance`, { params: { date: dateStr } });
      const data = response.data;

      const flattened = flattenAttendanceResponse(data);
      return { date: dateStr, records: flattened };

    } catch (error) {
      console.error("Error fetching attendance:", error);
      return rejectWithValue(error.message);
    }
  }
);


export const fetchCalendarAttendance = createAsyncThunk(
  "attendance/fetchCalendarAttendance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/attendance", { params: { limit: 500 } });
      const data = response.data;

      // Flatten to per-employee records then group by date for the calendar
      const flattened = flattenAttendanceResponse(data);
      const calendarData = {};
      flattened.forEach(rec => {
        const d = rec.date || "unknown";
        if (!calendarData[d]) calendarData[d] = [];
        calendarData[d].push(rec);
      });

      return calendarData;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Subscribe to real-time updates for a date
export const subscribeToAttendanceUpdates = (dateStr) => (dispatch) => {
  // Setup Socket.io listener
  if (!socket) {
    socket = io(API_BASE_URL.replace('/api', ''), {
      withCredentials: true
    });
  }

  // Join room for this date
  socket.emit("subscribeToAttendance", dateStr);

  socket.off("attendanceUpdated");
  socket.on("attendanceUpdated", (updatedRecord) => {
    // UpdatedRecord may be a per-date doc or an employee entry — flatten then dispatch updates
    const flattened = flattenAttendanceResponse(updatedRecord);
    flattened.forEach(rec => dispatch(updateAttendanceRecord(rec)));
  });

  return () => {
    if (socket) {
      socket.off("attendanceUpdated");
    }
  };
};


const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    list: [], // List of ALL loaded attendance records (flat)
    calendarData: {}, // Map of date -> attendance list
    loading: false,
    error: null,
  },
  reducers: {
    setAttendance(state, action) {
      // Payload expected: { date, records }
      const { date, records } = action.payload;
      if (date) {
        // Remove old records for this date
        state.list = state.list.filter(r => r.date !== date);
        // Add new records
        state.list.push(...records);
      } else if (Array.isArray(action.payload)) {
        // Fallback
        state.list = action.payload;
      }
      state.loading = false;
    },
    updateAttendanceRecord(state, action) {
      const updatedRecord = action.payload;
      // Update in data list
      const index = state.list.findIndex(item => item.id === updatedRecord.id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...updatedRecord };
      } else {
        state.list.push(updatedRecord);
      }
    },
    clearAttendance(state) {
      state.list = [];
      if (socket) {
        socket.off("attendanceUpdated");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listenToAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(listenToAttendance.fulfilled, (state, action) => {
        state.loading = false;
        const { date, records } = action.payload;
        if (date) {
          state.list = state.list.filter(r => r.date !== date);
          state.list.push(...records);
        } else if (Array.isArray(action.payload)) {
          state.list = action.payload;
        }
      })
      .addCase(listenToAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCalendarAttendance.fulfilled, (state, action) => {
        state.calendarData = action.payload;
      });
  },
});

export const { setAttendance, updateAttendanceRecord, clearAttendance } = attendanceSlice.actions;

export default attendanceSlice.reducer;