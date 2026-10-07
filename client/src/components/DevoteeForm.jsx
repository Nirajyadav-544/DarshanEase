import React from 'react';

export default function DevoteeForm({ devotees, handleInputChange, handleRemoveDevotee }) {
  return (
    <div className="space-y-6">
      {devotees.map((devotee, index) => (
        <div key={index} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 relative space-y-4 animate-fade-in">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-xs bg-orange-600 text-white font-black px-3 py-1 rounded-lg">DEVOTEE #{index + 1}</span>
            {devotees.length > 1 && (
              <button type="button" onClick={() => handleRemoveDevotee(index)} className="text-xs text-red-500 font-bold hover:underline cursor-pointer">✕ Delete</button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">1. Full Name</label>
              <input type="text" required placeholder="Full Name" value={devotee.fullName} onChange={(e) => handleInputChange(index, 'fullName', e.target.value)} className="w-full px-3 py-2 rounded-xl border text-xs bg-white text-gray-800" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">2. Gender</label>
              <select value={devotee.gender} onChange={(e) => handleInputChange(index, 'gender', e.target.value)} className="w-full px-3 py-2 rounded-xl border text-xs bg-white text-gray-600 cursor-pointer">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">3. Mobile Number</label>
              <input type="tel" maxLength="10" required placeholder="Personal Mobile" value={devotee.mobileNumber} onChange={(e) => handleInputChange(index, 'mobileNumber', e.target.value.replace(/\D/g, ''))} className="w-full px-3 py-2 rounded-xl border text-xs bg-white text-gray-800 font-mono" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">4. Nationality</label>
              <input type="text" required placeholder="e.g. Indian" value={devotee.nationality} onChange={(e) => handleInputChange(index, 'nationality', e.target.value)} className="w-full px-3 py-2 rounded-xl border text-xs bg-white text-gray-800" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">5. Province </label>
              <input type="text" required placeholder="Province/State" value={devotee.province} onChange={(e) => handleInputChange(index, 'province', e.target.value)} className="w-full px-3 py-2 rounded-xl border text-xs bg-white text-gray-800" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">6. District </label>
              <input type="text" required placeholder="District Name" value={devotee.district} onChange={(e) => handleInputChange(index, 'district', e.target.value)} className="w-full px-3 py-2 rounded-xl border text-xs bg-white text-gray-800" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">7. National Identity Number</label>
              <input type="text" required placeholder="National ID, PAN, etc." value={devotee.nationalIdentityNumber} onChange={(e) => handleInputChange(index, 'nationalIdentityNumber', e.target.value)} className="w-full px-3 py-2 rounded-xl border text-xs bg-white text-gray-800 font-mono" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 mb-1">8. Full Address</label>
            <input type="text" required placeholder="House no, Street, Ward, Village name, Pincode" value={devotee.address} onChange={(e) => handleInputChange(index, 'address', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border text-xs bg-white text-gray-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
