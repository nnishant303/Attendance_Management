import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://attendmate-backend-1.onrender.com/api";

// Create an axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Send cookies if needed
    timeout: 30000, // 30 seconds timeout
});

// REQUEST INTERCEPTOR: Automatically add token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// RESPONSE INTERCEPTOR: Handle global errors (like 401)
api.interceptors.response.use(
    (response) => {
        // Any status code within the range of 2xx causes this function to trigger
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized globally
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.error("Authentication expired or unauthorized.");
            // We don't clear storage or redirect here anymore.
            // Redux thunks (like listenToAuthState) will handle the dispatch(logout())
            // which clears state and triggers router navigation.
        }

        // Return a readable error message
        const message = error.response?.data?.message || error.message || "An unexpected error occurred";
        return Promise.reject(new Error(message));
    }
);

export default api;
