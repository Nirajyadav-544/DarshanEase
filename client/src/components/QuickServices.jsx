import React from 'react';

export default function QuickServices() {
  const services = [
    { id: 1, title: 'VIP Darshan', icon: '🎟️', desc: 'Skip queues with pre-booked slots.' },
    { id: 2, title: 'E-Puja Booking', icon: '🙏', desc: 'Perform rituals online from anywhere.' },
    { id: 3, title: 'Prasad Delivery', icon: '📦', desc: 'Get pure temple prasad at your doorstep.' },
    { id: 4, title: 'Yatra Kit', icon: '🎒', desc: 'Essential spiritual gear for your journey.' },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center border border-gray-100">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
