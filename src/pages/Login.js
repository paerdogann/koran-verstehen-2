import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) navigate('/'); else setError(result.error);
  };
  return (
    <div style={{ background:'linear-gradient(135deg,#f7f7f4,#e8f0e8)', minHeight:'calc(100vh - 64px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ maxWidth:420, width:'100%', background:'white', borderRadius:18, boxShadow:'0 4px 24px rgba(53,79,136,.12)', padding:'44px 40px' }}>
        <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'1.7rem', color:'#354f88', textAlign:'center', marginBottom:8 }}>Willkommen zurück</h1>
        <p style={{ textAlign:'center', color:'#5a6378', marginBottom:28, fontSize:'0.9rem' }}>Melden Sie sich an</p>
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <label style={{ fontSize:'0.85rem', fontWeight:600, marginBottom:6, display:'block' }}>E-Mail</label>
            <input style={{ width:'100%', padding:'10px 14px', border:'1.5px solid #9ebb9d', borderRadius:9, fontFamily:'inherit', fontSize:'0.92rem', background:'#f7f7f4', boxSizing:'border-box' }}
              type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} placeholder="ihre@email.de" required />
          </div>
          <div>
            <label style={{ fontSize:'0.85rem', fontWeight:600, marginBottom:6, display:'block' }}>Passwort</label>
            <input style={{ width:'100%', padding:'10px 14px', border:'1.5px solid #9ebb9d', borderRadius:9, fontFamily:'inherit', fontSize:'0.92rem', background:'#f7f7f4', boxSizing:'border-box' }}
              type="password" value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))} placeholder="••••••••" required />
          </div>
          {error && <div style={{ background:'#fff0f0', border:'1px solid #f5c6c6', borderRadius:8, padding:'10px 14px', color:'#c0392b', fontSize:'0.87rem' }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ padding:12, background:'#354f88', color:'white', border:'none', borderRadius:10, fontFamily:'inherit', fontSize:'1rem', cursor:'pointer' }}>
            {loading ? 'Wird angemeldet...' : 'Anmelden'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:20, fontSize:'0.88rem', color:'#5a6378' }}>
          Noch kein Konto? <Link to="/register" style={{ color:'#354f88', fontWeight:600 }}>Registrieren</Link>
        </p>
      </div>
    </div>
  );
}
