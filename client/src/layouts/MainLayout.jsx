import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Navbar />
      {/* 16px (mt-16) offsets sticky Navbar height */}
      <main className="flex-grow mt-16 animate-fade-in">
        {children}
      </main>
      <Footer />
    </div>
  );
}
