import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Devotee Account',
    phone: '+91 9988776655',
    city: 'Delhi'
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    alert("Profile configurations saved securely!");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">👤 My Account Settings</h2>
        
        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Profile Name</label>
            <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-orange-500 bg-white" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Registered Email</label>
            <input type="text" disabled value={user?.email || 'devotee@darshanease.com'} className="w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 text-gray-400 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Mobile Number</label>
            <input type="text" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-orange-500 bg-white" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Native City</label>
            <input type="text" value={profileData.city} onChange={(e) => setProfileData({...profileData, city: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-orange-500 bg-white" />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold py-3 rounded-xl shadow-md hover:from-orange-700 hover:to-amber-600 transition">
            Save Configuration Changes
          </button>
        </form>
      </div>
    </div>
  );
}
