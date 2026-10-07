import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      toast.success('Successfully logged in!');
      if (result.role === 'admin') navigate('/admin/dashboard');
      else if (result.role === 'organizer') navigate('/organizer/dashboard');
      else navigate('/'); 
    } else {
      toast.error(result.message || 'Incorrect password or account does not exist!');
    }
  };

  // 🌟 ईमेल वैलिडेशन गेटवे: बिना ईमेल बॉक्स भरे फॉरगेट पासवर्ड पर जाने से रोकना
  const handleForgotPasswordGate = (e) => {
    if (!email.trim()) {
      e.preventDefault(); // 🔒 लिंक का डिफ़ॉल्ट नेविगेशन ब्लॉक करना
      toast.error('⚠️ Please enter your registered Email Address first to proceed with password recovery!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-orange-100 animate-fade-in">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-orange-600 tracking-wide">DarshanEase Portal</h2>
          <p className="text-gray-500 mt-2 text-sm">Sign in with your verified credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-sm bg-white text-gray-800"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-sm bg-white text-gray-800"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            {/* 🌟 अपडेटेड लिंक: अब इसपर handleForgotPasswordGate सुरक्षा चेक लगा है */}
            <div className="flex justify-end mt-2">
              <Link 
                to={`/forgot-password?email=${encodeURIComponent(email.trim())}`}
                onClick={handleForgotPasswordGate}
                className="text-xs text-orange-600 font-semibold hover:underline"
              >
                Forgot Password? (पासवर्ड भूल गए?)
              </Link>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition shadow-md disabled:opacity-50 text-sm cursor-pointer">
            {loading ? 'Verifying with Database...' : 'Secure Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account? <Link to="/register" className="text-orange-600 font-semibold hover:underline">Register</Link>
        </p>

      </div>
    </div>
  );
}

