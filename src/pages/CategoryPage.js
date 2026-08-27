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

  return (
    <div style={{ fontFamily: "'Work Sans', sans-serif" }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 24px 0' }}>
        <Link to="/" style={{ color: '#354f88', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>← Zurück zur Startseite</Link>
      </div>

      {/* Kategorie-Kopfbereich */}
      <div style={{
        background: 'radial-gradient(circle at 75% 30%, #4a63a3 0%, #354f88 40%, #12193a 100%)',
        padding: '56px 24px 60px', textAlign: 'center', color: '#fff', marginTop: 20,
      }}>
        <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#e79209', border: '1px solid #e79209', borderRadius: 20, padding: '5px 16px', marginBottom: 18 }}>
          Hauptthema
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0 0 14px' }}>{category.name}</h1>
        <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: '15.5px', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
          Alle Beiträge zu diesem Thema — sortiert nach den neuesten Einträgen.
        </p>
      </div>

      {/* Unterthemen-Grid */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 90px' }}>
        <div style={{ fontSize: 13, color: '#999', marginBottom: 24, textAlign: 'center' }}>
          {boxes.length} Beiträge in dieser Kategorie
        </div>

        {boxes.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999' }}>Noch keine Beiträge in dieser Kategorie.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {boxes.map((box) => (
              <div key={box.id} onClick={() => navigate(`/beitrag/${box.id}`)}
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
                    {category.name}
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
          </div>
        )}
      </div>
    </div>
  );
}
