import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) { navigate('/login'); return null; }
  return (
    <div style={{ background:'linear-gradient(135deg,#f7f7f4,#e8f0e8)', minHeight:'calc(100vh - 64px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'white', borderRadius:20, boxShadow:'0 4px 24px rgba(53,79,136,.12)', padding:'48px 44px', width:'100%', maxWidth:380, textAlign:'center' }}>
        <div style={{ width:80, height:80, background:'#354f88', color:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Playfair Display,serif', fontSize:'2rem', fontWeight:700, margin:'0 auto 18px' }}>{user.email[0].toUpperCase()}</div>
        <h1 style={{ fontFamily:'Playfair Display,serif', color:'#354f88', fontSize:'1.5rem', marginBottom:6 }}>{user.email}</h1>
        <p style={{ color:'#5a6378', fontSize:'0.88rem', marginBottom:28 }}>Eingeloggt</p>
        <button onClick={() => { logout(); navigate('/'); }} style={{ width:'100%', padding:12, background:'transparent', border:'1.5px solid #e0cece', borderRadius:10, color:'#c0392b', fontFamily:'inherit', fontSize:'0.95rem', cursor:'pointer' }}>🚪 Abmelden</button>
      </div>
    </div>
  );
}
