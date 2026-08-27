import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const categories = ['Gott', 'Mensch', 'Handlung', 'Erkenntnis', 'Jenseits'];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenu, setUserMenu] = useState(false);
  const [themenOpen, setThemenOpen] = useState(false);
  const themenRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (themenRef.current && !themenRef.current.contains(e.target)) {
        setThemenOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'white', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', height: 64, boxShadow: '0 2px 12px rgba(53,79,136,.07)' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <img src="/logo.png" alt="logo" style={{ height: 40 }} />
      </Link>

      {/* Orta navigasyon: Themen (açılır menü) / Beiträge / Über uns */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 36, fontFamily: "'Playfair Display', serif" }}>
        <div ref={themenRef} style={{ position: 'relative' }}>
          <span onClick={() => setThemenOpen(!themenOpen)}
            style={{ fontSize: '1rem', color: '#354f88', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            Themen
            <svg width="11" height="8" viewBox="0 0 12 8" fill="none"
              style={{ transform: themenOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>
              <path d="M1 1.5L6 6.5L11 1.5" stroke="#354f88" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          {themenOpen && (
            <div style={{ position: 'absolute', top: 34, left: '50%', transform: 'translateX(-50%)', background: 'white', border: '1px solid #eee', borderRadius: 14, boxShadow: '0 12px 28px rgba(53,79,136,.15)', padding: 10, minWidth: 200, zIndex: 200 }}>
              {categories.map((cat, i) => (
                <div key={cat} onClick={() => { setThemenOpen(false); navigate(`/themen/${i}`); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 9, cursor: 'pointer', fontSize: '0.95rem', color: '#354f88' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f7f7f4'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#e79209', flexShrink: 0 }} />
                  {cat}
                </div>
              ))}
            </div>
          )}
        </div>

        <span style={{ fontSize: '1rem', color: '#354f88', cursor: 'pointer' }}>
          Beiträge
        </span>

        <span style={{ fontSize: '1rem', color: '#354f88', cursor: 'pointer' }}>
          Über uns
        </span>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {user ? (
          <div style={{ position: 'relative' }} onMouseEnter={() => setUserMenu(true)} onMouseLeave={() => setUserMenu(false)}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f7f7f4', border: '1.5px solid #9ebb9d', borderRadius: 24, padding: '6px 14px 6px 6px', cursor: 'pointer', fontFamily: 'inherit' }}>
              <div style={{ width: 30, height: 30, background: '#354f88', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{user.email[0].toUpperCase()}</div>
              <span style={{ fontSize: '0.88rem' }}>{user.email.split('@')[0]}</span>
            </button>
            {userMenu && (
              <div style={{ position: 'absolute', right: 0, top: '100%', background: 'white', border: '1px solid #ddd', borderRadius: 12, boxShadow: '0 8px 32px rgba(53,79,136,.15)', minWidth: 180, padding: '8px 0', zIndex: 200 }}>
                <Link to="/profil" style={{ display: 'block', padding: '10px 20px', color: '#1e2533', textDecoration: 'none', fontSize: '0.9rem' }}>👤 Mein Profil</Link>
                <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid #eee' }} />
                <button onClick={() => { logout(); navigate('/'); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 20px', color: '#c0392b', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>🚪 Abmelden</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login"><button style={{ padding: '8px 20px', border: '1.5px solid #354f88', borderRadius: 8, background: 'transparent', color: '#354f88', cursor: 'pointer', fontFamily: 'inherit' }}>Anmelden</button></Link>
        )}
        <button onClick={() => {
          if (window.location.pathname === '/') {
            document.getElementById('wer-sind-wir')?.scrollIntoView({ behavior: 'smooth' });
          } else {
            navigate('/');
            setTimeout(() => {
              document.getElementById('wer-sind-wir')?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          }
        }} style={{ padding: '8px 20px', border: 'none', borderRadius: 8, background: '#354f88', color: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>
          Wer sind wir?
        </button>
      </div>
    </nav>
  );
}
