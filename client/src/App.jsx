import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast'; // 🌟 टोस्ट नोटिफिकेशन के लिए इम्पोर्ट

// Layouts & Guards
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import OrganizerRoute from './components/OrganizerRoute';
import AdminRoute from './components/AdminRoute';

// Core Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Temples from './pages/Temples';
import TempleDetails from './pages/TempleDetails';
import Booking from './pages/Booking';
import Ticket from './pages/Ticket';
import MyBookings from './pages/MyBookings';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';

// Dashboards
import OrganizerDashboard from './organizer/Dashboard';
import AddTemple from './organizer/AddTemple';
import CreateSlot from './organizer/CreateSlot';
import ManageTemple from './pages/OrganizerManageTemples.jsx';
import MySlots from './organizer/MySlots';
import OrganizerProfile from './organizer/OrganizerProfile';

import AdminDashboard from './admin/Dashboard';
import ManageUsers from './admin/Users';
import ApproveTemples from './admin/Temples';
import FinancialAnalytics from './admin/Analytics';
import MasterBookings from './admin/Bookings';
import ForgotPassword from './pages/ForgotPassword';
import PrasadReceipt from './pages/PrasadReceipt';
import About from './pages/About';
import OrganizerManageTemples from './pages/OrganizerManageTemples';



export default function App() {
  return (
    <Router>
      <AuthProvider>
        {/* 🌟 पूरे ऐप में टोस्ट अलर्ट्स दिखाने के लिए कंटेनर */}
        <Toaster position="top-center" reverseOrder={false} />
        
        <Routes>
          {/* Public & Devotee Routes */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register defaultRole="user" title="Devotee Registration" />} />
          
          {/* 🔐 सीक्रेट एडमिन और ऑर्गनाइज़र रजिस्ट्रेशन पोर्टल्स */}
          <Route path="/super-secret-admin-register" element={<Register defaultRole="admin" title="👑 Super Admin Creation Portal" />} />
          <Route path="/super-secret-organizer-register" element={<Register defaultRole="organizer" title="⛩️ Temple Organizer Creation Portal" />} />

          <Route path="/temples" element={<MainLayout><Temples /></MainLayout>} />
          <Route path="/temple/:id" element={<MainLayout><TempleDetails /></MainLayout>} />
          
          <Route path="/booking" element={<ProtectedRoute><MainLayout><Booking /></MainLayout></ProtectedRoute>} />
          <Route path="/ticket/:bookingId" element={<ProtectedRoute><MainLayout><Ticket /></MainLayout></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MainLayout><MyBookings /></MainLayout></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><MainLayout><Favorites /></MainLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>} />
          <Route path="/unauthorized" element={<MainLayout><div className="p-12 text-center text-red-600 font-bold text-2xl">Unauthorized Access Restricted!</div></MainLayout>} />

          {/* Organizer Dashboard */}
          <Route path="/organizer/dashboard" element={<OrganizerRoute><DashboardLayout><OrganizerDashboard /></DashboardLayout></OrganizerRoute>} />
          <Route path="/organizer/add-temple" element={<OrganizerRoute><DashboardLayout><AddTemple /></DashboardLayout></OrganizerRoute>} />
          <Route path="/organizer/create-slot" element={<OrganizerRoute><DashboardLayout><CreateSlot /></DashboardLayout></OrganizerRoute>} />
          <Route path="/organizer/manage-temple" element={<OrganizerRoute><DashboardLayout><ManageTemple /></DashboardLayout></OrganizerRoute>} />
          <Route path="/organizer/my-slots" element={<OrganizerRoute><DashboardLayout><MySlots /></DashboardLayout></OrganizerRoute>} />
          <Route path="/organizer/profile" element={<OrganizerRoute><DashboardLayout><OrganizerProfile /></DashboardLayout></OrganizerRoute>} />

          {/* Admin Dashboard */}
          <Route path="/admin/dashboard" element={<AdminRoute><DashboardLayout><AdminDashboard /></DashboardLayout></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><DashboardLayout><ManageUsers /></DashboardLayout></AdminRoute>} />
          <Route path="/admin/temples" element={<AdminRoute><DashboardLayout><ApproveTemples /></DashboardLayout></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><DashboardLayout><FinancialAnalytics /></DashboardLayout></AdminRoute>} />
          <Route path="/admin/bookings" element={<AdminRoute><DashboardLayout><MasterBookings /></DashboardLayout></AdminRoute>} />

          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* 🌟 ओटीपी रिकवरी पेज राउट */}
          <Route path="/prasad-receipt/:id" element={<PrasadReceipt />} />
          <Route path="/about" element={<About />} />
          <Route path="/organizer/manage-temples" element={<OrganizerManageTemples />} />
        

          {/* Fallback Not Found Route Catch-All */}
          <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
        
        </Routes>
      </AuthProvider>
    </Router>
  );
}
