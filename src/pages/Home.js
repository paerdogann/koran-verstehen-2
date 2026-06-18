import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
const categories = ['Gott', 'Mensch', 'Handlung', 'Erkenntnis', 'Jenseits'];

const slideColors = [
  'linear-gradient(135deg, #1e3a6e 0%, #354f88 60%, #446296 100%)',
  'linear-gradient(135deg, #2d5016 0%, #3a6b1e 60%, #4a8a28 100%)',
  'linear-gradient(135deg, #7a4a00 0%, #a86400 60%, #c87800 100%)',
  'linear-gradient(135deg, #1a4a4a 0%, #226666 60%, #2a7a7a 100%)',
  'linear-gradient(135deg, #4a1a6e 0%, #6a2a9a 60%, #7a3aaa 100%)',
];

const slideDesc = [
  'Allah\'ın sözünün Hz. Muhammed\'e 23 yıl boyunca nasıl iletildiğini keşfedin.',
  'Kuran\'daki Allah\'ı yücelten ayetler ve dua. Allah\'ın 99 ismi ve özelliklerini inceleyin.',
  'İnsanın yeryüzündeki halifesi rolü ve sorumluluğu. Sosyal adalet ve çevre bilinci.',
  'Kuran\'da adalet, eşitlik ve etik ilkeler. Tüm insanlara karşı adil davranmanın önemi.',
  'Yeni bir konuyu keşfedin. Bu alan yakında içeriklerle doldurulacak.',
];

const subCategories = {
  0: ['Gott 1', 'Gott 2', 'Gott 3', 'Gott 4', 'Gott 5'],
  1: ['Mensch 1', 'Mensch 2', 'Mensch 3', 'Mensch 4', 'Mensch 5'],
  2: ['Mensch 1', 'Mensch 2', 'Mensch 3', 'Mensch 4', 'Mensch 5'],
  3: ['Ethik 1', 'Ethik 2', 'Ethik 3', 'Ethik 4', 'Ethik 5'],
  4: ['Thema 1', 'Thema 2', 'Thema 3', 'Thema 4', 'Thema 5'],
};

const subContent = {
  0: { 0: 'Der Koran gilt im Islam als das direkte Wort Gottes.', 1: 'Die Gott erfolgte über 23 Jahre.', 2: 'Viele Verse sind historisch kontextualisiert.', 3: 'Mündliche Überlieferung war zentral.', 4: 'Standardisierung unter Kalif Uthman.' },
  1: { 0: 'Das Mensch umfasst Verse über Gottes Eigenschaften.', 1: 'Die 99 Namen Gottes beschreiben seine Attribute.', 2: 'Dankbarkeit ist ein zentrales Thema.', 3: 'Das Gebet ist die wichtigste Form des Menschs.', 4: 'Verse betonen die Einheit Gottes.' },
  2: { 0: 'Der Mensch trägt Verantwortung als Stellvertreter.', 1: 'Soziale Verantwortung ist eine islamische Pflicht.', 2: 'Familie hat einen hohen Stellenwert.', 3: 'Umweltverantwortung ist Teil des Auftrags.', 4: 'Rechenschaft motiviert ethisches Handeln.' },
  3: { 0: 'Gerechtigkeit ist eine islamische Pflicht.', 1: 'Der Koran verbietet Ungerechtigkeit.', 2: 'Zakat ist eine der fünf Säulen.', 3: 'Gleichheit aller Menschen ist ein Grundprinzip.', 4: 'Frieden wird als höchster Wert dargestellt.' },
  4: { 0: 'Inhalt kommt bald.', 1: 'Inhalt kommt bald.', 2: 'Inhalt kommt bald.', 3: 'Inhalt kommt bald.', 4: 'Inhalt kommt bald.' },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeSub, setActiveSub] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [curSlide, setCurSlide] = useState(0);
  const [contentData, setContentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const wirRef = useRef(null);
  const themenRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurSlide(p => (p + 1) % categories.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('content').select('*')
        .eq('category_index', activeTab)
        .eq('sub_index', activeSub)
        .single();
      if (!error) setContentData(data);
      setLoading(false);
    };
    fetchContent();
  }, [activeTab, activeSub]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
  };

  const handleTabChange = (i) => {
    setActiveTab(i);
    setActiveSub(0);
  };

  const goToSlide = (i) => {
    setCurSlide(i);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurSlide(p => (p + 1) % categories.length), 4000);
  };

  const scrollToWir = () => wirRef.current?.scrollIntoView({ behavior: 'smooth' });

  const handleSlideClick = (i) => {
    setActiveTab(i);
    setActiveSub(0);
    setTimeout(() => {
      themenRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div style={{ fontFamily: "'Playfair Display', serif", color: '#354f88' }}>



      {/* Hero Slider - sadece aktif slayt tıklanabilir */}
      <div style={{ position: 'relative', height: 420, overflow: 'hidden' }}>
        {categories.map((cat, i) => (
          <div key={i}
            onClick={() => curSlide === i && handleSlideClick(i)}
            style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%',
              background: slideColors[i],
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', padding: '40px 48px',
              opacity: curSlide === i ? 1 : 0,
              transition: 'opacity 0.6s ease',
              cursor: curSlide === i ? 'pointer' : 'default',
              pointerEvents: curSlide === i ? 'auto' : 'none',
            }}>

            <h2 style={{ fontSize: 32, fontWeight: 500, color: 'white', lineHeight: 1.3, marginBottom: 12 }}>{cat}</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, maxWidth: 500, marginBottom: 24 }}>{slideDesc[i]}</p>
            <button onClick={(e) => { e.stopPropagation(); handleSlideClick(i); }}
              style={{ padding: '10px 28px', background: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#354f88' }}>
              Konuya Git →
            </button>
            <div style={{ position: 'absolute', bottom: 16, right: 20, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{i + 1} / {categories.length}</div>
          </div>
        ))}
      </div>

      {/* Noktalar */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '12px', background: 'white', borderBottom: '1px solid #e0e0e0' }}>
        {categories.map((_, i) => (
          <button key={i} onClick={() => goToSlide(i)}
            style={{ width: curSlide === i ? 24 : 8, height: 8, borderRadius: curSlide === i ? 4 : '50%', background: curSlide === i ? '#354f88' : '#ddd', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
        ))}
      </div>

      {/* Wer sind wir */}
      <div ref={wirRef} style={{ padding: '48px 32px', borderBottom: '1px solid #e0e0e0' }}>
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

      {/* Themen */}
      <div ref={themenRef} style={{ margin: '24px 32px', background: '#f5f5f5', borderRadius: 12, padding: '12px 16px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {categories.map((cat, i) => (
            <button key={i} onClick={() => handleTabChange(i)}
              style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: activeTab === i ? 'white' : 'transparent', fontWeight: activeTab === i ? 700 : 400, color: '#354f88', cursor: 'pointer', fontFamily: 'inherit', boxShadow: activeTab === i ? '0 2px 6px rgba(0,0,0,0.1)' : 'none' }}>
              {cat}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {subCategories[activeTab].map((sub, i) => (
            <button key={i} onClick={() => setActiveSub(i)}
              style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid #354f88', background: activeSub === i ? '#354f88' : 'white', color: activeSub === i ? 'white' : '#354f88', cursor: 'pointer', fontFamily: 'inherit' }}>
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* İçerik */}
      <div style={{ margin: '32px 32px' }}>
        <h2 style={{ textAlign: 'center', color: '#354f88', marginBottom: 8 }}>{categories[activeTab]}</h2>
        <h3 style={{ textAlign: 'center', color: '#e79209', marginBottom: 16 }}>{subCategories[activeTab][activeSub]}</h3>
        <p style={{ lineHeight: 1.8, color: '#333' }}>{subContent[activeTab][activeSub]}</p>
      </div>

      {/* Video */}
      <div style={{ margin: '32px 32px', background: '#f5f5f5', borderRadius: 12, padding: 24 }}>
        <h2 style={{ textAlign: 'center', color: '#354f88', marginBottom: 20 }}>Video Beiträge</h2>
        {loading ? <p style={{ textAlign: 'center', color: '#999' }}>Laden...</p> : (
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ flex: 1, background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ background: '#ddd', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {contentData?.video_url ? <video src={contentData.video_url} controls style={{ width: '100%', height: '100%' }} /> : <span style={{ fontSize: 40, color: '#354f88' }}>▶</span>}
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ color: '#9ebb9d', fontWeight: 700, marginBottom: 4 }}>{contentData?.video_title || 'Video kommt bald'}</div>
                <p style={{ color: '#333', fontSize: 14 }}>{contentData?.video_desc || ''}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PDF */}
      <div style={{ margin: '48px 32px', textAlign: 'center' }}>
        <h2 style={{ color: '#354f88', marginBottom: 8 }}>Den Koran</h2>
        <h2 style={{ color: '#354f88', marginBottom: 16 }}>besser verstehen</h2>
        <p style={{ color: '#555', marginBottom: 24 }}>Laden Sie unsere kostenlose PDF herunter und erhalten Sie einen klaren Einstieg in die wichtigsten Grundlagen, Begriffe und Zusammenhänge des Korans.</p>
        {contentData?.pdf_url ? (
          <a href={contentData.pdf_url} target="_blank" rel="noreferrer"
            style={{ padding: '14px 32px', background: '#354f88', color: 'white', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer', textDecoration: 'none' }}>
            {contentData.pdf_title || 'PDF herunterladen'}
          </a>
        ) : (
          <button style={{ padding: '14px 32px', background: '#354f88', color: 'white', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer' }}>
            Kostenlose PDF herunterladen
          </button>
            )}
      </div>
    </div>
    );
  }
