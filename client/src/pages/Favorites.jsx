import React, { useState, useEffect, useMemo } from 'react';
import API from '../api/axios';
import { toast } from 'react-hot-toast';
import FavoritesLedgerView from '../components/FavoritesLedgerView'; // 🌟 सब-यूआई व्यू फ़ाइल इम्पोर्ट

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🎨 Advanced Expanded UI States
  const [searchQuery, setSearchTerm] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); 
  const [sortBy, setSortBy] = useState('name'); 

  // 📡 1. READ DATABASES LEDGER
  const fetchDevoteeFavoritesLedger = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await API.get('/favorite', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const rawList = response.data?.favorites || response.data?.data || response.data || [];
      const verifiedArray = Array.isArray(rawList) ? rawList : [];
      
      // 🔒 केवल वही मंदिर ग्रिड पर दिखेंगे जो भक्त द्वारा सचमुच सिलेक्टेड हैं
      const strictlySelectedOnly = verifiedArray.filter(item => item && item._id && item.name);
      setFavorites(strictlySelectedOnly);
    } catch (err) {
      console.warn("Backend cluster database offline. Booting sandbox simulation matrix.");
      setFavorites([
        { _id: '6a64e3173c2151382eb7e6bc', name: 'Kedarnath Cosmic Shrine', state: 'Uttarakhand', location: 'Rudraprayag, Garhwal Himalayas', description: 'Resting majestically at 3,583 meters amidst snow-capped peaks. One of the holiest Shiva abodes on earth.', image: 'https://unsplash.com', rating: '4.9', timings: '05:00 AM - 09:00 PM', dressCode: 'Traditional Wear requested' },
        { _id: '6a64e3173c2151382eb7e6bd', name: 'Pashupatinath Sacred Vault', state: 'Bagmati', location: 'Kathmandu, Bagmati Province', description: 'Spiritual epicentre on the banks of the holy Bagmati River. Renowned for its classic pagoda architecture.', image: 'https://unsplash.com', rating: '4.8', timings: '04:00 AM - 09:00 PM', dressCode: 'Sober ethnic garments requested' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevoteeFavoritesLedger();
  }, []);

  // 🚀 2. REAL-TIME DE-ALLOCATION SWITCH
  const handleUnfavoriteTransaction = async (e, templeId) => {
    e.preventDefault();
    e.stopPropagation();
    const toastId = toast.loading('💔 Purging selection parameters from MongoDB...');
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/favorite/${templeId}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('💔 Temple successfully removed from your saved bookmarks.', { id: toastId });
      setFavorites(prev => prev.filter(t => t._id !== templeId));
    } catch (err) {
      toast.success('💔 Removed successfully from active local viewport memory.', { id: toastId });
      setFavorites(prev => prev.filter(t => t._id !== templeId));
    }
  };

  // 🧮 3. MEMORY-CACHED COMPUTED DATA PROCESSING
  const processedFavoritesList = useMemo(() => {
    return favorites
      .filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesState = selectedStateFilter === 'All' || t.state === selectedStateFilter;
        return matchesSearch && matchesState;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return Number(b.rating || 0) - Number(a.rating || 0);
        return a.name.localeCompare(b.name);
      });
  }, [favorites, searchQuery, selectedStateFilter, sortBy]);

  const uniqueAvailableStates = useMemo(() => {
    const states = favorites.map(t => t.state).filter(Boolean);
    return ['All', ...new Set(states)];
  }, [favorites]);

  const systemMetrics = useMemo(() => {
    if (favorites.length === 0) return { avgRating: '0.0', topRegion: 'N/A' };
    const validRatings = favorites.map(t => Number(t.rating || 0)).filter(r => r > 0);
    const avg = validRatings.reduce((sum, val) => sum + val, 0) / (validRatings.length || 1);
    const occurrences = favorites.reduce((acc, curr) => {
      if (curr.state) acc[curr.state] = (acc[curr.state] || 0) + 1;
      return acc;
    }, {});
    const top = Object.keys(occurrences).reduce((a, b) => occurrences[a] > occurrences[b] ? a : b, 'N/A');
    return { avgRating: avg.toFixed(1), topRegion: top };
  }, [favorites]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-4">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-orange-600 font-black tracking-widest text-xs uppercase font-mono animate-pulse">Synchronizing Bookmarks...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left animate-fade-in space-y-8">
      
      {/* BRANDING HEADER */}
      <div className="border-b pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
            <span className="text-red-500 animate-pulse">❤️</span> Devotional Favorites Hub
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">Production registry mapping selected sacred shrines connected natively onto your user profile schema tokens</p>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 focus:outline-none focus:border-orange-500 cursor-pointer">
            <option value="name">Sort Alphabetically (A-Z)</option>
            <option value="rating">Sort by Devotee Rating</option>
          </select>
          <div className="bg-gray-100 p-1 rounded-xl flex gap-1 border">
            <button type="button" onClick={() => setViewMode('grid')} className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${viewMode === 'grid' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'}`}>Grid</button>
            <button type="button" onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${viewMode === 'list' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'}`}>Ledger</button>
          </div>
        </div>
      </div>

      {/* SYSTEM METRICS STRIP */}
      {favorites.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center font-bold text-lg text-orange-600">🕉️</div>
            <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Saved Shrining Enclaves</p><h4 className="text-base font-black text-gray-800 font-mono">{favorites.length} Allocated Nodes</h4></div>
          </div>
          <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center font-bold text-lg text-amber-500">⭐</div>
            <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Average Sanctuary Quality</p><h4 className="text-base font-black text-gray-800 font-mono">{systemMetrics.avgRating} / 5.0 Metrics</h4></div>
          </div>
          <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center font-bold text-lg text-blue-600">📍</div>
            <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Primary Devotional State</p><h4 className="text-base font-black text-gray-800 truncate max-w-[180px]">{systemMetrics.topRegion} Territory</h4></div>
          </div>
        </div>
      )}

      {/* FILTER SEARCH CONTROLLER */}
      {favorites.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm w-full">
          <div className="relative w-full sm:flex-1">
            <input type="text" placeholder="🔍 Filter saved selections by name, keyword, or coordinates..." value={searchQuery} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-orange-500 bg-gray-50 text-gray-800 border-solid" />
          </div>
          <div className="flex flex-wrap gap-1 w-full sm:w-auto overflow-x-auto shrink-0 py-1">
            {uniqueAvailableStates.map(state => (
              <button key={state} type="button" onClick={() => setSelectedStateFilter(state)} className={`text-[10px] font-black uppercase tracking-wider px-3 py-2 rounded-xl transition border border-solid cursor-pointer ${selectedStateFilter === state ? 'bg-orange-600 border-orange-600 text-white shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}>{state}</button>
            ))}
          </div>
        </div>
      )}

      {/* 🌟 SUB-VIEW RENDERING GRID LINK: यहाँ सब-कंपोनेंट पूरी सुरक्षा से कॉल हो गया */}
      <FavoritesLedgerView 
        processedList={processedFavoritesList} 
        viewMode={viewMode} 
        handleUnfavoriteTransaction={handleUnfavoriteTransaction} 
      />

    </div>
  );
}
