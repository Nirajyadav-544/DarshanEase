import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        {/* ML-64 keeps content from hiding behind the fixed Sidebar */}
        <main className="flex-grow ml-64 mt-16 p-8 min-h-[calc(100vh-64px)] overflow-x-hidden">
          <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
