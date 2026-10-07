import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FiTrendingUp, FiLayers, FiCalendar, FiUsers } from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function OrganizerDashboard() {
  const defaultSlotBookingMetrics = Array.from(String("45-12-28-40-15-5").split("-"), Number);

  const [metrics, setMetrics] = useState({
    totalRevenue: "48,500",
    registeredTemples: 2,
    activeSlots: 12,
    todayDevotees: 145,
    slotBookingMetrics: defaultSlotBookingMetrics
  });
  const [recentBookings, setRecentBookings] = useState([
    { id: 'BK-8841', name: 'Amit Kumar', temple: 'Kedarnath Temple', slot: 'Morning Darshan', status: 'Verified' },
    { id: 'BK-2291', name: 'Suresh Raina', temple: 'Kedarnath Temple', slot: 'VIP Darshan', status: 'Pending' }
  ]);

  useEffect(() => {
    const fetchOrganizerData = async () => {
      try {
        const response = await API.get('/organizer/analytics');
        if (response.data) {
          if (response.data.metrics) setMetrics(response.data.metrics);
          if (response.data.recentBookings) setRecentBookings(response.data.recentBookings);
        }
      } catch (err) {
        console.warn("Organizer node offline. Serving simulation dashboard layout.");
      }
    };
    fetchOrganizerData();
  }, []);

  const chartData = {
    labels: ['Slot A', 'Slot B', 'Slot C', 'Slot D', 'Slot E', 'Slot F'],
    datasets: [
      {
        label: 'Devotees per Slot Cluster',
        data: metrics.slotBookingMetrics || defaultSlotBookingMetrics,
        backgroundColor: 'rgba(234, 88, 12, 0.8)',
        borderRadius: 6,
      }
    ]
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Organizer Dashboard</h2>
        <p className="text-gray-500 text-sm">Manage your registered shrines and live darshan entries efficiently.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Total Revenue</p>
            <h3 className="text-2xl font-black text-gray-800 mt-1">₹ {metrics.totalRevenue}</h3>
          </div>
          <FiTrendingUp className="text-3xl text-green-500" />
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">My Shrines</p>
            <h3 className="text-2xl font-black text-gray-800 mt-1">{metrics.registeredTemples}</h3>
          </div>
          <FiLayers className="text-3xl text-orange-500" />
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Active Slots</p>
            <h3 className="text-2xl font-black text-gray-800 mt-1">{metrics.activeSlots}</h3>
          </div>
          <FiCalendar className="text-3xl text-amber-500" />
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Today Devotees</p>
            <h3 className="text-2xl font-black text-gray-800 mt-1">{metrics.todayDevotees}</h3>
          </div>
          <FiUsers className="text-3xl text-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-1">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Slot Load Distribution</h3>
          <div className="h-64 relative">
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden lg:col-span-2">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-sm font-bold text-gray-800">Recent Gate Bookings</h3>
          </div>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-100/50 text-gray-400 font-bold border-b">
                <th className="p-3">PASS ID</th>
                <th className="p-3">DEVOTEE NAME</th>
                <th className="p-3">SLOT TYPE</th>
                <th className="p-3 text-right">GATE STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-600">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-3 font-mono font-bold text-gray-900">{b.id}</td>
                  <td className="p-3 font-medium">{b.name}</td>
                  <td className="p-3 text-orange-600 font-medium">{b.slot}</td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${b.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {b.status}
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
