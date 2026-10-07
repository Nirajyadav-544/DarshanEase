import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-9xl font-extrabold text-orange-600 tracking-widest animate-bounce">404</h1>
      <div className="bg-amber-500 text-white px-3 py-1 rounded text-sm transform rotate-12 absolute mb-24 font-bold shadow-md">
        Path Not Found
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4">Lost in the Divine Search?</h2>
      <p className="text-gray-500 mt-2 max-w-md">
        The destination you are looking for doesn't exist or has been moved to another spiritual realm.
      </p>
      <button 
        onClick={() => navigate('/')} 
        className="mt-6 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold px-6 py-3 rounded-xl hover:from-orange-700 hover:to-amber-600 transition shadow-lg transform hover:scale-105"
      >
        Go Back Home
      </button>
    </div>
  );
}
