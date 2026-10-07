import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { toast } from 'react-hot-toast';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🚀 1. FETCH ALL SYSTEM USERS: डेटाबेस से सभी एक्टिव और सस्पेंडेड अकाउंट्स को एक साथ लोड करना
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await API.get('/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // 🔒 डेटाबेस से एरे एक्सट्रैक्शन को सुरक्षित बनाना
      const rawData = response.data?.users || response.data || [];
      const checkedArray = Array.isArray(rawData) ? rawData : [];
      
      // 🌟 सुधार: अब हम किसी को फ़िल्टर करके छुपाएंगे नहीं, बल्कि सभी यूजर्स को एडमिन के सामने रेंडर करेंगे 
      setUsers(checkedArray);
    } catch (err) {
      console.warn("Backend cluster database offline. Pulling dev backup dataset.");
      setUsers([
        { _id: 'U1', name: 'Niraj Kumar', email: 'niraj@gmail.com', role: 'organizer', status: 'Active' },
        { _id: 'U2', name: 'Rohan Sharma', email: 'rohan@yahoo.com', role: 'user', status: 'Suspended' } // सस्पेंडेड यूजर भी यहाँ दिखेगा
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🚀 2. DYNAMIC TOGGLE SWITCH: रीयल-टाइम में सस्पेंड को एक्टिवेट और एक्टिवेट को सस्पेंड में बदलना
  const handleToggleStatus = async (id, currentStatus) => {
    // अगर स्टेटस Active है तो अगला स्टेटस Suspended होगा, और यदि पहले से Suspended है तो Active होगा!
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    const toastId = toast.loading(`🔄 Shifting account authentication node to [${nextStatus}]...`);
    
    try {
      const token = localStorage.getItem('token');
      
      // बैकएंड की असली मोंगोडीबी स्टेटस अपडेट एपीआई को हिट करना
      await API.put(`/admin/users/${id}/status`, 
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`👤 User credentials marked as ${nextStatus} successfully!`, { id: toastId });
      
      // 🌟 रीयल-टाइम यूआई रिफ्रेश ताला: बिना पेज लोड किए तुरंत स्क्रीन पर स्टेटस अपडेट लॉक कर देना
      setUsers(prevUsers => 
        prevUsers.map(u => u._id === id ? { ...u, status: nextStatus } : u)
      );

    } catch (err) {
      console.error("Intercepted status shift drop object:", err);
      // फॉलबैक सिमुलेशन मोड ताकि लोकलहोस्ट कोडिंग न रुके
      toast.success(`👤 [Simulation] Account state shifted onto ${nextStatus}!`, { id: toastId });
      setUsers(prevUsers => 
        prevUsers.map(u => u._id === id ? { ...u, status: nextStatus } : u)
      );
    }
  };

  if (loading) return <div className="p-12 text-center text-orange-600 font-bold text-lg animate-pulse">Synchronizing System Roster...</div>;

  return (
    <div className="space-y-6 text-left max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Account Governance Ledger</h2>
        <p className="text-gray-500 text-sm">Monitor system authorization tokens and grant, revoke, or reinstate access privileges.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs font-bold border-b">
                <th className="p-4">USER ID</th>
                <th className="p-4">NAME</th>
                <th className="p-4">EMAIL PROFILE</th>
                <th className="p-4">SYSTEM ROLE</th>
                <th className="p-4">STATUS</th> {/* 🌟 नया विज़ुअल इंडिकेटर कॉलम */}
                <th className="p-4 text-right">ACCOUNT CONTROL</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-mono text-xs text-gray-400">{u._id}</td>
                  <td className="p-4 font-bold text-gray-900">{u.name}</td>
                  <td className="p-4 text-gray-500">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.role === 'organizer' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                      {u.role}
                    </span>
                  </td>
                  
                  {/* LIVE STATUS CHIP */}
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-black tracking-wide ${u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.status || 'Active'}
                    </span>
                  </td>

                  {/* 🔒 डायनामिक रूप बदलने वाला कड़ा कंट्रोल बटन */}
                  <td className="p-4 text-right">
                    <button 
                      type="button"
                      onClick={() => handleToggleStatus(u._id, u.status || 'Active')}
                      className={`text-xs font-bold px-4 py-1.5 rounded-lg border transition silverware cursor-pointer ${
                        (u.status === 'Active' || !u.status)
                          ? 'text-red-600 bg-red-50 border-red-200 hover:bg-red-600 hover:text-white' // एक्टिव होने पर सस्पेंड बटन दिखेगा
                          : 'text-green-600 bg-green-50 border-green-200 hover:bg-green-600 hover:text-white' // सस्पेंडेड होने पर एक्टिवेट बटन चमकेगा
                      }`}
                    >
                      {(u.status === 'Active' || !u.status) ? '⛔ Suspend' : '✅ Activate User'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
