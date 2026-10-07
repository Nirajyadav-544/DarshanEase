import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in space-y-16">
      
      {/* 🌟 1. Master Hero Mission Banner Block */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full font-black tracking-widest border border-orange-200">
          Our Sacred Purpose (हमारा उद्देश्य)
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-none mt-4">
          Bridging Devotion With <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">Digital Ease</span>
        </h1>
        <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
          DarshanEase is a spiritual tech foundation created to eliminate long chaotic waiting lines, corrupt intermediate middleman cuts, and tracking hassles across holy shrines in India and Nepal.
        </p>
      </div>

      {/* 🌟 2. Three Pillars of Truth (Core Value Grid Node) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card 1: Fast-track Darshan */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-4 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 text-left">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-2xl">🕉️</div>
          <h3 className="text-lg font-black text-gray-800 tracking-tight">Structured Queue Allocation</h3>
          <p className="text-gray-500 text-xs leading-relaxed font-medium">
            We provide verified digital gate tokens and fixed real-time darshan slot booking directly synced with the temple management ledger to minimize waiting crowd exhaustion.
          </p>
        </div>

        {/* Card 2: Pure Prasad Shipment */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-4 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 text-left">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl">📦</div>
          <h3 className="text-lg font-black text-gray-800 tracking-tight">Divine Prasad Delivery</h3>
          <p className="text-gray-500 text-xs leading-relaxed font-medium">
            For senior citizens or devotees unable to travel physically across terrains, our secure 8-field dynamic postal framework delivers blessed prasad directly to their homes.
          </p>
        </div>

        {/* Card 3: Peer-to-Peer Settlements */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-4 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 text-left">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl">💸</div>
          <h3 className="text-lg font-black text-gray-800 tracking-tight">Direct Account Settlements</h3>
          <p className="text-gray-500 text-xs leading-relaxed font-medium">
            All transactional offerings mapped via our direct <code>@ibl</code> UPI routing protocols instantly hit the respective priest or shrine trustee bank account with 0% platform cuts.
          </p>
        </div>

      </div>

      {/* 🌟 3. Live Navigation Call-To-Action Console Strip */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-orange-950/40 p-8 md:p-12 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-xl mx-auto space-y-3 z-10 relative">
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Ready to Experience Divine Resonance?</h2>
          <p className="text-slate-400 text-xs leading-relaxed font-medium">
            Explore active holy counters across Kathmandu, Mustang, Janakpur, and Varanasi with synchronized real-time live satellite GPS trackers.
          </p>
          <div className="pt-4">
            <button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg transition duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              Explore Holy Shrines Now →
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
