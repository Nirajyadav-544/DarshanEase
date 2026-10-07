import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-hot-toast';

export default function TempleCard({ temple, onPrasadClick }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [toggling, setToggling] = useState(false);

  // Remote image fallback guard
  const defaultLocalImage = "/assets/temples/default-shrine.jpg";

  // 📡 1. READ LIFE BOOKMARK LEDGER: Query your favorites database collection to toggle heart on mount
  useEffect(() => {
    const checkFavoriteStatusOnMount = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Query the get favorites endpoint: /api/favorite
        const response = await API.get('/favorite', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const favoritesList = response.data?.favorites || response.data || [];
        
        // Lock the heart status true if the temple id matches our registry array elements
        const exists = favoritesList.some(fav => fav._id === temple._id);
        setIsFavorite(exists);
      } catch (err) {
        console.warn("Favorite connection check bypassed on card layer mount.");
      }
    };
    checkFavoriteStatusOnMount();
  }, [temple._id]);

  // ❤️ 🤍 2. DYNAMIC TOGGLE TRANSMISSION ENGINE: Maps precisely onto your controller's exact expected routes
  const handleHeartToggleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // 🔒 CRITICAL: Blocks container bubbles from accidentally clicking into navigate detail paths

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("🔒 Access Restricted: Please log in to bookmark your favorite temples!");
      return;
    }

    if (toggling) return;
    setToggling(true);

    const nextState = !isFavorite;
    setIsFavorite(nextState); // Instant state adjustment response fluidness for elite user experience

    try {
      if (nextState) {
        // 🚀 THE CORE FIX FOR THE 400 ERROR: 
        // Changes the URL path from '/favorite' to match your controller's exact expected endpoint structure: '/favorite/add/:templeId'
        await API.post(`/favorite/add/${temple._id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success(`❤️ Added ${temple.name} to your saved favorites ledger!`);
      } else {
        // 🚀 THE CORE FIX FOR THE DELETION LOOP:
        // Changes the URL path to match your controller's exact expected delete endpoint structure: '/favorite/remove/:templeId'
        await API.delete(`/favorite/remove/${temple._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success(`💔 Removed ${temple.name} from your saved bookmarks.`);
      }
    } catch (err) {
      console.error("Intercepted dynamic toggle trace failure:", err);
      // Revert display parameters state locally if the backend drops validation tokens
      setIsFavorite(!nextState);
      toast.error(err.response?.data?.message || "❌ Database Write Refused: Controller rejected parameters format.");
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full text-left relative">
      
      {/* CARD TOP FRAME GRAPHIC PLATFORM */}
      <div className="h-48 w-full bg-gray-100 overflow-hidden relative group">
        <img 
          src={temple.image || defaultLocalImage} 
          alt={temple.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://unsplash.com";
          }}
        />
        <div className="absolute top-3 left-3 bg-orange-600 text-white font-black text-[10px] uppercase px-2.5 py-1 rounded-md tracking-wider shadow-md z-10 select-none">
          {temple.state || "Nepal"}
        </div>

        {/* ❤️ 🤍 THE MASTER FAVORITE TOGGLE BUTTON: High Z-Index layer bound over top-right corner card graphics */}
        <button 
          type="button"
          onClick={handleHeartToggleClick}
          className={`absolute top-3 right-3 p-2 rounded-xl shadow-md transition-all duration-300 transform hover:scale-110 border-none cursor-pointer flex items-center justify-center text-xs backdrop-blur-sm z-20 ${
            isFavorite 
              ? 'bg-red-500 text-white scale-105' 
              : 'bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white'
          }`}
          title={isFavorite ? "Remove from favorite shrines ledger" : "Add to favorite shrines directory"}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      {/* METADATA CONTENT FOOTER SPECS GRID */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div>
          <h3 className="text-lg font-black text-gray-800 tracking-tight line-clamp-1">{temple.name}</h3>
          <p className="text-gray-400 text-xs mt-1 font-medium">📍 {temple.location}</p>
          <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed">{temple.description}</p>
        </div>

        <div className="border-t pt-3 flex flex-col gap-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-black text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg">⭐ {temple.rating || "4.9"}</span>
            <span className="text-xs font-black text-orange-600 select-none">Prasad Available Box 📦</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              type="button"
              onClick={() => navigate(`/temple/${temple._id}`)}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-[11px] font-black py-2.5 rounded-xl transition uppercase tracking-wider text-center cursor-pointer border-none"
            >
              Ticket Booking 🕉️
            </button>
            <button 
              type="button"
              onClick={() => onPrasadClick(temple)}
              className="bg-gradient-to-r from-orange-600 to-amber-500 text-white text-[11px] font-black py-2.5 rounded-xl shadow-md transition uppercase tracking-wider text-center cursor-pointer border-none"
            >
              Order Prasad 📦
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

