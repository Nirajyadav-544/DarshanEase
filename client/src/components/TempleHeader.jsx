import React from 'react';

export default function TempleHeader({ temple }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6 mb-8">
      <div>
        <span className="text-xs uppercase bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-black tracking-wide">
          {temple.state}
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-gray-800 tracking-tight mt-2">{temple.name}</h1>
        <p className="text-gray-500 text-sm mt-1.5 flex items-center gap-1">📍 {temple.location}</p>
      </div>
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-lg px-5 py-2.5 rounded-2xl shadow-md self-start md:self-center">
        ⭐ {temple.rating || '4.9'}
      </div>
    </div>
  );
}
