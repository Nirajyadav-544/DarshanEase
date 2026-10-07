import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-hot-toast';

export default function ForgotPassword() {
  const [urlParams] = useSearchParams();
  const targetEmail = urlParams.get('email') || ''; 

  const [step, setStep] = useState(1); 
  const [recoveryChannel, setRecoveryChannel] = useState('email'); // "email" or "sms"
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0); 
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Step 1: Real OTP Core Trigger (Hybrid Dispatcher)
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (recoveryChannel === 'sms' && phone.trim().length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/auth/forgot-password-otp', { 
        email: targetEmail,
        phone: recoveryChannel === 'sms' ? phone.trim() : undefined,
        via: recoveryChannel // "email" या "sms" बैकएंड नोड को भेजना
      });
      toast.success(response.data.message || '🎉 Verification code dispatched successfully!');
      setStep(2); 
      setTimer(60); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to dispatch verification codes.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Real OTP Token Verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      toast.error('Please enter a valid 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      await API.post('/auth/verify-otp', { email: targetEmail, otp: otp.trim() });
      toast.success('🎯 Identity authorized successfully!');
      setStep(3); 
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Invalid or Expired OTP Verification Token!');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Database Credentials Patch & Direct Session Rendering
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/auth/reset-password-otp', { email: targetEmail, newPassword: newPassword });
      toast.success('✨ Password updated successfully!');
      
      // 🚀 डायरेक्ट प्रोफाइल लोडिंग मैकेनिज्म (ऑटो लॉगिन)
      localStorage.setItem('token', response.data.token);
      const userRole = response.data.user?.role;
      
      if (userRole === 'admin') navigate('/admin/dashboard');
      else if (userRole === 'organizer') navigate('/organizer/dashboard');
      else navigate('/profile');
      
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Database write failure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-orange-100 animate-fade-in">
        
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-orange-600 tracking-wide">Account Recovery</h2>
          <p className="text-gray-400 mt-1 text-sm">Recovering account for: <span className="font-bold text-gray-800">{targetEmail}</span></p>
        </div>

        {/* STEP 1: HYBRID OTP OPTIONS SELECTION */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-5">
            {/* Channel Radio Options Toggle */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Choose Recovery Channel</p>
              
              <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-gray-700">
                <input type="radio" name="channel" checked={recoveryChannel === 'email'} onChange={() => setRecoveryChannel('email')} className="text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer" />
                📧 Send Verification Code to Gmail Profile
              </label>

              <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-gray-700">
                <input type="radio" name="channel" checked={recoveryChannel === 'sms'} onChange={() => setRecoveryChannel('sms')} className="text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer" />
                📱 Send Verification OTP to Registered Mobile
              </label>
            </div>

            {/* If Mobile selected, display validation input node */}
            {recoveryChannel === 'sms' && (
              <div className="space-y-1 animate-fade-in">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Verify Registered Mobile Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 font-bold text-sm">+91</span>
                  <input type="tel" maxLength="10" required className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-sm bg-white text-gray-800 font-mono tracking-wider" placeholder="10-digit number" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} />
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl shadow-md text-sm cursor-pointer hover:bg-orange-700 transition">
              {loading ? 'Dispatched Token Routing...' : 'Send Recovery OTP Code'}
            </button>
          </form>
        )}

        {/* STEP 2: VERIFY OTP BOX */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase text-center">
                Enter 6-Digit Secure Code sent to your Account
              </label>
              <input type="text" maxLength="6" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-gray-800 text-center font-mono tracking-widest text-xl bg-white" placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl shadow-md text-sm cursor-pointer">
              Verify Code Token →
            </button>
          </form>
        )}

        {/* STEP 3: NEW PASSWORD ENTRY */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="p-3 bg-green-50 text-green-800 text-xs font-semibold rounded-xl border border-green-200">✓ Security Node Unlocked. Set your new platform credentials below.</div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">New Password</label>
              <input type="password" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-sm bg-white text-gray-800" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Confirm New Password</label>
              <input type="password" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-sm bg-white text-gray-800" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold py-3 rounded-xl shadow-md text-sm cursor-pointer">
              Update Credentials & Enter Profile Direct
            </button>
          </form>
        )}

        <div className="text-center text-sm text-gray-500 mt-6 border-t pt-4">
          Remember credentials? <Link to="/login" className="text-orange-600 font-semibold hover:underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}


