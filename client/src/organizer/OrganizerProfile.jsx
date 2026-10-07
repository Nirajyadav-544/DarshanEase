import React, { useState } from 'react';

// फ़ंक्शन का नाम OrganizerProfile सुनिश्चित किया गया है ताकि App.jsx का इम्पोर्ट एरर खत्म हो सके
export default function OrganizerProfile() {
  const [profile, setProfile] = useState({ trustName: 'Sacred Trust India', phone: '+91 9876543210', registrationId: 'TRUST-2026-XYZ' });

  const handleSave = (e) => {
    e.preventDefault();
    alert("Organizer credentials updated successfully!");
  };

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Organizer Trust Profile</h2>
        <p className="text-gray-500 text-sm">Manage your officially registered religious trust verification settings.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Religious Trust Name</label>
          <input type="text" value={profile.trustName} onChange={(e) => setProfile({...profile, trustName: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-orange-500 bg-white" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Official Support Phone</label>
          <input type="text" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-orange-500 bg-white" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Govt Trust Registration ID</label>
          <input type="text" readOnly value={profile.registrationId} className="w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-50 text-gray-400 focus:outline-none" />
        </div>
        <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-orange-700 transition">
          Update Trust Metadata
        </button>
      </form>
    </div>
  );
}
