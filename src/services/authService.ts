
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Set auth token for API requests
export const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('token');
  }
};

// Load token on app start
export const loadToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
    return token;
  }
  return null;
};

// Register user
export const register = async (userData: { name: string; email: string; password: string }) => {
  try {
    const res = await axios.post(`${API_URL}/users/register`, userData);
    if (res.data.token) {
      setAuthToken(res.data.token);
    }
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Server error' };
  }
};

// Login user
export const login = async (userData: { email: string; password: string }) => {
  try {
    const res = await axios.post(`${API_URL}/users/login`, userData);
    if (res.data.token) {
      setAuthToken(res.data.token);
    }
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: 'Server error' };
  }
};

// Get current user data
export const getCurrentUser = async () => {
  try {
    const res = await axios.get(`${API_URL}/users/me`);
    return res.data;
  } catch (err) {
    setAuthToken(null);
    throw err.response?.data || { message: 'Server error' };
  }
};

// Logout user
export const logout = () => {
  setAuthToken(null);
};
