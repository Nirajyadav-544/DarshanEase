import React from 'react';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 text-left shadow-2xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-base font-black text-white uppercase tracking-wider">🔒 Cryptographic Privacy & Data Registry Audit</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white font-bold cursor-pointer text-sm">✕</button>
        </div>
        <div className="text-xs text-slate-400 space-y-3 max-h-60 overflow-y-auto pr-2 font-medium leading-relaxed">
          <p>1. **Data Security Node Operations**: All submitted profile parameters, log vectors, and national identification details are fully tokenized and committed securely inside our isolated MongoDB storage cluster.</p>
          <p>2. **Anti-Scam Session Governance**: Login sessions, hardware allocation handshakes, and gate pass tokens are strictly tracked via private web tokens to block remote malicious execution traces.</p>
          <p>3. **Zero Knowledge Assertions**: Personal metadata like alternate numbers or exact home positions are never shared across public grids without explicit multi-factor verification checks.</p>
        </div>
        <div className="pt-2 text-right">
          <button type="button" onClick={onClose} className="bg-orange-600 hover:bg-orange-700 text-white font-black text-[11px] uppercase tracking-wider px-5 py-2.5 rounded-xl cursor-pointer shadow-md">I Acknowledge Rules</button>
        </div>
      </div>
    </div>
  );
}
