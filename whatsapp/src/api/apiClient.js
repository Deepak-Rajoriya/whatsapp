import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api/', // Set your API base URL here
  timeout: 5000, // Request timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors for handling errors or tokens
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Example: Add auth token to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
