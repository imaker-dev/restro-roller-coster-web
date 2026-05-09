import axios from "axios";
import { clearAuthStorage, getBearerToken } from "../utils/authToken";
import { ERROR_TYPES, identifyError } from "../utils/errorHandler";

const baseURL = import.meta.env.VITE_API_URL;

// Create axios instance
const axiosInstance = axios.create({
  baseURL,
});

// Request interceptor to handle dynamic content-type based on request body
axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.headers) config.headers = {};

    const token = getBearerToken();

    if (token) {
      config.headers.Authorization = token;
    }

    // If the request body is FormData, let axios set the Content-Type for multipart/form-data
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      // For JSON requests, set Content-Type to application/json
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors and unauthorized status
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const errorMessage = data?.message || data?.error || "Some unknown error";

      const errorType = identifyError(errorMessage);

      if (errorType === ERROR_TYPES.AUTH) {
        clearAuthStorage();
        window.location.replace("/auth");
      }

      if (errorType === ERROR_TYPES.SUBSCRIPTION) {
        // Same route for all roles
         window.dispatchEvent(new CustomEvent("api-error", {
          detail: { type: ERROR_TYPES.SUBSCRIPTION, message: errorMessage }
        }));
        // window.location.replace("/subscription-expired");
      }

      if (errorType === ERROR_TYPES.ORDER) {
        if (window.location.pathname.includes("self-order")) {
          // window.location.reload();
        }
      }

      return Promise.reject(new Error(errorMessage));
    }

    return Promise.reject(new Error("Network error"));
  },
);

// Utility methods for GET and POST requests
export const get = async (url, params, config = {}) =>
  axiosInstance.get(url, { params, ...config });

export const post = async (url, data, config = {}) =>
  axiosInstance.post(url, data, config);

export const put = async (url, data, config = {}) =>
  axiosInstance.put(url, data, config);

export const del = async (url, config = {}) =>
  axiosInstance.delete(url, config);

export default axiosInstance;
