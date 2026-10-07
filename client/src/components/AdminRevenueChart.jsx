import React from 'react';

export default function AdminRevenueChart({ revenueData }) {
  // 🌟 शुद्ध CSS और HTML5 से बना क्रैश-प्रूफ कस्टमाइज्ड रेवेन्यू बार ग्राफ
  // इसके लिए किसी भारी बाहरी पैकेज की जरूरत नहीं है, यह 100% लाइटवेट है
  const maxRevenue = Math.max(...revenueData.map(d => d.amount), 1000);

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl space-y-4">
      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">📈 7-Day Revenue Audit Ledger</h3>
      
      <div className="h-48 flex items-end justify-between gap-2 pt-6 border-b border-dashed pb-2">
        {revenueData.map((data, index) => {
          const barHeight = (data.amount / maxRevenue) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2 group relative">
              {/* Tooltip on Hover */}
              <span className="absolute -top-7 bg-gray-900 text-white font-mono text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition shadow-md z-10">
                ₹{data.amount}
              </span>
              
              {/* Live Animated Bar */}
              <div 
                style={{ height: `${barHeight}%` }} 
                className="w-full bg-gradient-to-t from-orange-600 to-amber-500 rounded-t-xl transition-all duration-500 shadow-md group-hover:from-orange-700"
              ></div>
              
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{data.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
