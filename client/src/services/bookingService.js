import API from '../api/axios';

const bookingService = {
  // 1. रेज़रपे आर्डर क्रिएट करना
  createOrder: async (bookingData) => {
    const response = await API.post('/bookings/create-order', bookingData);
    return response.data;
  },

  // 2. रेज़रपे पेमेंट सिग्नेचर वेरीफाई करना
  verifyPayment: async (paymentDetails) => {
    const response = await API.post('/bookings/verify-payment', paymentDetails);
    return response.data;
  },

  // 3. डिजिटल पास/टिकट की डिटेल्स लाना
  getTicketDetails: async (bookingId) => {
    const response = await API.get(`/bookings/ticket/${bookingId}`);
    return response.data;
  },

  // 4. किसी भक्त का पूरा बुकिंग इतिहास देखना
  getMyBookingHistory: async () => {
    const response = await API.get('/bookings/my-history');
    return response.data;
  },

  // 5. [Admin] पूरे प्लेटफॉर्म की मास्टर बुकिंग्स लिस्ट
  getMasterBookings: async () => {
    const response = await API.get('/admin/all-bookings');
    return response.data;
  }
};

export default bookingService;
