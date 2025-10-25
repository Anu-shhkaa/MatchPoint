import axios from 'axios';

// 1. Create a "base" axios instance
const api = axios.create({
  // We use a relative URL here because of the proxy we set up in vite.config.js
  // All requests to /api/ will be forwarded to http://localhost:3001
  baseURL: '/api',
});

// 2. The "Interceptor" (This is the magic part)
// This function runs BEFORE every single request you make with this 'api' instance
api.interceptors.request.use(
  (config) => {
    // 3. Get the token from localStorage (where AuthContext saves it)
    const token = localStorage.getItem('matchpoint-token');
    
    // 4. If the token exists, add it to the 'Authorization' header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config; // Send the request on its way
  },
  (error) => {
    // Handle any request errors
    return Promise.reject(error);
  }
);

export default api;
