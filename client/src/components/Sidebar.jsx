import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const isOrganizer = user?.role === 'organizer';

  // रोल के आधार पर लिंक्स तय करना
  const links = isOrganizer 
    ? [
        { path: '/organizer/dashboard', label: 'Overview', icon: '📊' },
        { path: '/organizer/add-temple', label: 'Add Temple', icon: '➕' },
        { path: '/organizer/manage-temple', label: 'Manage Temples', icon: '⛩️' },
        { path: '/organizer/create-slot', label: 'Create Slots', icon: '📅' },
        { path: '/organizer/my-slots', label: 'View Slots', icon: '⏰' },
        { path: '/organizer/profile', label: 'Profile Settings', icon: '⚙️' },
      ]
    : [
        { path: '/admin/dashboard', label: 'Admin Metrics', icon: '📈' },
        { path: '/admin/users', label: 'Manage Users', icon: '👥' },
        { path: '/admin/temples', label: 'Approve Temples', icon: '🏛️' },
        { path: '/admin/bookings', label: 'All Bookings', icon: '🎟️' },
        { path: '/admin/analytics', label: 'Revenue Insights', icon: '💰' },
      ];

  return (
    <aside className="w-64 bg-gray-900 text-gray-300 min-h-screen flex flex-col justify-between fixed left-0 top-0 pt-16 z-30 shadow-xl">
      <div className="p-4 flex-grow">
        <div className="mb-6 px-2 py-3 bg-gray-800 rounded-xl text-center">
          <p className="text-xs uppercase text-orange-400 font-bold tracking-wider">{user?.role} Panel</p>
          <h4 className="text-white font-semibold truncate mt-1">{user?.name}</h4>
        </div>

        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium text-sm ${
                  isActive ? 'bg-orange-600 text-white shadow-lg' : 'hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span className="text-base">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-800">
        <button onClick={logout} className="w-full flex items-center justify-center space-x-2 bg-red-950/40 text-red-400 border border-red-900/60 py-2.5 rounded-xl hover:bg-red-900 hover:text-white transition text-sm font-semibold">
          <span>🚪</span>
          <span>Exit Dashboard</span>
        </button>
      </div>
    </aside>
  );
}
