import axios from 'axios';
import { toast } from 'react-hot-toast';

// Prefer an environment variable if one is set (needed for production
// deployments where the backend isn't on localhost), falling back to the
// local dev backend so nothing breaks if .env isn't configured yet.
const BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  'http://localhost:5000/api';

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // fail fast instead of hanging forever if the backend is unreachable
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: हर रिक्वेस्ट के साथ लोकल स्टोरेज से टोकन जोड़ना
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: 401 Unauthorized होने पर ऑटो-लॉगआउट संभालना
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Only treat this as "session expired" if the user actually had a
      // token in the first place — otherwise a logged-out user hitting a
      // protected route would get bounced with a confusing message.
      const hadToken = Boolean(localStorage.getItem('token'));

      localStorage.clear();

      if (hadToken) {
        toast.error('Your session has expired. Please log in again.');
      }

      // Give the toast a moment to actually render before navigating away —
      // previously this redirected instantly, so any error toast a caller
      // tried to show (including this one) could be wiped by the reload
      // before the user ever saw it.
      setTimeout(() => {
        window.location.href = '/login';
      }, 1200);
    }
    return Promise.reject(error);
  }
);

export default API;