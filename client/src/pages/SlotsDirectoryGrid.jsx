import React from 'react';

export default function SlotsDirectoryGrid({ slots = [], startInlineEdit, handleDeleteSlotNode }) {
  // Safe normalization helper to prevent [object Object] leaks or undefined failures
  const renderCapacityValue = (slot) => {
    if (slot?.totalCapacity !== undefined && slot?.totalCapacity !== null) {
      return String(slot.totalCapacity);
    }
    if (slot?.available !== undefined && slot?.available !== null) {
      return String(slot.available);
    }
    return '0';
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-black text-gray-800 tracking-tight">Active Calendar Slots Directory</h3>
        <p className="text-gray-400 text-xs mt-0.5">Live operational logs currently linked onto the selected shrine collection node.</p>
      </div>

      {(!slots || slots.length === 0) ? (
        <div className="bg-gray-50 border border-dashed rounded-3xl p-8 text-center text-xs font-bold text-gray-400">
          📭 No slot entries provisioned for this selected date ledger. Create one above!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {slots.map((slot) => {
            // Guard clause to ensure broken elements don't crash the grid execution layout
            if (!slot) return null;
            const targetId = slot._id || slot.id || Math.random().toString(36).substring(2, 9);

            return (
              <div 
                key={targetId} 
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-md flex flex-col justify-between space-y-4 hover:border-gray-200 transition"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md tracking-wider">
                      {slot.type || 'N/A'}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-gray-400">
                      📅 {slot.date || 'No Date'}
                    </span>
                  </div>
                  <h4 className="text-base font-black text-gray-800 mt-2">
                    ⏳ {slot.time || slot.slotName || 'Unspecified Time'}
                  </h4>
                  <p className="text-gray-400 text-xs mt-1">
                    Allowed Tickets Capacity:{' '}
                    <span className="font-bold text-gray-700 font-mono">
                      {renderCapacityValue(slot)}
                    </span>
                  </p>
                </div>

                <div className="border-t pt-3 flex justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => startInlineEdit && startInlineEdit(slot)} 
                    className="text-[11px] font-bold px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleDeleteSlotNode && handleDeleteSlotNode(targetId)} 
                    className="text-[11px] font-bold px-3 py-1.5 bg-red-50 border border-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition cursor-pointer"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
