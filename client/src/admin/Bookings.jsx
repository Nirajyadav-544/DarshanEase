import React, { useState, useEffect } from 'react';
import API from '../api/axios';

export default function MasterBookings() {
  const [masterRecords, setMasterRecords] = useState([]);

  useEffect(() => {
    const fetchMasterRecords = async () => {
      try {
        const response = await API.get('/admin/all-bookings');
        setMasterRecords(response.data.bookings);
      } catch (err) {
        setMasterRecords([
          { _id: 'BK-1102', user: 'Alok Mishra', temple: 'Tirupati Balaji', slot: 'VIP Darshan', date: '2026-07-28', status: 'Paid' },
          { _id: 'BK-4491', user: 'Vikas Patel', temple: 'Kedarnath Temple', slot: 'Morning Darshan', date: '2026-07-29', status: 'Paid' }
        ]);
      }
    };
    fetchMasterRecords();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Master Booking Ledger</h2>
        <p className="text-gray-500 text-sm">Global monitoring node tracking all active devotee transactional passes across India.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs font-bold border-b">
                <th className="p-4">PASS NUMBER</th>
                <th className="p-4">DEVOTEE ACCOUNT</th>
                <th className="p-4">TEMple TARGET</th>
                <th className="p-4">SLOT ASSIGNED</th>
                <th className="p-4">TRAVEL DATE</th>
                <th className="p-4 text-right">GATE STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {masterRecords.map((rec) => (
                <tr key={rec._id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-mono font-bold text-xs text-gray-900">{rec._id}</td>
                  <td className="p-4 font-medium">{rec.user}</td>
                  <td className="p-4 text-gray-500">{rec.temple}</td>
                  <td className="p-4 text-orange-600 font-medium">{rec.slot}</td>
                  <td className="p-4 font-medium text-gray-500">{rec.date}</td>
                  <td className="p-4 text-right">
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
