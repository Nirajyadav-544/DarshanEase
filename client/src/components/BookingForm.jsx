import React from 'react';
import DevoteeForm from './DevoteeForm';
import BookingPriceSummary from './BookingPriceSummary';

export default function BookingForm({
  onSubmit,
  loading,
  visitorPhone,
  setVisitorPhone,
  devotees,
  setDevotees,
  handleInputChange,
  selectedSlot,
  ticketPrice
}) {
  // 🔒 Safety Array Guard: Defends the component loops against empty or undefined property datasets
  const validatedRosterList = Array.isArray(devotees) ? devotees : [];

  // Universal cross-compatibility safety check logic (supporting both available and availableSeats keys)
  const remainingSeats = selectedSlot 
    ? (selectedSlot.availableSeats !== undefined ? Number(selectedSlot.availableSeats) : Number(selectedSlot.available || 0)) 
    : 0;

  const isSlotUnavailable = !selectedSlot || remainingSeats <= 0;
  const isSubmitDisabled = loading || isSlotUnavailable;

  return (
    <form onSubmit={onSubmit} className="space-y-6 pt-6 border-t border-solid border-gray-100 text-left">
      
      {/* PRIMARY CONTACT FIELD */}
      <div className="max-w-xs">
        <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
          Primary Contact Phone
        </label>
        <input 
          type="tel" 
          maxLength="10" 
          required={true} 
          className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 font-mono text-xs border-solid font-bold focus:outline-none focus:border-orange-500 focus:bg-white" 
          placeholder="Input 10-digit number" 
          value={visitorPhone || ''} 
          onChange={(e) => setVisitorPhone(e.target.value.replace(/\D/g, ''))} 
        />
      </div>

      {/* DEVOTEE ACCUMULATION LIST ROSTER */}
      <DevoteeForm 
        devotees={validatedRosterList} 
        handleInputChange={handleInputChange} 
        handleRemoveDevotee={(idx) => setDevotees(validatedRosterList.filter((_, i) => i !== idx))} 
      />

      <button 
        type="button" 
        onClick={() => setDevotees([...validatedRosterList, { fullName: '', gender: 'Male', mobileNumber: '', province: '', district: '', nationality: 'nepal', nationalIdentityNumber: '', address: '' }])} 
        className="border-2 border-dashed border-orange-300 text-orange-600 font-black w-full py-3.5 rounded-2xl hover:bg-orange-50 text-xs uppercase tracking-wide cursor-pointer transition bg-transparent"
      >
        ➕ Add Another Devotee Member to Roster
      </button>

      <BookingPriceSummary count={validatedRosterList.length} price={ticketPrice} />

      {/* CORE GATEKEEPER TRIGGER CONTROL */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold rounded-2xl uppercase tracking-wider text-sm transition shadow-lg disabled:shadow-none cursor-pointer border-none"
        >
          {loading 
            ? 'Processing Registration...' 
            : isSlotUnavailable 
              ? '❌ NOT AVAILABLE: Selected slot is completely full' 
              : '💡 Confirm & Proceed To Pass Generation'
          }
        </button>
      </div>
    </form>
  );
}
