import axios from 'axios';

// Create an instance of Axios with default settings
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('preppilot_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry / global server errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend returns 401 Unauthorized, we can clear token and log out the user
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('preppilot_token');
      // If we are in a browser context, redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    // Normalize error response formatting for easier controller use
    const responseData = error.response?.data;
    let message = responseData?.message || 'Something went wrong. Please try again.';
    
    // If backend returned field-level validation errors, join them into readable message
    if (responseData?.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
      message = responseData.errors.map(e => e.message).join('. ');
    }
    
    const normalizedError = new Error(message);
    normalizedError.status = error.response?.status || 500;
    normalizedError.data = responseData || null;
    
    return Promise.reject(normalizedError);
  }
);

export default api;
