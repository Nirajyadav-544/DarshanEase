import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { toast } from 'react-hot-toast';

export default function CreateSlot() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 🌟 MAPPED STATE: होम पेज वाले असली लाइव मंदिरों के साथ कड़ाई से बाइंडेड स्टेट
  const [slotData, setSlotData] = useState({
    templeId: '', date: '', timeRange: '06:00 AM - 09:00 AM', slotType: 'Morning Darshan', maxCapacity: 100
  });

  // 📡 1. LOAD PUBLIC LIVE TEMPLES: सीधे उसी मुख्य एपीआई से डेटा खींचना जो होम पेज पर दिखती है
  useEffect(() => {
    const fetchAllLiveTemplesFromHome = async () => {
      try {
        const response = await API.get('/temple'); // 🚀 वही एंडपॉइंट जो होम पेज पर सारे मंदिर दिखाता है
        const rawList = response.data?.temples || response.data || [];
        const validatedArray = Array.isArray(rawList) ? rawList : [];

        setTemples(validatedArray);

        // लिस्ट मिलते ही सबसे पहले वाले लाइव मंदिर को ऑटो-सिलेक्ट लॉक कर देना
        if (validatedArray.length > 0) {
          setSlotData(prev => ({ ...prev, templeId: validatedArray[0]._id }));
        } else {
          console.warn('CreateSlot: /temple returned an empty list — no live temples to select.');
        }
      } catch (err) {
        console.error('CreateSlot: failed to load temple list from /temple:', err);
        toast.error(
          err.response?.data?.message ||
            'Could not load the live temple list. Please refresh and try again.'
        );
        setTemples([]);
      }
    };
    fetchAllLiveTemplesFromHome();
  }, []);

  // 🚀 2. SUBMIT TRANSACTION: सिलेक्टेड लाइव मंदिर के अनुसार डेटाबेस (MongoDB) में स्लॉट जोड़ना
  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!slotData.templeId) {
      toast.error("❌ Action Blocked: Please select a live home page temple first!");
      return;
    }

    if (!slotData.date) {
      toast.error("❌ Action Blocked: Please select a calendar date first!");
      return;
    }

    setLoading(true);
    const toastId = toast.loading('🔄 Linking new calendar slots with your live temple database...');

    try {
      const token = localStorage.getItem('token');

      // बैकएंड एंडपॉइंट पर डेटा ट्रांसफर पैकेट फायर करना
      const response = await API.post('/organizer/create-slot', {
        templeId: slotData.templeId,
        timeSlot: slotData.timeRange,
        slotType: slotData.slotType,
        totalCapacity: Number(slotData.maxCapacity),
        date: slotData.date
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data?.success === false) {
        throw new Error(response.data?.message || 'Server rejected the slot creation request.');
      }

      toast.success('🎉 New live booking slots added to calendar ledger successfully!', { id: toastId });
      setMessage('🎉 New live booking slots added to calendar ledger successfully!');
      setSlotData(prev => ({ ...prev, date: '', maxCapacity: 100 })); // इनपुट क्लीन
    } catch (err) {
      // असली एरर अब यूज़र और कंसोल दोनों को दिखेगा — पहले यहाँ चुपचाप
      // एक फ़र्ज़ी "success" दिखा दिया जाता था, जिसकी वजह से organizer को
      // लगता था slot बन गया जबकि database में कुछ save ही नहीं हुआ था।
      console.error('CreateSlot: /organizer/create-slot failed:', err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Slot creation failed. Please check your connection and try again.';

      toast.error(`❌ ${errorMessage}`, { id: toastId });
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl text-left mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Generate Live Darshan Slots</h2>
        <p className="text-gray-500 text-sm">Provision available slots for devotees based on calendar queues.</p>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm mb-6 font-medium border-solid">
          {message}
        </div>
      )}

      <form onSubmit={handleCreate} className="space-y-5 bg-white">

        {/* 🌟 100% फिक्स ड्रापडाउन: होम पेज वाले सारे लाइव मंदिर यहाँ साफ़-साफ़ सिलेक्ट करने के लिए दिखेंगे */}
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Target Live Temple (From Home Grid)</label>
          <select
            value={slotData.templeId}
            onChange={(e) => setSlotData({ ...slotData, templeId: e.target.value })}
            disabled={temples.length === 0}
            className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-orange-500 bg-white text-gray-800 cursor-pointer font-bold border-solid disabled:bg-gray-100"
          >
            {temples.length === 0 ? (
              <option value="">No live temples available</option>
            ) : (
              temples.map(t => (
                <option key={t._id} value={t._id}>{t.name} (📍 {t.location || t.state})</option>
              ))
            )}
          </select>
          <p className="text-[10px] text-gray-400 mt-1">※ Selecting a shrine from this grid ties the dynamic slot ledger parameters onto its production token directly.</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Target Calendar Date</label>
          <input type="date" required value={slotData.date} onChange={(e) => setSlotData({...slotData, date: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-orange-500 bg-white cursor-pointer text-gray-800 border-solid" />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Time Slot Range</label>
          <select value={slotData.timeRange} onChange={(e) => setSlotData({...slotData, timeRange: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-orange-500 bg-white cursor-pointer text-gray-800 border-solid">
            <option value="06:00 AM - 09:00 AM">06:00 AM - 09:00 AM (Morning Batch)</option>
            <option value="10:00 AM - 01:00 PM">10:00 AM - 01:00 PM (VIP Midday Batch)</option>
            <option value="04:00 PM - 07:00 PM">04:00 PM - 07:00 PM (Evening Aarti Batch)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Pass Classification</label>
          <select value={slotData.slotType} onChange={(e) => setSlotData({...slotData, slotType: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-orange-500 bg-white cursor-pointer text-gray-800 border-solid">
            <option value="Morning Darshan">General Morning Darshan</option>
            <option value="VIP Darshan">VIP Fast-Track Pass</option>
            <option value="Evening Aarti Pass">Maha Aarti General Pass</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Maximum Allowed Devotees (Capacity)</label>
          <input type="number" required min="10" value={slotData.maxCapacity} onChange={(e) => setSlotData({...slotData, maxCapacity: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-orange-500 bg-white text-gray-800 border-solid" placeholder="e.g. 150" />
        </div>

        <button type="submit" disabled={loading || !slotData.templeId} className="w-full bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black py-3 rounded-xl shadow-md hover:from-orange-700 transition transform hover:-translate-y-0.5 cursor-pointer text-sm uppercase tracking-wider disabled:opacity-50">
          {loading ? 'Deploying Entry Node...' : 'Deploy Live Slots →'}
        </button>
      </form>
    </div>
  );
}
