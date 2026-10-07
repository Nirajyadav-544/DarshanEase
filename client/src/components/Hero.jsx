import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const [homeSearch, setHomeSearch] = useState('');
  const navigate = useNavigate();

  const handleHomeSearchSubmit = (e) => {
    e.preventDefault();
    
    // 🌟 क्लिक एक्शन फिक्स: बटन दबाते ही यह बिना किसी रुकावट के सीधे /temples पेज पर रीडायरेक्ट करेगा
    if (homeSearch.trim()) {
      navigate(`/temples?query=${encodeURIComponent(homeSearch.trim())}`);
    } else {
      navigate('/temples');
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-orange-500 to-amber-500 h-[85vh] flex items-center justify-center text-white px-4 mt-16 animate-fade-in">
      <div className="absolute inset-0 bg-black opacity-20"></div>

      <div className="relative z-10 text-center max-w-3xl mx-auto w-full">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md">
          Your Spiritual Journey, Made Simple
        </h1>
        <p className="text-lg md:text-xl mb-8 text-orange-50">
          Skip the long queues. Book VIP Darshan, Puja, Prasad, and Travel Kits all in one click.
        </p>

        {/* Dynamic Search Box Form Container */}
        <form 
          onSubmit={handleHomeSearchSubmit}
          className="bg-white p-3 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-3 text-gray-800 max-w-2xl mx-auto w-full"
        >
          <input 
            type="text" 
            placeholder="Search Temples (e.g., Kedarnath, Tirupati)..." 
            className="flex-grow px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-base bg-white text-gray-800"
            value={homeSearch}
            onChange={(e) => setHomeSearch(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-3 rounded-xl transition cursor-pointer text-sm shadow-md"
          >
            Search Temple
          </button>
        </form>
      </div>
    </div>
  );
}

