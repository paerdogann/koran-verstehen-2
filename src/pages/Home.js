import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const wirRef = useRef(null);
  const themenRef = useRef(null);

  const [themenCategories, setThemenCategories] = useState([]);
  const [filterCategoryId, setFilterCategoryId] = useState(null); // null = Alle anzeigen
  const [boxes, setBoxes] = useState([]);
  const [boxesLoading, setBoxesLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      const { data, error } = await supabase
        .from('categories').select('*').order('sort_order', { ascending: true });
      if (!error && data) setThemenCategories(data);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadBoxes = async () => {
      setBoxesLoading(true);
      let query = supabase.from('content').select('*').order('created_at', { ascending: false });
      if (filterCategoryId !== null) {
        query = query.eq('category_index', filterCategoryId);
      }
      const { data, error } = await query;
      if (!error && data) setBoxes(data);
      setBoxesLoading(false);
    };
    loadBoxes();
  }, [filterCategoryId]);

  const scrollToThemen = () => themenRef.current?.scrollIntoView({ behavior: 'smooth' });

  const handleBoxClick = (box) => {
    navigate(`/beitrag/${box.id}`);
  };

  const formatDate = (d) => {
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return '';
    }
  };

  const categoryName = (categoryIndex) => themenCategories.find(c => c.id === categoryIndex)?.name || '';

  return (
    <div style={{ color: '#354f88' }}>

      {/* ---------- HERO ---------- */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '90px 60px 100px',
        display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap',
        backgroundImage: 'linear-gradient(120deg, rgba(18,25,58,0.62) 0%, rgba(53,79,136,0.48) 45%, rgba(18,25,58,0.32) 100%), url(/hero-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 520, flex: 1, minWidth: 320 }}>
          <h1 style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 52, lineHeight: 1.1, margin: '0 0 22px' }}>
            <span style={{ color: '#e79209', fontWeight: 500, display: 'block' }}>Koran verstehen</span>
            <span style={{ color: '#fff', fontWeight: 800, display: 'block' }}>leicht gemacht</span>
          </h1>
          <p style={{ fontFamily: "'Work Sans', sans-serif", color: 'rgba(255,255,255,0.8)', fontSize: 16, lineHeight: 1.65, marginBottom: 30, maxWidth: 440 }}>
            Entdecke den Koran auf eine Art, die zu dir passt — klar, zugänglich und ohne Vorwissen. Fünf Themenbereiche, unzählige Beiträge.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button onClick={scrollToThemen}
              style={{ fontFamily: "'Work Sans', sans-serif", padding: '14px 26px', borderRadius: 8, fontSize: 15, fontWeight: 600, border: '1.5px solid #e79209', color: '#e79209', background: 'transparent', cursor: 'pointer' }}>
              Jetzt entdecken →
            </button>
            <button onClick={scrollToThemen}
              style={{ fontFamily: "'Work Sans', sans-serif", padding: '14px 26px', borderRadius: 8, fontSize: 15, fontWeight: 600, border: 'none', color: '#fff', background: '#e79209', cursor: 'pointer' }}>
              Alle Themen ansehen
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Wer sind wir (değişmedi) ---------- */}
      <div id="wer-sind-wir" ref={wirRef} style={{ padding: '48px 32px', borderBottom: '1px solid #e0e0e0', fontFamily: "'Playfair Display', serif" }}>
        <h2 style={{ fontSize: 22, fontWeight: 500, textAlign: 'center', color: '#354f88', marginBottom: 8 }}>Wer sind wir?</h2>
        <p style={{ textAlign: 'center', color: '#888', fontSize: 13, marginBottom: 28 }}>Her kart bir pencere — tıklayın ve daha fazlasını keşfedin</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { title: 'Das Seminar', desc: 'PH Karlsruhe bünyesinde İslam İlahiyatı ve Din Eğitimi alanında yürütülen akademik proje.', bg: '#e8edf5', iconBg: '#354f88', icon: '🏫' },
            { title: 'Das Team', desc: 'Dr. Ibrahim Aslandur liderliğinde öğrenci ve akademisyenlerden oluşan bir ekip.', bg: '#f0f4ee', iconBg: '#9ebb9d', icon: '👥' },
            { title: 'Unser Ziel', desc: 'Kuran\'ı her kesimden insana anlaşılır ve erişilebilir kılmak — ön bilgi gerekmez.', bg: '#fef6e4', iconBg: '#e79209', icon: '🎯' },
          ].map((card, i) => (
            <div key={i} onClick={() => window.open('/about', '_blank')}
              style={{ border: '1px solid #e0e0e0', borderRadius: 12, overflow: 'hidden', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#354f88'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e0e0e0'}>
              <div style={{ height: 140, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{card.icon}</div>
              </div>
              <div style={{ padding: '14px 16px', background: 'white' }}>
                <h3 style={{ fontSize: 14, fontWeight: 500, color: '#354f88', marginBottom: 6 }}>{card.title}</h3>
                <p style={{ fontSize: 12, color: '#777', lineHeight: 1.6, marginBottom: 10 }}>{card.desc}</p>
                <div style={{ fontSize: 12, color: '#354f88' }}>Mehr erfahren →</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Alle Themen — yeni kart tasarımı ---------- */}
      <div ref={themenRef} id="alle-themen" style={{ maxWidth: 1080, margin: '0 auto', padding: '70px 24px 90px', fontFamily: "'Work Sans', sans-serif" }}>
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 44px' }}>
          <h2 style={{ color: '#354f88', fontSize: 34, margin: '0 0 14px', fontWeight: 800 }}>Alle Themen</h2>
          <p style={{ color: '#777', fontSize: 15, lineHeight: 1.7 }}>Durchstöbere alle Beiträge — sortiert nach den neuesten Einträgen, gefiltert nach deinem Interesse.</p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
          <button onClick={() => setFilterCategoryId(null)}
            style={{ padding: '9px 20px', borderRadius: 20, border: '1.5px solid #354f88', background: filterCategoryId === null ? '#354f88' : '#fff', color: filterCategoryId === null ? '#fff' : '#354f88', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600 }}>
            Alle anzeigen
          </button>
          {themenCategories.map((cat) => (
            <button key={cat.id} onClick={() => setFilterCategoryId(cat.id)}
              style={{ padding: '9px 20px', borderRadius: 20, border: '1.5px solid #354f88', background: filterCategoryId === cat.id ? '#354f88' : '#fff', color: filterCategoryId === cat.id ? '#fff' : '#354f88', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600 }}>
              {cat.name}
            </button>
          ))}
        </div>

        {boxesLoading ? (
          <p style={{ textAlign: 'center', color: '#999' }}>Laden...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26 }}>
            {boxes.map((box) => (
              <div key={box.id} onClick={() => handleBoxClick(box)}
                style={{
                  position: 'relative', borderRadius: 16, overflow: 'hidden', aspectRatio: '4/5', cursor: 'pointer',
                  backgroundImage: box.image_url ? `url(${box.image_url})` : 'none',
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  backgroundColor: '#2b3a63',
                }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(18,25,58,0.92) 0%, rgba(18,25,58,0.35) 45%, rgba(18,25,58,0.05) 70%)' }} />
                <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 2, width: 38, height: 38, borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, background: 'rgba(255,255,255,0.08)' }}>
                  🖼️
                </div>
                <div style={{ position: 'absolute', left: 20, right: 20, bottom: 20, zIndex: 2 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#e79209', marginBottom: 8 }}>{formatDate(box.created_at)} · {categoryName(box.category_index)}</div>
                  <div style={{ fontSize: 23, fontWeight: 700, color: '#fff', lineHeight: 1.25 }}>{box.title || '(başlıksız)'}</div>
                </div>
              </div>
            ))}
            {!boxesLoading && boxes.length === 0 && (
              <p style={{ textAlign: 'center', color: '#999', gridColumn: '1 / -1' }}>Bu kategoride henüz içerik yok.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
