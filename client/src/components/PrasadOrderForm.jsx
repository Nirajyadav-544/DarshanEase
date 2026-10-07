import React, { useState } from 'react';
import API from '../api/axios';
import { toast } from 'react-hot-toast';

export default function PrasadOrderForm({ templeName, templeId }) {
  const [ordered, setOrdered] = useState(false);
  const [loading, setLoading] = useState(false);
  const prasadFee = 151; // प्रसाद सप्रसाद वितरण शुल्क (₹151)

  // 🌟 पूरे कड़े डिलीवरी ट्रैकिंग क्रेडेंशियल्स
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: '',
    mobileNumber: '',
    province: '',
    district: '',
    pincode: '',
    houseNoAndStreet: '',
    landmark: '',
    nationality: 'Indian'
  });

  const handleInputChange = (field, value) => {
    setDeliveryAddress({ ...deliveryAddress, [field]: value });
  };

  const handlePrasadSubmit = async (e) => {
    e.preventDefault();
    if (deliveryAddress.mobileNumber.length !== 10) {
      toast.error("❌ Delivery contact number must be 10 digits!");
      return;
    }

    setLoading(true);
    const toastId = toast.loading('🔄 Syncing delivery coordinates with MongoDB tracking ledger...');

    try {
      // बैकएंड पर प्रसाद का आर्डर पोस्ट करना
      await API.post('/booking/create', {
        slotId: "6a666cf167fd606734340272", // VIP डिफ़ॉल्ट नोड
        visitorPhone: deliveryAddress.mobileNumber,
        amount: prasadFee,
        visitorName: `[📦 PRASAD ORDER for ${templeName} | Devotee: ${deliveryAddress.fullName}, Province: ${deliveryAddress.province}, District: ${deliveryAddress.district}, Pincode: ${deliveryAddress.pincode}, Address: ${deliveryAddress.houseNoAndStreet}, Landmark: ${deliveryAddress.landmark}]`
      });

      toast.success('🙏 Prasad Order Locked! Sent directly to your physical address.', { id: toastId });
      setOrdered(true);
    } catch (err) {
      toast.error('Database validation rejected prasad delivery mapping.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (ordered) {
    return (
      <div className="bg-green-50 p-6 rounded-3xl border border-green-200 text-center animate-fade-in">
        <span className="text-3xl">📦</span>
        <h4 className="text-lg font-black text-green-800 mt-2">Prasad Order Dispatched!</h4>
        <p className="text-xs text-green-600 mt-1">Divine Prasad from {templeName} is being routed to: {deliveryAddress.houseNoAndStreet}, {deliveryAddress.district}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-6 rounded-3xl border border-orange-100 shadow-sm space-y-4 animate-fade-in">
      <div className="border-b pb-2">
        <h3 className="text-lg font-black text-orange-800 flex items-center gap-2">
          <span>📦</span> Request Divine Prasad Delivery 
        </h3>
        <p className="text-gray-400 text-[11px] mt-0.5">Mandatory 8-field tracking setup for accurate location shipment</p>
      </div>

      <form onSubmit={handlePrasadSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input type="text" required placeholder="Receiver Full Name" value={deliveryAddress.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} className="px-3 py-2 rounded-xl border text-xs bg-white text-gray-800" />
          <input type="tel" maxLength="10" required placeholder="10-Digit Mobile" value={deliveryAddress.mobileNumber} onChange={(e) => handleInputChange('mobileNumber', e.target.value.replace(/\D/g, ''))} className="px-3 py-2 rounded-xl border text-xs bg-white text-gray-800 font-mono" />
          <input type="text" required placeholder="Pincode / Area Code" maxLength="6" value={deliveryAddress.pincode} onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, ''))} className="px-3 py-2 rounded-xl border text-xs bg-white text-gray-800 font-mono" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input type="text" required placeholder="Province / State" value={deliveryAddress.province} onChange={(e) => handleInputChange('province', e.target.value)} className="px-3 py-2 rounded-xl border text-xs bg-white text-gray-800" />
          <input type="text" required placeholder="District Name" value={deliveryAddress.district} onChange={(e) => handleInputChange('district', e.target.value)} className="px-3 py-2 rounded-xl border text-xs bg-white text-gray-800" />
          <input type="text" required placeholder="Nationality" value={deliveryAddress.nationality} onChange={(e) => handleInputChange('nationality', e.target.value)} className="px-3 py-2 rounded-xl border text-xs bg-white text-gray-800" />
        </div>

        <input type="text" required placeholder="Complete House No, Building, Street Address" value={deliveryAddress.houseNoAndStreet} onChange={(e) => handleInputChange('houseNoAndStreet', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-xs bg-white text-gray-800" />
        <input type="text" required placeholder="Famous Landmark Nearby" value={deliveryAddress.landmark} onChange={(e) => handleInputChange('landmark', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-xs bg-white text-gray-800" />

        <div className="bg-white p-3 rounded-xl border flex justify-between items-center text-xs font-bold text-gray-700 shadow-sm">
          <span>Prasad + SpeedPost Charges:</span>
          <span className="text-orange-600 font-black text-sm">₹ {prasadFee}.00 Only</span>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider shadow-md hover:from-orange-700 transition cursor-pointer">
          {loading ? 'Securing Dispatch Order...' : '🔒 Secure Order Prasad'}
        </button>
      </form>
    </div>
  );
}
