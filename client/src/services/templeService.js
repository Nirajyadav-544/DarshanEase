import API from '../api/axios';

const templeService = {
  // 1. सभी मंदिरों की लिस्ट (सर्च और फ़िल्टर के साथ)
  getAllTemples: async (search = '', state = '') => {
    const response = await API.get(`/temples?search=${search}&state=${state}`);
    return response.data;
  },

  // 2. किसी एक मंदिर की पूरी जानकारी (ID के आधार पर)
  getTempleById: async (id) => {
    const response = await API.get(`/temples/${id}`);
    return response.data;
  },

  // 3. [Organizer] नया मंदिर जोड़ना
  addTemple: async (templeData) => {
    const response = await API.post('/organizer/add-temple', templeData);
    return response.data;
  },

  // 4. [Organizer] नए दर्शन स्लॉट्स बनाना
  createSlot: async (slotData) => {
    const response = await API.post('/organizer/create-slot', slotData);
    return response.data;
  },

  // 5. [Admin] पेंडिंग मंदिरों की सूची देखना
  getPendingTemples: async () => {
    const response = await API.get('/admin/pending-temples');
    return response.data;
  },

  // 6. [Admin] मंदिर को एप्रूव या रिजेक्ट करना
  reviewTemple: async (id, status) => {
    const response = await API.patch(`/admin/temples/${id}`, { status });
    return response.data;
  }
};

export default templeService;
