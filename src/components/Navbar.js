import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenu, setUserMenu] = useState(false);
  return (
    <nav style={{ position:'sticky', top:0, zIndex:100, background:'white', borderBottom:'1px solid #ddd', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 40px', height:64, boxShadow:'0 2px 12px rgba(53,79,136,.07)' }}>
      <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
        <img src="/logo.png" alt="logo" style={{ height:40 }} />
      </Link>
      <div style={{ display:'flex', gap:10, alignItems:'center' }}>
        {user ? (
          <div style={{ position:'relative' }} onMouseEnter={() => setUserMenu(true)} onMouseLeave={() => setUserMenu(false)}>
            <button style={{ display:'flex', alignItems:'center', gap:8, background:'#f7f7f4', border:'1.5px solid #9ebb9d', borderRadius:24, padding:'6px 14px 6px 6px', cursor:'pointer', fontFamily:'inherit' }}>
              <div style={{ width:30, height:30, background:'#354f88', color:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>{user.email[0].toUpperCase()}</div>
              <span style={{ fontSize:'0.88rem' }}>{user.email.split('@')[0]}</span>
            </button>
            {userMenu && (
              <div style={{ position:'absolute', right:0, top:'100%', background:'white', border:'1px solid #ddd', borderRadius:12, boxShadow:'0 8px 32px rgba(53,79,136,.15)', minWidth:180, padding:'8px 0', zIndex:200 }}>
                <Link to="/profil" style={{ display:'block', padding:'10px 20px', color:'#1e2533', textDecoration:'none', fontSize:'0.9rem' }}>👤 Mein Profil</Link>
                <hr style={{ margin:'4px 0', border:'none', borderTop:'1px solid #eee' }}/>
                <button onClick={() => { logout(); navigate('/'); }} style={{ display:'block', width:'100%', textAlign:'left', padding:'10px 20px', color:'#c0392b', background:'none', border:'none', cursor:'pointer', fontSize:'0.9rem' }}>🚪 Abmelden</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login"><button style={{ padding:'8px 20px', border:'1.5px solid #354f88', borderRadius:8, background:'transparent', color:'#354f88', cursor:'pointer', fontFamily:'inherit' }}>Anmelden</button></Link>
            <Link to="/register"><button style={{ padding:'8px 20px', border:'none', borderRadius:8, background:'#354f88', color:'white', cursor:'pointer', fontFamily:'inherit' }}>Registrieren</button></Link>
          </>
        )}
      </div>
    </nav>
  );
}
