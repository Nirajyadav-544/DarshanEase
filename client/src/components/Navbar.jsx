import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md fixed w-full z-40 top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-orange-600 tracking-wide">
              Darshan<span className="text-gray-800">Ease</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 font-medium text-gray-600">
            <Link to="/" className="hover:text-orange-600 transition">Home</Link>
            <Link to="/temples" className="hover:text-orange-600 transition">Temples</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/my-bookings" className="hover:text-orange-600 transition">My Bookings</Link>
                <Link to="/favorites" className="hover:text-orange-600 transition">Favorites</Link>
                
                {/* Redirect based on role */}
                {user?.role === 'organizer' && (
                  <Link to="/organizer/dashboard" className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-amber-200">Organizer Panel</Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-purple-200">Admin Panel</Link>
                )}

                <Link to="/profile" className="text-gray-700 font-semibold border-b-2 border-transparent hover:border-orange-500">
                  Hi, {user?.name?.split(' ')[0]}
                </Link>
                <button onClick={logout} className="border border-red-500 text-red-500 px-4 py-1.5 rounded-full hover:bg-red-50 transition text-sm">
                  Logout
                </button>
              </>
            ) : (
              <button onClick={() => navigate('/login')} className="bg-orange-600 text-white px-5 py-2 rounded-full hover:bg-orange-700 transition shadow-md text-sm">
                Login / Signup
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-2 shadow-lg">
          <Link to="/" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-orange-600">Home</Link>
          <Link to="/temples" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-orange-600">Temples</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/my-bookings" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-orange-600">My Bookings</Link>
              <Link to="/favorites" onClick={() => setIsOpen(false)} className="block py-2 text-gray-700 hover:text-orange-600">Favorites</Link>
              {user?.role === 'organizer' && <Link to="/organizer/dashboard" onClick={() => setIsOpen(false)} className="block py-2 text-amber-700 font-bold">Organizer Dashboard</Link>}
              {user?.role === 'admin' && <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="block py-2 text-purple-700 font-bold">Admin Dashboard</Link>}
              <Link to="/profile" onClick={() => setIsOpen(false)} className="block py-2 font-medium text-gray-800">My Profile ({user?.name})</Link>
              <button onClick={() => { logout(); setIsOpen(false); }} className="w-full text-left py-2 text-red-600 font-medium">Logout</button>
            </>
          ) : (
            <button onClick={() => { navigate('/login'); setIsOpen(false); }} className="w-full bg-orange-600 text-white px-5 py-2 rounded-xl hover:bg-orange-700 transition mt-2 text-sm">
              Login / Signup
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
