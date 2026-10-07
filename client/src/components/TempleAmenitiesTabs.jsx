import React from 'react';
import { toast } from 'react-hot-toast';

export default function TempleAmenitiesTabs({ activeTab, setActiveTab }) {
  return (
    <div className="w-full">
      {/* 🧭 Dynamic Multi-Tab Content Engine Panel */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '16px' }}>
        <button type="button" onClick={() => setActiveTab('MAP')} style={{ padding: '10px 20px', fontSize: '13px', fontWeight: 'bold', border: 'none', borderBottom: activeTab === 'MAP' ? '3px solid #ea580c' : 'none', backgroundColor: 'transparent', color: activeTab === 'MAP' ? '#ea580c' : '#6b7280', cursor: 'pointer' }}>🗺️ Real Map Area</button>
        <button type="button" onClick={() => setActiveTab('NEARBY')} style={{ padding: '10px 20px', fontSize: '13px', fontWeight: 'bold', border: 'none', borderBottom: activeTab === 'NEARBY' ? '3px solid #ea580c' : 'none', backgroundColor: 'transparent', color: activeTab === 'NEARBY' ? '#ea580c' : '#6b7280', cursor: 'pointer' }}>🏨 Nearby Facilities</button>
        <button type="button" onClick={() => setActiveTab('WEATHER')} style={{ padding: '10px 20px', fontSize: '13px', fontWeight: 'bold', border: 'none', borderBottom: activeTab === 'WEATHER' ? '3px solid #ea580c' : 'none', backgroundColor: 'transparent', color: activeTab === 'WEATHER' ? '#ea580c' : '#6b7280', cursor: 'pointer' }}>🌦️ Local Weather</button>
      </div>

      {/* TAB VALUE 2: Nearby Infrastructure Ledger Grid (Hotels, Restaurants, Parking, ATMs, Hospitals) */}
      {activeTab === 'NEARBY' && (
        <div style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', display: 'grid', gap: '10px' }} className="animate-fade-in">
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0' }}><p style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b' }}>🅿️ Certified Parking Zones</p><p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Safe Counter parking available (150m from Gate 1)</p></div>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0' }}><p style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b' }}>🏨 Nearby Premium Hotels</p><p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Shrine Residency & Pilgrim Rest House Lodge</p></div>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0' }}><p style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b' }}>🍽️ Pure Satvik Restaurants</p><p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Bhojan Shala (Free distribution kitchen and cafeteria)</p></div>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0' }}><p style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b' }}>🏧 Bank ATM & Emergency Hospital</p><p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>SBI ATM Corridor & Red Cross First-Aid Medical Center</p></div>
        </div>
      )}

      {/* TAB VALUE 3: Weather Tracking Node Widget Component */}
      {activeTab === 'WEATHER' && (
        <div style={{ backgroundColor: '#f0fdfa', border: '1px solid #ccfbf1', padding: '20px', borderRadius: '24px', display: 'flex', alignItems: 'center', justify: 'space-between' }} className="animate-fade-in">
          <div>
            <p style={{ fontSize: '12px', color: '#0d9488', fontWeight: 'bold', textTransform: 'uppercase' }}>🌦️ Climate Status</p>
            <h4 style={{ fontSize: '24px', fontWeight: '900', color: '#115e59', marginTop: '4px' }}>28°C Clear Sky</h4>
            <p style={{ fontSize: '11px', color: '#14b8a6', marginTop: '2px' }}>Perfect auspicious wind currents for open-air holy rituals</p>
          </div>
          <div style={{ fontSize: '48px' }}>☀️</div>
        </div>
      )}
    </div>
  );
}
