import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setNotFound(false);
      const { data: cat, error: catError } = await supabase
        .from('categories').select('*').eq('id', categoryId).maybeSingle();
      if (catError || !cat) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setCategory(cat);
      const { data: boxData } = await supabase
        .from('content').select('*').eq('category_index', categoryId).order('created_at', { ascending: false });
      setBoxes(boxData || []);
      setLoading(false);
    };
    load();
    window.scrollTo(0, 0);
  }, [categoryId]);

  const formatDate = (d) => {
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return '';
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 80, fontFamily: "'Work Sans', sans-serif", color: '#354f88' }}>Laden...</div>;
  }

  if (notFound || !category) {
    return (
      <div style={{ textAlign: 'center', padding: 80, fontFamily: "'Work Sans', sans-serif" }}>
        <h2 style={{ color: '#354f88' }}>Nicht gefunden</h2>
        <Link to="/" style={{ color: '#354f88' }}>← Zurück zur Startseite</Link>
      </div>
    );
  }

  const featured = boxes.length > 0 ? boxes[0] : null;
  const rest = boxes.length > 1 ? boxes.slice(1) : [];

  return (
    <div style={{ fontFamily: "'Work Sans', sans-serif", background: '#f7f8fb' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 24px 0' }}>
        <Link to="/" style={{ color: '#354f88', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>← Zurück zur Startseite</Link>
      </div>

      {/* Kategori etiketi + başlık */}
      <div style={{ textAlign: 'center', padding: '28px 24px 0' }}>
        <span style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#e79209', border: '1px solid #e79209', borderRadius: 20, padding: '5px 16px' }}>
          Hauptthema
        </span>
      </div>
      <h1 style={{ textAlign: 'center', color: '#354f88', fontSize: '2.1rem', fontWeight: 800, margin: '14px 0 40px' }}>{category.name}</h1>

      {boxes.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', padding: '0 24px 90px' }}>Noch keine Beiträge in dieser Kategorie.</p>
      ) : (
        <>
          {/* Öne çıkan makale (en yeni) */}
          {featured && (
            <div style={{ maxWidth: 1080, margin: '0 auto 60px', padding: '0 24px' }}>
              <div onClick={() => navigate(`/beitrag/${featured.id}`)}
                style={{
                  position: 'relative', borderRadius: 22, overflow: 'hidden', cursor: 'pointer', height: 420,
                  backgroundImage: featured.image_url ? `url(${featured.image_url})` : 'none',
                  backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#2b3a63',
                }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(18,25,58,0.92) 0%, rgba(18,25,58,0.55) 50%, rgba(18,25,58,0.15) 100%)' }} />
                <span style={{ position: 'absolute', top: 22, left: 22, zIndex: 2, background: '#e79209', color: '#fff', fontSize: 11, fontWeight: 700, padding: '6px 14px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                  Neuester Beitrag
                </span>
                <div style={{ position: 'absolute', left: 32, right: 32, bottom: 30, zIndex: 2, color: '#fff' }}>
                  <div style={{ fontSize: 12.5, opacity: 0.75, marginBottom: 10 }}>{formatDate(featured.created_at)}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, maxWidth: 620, lineHeight: 1.3 }}>{featured.title || '(başlıksız)'}</div>
                  {featured.short_desc && (
                    <div style={{ fontSize: 14.5, opacity: 0.85, maxWidth: 560, lineHeight: 1.6, marginBottom: 18 }}>
                      {featured.short_desc.slice(0, 140)}{featured.short_desc.length > 140 ? '…' : ''}
                    </div>
                  )}
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#354f88', fontWeight: 700, fontSize: 14, padding: '11px 22px', borderRadius: 8 }}>
                    Artikel lesen →
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Weitere Beiträge */}
          {rest.length > 0 && (
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px 90px' }}>
              <div style={{ color: '#354f88', fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Weitere Beiträge</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
                {rest.map((box) => (
                  <div key={box.id} onClick={() => navigate(`/beitrag/${box.id}`)}
                    style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 4px 18px rgba(18,25,58,0.08)', transition: 'transform .15s ease, box-shadow .15s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(18,25,58,0.14)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(18,25,58,0.08)'; }}>
                    <div style={{
                      aspectRatio: '1/1', position: 'relative',
                      backgroundImage: box.image_url ? `url(${box.image_url})` : 'none',
                      backgroundSize: 'cover', backgroundPosition: 'center',
                      backgroundColor: '#2b3a63',
                    }}>
                      <span style={{ position: 'absolute', top: 14, left: 14, background: '#e79209', color: '#fff', fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.03em' }}>
                        {category.name}
                      </span>
                    </div>
                    <div style={{ padding: 18 }}>
                      <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>{formatDate(box.created_at)}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#354f88', marginBottom: 8, lineHeight: 1.3 }}>{box.title || '(başlıksız)'}</div>
                      <p style={{ fontSize: 13, color: '#777', lineHeight: 1.55, marginBottom: 14 }}>
                        {(box.short_desc || '').slice(0, 60)}{box.short_desc && box.short_desc.length > 60 ? '…' : ''}
                      </p>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 700, color: '#354f88', border: '1.5px solid #354f88', borderRadius: 8, padding: '8px 14px' }}>
                        Mehr erfahren →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
