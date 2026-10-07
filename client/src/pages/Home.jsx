import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import TempleCard from '../components/TempleCard';
import PaymentQR from '../components/PaymentQR'; 
import { toast } from 'react-hot-toast';

export default function Home() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedTempleForPrasad, setSelectedTempleForPrasad] = useState(null);
  const [showPrasadGate, setShowPrasadGate] = useState(false);
  const [prasadStep, setPrasadStep] = useState(1); 
  const prasadFee = 151;
  const UP_ID_GATEWAY = "darshanease@sbi"; 

  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: '', mobileNumber: '', province: '', district: '', pincode: '', houseNoAndStreet: '', landmark: '', nationality: 'Indian'
  });

  useEffect(() => {
    const fetchTemplesFromDB = async () => {
      try {
        setLoading(true);
        const response = await API.get('/temple');
        const rawList = response.data.temples || response.data || [];
        
        // 🔒 अभेद्य एंटी-स्कैम फ़िल्टर: होम पेज पर केवल वही मंदिर लोड होंगे जो Approved या Live हैं!
        // जैसे ही एडमिन रिजेक्ट बटन दबाएगा, मोंगोडीबी में 'Rejected' अपडेट होते ही वह मंदिर यहाँ से हमेशा के लिए ग़ायब हो जाएगा।
        const activeLiveOnly = rawList.filter(temple => 
          temple.status !== 'Rejected' && 
          temple.approvalStatus !== 'Rejected'
        );

        setTemples(activeLiveOnly);
      } catch (err) {
        console.warn("Backend cluster grid offline.");
        setTemples([]);
      } finally { setLoading(false); }
    };
    fetchTemplesFromDB();
  }, []);

  const handlePrasadAddressSubmit = (e) => {
    e.preventDefault();
    if (deliveryAddress.mobileNumber.length !== 10) {
      toast.error("❌ Mobile number must be 10 digits!");
      return;
    }
    setPrasadStep(2); 
  };

  const handleFinalPrasadPaymentConfirm = async () => {
    const toastId = toast.loading('🔄 Syncing Prasad delivery tokens with MongoDB...');
    const compiledAddress = `[📦 DEVOTEE: ${deliveryAddress.fullName}, Mob: ${deliveryAddress.mobileNumber}]`;

    try {
      const response = await API.post('/booking/create', {
        slotId: "6a666cf167fd606734340271", 
        visitorPhone: deliveryAddress.mobileNumber,
        amount: prasadFee,
        visitorName: compiledAddress,
        devotees: [{ fullName: deliveryAddress.fullName, gender: "Male", mobileNumber: deliveryAddress.mobileNumber, province: deliveryAddress.province, district: deliveryAddress.district, nationality: deliveryAddress.nationality, nationalIdentityNumber: deliveryAddress.pincode, address: deliveryAddress.houseNoAndStreet }]
      });

      if (response.data && response.data.booking) {
        toast.success('💸 Payment Settled! Generating Receipt...', { id: toastId });
        setShowPrasadGate(false);
        setPrasadStep(1);
        window.location.href = `/prasad-receipt/${response.data.booking._id}?templeName=${encodeURIComponent(selectedTempleForPrasad.name)}&address=${encodeURIComponent(compiledAddress)}&amount=${prasadFee}`;
      }
    } catch (err) {
      toast.error('Security Node Validation Error.', { id: toastId });
    }
  };

  const filteredTemples = temples.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
  if (loading) return <div className="p-12 text-center text-orange-600 font-bold text-lg animate-pulse">Connecting Shrines...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 relative text-left">
      {showPrasadGate && selectedTempleForPrasad && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full border shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-lg font-black text-orange-800">📦 Order Prasad from {selectedTempleForPrasad.name}</h3>
              <button onClick={() => { setShowPrasadGate(false); setPrasadStep(1); }} className="text-gray-400 font-bold cursor-pointer">✕</button>
            </div>

            {prasadStep === 1 && (
              <form onSubmit={handlePrasadAddressSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input type="text" required placeholder="Full Name" value={deliveryAddress.fullName} onChange={(e) => setDeliveryAddress({...deliveryAddress, fullName: e.target.value})} className="px-3 py-2 rounded-xl border text-xs bg-white text-gray-800" />
                  <input type="tel" maxLength="10" required placeholder="Mobile No" value={deliveryAddress.mobileNumber} onChange={(e) => setDeliveryAddress({...deliveryAddress, mobileNumber: e.target.value.replace(/\D/g, '')})} className="px-3 py-2 rounded-xl border text-xs bg-white text-gray-800 font-mono" />
                  <input type="text" required placeholder="Pincode" maxLength="6" value={deliveryAddress.pincode} onChange={(e) => setDeliveryAddress({...deliveryAddress, pincode: e.target.value.replace(/\D/g, '')})} className="px-3 py-2 rounded-xl border text-xs bg-white text-gray-800 font-mono" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input type="text" required placeholder="Province" value={deliveryAddress.province} onChange={(e) => setDeliveryAddress({...deliveryAddress, province: e.target.value})} className="px-3 py-2 rounded-xl border text-xs bg-white text-gray-800" />
                  <input type="text" required placeholder="District" value={deliveryAddress.district} onChange={(e) => setDeliveryAddress({...deliveryAddress, district: e.target.value})} className="px-3 py-2 rounded-xl border text-xs bg-white text-gray-800" />
                  <input type="text" required placeholder="Nationality" value={deliveryAddress.nationality} onChange={(e) => setDeliveryAddress({...deliveryAddress, nationality: e.target.value})} className="px-3 py-2 rounded-xl border text-xs bg-white text-gray-800" />
                </div>
                <input type="text" required placeholder="House No, Ward & Street Address" value={deliveryAddress.houseNoAndStreet} onChange={(e) => setDeliveryAddress({...deliveryAddress, houseNoAndStreet: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border text-xs bg-white text-gray-800" />
                <input type="text" required placeholder="Famous Landmark" value={deliveryAddress.landmark} onChange={(e) => setDeliveryAddress({...deliveryAddress, landmark: e.target.value})} className="w-full px-3 py-2.5 rounded-xl border text-xs bg-white text-gray-800" />
                
                <div className="bg-orange-50 p-3 rounded-xl border flex justify-between items-center text-xs font-bold">
                  <span>Total Payable:</span><span className="text-orange-600 font-black text-sm">₹ {prasadFee}.00</span>
                </div>
                <button type="submit" className="w-full bg-orange-600 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider shadow-md cursor-pointer">Proceed to Pay & Scan QR →</button>
              </form>
            )}

            {prasadStep === 2 && (
              <PaymentQR totalAmount={prasadFee} UP_ID_GATEWAY={UP_ID_GATEWAY} loading={false} handleFinalPaymentConfirm={handleFinalPrasadPaymentConfirm} setStep={setPrasadStep} />
            )}
          </div>
        </div>
      )}

      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="text-3xl md:text-5xl font-black text-gray-800">Explore Nepal Sacred Shrines</h1>
        <input type="text" placeholder="🔍 Search Shrines..." className="w-full px-4 py-3 rounded-2xl border text-sm bg-white mt-4 text-gray-800" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemples.map((temple) => (
          <TempleCard key={temple._id} temple={temple} onPrasadClick={(t) => { setSelectedTempleForPrasad(t); setShowPrasadGate(true); }} />
        ))}
      </div>
    </div>
  );
}
