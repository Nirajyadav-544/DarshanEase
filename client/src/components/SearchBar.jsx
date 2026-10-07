import React from 'react';

export default function SearchBar({ searchInput, setSearchInput, selectedState, setSelectedState, onSearchClick }) {
  const states = [
    'Koshi', 'Madhesh ', 'Bagmati', 
    'Gandaki ', 'Lumbini', 'Karnali', 'Sudurpashchim'
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSearchClick(); // बटन या एंटर दबाने पर पैरेंट का सर्च ट्रिगर फायर करना
  };

  return (
    <form 
      onSubmit={handleFormSubmit}
      className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-5xl mx-auto -mt-10 relative z-20"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        
        {/* Text Input Search Room */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-sm bg-white text-gray-800"
            placeholder="Type temple name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)} // सिर्फ इनपुट स्टोर करेगा, लाइव फ़िल्टर नहीं करेगा
          />
        </div>

        {/* State Classification Selector Dropdown */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">📍</span>
          <select
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-sm bg-white cursor-pointer appearance-none text-gray-600"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="">All States </option>
            {states.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Master Execution Click Trigger */}
        <div>
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold py-3 rounded-xl shadow-md hover:from-orange-700 hover:to-amber-600 transition duration-300 cursor-pointer text-sm"
          >
            🔍 Search Temple
          </button>
        </div>

      </div>
    </form>
  );
}
