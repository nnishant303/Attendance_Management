import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import api from "../../utils/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://attendmate-backend-femy.onrender.com/api";
let socket;

export const listenToEvents = createAsyncThunk(
  "events/listenToEvents",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      console.log("Fetching events...");
      const response = await api.get("/events");
      const events = response.data;

      // Normalize
      const formattedEvents = events.map(ev => ({
        ...ev,
        id: ev._id,
        event_title: ev.title || ev.event_title || "No Title",
        // Recover color from description (primary storage) or mapped type (fallback)
        event_theme: ev.description || ev.event_theme || (ev.type === "Holiday" ? "green" : ev.type === "Meeting" ? "yellow" : "blue"),
        event_date: ev.event_date || ev.start || ev.end
      }));

      dispatch(setEvents(formattedEvents));

      // Socket config
      if (!socket) {
        socket = io(API_BASE_URL.replace('/api', ''), {
          withCredentials: true,
        });
      }

      socket.off("eventsUpdated");
      socket.on("eventsUpdated", () => {
        dispatch(listenToEvents());
      });

      return formattedEvents;

    } catch (error) {
      console.error("Events fetch error:", error);
      return rejectWithValue(error.message);
    }
  }
);


export const createEvent = createAsyncThunk(
  "events/createEvent",
  async ({ event_title, event_theme, event_date }, { rejectWithValue }) => {
    try {
      let backendType = "Event";
      if (event_theme === "green") backendType = "Holiday";
      else if (event_theme === "yellow") backendType = "Meeting";
      else backendType = "Event";

      const payload = {
        title: event_title,
        type: backendType,
        event_theme: event_theme || "blue",
        start: event_date instanceof Date ? event_date.toISOString() : event_date,
        end: event_date instanceof Date ? event_date.toISOString() : event_date,
        event_date: event_date instanceof Date ? event_date.toISOString() : event_date,
        description: event_theme || "blue"
      };

      const response = await api.post("/events/add", payload);
      const newEvent = response.data;
      return newEvent.event;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/events/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



const eventSlice = createSlice({
  name: "events",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {
    setEvents(state, action) {
      state.list = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listenToEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(listenToEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload; // Now using the returned payload
      })
      .addCase(listenToEvents.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.list = state.list.filter(event => event.id !== action.payload);
      })
  },

});

export const { setEvents } = eventSlice.actions;
export default eventSlice.reducer;