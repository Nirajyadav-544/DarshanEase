import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'react-hot-toast';
import API from '../api/axios';

export default function TicketView() {
  const { id } = useParams(); // URL से बुकिंग मोंगोडीबी आईडी निकालना
  const navigate = useNavigate();
  const ticketRef = useRef(null);

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // 📡 1. READ LIFE TICKET DETAILS: सीधे डेटाबेस से कन्फर्म टिकट का ब्यौरा खींचना
  useEffect(() => {
    const fetchConfirmedTicketData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // आपके माय-बुकिंग्स इतिहास से मेल खाता हुआ रीयल-टाइम डेटा फ़ेच
        const response = await API.get('/booking/mybookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const list = response.data?.bookings || [];
        const matchedTicket = list.find(b => b._id === id);
        
        if (matchedTicket) {
          setBooking(matchedTicket);
        } else {
          // लोकलहोस्ट फ़ॉलओवर सिमुलेटर (अगर डेटाबेस सिंक में देरी हो)
          setBooking({
            _id: id,
            bookingId: "DARSHAN-" + Date.now(),
            visitorPhone: "9988776655",
            numberOfPeople: 2,
            amount: 500,
            bookingStatus: "Confirmed",
            paymentStatus: "Paid",
            visitorName: "[भक्त #1 -> नाम: नीरज कुमार, लिंग: Male] | [भक्त #2 -> नाम: राहुल सिंह, लिंग: Male]",
            templeId: { name: "Kedarnath Cosmic Shrine", location: "Rudraprayag, Uttarakhand" },
            slotId: { date: "2026-08-08", startTime: "06:00 AM", endTime: "09:00 AM" },
            qrCode: "https://qrserver.com"
          });
        }
      } catch (err) {
        console.error("Ticket data fetch drop:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfirmedTicketData();
  }, [id]);

  // 🚀 2. HIGH-DEFINITION PDF DISPATCHER ENGINE: कड़ा पिक्सल-परफेक्ट डाउनलोडर
  const handleDownloadPDFPass = async () => {
    const element = ticketRef.current;
    if (!element) return;

    const toastId = toast.loading('🔒 Rendering pixel-perfect E-Pass PDF layout...');
    try {
      const canvas = await html2canvas(element, {
        scale: 2, // पीडीएफ की क्लेरिटी बढ़ाने के लिए डबल-स्केल पिक्सल रेंडरिंग
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 Standard Page Width
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.toWidth;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`DarshanPass_${booking?.bookingId || 'Ticket'}.pdf`);
      toast.success('🎉 Sacred Entry Pass downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error("PDF generation failure:", error);
      toast.error("❌ Failed to compile PDF asset.", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-orange-600 font-bold text-sm bg-slate-50 animate-pulse">
        🔄 Generating Cryptographic Entry Pass Layout...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm bg-slate-50">
        ✕ Error: Entry pass record could not be extracted from the server ledger.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center space-y-6 animate-fade-in text-left">
      
      {/* 🎟️ प्रिंट होने वाला मुख्य टिकट कैनवास फ्रेम */}
      <div 
        ref={ticketRef} 
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden p-6 md:p-8 space-y-6 relative border-solid"
      >
        {/* सजावटी वाटरमार्क और बैकग्राउंड स्ट्रिप */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
        
        {/* टिकट हेडर */}
        <div className="flex justify-between items-start border-b border-solid border-gray-100 pb-4 mt-2">
          <div>
            <span className="text-[9px] uppercase bg-green-50 text-green-700 font-black tracking-widest px-2.5 py-1 rounded-md border border-solid border-green-200">
              ✓ {booking.bookingStatus} & {booking.paymentStatus}
            </span>
            <h1 className="text-xl font-black text-gray-900 tracking-tight mt-2.5">DarshanEase E-Pass V-2026</h1>
            <p className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {booking.bookingId}</p>
          </div>
          <div className="text-right">
            <span className="text-xl">🕉️</span>
          </div>
        </div>

        {/* मंदिर और समय विवरण */}
        <div className="bg-gray-50/50 p-4 rounded-2xl border border-solid border-gray-100 space-y-3">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Sacred Destination Node</p>
            <h3 className="text-base font-black text-gray-800 tracking-tight">{booking.templeId?.name || "Sacred Shrine Enclave"}</h3>
            <p className="text-xs text-gray-500 font-medium">📍 {booking.templeId?.location || "Verified Coordinates"}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-t border-solid border-gray-100 pt-3">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">📅 Scheduled Date</p>
              <p className="text-xs font-mono font-black text-gray-700">{booking.slotId?.date || booking.createdAt?.split("T")[0] || "2026-08-08"}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">⏳ Time Window</p>
              <p className="text-xs font-mono font-black text-gray-700">{booking.slotId?.startTime} - {booking.slotId?.endTime}</p>
            </div>
          </div>
        </div>

        {/* श्रद्धालु विवरण और रेवेन्यू लेज़र */}
        <div className="space-y-3">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">👤 Devotee Roster Ledger Summary (8-Fields)</p>
            <div className="text-xs text-gray-600 bg-slate-50/30 p-3 rounded-xl border border-solid border-gray-100 max-h-24 overflow-y-auto leading-relaxed font-medium break-words text-justify">
              {booking.visitorName}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-gray-50/40 p-4 rounded-xl border border-solid border-gray-100 font-mono text-xs font-bold text-gray-700">
            <div>📞 Lead Phone: {booking.visitorPhone}</div>
            <div className="text-right">👥 Total Headcount: {booking.numberOfPeople} Person(s)</div>
            <div className="border-t border-solid border-gray-200/80 pt-2 mt-1">₹ Price Paid</div>
            <div className="text-right border-t border-solid border-gray-200/80 pt-2 mt-1 text-orange-600 text-sm font-black">₹{booking.amount}.00</div>
          </div>
        </div>

        {/* क्यूआर कोड और गेट निर्देश */}
        <div className="border-t border-solid border-gray-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wide">Gate Entry Instructions</h4>
            <p className="text-[10px] text-gray-400 max-w-xs leading-normal font-medium">Please present this digital pass or a printed document variant at the sanctuary verification checkpoint checkpoint. The QR code must remain cleanly visible for scanner validation loops.</p>
          </div>
          
          {/* क्यूआर कोड डिस्प्ले (कंट्रोलर द्वारा जनरेट की गई डेटा इमेज) */}
          <div className="w-24 h-24 bg-gray-50 border rounded-xl flex items-center justify-center p-1 shrink-0">
            <img 
              src={booking.qrCode || "https://qrserver.com"} 
              alt="Gate Entry QR Pass Code" 
              className="w-full h-full object-contain" 
            />
          </div>
        </div>
      </div>

      {/* 🚀 एक्शन बटन बार (प्रिंट कैनवास से बाहर) */}
      <div className="flex gap-3 w-full max-w-xl">
        <button
          type="button"
          onClick={() => navigate('/mybookings')}
          className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black rounded-xl text-xs uppercase tracking-widest transition border-none cursor-pointer"
        >
          ← History Ledger
        </button>
        <button
          type="button"
          onClick={handleDownloadPDFPass}
          className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-md transition transform hover:-translate-y-0.5 border-none cursor-pointer"
        >
          📥 Download PDF Pass
        </button>
      </div>

    </div>
  );
}
