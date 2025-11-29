// API URL configuration
// For production, set EXPO_PUBLIC_API_URL in your .env file or update this directly
// For local development, use 'http://localhost:8000'
// For physical device testing on local network, use 'http://YOUR_LOCAL_IP:8000'
// Example: export const API_URL = 'https://your-backend-domain.com';

// Using environment variable with fallback
// In Expo, environment variables must be prefixed with EXPO_PUBLIC_
// Create a .env file in the root with: EXPO_PUBLIC_API_URL=https://your-backend.com
export const API_URL = 
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) || 
  'http://localhost:8000';

// API endpoints
export const API_ENDPOINTS = {
    // Auth
    AUTH_LOGIN: '/auth/login',
    AUTH_SIGNUP: '/auth/signup',
    AUTH_GOOGLE: '/auth/google',
    AUTH_ME: '/auth/me',

    // Todos
    TODOS: '/todos',
    TODO_BY_ID: (id: string) => `/todos/${id}`,
} as const;
