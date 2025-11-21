import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, provider } from "../../firebase";

const savedUser = JSON.parse(localStorage.getItem("user"));


export const listenToAuthState = createAsyncThunk(
  "auth/listenToAuthState",
  async (_, { dispatch }) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "User",
          photo: user.photoURL || null,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        dispatch(setUser(userData));
      } else {
        localStorage.removeItem("user");
        dispatch(logout());
      }
    });
  }
);

export const signUpWithEmail = createAsyncThunk(
  "auth/signUpWithEmail",
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      // Clear any existing user data first
      localStorage.removeItem("user");
      
      // Create user but don't sign them in automatically
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      // Return success without user data to prevent automatic login
      return { success: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInWithEmail = createAsyncThunk(
  "auth/signInWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userData = { uid: user.uid, email: user.email };
      localStorage.setItem("user", JSON.stringify(userData));

      return { user: userData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
      };
      localStorage.setItem("user", JSON.stringify(userData));

      return { user: userData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOutUser = createAsyncThunk(
  "auth/signOutUser",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser || null,
    loading: false,
    error: null,
    isAuthenticated: !!savedUser,
    showSuccessMessage: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.showSuccessMessage = false;
      localStorage.removeItem("user");
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setShowSuccessMessage: (state, action) => {
      state.showSuccessMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.loading = false;
       
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(signInWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.showSuccessMessage = true;
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.showSuccessMessage = true;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.showSuccessMessage = false;
      })
      .addCase(signOutUser.rejected, (state, action) => {
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, logout, setUser, setShowSuccessMessage } =
  authSlice.actions;
export default authSlice.reducer;
