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
        padding: '80px 40px 0',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 0%, #4a63a3 0%, #354f88 45%, #12193a 100%)',
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 640, margin: '0 auto' }}>
          <h1 style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 52, lineHeight: 1.1, margin: '0 0 22px' }}>
            <span style={{ color: '#e79209', fontWeight: 500, display: 'block' }}>Koran verstehen</span>
            <span style={{ color: '#fff', fontWeight: 800, display: 'block' }}>leicht gemacht</span>
          </h1>
          <p style={{ fontFamily: "'Work Sans', sans-serif", color: 'rgba(255,255,255,0.8)', fontSize: 16, lineHeight: 1.65, marginBottom: 30, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
            Entdecke den Koran auf eine Art, die zu dir passt — klar, zugänglich und ohne Vorwissen. Fünf Themenbereiche, unzählige Beiträge.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 56 }}>
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

        {/* Büyük görsel + yüzen rozetler */}
        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 820, margin: '0 auto' }}>
          <div style={{ position: 'absolute', inset: -14, borderRadius: 32, border: '1.5px solid rgba(231,146,9,0.4)' }} />
          <div style={{
            width: '100%', aspectRatio: '16/8', borderRadius: 24, overflow: 'hidden',
            backgroundImage: 'url(/hero-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 40%',
            border: '6px solid rgba(255,255,255,0.12)', boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
          }} />
          <div style={{ position: 'absolute', top: -24, left: 24, background: '#fff', borderRadius: 14, padding: '12px 16px', boxShadow: '0 10px 28px rgba(18,25,58,0.25)', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', fontFamily: "'Work Sans', sans-serif" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#354f88', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, flexShrink: 0 }}>📚</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#354f88' }}>5 Themen</div>
              <div style={{ fontSize: 11, color: '#888' }}>Gott, Mensch, u.v.m.</div>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: -24, right: 24, background: '#fff', borderRadius: 14, padding: '12px 16px', boxShadow: '0 10px 28px rgba(18,25,58,0.25)', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', fontFamily: "'Work Sans', sans-serif" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: '#354f88', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, flexShrink: 0 }}>✨</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#354f88' }}>Neue Beiträge</div>
              <div style={{ fontSize: 11, color: '#888' }}>jede Woche</div>
            </div>
          </div>
        </div>
        <div style={{ height: 70 }} />
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {boxes.map((box) => (
              <div key={box.id} onClick={() => handleBoxClick(box)}
                style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 4px 18px rgba(18,25,58,0.08)', transition: 'transform .15s ease, box-shadow .15s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(18,25,58,0.14)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(18,25,58,0.08)'; }}>
                <div style={{
                  height: 190, position: 'relative',
                  backgroundImage: box.image_url ? `url(${box.image_url})` : 'none',
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  backgroundColor: '#2b3a63',
                }}>
                  <span style={{ position: 'absolute', top: 14, left: 14, background: '#e79209', color: '#fff', fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.03em' }}>
                    {categoryName(box.category_index)}
                  </span>
                </div>
                <div style={{ padding: '22px 22px 24px' }}>
                  <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>{formatDate(box.created_at)}</div>
                  <div style={{ fontSize: 19, fontWeight: 700, color: '#354f88', marginBottom: 10, lineHeight: 1.3 }}>{box.title || '(başlıksız)'}</div>
                  <p style={{ fontSize: 14, color: '#777', lineHeight: 1.6, marginBottom: 18 }}>
                    {(box.short_desc || '').slice(0, 90)}{box.short_desc && box.short_desc.length > 90 ? '…' : ''}
                  </p>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 700, color: '#354f88', border: '1.5px solid #354f88', borderRadius: 8, padding: '9px 18px' }}>
                    Mehr erfahren →
                  </span>
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
