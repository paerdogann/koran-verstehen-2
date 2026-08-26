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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26 }}>
            {boxes.map((box) => (
              <div key={box.id} onClick={() => navigate(`/beitrag/${box.id}`)}
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
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#e79209', marginBottom: 8 }}>{formatDate(box.created_at)}</div>
                  <div style={{ fontSize: 23, fontWeight: 700, color: '#fff', lineHeight: 1.25 }}>{box.title || '(başlıksız)'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
