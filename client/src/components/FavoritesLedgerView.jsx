import React from 'react';
import { Link } from 'react-router-dom';

export default function FavoritesLedgerView({ processedList, viewMode, handleUnfavoriteTransaction }) {
  
  // 📭 1. EMPTY LIFECYCLE QUEUE FLAG
  if (processedList.length === 0) {
    return (
      <div className="p-16 text-center text-gray-400 bg-white border border-dashed rounded-3xl max-w-xl mx-auto space-y-4">
        <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-2xl mx-auto">📭</div>
        <div>
          <h4 className="text-sm font-black text-gray-700 tracking-tight">No Matching Shrines Identified</h4>
          <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
            Only temple assets explicitly selected with your profile account token will materialize within this workspace panel layer.
          </p>
        </div>
        <Link to="/" className="inline-block text-xs bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black px-6 py-2.5 rounded-xl uppercase tracking-wider shadow-md hover:from-orange-700 transition">Explore Live Shrines</Link>
      </div>
    );
  }

  // 🛕 2. THE VISUAL CARD GRID VIEW CANVAS
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedList.map((t) => (
          <div key={t._id} className="group bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex flex-col justify-between hover:border-gray-200 transition duration-300 transform hover:-translate-y-1 relative border-solid">
            
            <div className="relative h-48 w-full bg-gray-50 overflow-hidden">
              <img 
                src={t.image || t.images || "https://unsplash.com"} 
                alt={t.name} 
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                onError={(e) => { e.target.src = "https://unsplash.com"; }}
              />
              <div className="absolute top-4 left-4 flex gap-1 items-center bg-white/95 backdrop-blur-sm shadow-md rounded-lg px-2.5 py-1 text-xs font-black text-gray-800">
                <span className="text-amber-500">⭐</span> {t.rating || '4.8'}
              </div>
              
              <button 
                type="button"
                onClick={(e) => handleUnfavoriteTransaction(e, t._id)}
                className="absolute top-4 right-4 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white transition rounded-xl p-2 cursor-pointer shadow-md font-bold text-sm border-none z-10"
                title="Remove from favorites ledger"
              >
                ✕
              </button>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] uppercase bg-amber-50 border border-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-black tracking-wider inline-block">
                  {t.state}
                </span>
                <h3 className="text-base font-black text-gray-900 tracking-tight mt-1 truncate">{t.name}</h3>
                <p className="text-gray-400 text-xs truncate font-medium">📍 {t.location}</p>
                
                {t.timings && (
                  <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono text-slate-400">
                    <span>⏳ {t.timings}</span>
                    <span>👔 {t.dressCode}</span>
                  </div>
                )}
                
                <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed text-justify font-medium">
                  {t.description || 'Access dynamic, real-time schedule profiles, book premium pass tiers, or track calendar updates natively for this verified selection.'}
                </p>
              </div>

              <Link 
                to={`/temple/${t._id}`}
                className="block text-center w-full px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-md hover:from-orange-700 transition"
              >
                Book Darshan Slots →
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 📝 3. THE COMPACT LEDGER ROW TABLE CANVAS
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 text-gray-400 font-bold border-b border-solid">
              <th className="p-4 uppercase tracking-wider">Shrine Visual Node</th>
              <th className="p-4 uppercase tracking-wider">Territory Location</th>
              <th className="p-4 uppercase tracking-wider">Sanctuary Parameters</th>
              <th className="p-4 uppercase tracking-wider text-right">Operational Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-gray-600 font-medium">
            {processedList.map((t) => (
              <tr key={t._id} className="hover:bg-gray-50/50 transition">
                <td className="p-4 flex items-center gap-3">
                  <img src={t.image || "https://unsplash.com"} alt={t.name} className="w-12 h-12 object-cover rounded-xl border shrink-0" />
                  <div>
                    <h4 className="text-sm font-black text-gray-900 tracking-tight">{t.name}</h4>
                    <span className="text-[9px] uppercase font-black text-orange-600 font-mono">ID: {t._id}</span>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-bold text-gray-700">📍 {t.location}</p>
                  <p className="text-gray-400 text-[10px] mt-0.5">Region Grid Domain: {t.state}</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1 font-bold text-gray-800"><span className="text-amber-500 text-sm">★</span> {t.rating || '4.8'}</div>
                  <p className="text-gray-400 text-[10px] mt-0.5 font-mono">{t.timings || '05:00 AM - 09:00 PM'}</p>
                </td>
                <td className="p-4 text-right space-x-1 whitespace-nowrap">
                  <button 
                    type="button" 
                    onClick={(e) => handleUnfavoriteTransaction(e, t._id)}
                    className="px-3 py-2 bg-red-50 text-red-600 border border-solid border-red-100 hover:bg-red-600 hover:text-white rounded-xl font-bold transition cursor-pointer text-[10px] uppercase tracking-wide"
                  >
                    💔 Remove
                  </button>
                  <Link 
                    to={`/temple/${t._id}`} 
                    className="inline-block px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black rounded-xl text-[10px] uppercase tracking-wider shadow-sm"
                  >
                    Book Pass
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
