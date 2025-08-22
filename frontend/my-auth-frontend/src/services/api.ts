import axios from "axios";
import { refreshToken as refreshTokenService } from "./authServices";

/**
 * Axios instance
 * This is the main HTTP client used throughout the frontend.
 * - `baseURL` points to your backend API
 * - `withCredentials: true` ensures cookies (like refreshToken) are sent automatically
 */
const API = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

/**
 * -------------------------------
 * ASYNC COORDINATION VARIABLES
 * -------------------------------
 */

// Prevent multiple simultaneous refresh requests
let isRefreshing = false;

// Queue of callbacks waiting for a new token
let refreshSubscribers: ((token: string) => void)[] = [];

/**
 * Add a callback to the queue
 * Each callback will be called once a new access token is obtained
 */
function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

/**
 * Trigger all queued callbacks after new token is available
 */
function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = []; // clear the queue
}

/**
 * -------------------------------
 * REQUEST INTERCEPTOR
 * -------------------------------
 * Automatically attach access token to every outgoing request
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // wherever you store your access token
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * -------------------------------
 * RESPONSE INTERCEPTOR
 * -------------------------------
 * Handles token expiration automatically (401 responses)
 */
API.interceptors.response.use(
  (response) => response, // If response is OK, just return it
  async (error) => {
    const originalRequest = error.config;

    // Check if 401 (Unauthorized) AND not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {

      // If a token refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            // Once refresh finishes, update Authorization header & retry request
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(API(originalRequest));
          });
        });
      }

      // Mark original request so we don't retry infinitely
      originalRequest._retry = true;
      isRefreshing = true; // indicate refresh in progress

      try {
        // Call backend refresh endpoint
        const response = await refreshTokenService();
        const newToken = response.data?.token || '';

        // Save new token locally
        localStorage.setItem("accessToken", newToken);

        // Resolve all queued requests waiting for this new token
        onRefreshed(newToken);

        // Retry the original request with updated token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);

      } catch (err) {
        // Refresh failed → force logout
        localStorage.removeItem("accessToken");
        window.location.href = "/login"; // redirect to login page
        return Promise.reject(err);

      } finally {
        // Reset flag so future 401s can trigger refresh
        isRefreshing = false;
      }
    }

    // If error is not 401 or already retried, just reject
    return Promise.reject(error);
  }
);

export default API;
