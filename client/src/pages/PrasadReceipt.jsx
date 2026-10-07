import React from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function PrasadReceipt() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const templeName = searchParams.get('templeName') || 'Sacred Temple Shrine';
  const address = searchParams.get('address') || 'Delivery Address Node';
  const amount = searchParams.get('amount') || '151';

  const handleDownloadPDF = () => {
    toast.success('Downloading your official Prasad Delivery Receipt...');
    setTimeout(() => { window.print(); }, 500);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div id="printable-pass" className="bg-white rounded-3xl shadow-2xl overflow-hidden border p-8 space-y-6 print:border-none print:shadow-none bg-white">
        
        <div className="text-center border-b pb-4">
          <span className="text-[10px] font-black bg-orange-100 text-orange-700 px-3 py-1 rounded-full uppercase tracking-wider">
            OFFICIAL PRASAD DISPATCH RECEIPT
          </span>
          <h2 className="text-2xl font-black text-gray-800 mt-3">{templeName}</h2>
          <p className="text-xs text-green-600 font-bold mt-1">🟢 SPEEDPOST DELIVERY CONFIRMED</p>
        </div>

        <div className="space-y-4 text-xs text-gray-700">
          <div className="grid grid-cols-2 gap-2 border-b border-dashed pb-3 text-gray-500">
            <p><b>Order Ref Token:</b> <span className="font-mono text-gray-900 font-bold">{id}</span></p>
            <p className="text-right"><b>Date:</b> <span className="text-gray-900 font-bold">{new Date().toLocaleDateString('en-IN')}</span></p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">8-Field Physical Shipping Destination</p>
            <p className="bg-gray-50 p-4 rounded-xl border border-gray-100 leading-relaxed font-mono font-medium text-gray-600">
              {address}
            </p>
          </div>
        </div>

        {/* Live Delivery Pass QR */}
        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <img src={`https://qrserver.com{id}`} alt="Tracking QR" className="w-36 h-36 p-2 bg-white rounded-xl shadow-sm border border-gray-200" />
          <p className="text-[9px] text-gray-400 font-black mt-2 tracking-widest">POSTAL DEPARTMENT TRACKING QR</p>
        </div>

        <div className="flex justify-between items-center bg-orange-50/50 p-4 rounded-xl border border-orange-100 text-sm font-bold">
          <span className="text-gray-500">Total Settlement Received:</span>
          <span className="text-lg font-black text-gray-900">₹ {amount}.00</span>
        </div>

        <div className="grid grid-cols-2 gap-3 print:hidden pt-2">
          <button onClick={() => navigate('/')} className="bg-gray-100 text-gray-600 font-bold py-3 rounded-xl text-xs uppercase hover:bg-gray-200 transition text-center cursor-pointer">
            ← Home Screen
          </button>
          <button onClick={handleDownloadPDF} className="bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider shadow-md hover:from-orange-700 transition text-center cursor-pointer">
            📥 Download PDF
          </button>
        </div>

      </div>
    </div>
  );
}
