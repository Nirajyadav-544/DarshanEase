import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-hot-toast';

export default function Ticket() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRealTicketFromDB = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 🔒 सुरक्षा गेट: सीधे आपके मोंगोडीबी बैकएंड के /mybookings से लाइव डेटा खींचना
        const response = await API.get('/booking/mybookings');
        const allBookings = response.data.bookings || response.data;
        
        // एरे में से वर्तमान बुकिंग आईडी वाले टिकट को खोजना
        const activeTicket = Array.isArray(allBookings) ? allBookings.find(b => b._id === bookingId) : null;
        
        // 🔒 कड़ा सुरक्षा नियम: जब तक स्टेटस 'Confirmed' या 'Paid' नहीं होगा, टिकट लॉक रहेगा
        if (activeTicket && (activeTicket.bookingStatus === 'Confirmed' || activeTicket.bookingStatus === 'Paid')) {
          setTicketData(activeTicket);
        } else {
          setError("❌ Access Denied: This transaction is either unpaid, manipulated, or does not exist in the database bank ledger.");
        }
      } catch (err) {
        console.error("Security Breach Blocked: Unverified database token.");
        setError("🔒 Security Intercept: Unverified transaction token at database node.");
      } finally {
        setLoading(false);
      }
    };
    fetchRealTicketFromDB();
  }, [bookingId]);

  // प्रिंट/डाउनलोड इंजन (सिर्फ वेरिफाइड टिकट के लिए)
  const handleDownloadPDF = () => {
    toast.success('Dispatched printable PDF layout. Rendering document for free...');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  if (loading) return <div className="p-12 text-center text-orange-600 font-bold text-lg animate-pulse">Verifying Bank Node Settlement Matrix...</div>;

  // 🔒 अगर डेटाबेस में पेमेंट वेरिफाई नहीं हुई, तो सीधे ब्लॉक स्क्रीन आएगी, कोई टिकट नहीं दिखेगा
  if (error || !ticketData) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white border-2 border-red-200 rounded-3xl shadow-2xl text-center animate-fade-in">
        <div className="text-6xl text-red-500 mb-4 animate-bounce">🔒</div>
        <h3 className="text-2xl font-black text-gray-800">Security Vault Locked</h3>
        <p className="text-gray-500 text-sm mt-3 leading-relaxed font-medium bg-red-50 p-4 rounded-xl text-red-700 border border-red-100">{error}</p>
        <button onClick={() => navigate('/')} className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition">
          Return to Safe Zone
        </button>
      </div>
    );
  }

  // 🌟 आपके असली डेटाबेस से जनरेट हुआ लाइव पास वेरिफिकेशन क्यूआर कोड
  const qrUrl = `https://qrserver.com{ticketData.bookingId}`;

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div 
        id="printable-pass" 
        className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-fade-in print:shadow-none print:border-none"
      >
        {/* 🌟 मोंगोडीबी सिलेक्शन के आधार पर असली मंदिर का लाइव पोस्टर/लोगो बैनर */}
        <div className="h-48 w-full relative bg-gray-900">
          <img 
            src={ticketData.templeId?.image || 'https://unsplash.com'} 
            alt="Official Temple Shrine" 
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute bottom-4 left-6 right-6 text-white text-left">
            <span className="text-[10px] font-black uppercase bg-orange-600 text-white px-2.5 py-0.5 rounded-md tracking-wider">
              Official Entry Pass
            </span>
            {/* 🌟 लाइव मंदिर का नाम और लोकेशन */}
            <h1 className="text-2xl font-black tracking-tight mt-1 drop-shadow-md">
              {ticketData.templeId?.name || "Divine Sacred Temple Shrine"}
            </h1>
            <p className="text-xs text-gray-200 mt-0.5">📍 {ticketData.templeId?.location || "Verified Holy Domain"}</p>
          </div>
        </div>

        {/* Pass Core Receipts Details */}
        <div className="p-6 md:p-8 space-y-6 bg-white">
          <div className="text-center">
            <span className="inline-block bg-green-100 text-green-700 text-xs font-extrabold px-5 py-1.5 rounded-full border border-green-200 uppercase tracking-wider shadow-sm">
              🟢 BANK SETTLEMENT VERIFIED & CONFIRMED
            </span>
          </div>

          {/* Roster & Metadata Data Grid */}
          <div className="grid grid-cols-2 gap-y-5 gap-x-2 border-t border-b border-dashed py-5 text-sm text-gray-700">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pass Reference ID</p>
              <p className="font-mono font-black text-gray-900 mt-0.5">{ticketData.bookingId}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Scheduled Darshan Date</p>
              <p className="font-bold text-gray-900 mt-0.5">{ticketData.slotId?.date || new Date().toLocaleDateString('en-IN')}</p>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Verified 8-Field Devotee Identity Roster</p>
              <div className="font-semibold text-gray-600 text-xs mt-1.5 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 max-h-32 overflow-y-auto font-mono">
                {ticketData.visitorName}
              </div>
            </div>
            <div className="col-span-2 border-t pt-3 border-gray-100">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Allocated Gate Entry Time Window</p>
              <p className="font-black text-orange-600 text-base mt-0.5">
                {ticketData.slotId ? `${ticketData.slotId.startTime} - ${ticketData.slotId.endTime}` : "10:00 AM - 01:00 PM (VIP Fast-Track Pass)"}
              </p>
            </div>
          </div>

          {/* 🌟 100% लाइव साफ़ क्यूआर कोड इमेज नोड */}
          <div className="flex flex-col items-center justify-center p-5 bg-gray-50 rounded-2xl border border-gray-100/80">
            <img 
              src={qrUrl} 
              alt="Live Pass Gate Verification QR" 
              className="w-40 h-40 border p-2.5 bg-white rounded-xl shadow-md border-gray-200" 
            />
            <p className="text-[10px] text-gray-400 font-black mt-3 uppercase tracking-widest text-center">
              SCAN AT ENTRY COUNTER FOR QUICK ENTRY VERIFICATION
            </p>
          </div>

          {/* Pricing Ledger audit row */}
          <div className="flex justify-between items-center bg-orange-50/40 p-4 rounded-xl border border-orange-100 text-sm">
            <span className="font-bold text-gray-500">Total Settlement Amount (INR):</span>
            <span className="font-black text-gray-900 text-xl">₹ {ticketData.amount}.00</span>
          </div>

          {/* Action Trigger Link Button */}
          <div className="pt-2 print:hidden">
            <button 
              onClick={handleDownloadPDF}
              className="w-full bg-gradient-to-r from-orange-600 to-amber-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition duration-300 text-sm hover:from-orange-700 hover:to-amber-600 transform hover:-translate-y-0.5 cursor-pointer text-center uppercase tracking-wider"
            >
              📥 Download Confirmation Ticket PDF
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
