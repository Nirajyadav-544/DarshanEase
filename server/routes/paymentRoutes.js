const express = require("express");
const router = express.Router();
const { createRazorpayOrder, razorpayWebhookCapture } = require("../controllers/paymentController");
const protectUser = require("../middleware/authMiddleware");

// फ्रंटेंड आर्डर बनाने के लिए (यूजर टोकन सुरक्षा के साथ)
router.post("/create-order", protectUser, createRazorpayOrder);

// 🌟 रेज़रपे बैंक सिग्नल के लिए सीधा ओपन वेबहुक एंडपॉइंट (इसमें कोई मिडिलवेयर नहीं लगेगा)
router.post("/webhook", razorpayWebhookCapture);

module.exports = router;
