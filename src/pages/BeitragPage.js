import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function BeitragPage() {
  const { id } = useParams();
  const [box, setBox] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setNotFound(false);
      const { data, error } = await supabase
        .from('content').select('*').eq('id', id).maybeSingle();
      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setBox(data);
      const { data: cat } = await supabase
        .from('categories').select('name').eq('id', data.category_index).maybeSingle();
      setCategoryName(cat?.name || '');
      setLoading(false);
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

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

  if (notFound || !box) {
    return (
      <div style={{ textAlign: 'center', padding: 80, fontFamily: "'Work Sans', sans-serif" }}>
        <h2 style={{ color: '#354f88' }}>Nicht gefunden</h2>
        <Link to="/#alle-themen" style={{ color: '#354f88' }}>← Zurück zur Übersicht</Link>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Work Sans', sans-serif", color: '#333', maxWidth: 760, margin: '0 auto', padding: '48px 24px 90px' }}>
      <Link to="/#alle-themen" style={{ color: '#354f88', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>← Zurück zur Übersicht</Link>

      {/* Etiketler */}
      <div style={{ display: 'flex', gap: 8, margin: '22px 0 14px' }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#e79209', border: '1px solid #e79209', borderRadius: 20, padding: '4px 12px' }}>
          {formatDate(box.created_at)}
        </span>
        {categoryName && (
          <span style={{ fontSize: 12, fontWeight: 700, color: '#354f88', border: '1px solid #354f88', borderRadius: 20, padding: '4px 12px' }}>
            {categoryName}
          </span>
        )}
      </div>

      {/* 1. Titel */}
      <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#354f88', margin: '0 0 32px', lineHeight: 1.25 }}>
        {box.title || 'Ohne Titel'}
      </h1>

      {/* 2. Video */}
      <div style={{ marginBottom: 56 }}>
        <div style={{ background: '#111', borderRadius: 14, overflow: 'hidden', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {box.video_url
            ? <video src={box.video_url} controls style={{ width: '100%', height: '100%' }} />
            : (
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#354f88', fontSize: 22 }}>▶</div>
            )}
        </div>
        <div style={{ fontSize: 14, color: '#888', marginTop: 10, textAlign: 'center' }}>{box.video_title || 'Video kommt bald'}</div>
      </div>

      {/* 3. Blogbeitrag */}
      {box.short_desc && (
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#e79209', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10 }}>Blogbeitrag</div>
          <p style={{ fontSize: 16, lineHeight: 1.85, color: '#333', whiteSpace: 'pre-wrap' }}>{box.short_desc}</p>
        </div>
      )}

      {/* 4. Downloadbereich */}
      <div style={{ background: 'linear-gradient(135deg, #354f88 0%, #12193a 100%)', borderRadius: 20, padding: '44px 36px', textAlign: 'center', color: '#fff' }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 18px' }}>📄</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>{box.pdf_title || 'Noch kein PDF-Titel hinzugefügt.'}</div>
        <div style={{ fontSize: '14.5px', color: 'rgba(255,255,255,0.75)', marginBottom: 26, maxWidth: 420, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
          {box.pdf_desc || 'Noch keine PDF-Beschreibung hinzugefügt.'}
        </div>
        {box.pdf_url ? (
          <a href={box.pdf_url} target="_blank" rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 30px', borderRadius: 8, background: '#e79209', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
            ⬇ PDF herunterladen
          </a>
        ) : (
          <button disabled
            style={{ padding: '14px 30px', borderRadius: 8, background: 'rgba(255,255,255,0.25)', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'not-allowed' }}>
            PDF noch nicht verfügbar
          </button>
        )}
      </div>
    </div>
  );
}
