import React from 'react';

export default function Testimonials() {
  const reviews = [
    { id: 1, name: 'Rahul Sharma', role: 'Devotee', review: 'DarshanEase made our family trip to Kedarnath so smooth. The VIP pass saved us 4 hours of waiting!', rating: '⭐⭐⭐⭐⭐' },
    { id: 2, name: 'Priya Patel', role: 'Working Professional', review: 'Ordered online prasad for my parents. It delivered safely and fresh. Highly recommend their service.', rating: '⭐⭐⭐⭐⭐' },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What Devotees Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <p className="text-gray-600 italic">"{r.review}"</p>
              <div className="mt-6 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-800">{r.name}</h4>
                  <span className="text-xs text-gray-400">{r.role}</span>
                </div>
                <span className="text-sm">{r.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
