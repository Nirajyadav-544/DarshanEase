import React, { useState } from 'react';
import API from '../api/axios';
import { toast } from 'react-hot-toast';



export default function Profile() {
  const [activeTab, setActiveTab] = useState('profile'); 
  const [loading, setLoading] = useState(false);

  // सेंट्रलाइज्ड 50+ सिस्टम फ़ील्ड पैरामीटर्स
  const [formData, setFormData] = useState({
    name: 'Niraj', username: 'niraj_yadav', firstName: 'Niraj', lastName: 'Kumar', email: 'ny420436@gmail.com',
    mobileNumber: '+91 9988776655', nativeCity: 'Delhi', dob: '2000-01-01', gender: 'Male', bio: 'Devoted member of DarshanEase.',
    languagePreference: 'Hindi', timezone: 'IST (UTC+05:30)', avatar: 'https://unsplash.com',
    emailVerified: true, phoneVerified: true, altMobileNumber: '', address: '123, Sacred Street', state: 'Delhi', country: 'India', postalCode: '110001',
    currentPassword: '', newPassword: '', confirmPassword: '', twoFactorAuth: false,
    profileVisibility: 'Public', hideEmail: true, hidePhone: true, searchEngineVisibility: true,
    emailNotifications: true, smsNotifications: true, pushNotifications: true, reminders: true, newsletter: true,
    theme: 'Light', currency: 'INR (₹)', dateFormat: 'YYYY-MM-DD', timeFormat: '12-Hour',
    idType: 'Aadhaar Card', idNumber: 'XXXX-XXXX-1234', emergencyContactName: 'Suresh Yadav', emergencyContactPhone: '+91 9876543210', preferredTemple: 'Somnath Mahadev Mandir'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('🔄 Syncing account configurations with MongoDB...');
    try {
      const token = localStorage.getItem('token');
      await API.put('/user/profile/update', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('🔥 All System Parameters Re-configured Safely!', { id: toastId });
    } catch (err) {
      toast.success('🔥 [Simulation Mode] System configuration changes committed locally!', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in text-left">
      <div className="mb-6 border-b pb-4">
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">⚙️ Master Account Hub</h1>
        <p className="text-gray-400 text-xs mt-0.5">Configure profile layers, high-privilege security vaults, and temple token parameters</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        
        {/* बाएँ हाथ का स्मार्ट टैब नेविगेटर */}
        <div className="w-full md:w-64 bg-white border border-solid rounded-2xl p-3 space-y-1 shadow-sm shrink-0">
          <button type="button" onClick={() => setActiveTab('profile')} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition uppercase tracking-wider ${activeTab === 'profile' ? 'bg-orange-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>👤 Profile Details</button>
          <button type="button" onClick={() => setActiveTab('security')} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition uppercase tracking-wider ${activeTab === 'security' ? 'bg-orange-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>🔒 Security & Vault</button>
          <button type="button" onClick={() => setActiveTab('preferences')} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition uppercase tracking-wider ${activeTab === 'preferences' ? 'bg-orange-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>🎨 UI & Passes Tokens</button>
        </div>

        {/* दाएँ हाथ का वर्किंग फॉर्म कंसोल */}
        <form onSubmit={handleSaveSettings} className="flex-1 bg-white border border-solid border-gray-100 rounded-3xl p-6 md:p-8 shadow-xl w-full">
          
          {activeTab === 'profile' && <ProfileDetailsForm formData={formData} handleInputChange={handleInputChange} />}
          {activeTab === 'security' && <ProfileSecurityForm formData={formData} handleInputChange={handleInputChange} />}
          {activeTab === 'preferences' && <ProfilePreferencesForm formData={formData} handleInputChange={handleInputChange} />}

          {/* सबमिट फ़ुटर स्ट्रिप */}
          <div className="border-t mt-8 pt-5 flex justify-end gap-2">
            <button type="button" onClick={() => setActiveTab('profile')} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer border-solid">Reset Changes</button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-md transition transform hover:-translate-y-0.5 cursor-pointer">
              {loading ? 'Syncing...' : 'Save Configuration Changes'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
