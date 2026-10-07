import React from 'react';

export default function BookingPriceSummary({ count, price }) {
  const total = count * price;
  return (
    <div className="border-t pt-5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-orange-50/40 p-4 rounded-2xl border border-orange-100">
      <div>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Required Transaction Amount</p>
        <p className="text-3xl font-black text-gray-900 mt-0.5">₹ {total}.00</p>
      </div>
      <button 
        type="submit" 
        className="bg-orange-600 hover:bg-orange-700 text-white font-black px-8 py-3.5 rounded-xl shadow-lg text-xs uppercase tracking-wider cursor-pointer w-full sm:w-auto transition"
      >
        Proceed to Pay & Scan QR →
      </button>
    </div>
  );
}
