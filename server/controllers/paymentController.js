

// 🌟 इस लाइन को paymentController.js के सबसे ऊपर टॉप पर पेस्ट करें:
require("dotenv").config();

const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const DarshanSlot = require("../models/DarshanSlot");
const QRCode = require("qrcode");
const sendWelcomeEmail = require("../utils/welcomeTemplate");

// 🌟 रेज़रपे इंस्टेंस को आपकी .env कीज़ के साथ बाइंड करना
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// =========================================================================
// 💸 1. CREATE ORDERS: फ्रंटेंड के लिए असली रेज़रपे आर्डर जनरेट करना
// =========================================================================
const createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body; // फ्रंटेंड से आई कुल फीस राशि (INR)
        
        const options = {
            amount: Number(amount) * 100, // रेज़रपे पैसे (Paise) में रीड करता है (₹250 = 25000 Paise)
            currency: "INR",
            receipt: "order_rcpt_" + Date.now()
        };

        const order = await razorpayInstance.orders.create(options);
        return res.status(200).json({ success: true, order });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// =========================================================================
// 🔒 2. WEBHOOK CAPTURE NODE: बैंक से पैसा आते ही ऑटोमैटिकली डेटाबेस अपडेट करना
// =========================================================================
const razorpayWebhookCapture = async (req, res) => {
    try {
        // 🔒 अत्यंत कड़ा सुरक्षा नियम: रेज़रपे के सिग्नेचर को वेरीफाई करना ताकि कोई हैकर नकली रिक्वेस्ट न भेज सके
        const secret = "DarshanEaseWebhookSecret@2026"; // यह आपका वेबहुक सीक्रेट पासवर्ड है
        
        const shasum = crypto.createHmac("sha256", secret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest("hex");

        if (digest !== req.headers["x-razorpay-signature"]) {
            return res.status(400).json({ status: "Security Intercept: Invalid Webhook Signature!" });
        }

        // सिग्नेचर वेरीफाई होने पर इवेंट को रीड करना
        const event = req.body.event;

        if (event === "payment.captured") {
            const paymentDetails = req.body.payload.payment.entity;
            const orderId = paymentDetails.order_id;
            const amountPaid = paymentDetails.amount / 100; // पैसे को दोबारा रुपये में बदलना

            console.log(`💰 Bank Alert: Payment of ₹${amountPaid} captured successfully for Order: ${orderId}`);

            // 🚀 ऑटोमैटिकली डेटाबेस अपडेट: पेंडिंग बुकिंग को खोजना और उसे 'Paid' व 'Confirmed' मार्क करना
            const booking = await Booking.findOne({ ticket: orderId }); // हम 'ticket' फ़ील्ड में order_id स्टोर करेंगे
            
            if (booking) {
                booking.paymentStatus = "Paid";
                booking.bookingStatus = "Confirmed";
                booking.amount = amountPaid;
                
                // डिजिटल गेट पास क्यूआर कोड जनरेट करना
                const qrContent = `DARSHAN EASE OFFICIAL\nPass ID: ${booking.bookingId}\nStatus: PAID & VERIFIED\nTotal Headcount: ${booking.numberOfPeople}`;
                booking.qrCode = await QRCode.toDataURL(qrContent);
                await booking.save();

                console.log(`✅ MongoDB Update: Booking ${booking.bookingId} is now officially Unlocked and Confirmed!`);
            }
        }

        // रेज़रपे सर्वर को 200 ओके रिस्पॉन्स भेजना ताकि वह बार-बार सिग्नल न भेजे
        return res.status(200).json({ status: "ok" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { createRazorpayOrder, razorpayWebhookCapture };
