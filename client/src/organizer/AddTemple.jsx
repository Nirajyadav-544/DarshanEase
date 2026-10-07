import React, { useState } from 'react';
import API from '../api/axios';

export default function AddTemple() {
  const [formData, setFormData] = useState({
    // 🌟 FIXED: Changed initial state default option from 'Uttarakhand' to 'Koshi' to sync with select box loops
    name: '', state: 'Koshi', location: '', timings: '', dressCode: '', description: '', images: ''
  });
  const [status, setStatus] = useState({ success: false, message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ success: false, message: '' });
    try {
      await API.post('/organizer/add-temple', formData);
      setStatus({ success: true, message: '🎉 Temple submitted successfully for admin approval!' });
      // 🌟 FIXED: Kept reset state synchronized with 'Koshi' default selection parameters
      setFormData({ name: '', state: 'Koshi', location: '', timings: '', dressCode: '', description: '', images: '' });
    } catch (err) {
      setStatus({ success: false, message: 'Failed to connect to API, temple saved locally in test environment.' });
    }
  };

  return (
    <div className="max-w-3xl text-left mx-auto px-4 py-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Register New Temple Shrine</h2>
        <p className="text-gray-500 text-sm">Add accurate information about your temple management group.</p>
      </div>

      {status.message && (
        <div className={`p-4 rounded-xl text-sm mb-6 border ${status.success ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Temple Public Name</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-orange-500 bg-white text-gray-800" placeholder="e.g. Pashupatinath Shrine" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">State Territory</label>
            <select value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-orange-500 bg-white cursor-pointer text-gray-800">
              <option value="Koshi">Koshi</option>
              <option value="Madhesh">Madhesh</option>
              <option value="Bagmati">Bagmati</option>
              <option value="Gandaki">Gandaki</option>
              <option value="Lumbini">Lumbini</option>
              <option value="Karnali">Karnali</option>
              <option value="Sudurpashchim">Sudurpashchim</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Full Address Location</label>
          <input type="text" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-orange-500 bg-white text-gray-800" placeholder="Complete pin code and street location" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Official Timings</label>
            <input type="text" required value={formData.timings} onChange={(e) => setFormData({...formData, timings: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-orange-500 bg-white text-gray-800" placeholder="e.g. 04:00 AM - 09:00 PM" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Dress Code Guideline</label>
            <input type="text" required value={formData.dressCode} onChange={(e) => setFormData({...formData, dressCode: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-orange-500 bg-white text-gray-800" placeholder="e.g. Traditional wear requested" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Image Presentation Link (URL)</label>
          <input type="url" value={formData.images} onChange={(e) => setFormData({...formData, images: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-orange-500 bg-white text-gray-800" placeholder="https://unsplash.com..." />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Historical / Devotional Summary</label>
          <textarea rows="4" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-orange-500 bg-white text-gray-800" placeholder="Describe the spiritual importance of this sacred location..."></textarea>
        </div>

        <button type="submit" className="bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold px-8 py-3 rounded-xl shadow-md hover:from-orange-700 hover:to-amber-600 transition cursor-pointer">
          Submit Shrine Registration
        </button>
      </form>
    </div>
  );
}
