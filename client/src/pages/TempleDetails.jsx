import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-hot-toast'; 
import TempleHeader from '../components/TempleHeader';       
import TempleLocationMap from '../components/TempleLocationMap'; 

export default function TempleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 🔒 स्लॉट लॉक स्टेट: शुरुआत में यह null (खाली) रहेगा
  const [selectedSlot, setSelectedSlot] = useState(null); 

  const dummySlots = [
    { id: '6a666cf167fd606734340271', time: '06:00 AM - 09:00 AM', type: 'Morning Darshan', available: 45 },
    { id: '6a666cf167fd606734340272', time: '10:00 AM - 01:00 PM', type: 'VIP Darshan', available: 12 },
    { id: '6a666cf167fd606734340273', time: '04:00 PM - 07:00 PM', type: 'Evening Aarti Pass', available: 28 }
  ];

  useEffect(() => {
    const fetchTempleDetails = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/temple/${id}`);
        setTemple(response.data.temple || response.data);
      } catch (err) {
        console.warn("Backend node offline. Engaging failover Nepal chronicles dataset.");
        setTemple({ 
          _id: id, 
          name: "Pashupatinath Temple", 
          state: "Bagmati Province, Nepal", 
          location: "Kathmandu, Nepal", 
          rating: '4.9', 
          openingTime: "04:00 AM", 
          closingTime: "09:00 PM", 
          image: "https://unsplash.com", 
          description: "Sacred Shiva shrine on holy Bagmati river.", 
          history: "Dating back to 400 AD, Pashupatinath is the ultimate cosmic center of Lord Shiva." 
        });
      } finally { setLoading(false); }
    };
    fetchTempleDetails();
  }, [id]);

  // 🔒 कड़ा सुरक्षा नियम: बिना स्लॉट सेलेक्ट किए प्रोसेस आगे नहीं जा सकता
  const handleProceedToBooking = () => {
    if (!selectedSlot) {
      toast.error('❌ Access Denied: Please select an official Darshan Time Slot first to unlock registration!');
      return;
    }
    // केवल स्लॉट आईडी मिलने पर ही बुकिंग फॉर्म खुलेगा
    navigate(`/booking?templeId=${id}&slotId=${selectedSlot}`);
  };

  if (loading) return <div className="p-12 text-center text-orange-600 font-bold text-lg animate-pulse">Connecting Node...</div>;
  if (!temple) return <div className="p-12 text-center text-red-600 font-bold">Temple Not Found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <TempleHeader temple={temple} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="h-[430px] w-full rounded-3xl overflow-hidden shadow-xl border bg-gray-100">
            <img src={temple.image} alt={temple.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = "https://unsplash.com"; }} />
          </div>
          
          <TempleLocationMap name={temple.name} location={temple.location} />

          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-3">
            <h3 className="text-xl font-bold text-gray-800">🕉️ About The Shrine</h3>
            <p className="text-gray-600 text-sm">{temple.description}</p>
          </div>
        </div>

        {/* Right Side Column: Dynamic Slot Selection Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border shadow-xl sticky top-24 space-y-6">
            <div className="border-b pb-3">
              <h3 className="text-lg font-extrabold text-gray-800">Select Darshan Slot</h3>
              <p className="text-xs text-red-500 font-black mt-1">⚠️ Selection is Mandatory to Unlock Form</p>
            </div>
            
            {/* Slot Matrix Selection Loop */}
            <div className="space-y-3">
              {dummySlots.map((slot) => (
                <div 
                  key={slot.id} 
                  onClick={() => {
                    setSelectedSlot(slot.id);
                    toast.success(`Active Slot Confirmed: ${slot.time}`);
                  }} 
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${selectedSlot === slot.id ? 'border-orange-500 bg-orange-50/70 shadow-md font-bold transform scale-[1.01]' : 'border-gray-100 bg-gray-50/30 hover:border-gray-200'}`}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-800 font-black">{slot.time}</p>
                    <span className="text-[10px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded-md">
                      {slot.available} Left
                    </span>
                  </div>
                  <p className="text-xs text-orange-600 font-bold mt-1 uppercase tracking-wider">{slot.type}</p>
                </div>
              ))}
            </div>

            {/* 🔒 कड़ा एक्शन बटन गार्ड: बिना सिलेक्शन के बटन का रंग धुंधला (Disabled) रहेगा और कर्सर काम नहीं करेगा */}
            <button 
              onClick={handleProceedToBooking}
              disabled={!selectedSlot}
              className={`w-full font-black py-4 rounded-xl text-xs uppercase tracking-widest transition duration-300 text-center ${selectedSlot ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg cursor-pointer transform hover:-translate-y-0.5' : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'}`}
            >
              {selectedSlot ? 'Proceed to Booking Pass →' : '🔒 Choose Time Slot First'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
