import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-hot-toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(''); 
  const [role, setRole] = useState('user'); 
  const [secretKey, setSecretKey] = useState(''); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const ADMIN_SECRET_PASSCODE = "AdminEase@2026";
  const ORGANIZER_SECRET_PASSCODE = "OrgEase@2026";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (role === 'admin' && secretKey !== ADMIN_SECRET_PASSCODE) {
      toast.error('❌ Incorrect Admin Passcode.');
      setLoading(false);
      return;
    }
    if (role === 'organizer' && secretKey !== ORGANIZER_SECRET_PASSCODE) {
      toast.error('❌ Incorrect Organizer Passcode.');
      setLoading(false);
      return;
    }
    if (phone.trim().length !== 10) {
      toast.error('❌ Mobile number must be exactly 10 digits!');
      setLoading(false);
      return;
    }

    try {
      const response = await API.post(
  '/auth/register',
  JSON.stringify({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    phone: phone.trim(),
    role
  }),
  {
    headers: {
      'Content-Type': 'application/json'
    }
  }
);
      
      toast.success(`Welcome to DarshanEase! Auto-Logged in successfully.`);
      
      // 🌟 ऑटो-लॉगिन इंजन: रजिस्ट्रेशन होते ही टोकन को स्टोर करके सीधे प्रोफाइल/डैशबोर्ड पर रेंडर करना
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'organizer') navigate('/organizer/dashboard');
        else navigate('/profile');
        window.location.reload();
      } else {
        navigate('/login');
      }

    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-orange-100 animate-fade-in">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-orange-600 tracking-wide">Register Account</h2>
          <p className="text-gray-400 mt-1 text-sm">Create your multi-role validated system account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input type="text" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-sm bg-white text-gray-800" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input type="email" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-sm bg-white text-gray-800" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number (Mandatory for OTP Recovery)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 font-bold text-sm">+91</span>
              <input type="tel" maxLength="10" required className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-sm bg-white text-gray-800 font-mono" placeholder="Enter 10-digit number" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input type="password" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-sm bg-white text-gray-800" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Account Role Type</label>
            <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-sm bg-white cursor-pointer text-gray-700 font-medium" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">Devotee (सामान्य भक्त)</option>
              <option value="organizer">Temple Organizer (मंदिर प्रबंधक)</option>
              <option value="admin">Super Admin (मुख्य नियंत्रक)</option>
            </select>
          </div>

          {(role === 'admin' || role === 'organizer') && (
            <div className="space-y-1 animate-fade-in">
              <label className="block text-sm font-bold text-red-600 mb-1 uppercase tracking-wider text-xs">⚠️ Verification Secret Passcode Required</label>
              <input type="password" required className="w-full px-4 py-2.5 rounded-xl border-2 border-red-200 focus:outline-none focus:border-red-500 text-sm bg-red-50/30 text-gray-800 font-mono" placeholder="Enter security token..." value={secretKey} onChange={(e) => setSecretKey(e.target.value)} />
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl shadow-md mt-2 disabled:opacity-50 hover:bg-orange-700 transition text-sm cursor-pointer">
            {loading ? 'Creating Account & Deploying Token...' : 'Register & Log In Directly'}
          </button>
        </form>
      </div>
    </div>
  );
}

