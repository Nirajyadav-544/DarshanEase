import API from '../api/axios';

const authService = {
  // 1. लॉगिन एंडपॉइंट कनेक्ट
  login: async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    return response.data;
  },

  // 2. रजिस्ट्रेशन एंडपॉइंट कनेक्ट
  register: async (userData) => {
    const response = await API.post('/auth/register', userData);
    return response.data;
  },

  // 3. करेंट यूजर सेशन वेरीफाई एंडपॉइंट
  getCurrentUser: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  },

  // 4. यूजर प्रोफाइल अपडेट एंडपॉइंट
  updateProfile: async (profileData) => {
    const response = await API.put('/users/profile', profileData);
    return response.data;
  }
};

export default authService;
