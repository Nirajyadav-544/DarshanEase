import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-hot-toast';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiveBookingHistory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        // 🚀 एक्सप्रेस गेटवे से श्रद्धालु का असली बुकिंग इतिहास खींचना
        //
        // FIX: पहले यह "/bookings/my-history" call कर रहा था, जो
        // server.js में registered किसी भी route से match नहीं करता
        // (bookingRoutes के अंदर सिर्फ "/mybookings" sub-path defined
        // है, bare root नहीं) — इसलिए यह हमेशा 404 देता था और history
        // हमेशा खाली दिखती थी, चाहे बुकिंग्स database में मौजूद हों।
        const response = await API.get('/booking/mybookings', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // डेटा स्ट्रक्चर की कड़ाई से जांच करना
        const rawData = response.data?.bookings || response.data || [];
        const validatedArray = Array.isArray(rawData) ? rawData : [];

        // 🔒 नियम लॉक: केवल वही टिकट्स दिखेंगे जो असली डेटाबेस में मौजूद हैं
        setBookings(validatedArray);
      } catch (err) {
        console.error("Booking history fetch failed:", err);
        // 🌟 कड़ा सुधार: एरर आने या डेटाबेस खाली होने पर कोई नकली केदारनाथ डेटा नहीं दिखेगा, ग्रिड 100% खाली रहेगा!
        setBookings([]);

        if (err.response?.status && err.response.status !== 404) {
          toast.error(
            err.response?.data?.message ||
              'Could not load your booking history.'
          );
        }
      } finally {
        setLoading(false);
      }
    };
    fetchLiveBookingHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-orange-600 font-bold tracking-wider text-sm animate-pulse">
        🔄 Synchronizing your E-Pass Ledger with MongoDB...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-left animate-fade-in">

      {/* हेडर ब्रांडिंग स्ट्रिप */}
      <div className="mb-8 border-b pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">
            <span>📜</span> Your E-Pass Booking History
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">Natively verified digital entry passes associated with your devotee account token.</p>
        </div>
        {bookings.length > 0 && (
          <span className="bg-green-50 border border-green-100 text-green-700 px-3 py-1 rounded-xl text-xs font-mono font-black">
            Total Passes: {bookings.length}
          </span>
        )}
      </div>

      {/* 🚀 कड़ा रेंडर कंडीशनर ताला: अगर कोई टिकट नहीं है तो केवल खाली स्क्रीन का अलर्ट दिखेगा */}
      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 p-8 max-w-xl mx-auto space-y-4 shadow-sm">
          <div className="text-4xl">📭</div>
          <div>
            <h4 className="text-sm font-black text-gray-700 tracking-tight">No Active Entry Passes Found</h4>
            <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
              You haven't booked any darshan slots yet. Your ledger will automatically populate once a verified transaction is cleared.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-block text-xs bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black px-6 py-2.5 rounded-xl uppercase tracking-wider shadow-md hover:from-orange-700 transition cursor-pointer border-none"
          >
            Explore & Book Live Slots
          </button>
        </div>
      ) : (
        /* 🎟️ असली टिकटों की सूची (केवल तभी दिखेगी जब सचमुच बुकिंग हुई हो) */
        <div className="space-y-4">
          {bookings.map((b) => {
            // मोंगोडीबी ऑब्जेक्ट रिलेशन से जुड़े मंदिर का नाम निकालना (या फ़ॉलओवर की सुरक्षा)
            const activeTempleName = b.templeId?.name || b.templeName || "Sacred Shrine Gateway";
            const activeSlotTime = b.slotId?.time || b.slot || "Regular Open Darshan Queue";

            return (
              <div key={b._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-gray-200 transition duration-300 transform hover:-translate-y-0.5 border-solid">
                <div>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                    b.bookingStatus === 'Confirmed' || b.status === 'Confirmed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {b.bookingStatus || b.status || 'Confirmed'}
                  </span>
                  <h3 className="text-lg font-black text-gray-800 tracking-tight mt-2">{activeTempleName}</h3>
                  <p className="text-gray-400 text-xs mt-1 font-medium">
                    📅 Date: <span className="font-mono text-gray-700 font-bold">{b.bookingDate || b.date}</span> | ⏰ Slot: <span className="font-mono text-gray-700 font-bold">{activeSlotTime}</span>
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono mt-1">Transaction Ref: {b._id}</p>
                </div>

                <div className="flex sm:flex-col items-between sm:items-end justify-between border-t sm:border-none pt-3 sm:pt-0 border-solid border-gray-100">
                  <span className="text-base font-black text-gray-800 font-mono">₹ {b.amount || 250}.00</span>
                  <button
                    type="button"
                    onClick={() => navigate(`/ticket/${b._id}`)}
                    className="mt-2 text-xs bg-orange-50 text-orange-600 font-black px-4 py-2.5 rounded-xl hover:bg-orange-600 hover:text-white transition border-none cursor-pointer"
                  >
                    View & Download PDF →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}