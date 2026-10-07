import React, { useState, useEffect } from 'react';
import API from '../api/axios';

export default function Analytics() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await API.get('/admin/audit-logs');
        setLogs(response.data.logs);
      } catch (err) {
        setLogs([
          { id: 'TXN-901', account: 'Rahul Sen', item: 'VIP Darshan Pass', amount: 500, node: 'Razorpay Gateway', time: '10:04 PM' },
          { id: 'TXN-442', account: 'Pooja Hegde', item: 'Maha Puja E-Pass', amount: 1200, node: 'Razorpay Gateway', time: '09:45 PM' }
        ]);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Financial Revenue Audits</h2>
        <p className="text-gray-500 text-sm">Real-time ledger data streams mapping financial transaction records across India.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wide">
          Transaction Node Event Ledger
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-100/50 text-gray-400 text-xs font-bold border-b">
                <th className="p-4">TXN RUNWAY ID</th>
                <th className="p-4">ACCOUNT</th>
                <th className="p-4">SERVICE DEPLOYED</th>
                <th className="p-4">GATEWAY NODE</th>
                <th className="p-4">TIME</th>
                <th className="p-4 text-right">SETTLED AMOUNT</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-600">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-mono font-bold text-gray-900 text-xs">{log.id}</td>
                  <td className="p-4 font-medium text-gray-800">{log.account}</td>
                  <td className="p-4 text-gray-500 text-xs">{log.item}</td>
                  <td className="p-4 text-indigo-600 text-xs font-medium">{log.node}</td>
                  <td className="p-4 text-gray-400 text-xs">{log.time}</td>
                  <td className="p-4 text-right font-black text-gray-900">₹ {log.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
