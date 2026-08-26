import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const ADMIN_EMAILS = ['elif@caredsk.de'];

export default function Admin() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const [activeBoxId, setActiveBoxId] = useState(null);

  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const [showAddBox, setShowAddBox] = useState(false);
  const [newBoxTitle, setNewBoxTitle] = useState('');
  const [newBoxImageFile, setNewBoxImageFile] = useState(null);

  const [form, setForm] = useState({
    title: '', short_desc: '', video_title: '', video_desc: '', video_url: '', pdf_title: '', pdf_desc: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // ---------- AUTH ----------
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && ADMIN_EMAILS.includes(session.user.email)) {
        setUser(session.user);
      }
    });
  }, []);

  const handleLogin = async () => {
    setLoginError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setLoginError('Giriş başarısız'); return; }
    if (!ADMIN_EMAILS.includes(data.user.email)) {
      setLoginError('Bu hesabın admin yetkisi yok');
      await supabase.auth.signOut();
      return;
    }
    setUser(data.user);
  };

  // ---------- CATEGORIES ----------
  useEffect(() => {
    if (!user) return;
    const loadCategories = async () => {
      const { data, error } = await supabase
        .from('categories').select('*').order('sort_order', { ascending: true });
      if (!error && data) {
        setCategories(data);
        if (data.length > 0) setActiveCategoryId(data[0].id);
      }
    };
    loadCategories();
  }, [user]);

  const handleAddCategory = async () => {
    const name = newCatName.trim();
    if (!name) return;
    const nextId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 0;
    const nextOrder = categories.length > 0 ? Math.max(...categories.map(c => c.sort_order)) + 1 : 0;
    const { data, error } = await supabase
      .from('categories').insert({ id: nextId, name, sort_order: nextOrder }).select();
    if (!error && data) {
      // Yeni kategoriye, diğer kategorilerle tutarlı olması için 5 hazır kutu oluştur
      const defaultBoxes = [0, 1, 2, 3, 4].map(i => ({
        category_index: nextId,
        sub_index: i,
        title: `${name} ${i + 1}`,
      }));
      await supabase.from('content').insert(defaultBoxes);

      setCategories([...categories, data[0]]);
      setActiveCategoryId(data[0].id);
      setNewCatName('');
      setShowAddCat(false);
    }
  };

  const handleDeleteCategory = async (cat) => {
    const ok = window.confirm(`"${cat.name}" ana başlığı ve içindeki tüm kutular silinsin mi? Bu işlem geri alınamaz.`);
    if (!ok) return;
    const { error: contentError } = await supabase.from('content').delete().eq('category_index', cat.id);
    if (contentError) {
      alert('Kutular silinemedi: ' + contentError.message);
      return;
    }
    const { error } = await supabase.from('categories').delete().eq('id', cat.id);
    if (error) {
      alert('Ana başlık silinemedi: ' + error.message);
      return;
    }
    const remaining = categories.filter(c => c.id !== cat.id);
    setCategories(remaining);
    if (activeCategoryId === cat.id) {
      setActiveCategoryId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // ---------- BOXES (content rows) ----------
  useEffect(() => {
    if (activeCategoryId === null) return;
    const loadBoxes = async () => {
      const { data, error } = await supabase
        .from('content').select('*')
        .eq('category_index', activeCategoryId)
        .order('sub_index', { ascending: true });
      if (!error && data) {
        setBoxes(data);
        setActiveBoxId(data.length > 0 ? data[0].id : null);
      }
    };
    loadBoxes();
  }, [activeCategoryId]);

  useEffect(() => {
    const box = boxes.find(b => b.id === activeBoxId);
    setMessage('');
    setImageFile(null);
    setPdfFile(null);
    if (box) {
      setForm({
        title: box.title || '',
        short_desc: box.short_desc || '',
        video_title: box.video_title || '',
        video_desc: box.video_desc || '',
        video_url: box.video_url || '',
        pdf_title: box.pdf_title || '',
        pdf_desc: box.pdf_desc || '',
      });
    }
  }, [activeBoxId, boxes]);

  const activeBox = boxes.find(b => b.id === activeBoxId);
  const activeCategory = categories.find(c => c.id === activeCategoryId);

  const handleAddBox = async () => {
    const title = newBoxTitle.trim();
    if (!title) return;
    const nextSub = boxes.length > 0 ? Math.max(...boxes.map(b => b.sub_index)) + 1 : 0;
    let image_url = null;
    try {
      if (newBoxImageFile) image_url = await uploadFile(newBoxImageFile, 'content-images');
    } catch (e) {
      setMessage('❌ Görsel yüklenemedi: ' + e.message);
      return;
    }
    const { data, error } = await supabase
      .from('content')
      .insert({ category_index: activeCategoryId, sub_index: nextSub, title, image_url })
      .select();
    if (!error && data) {
      setBoxes([...boxes, data[0]]);
      setActiveBoxId(data[0].id);
      setNewBoxTitle('');
      setNewBoxImageFile(null);
      setShowAddBox(false);
    } else if (error) {
      setMessage('❌ Hata: ' + error.message);
    }
  };

  const handleDeleteBox = async (box) => {
    const ok = window.confirm(`"${box.title || 'Bu kutu'}" silinsin mi? Bu işlem geri alınamaz.`);
    if (!ok) return;
    const { error } = await supabase.from('content').delete().eq('id', box.id);
    if (!error) {
      const remaining = boxes.filter(b => b.id !== box.id);
      setBoxes(remaining);
      if (activeBoxId === box.id) {
        setActiveBoxId(remaining.length > 0 ? remaining[0].id : null);
      }
    } else {
      alert('Silinemedi: ' + error.message);
    }
  };

  // ---------- FILE UPLOAD ----------
  const uploadFile = async (file, bucket) => {
    const ext = file.name.split('.').pop();
    const path = `${activeCategoryId}_${activeBoxId || 'new'}_${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };

  // ---------- SAVE ----------
  const handleSave = async () => {
    if (!activeBox) return;
    setSaving(true);
    setMessage('');
    try {
      let image_url = activeBox.image_url || null;
      if (imageFile) image_url = await uploadFile(imageFile, 'content-images');

      let pdf_url = activeBox.pdf_url || null;
      if (pdfFile) pdf_url = await uploadFile(pdfFile, 'pdfs');

      const payload = {
        title: form.title || null,
        short_desc: form.short_desc || null,
        video_title: form.video_title || null,
        video_desc: form.video_desc || null,
        video_url: form.video_url || null,
        pdf_title: form.pdf_title || null,
        pdf_desc: form.pdf_desc || null,
        image_url,
        pdf_url,
      };

      const { error } = await supabase.from('content').update(payload).eq('id', activeBox.id);
      if (error) throw error;

      setBoxes(boxes.map(b => b.id === activeBox.id ? { ...b, ...payload } : b));
      setMessage('✅ Kaydedildi!');
      setImageFile(null);
      setPdfFile(null);
    } catch (e) {
      setMessage('❌ Hata: ' + e.message);
    }
    setSaving(false);
  };

  // ---------- LOGIN SCREEN ----------
  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', fontFamily: 'sans-serif' }}>
      <div style={{ background: 'white', padding: 40, borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.1)', width: 360 }}>
        <h2 style={{ color: '#354f88', marginBottom: 24 }}>Admin Girişi</h2>
        {loginError && <div style={{ background: '#ffe0e0', color: '#c00', padding: 10, borderRadius: 6, marginBottom: 12 }}>{loginError}</div>}
        <input type="email" placeholder="E-Mail" value={email} onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', marginBottom: 12, border: '1px solid #ddd', borderRadius: 6, boxSizing: 'border-box' }} />
        <input type="password" placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', marginBottom: 20, border: '1px solid #ddd', borderRadius: 6, boxSizing: 'border-box' }} />
        <button onClick={handleLogin}
          style={{ width: '100%', padding: 12, background: '#354f88', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 15 }}>
          Giriş Yap
        </button>
      </div>
    </div>
  );

  // ---------- MAIN PANEL ----------
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 800, margin: '40px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ color: '#354f88' }}>Admin Paneli</h1>
        <button onClick={() => { supabase.auth.signOut(); setUser(null); }}
          style={{ padding: '8px 16px', background: '#eee', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          Çıkış
        </button>
      </div>

      <div style={{ background: '#f5f5f5', borderRadius: 12, padding: 16, marginBottom: 24 }}>

        {/* ANA BAŞLIKLAR */}
        <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.03em', marginBottom: 8 }}>
          Ana Başlıklar
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          {categories.map((cat) => (
            <div key={cat.id} style={{ position: 'relative' }}>
              <button onClick={() => setActiveCategoryId(cat.id)}
                style={{ padding: '8px 28px 8px 16px', borderRadius: 8, border: 'none', background: activeCategoryId === cat.id ? '#354f88' : 'white', color: activeCategoryId === cat.id ? 'white' : '#354f88', cursor: 'pointer' }}>
                {cat.name}
              </button>
              <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat); }} title="Sil"
                style={{ position: 'absolute', top: 4, right: 6, fontSize: 11, color: activeCategoryId === cat.id ? 'white' : '#999', background: 'transparent', border: 'none', cursor: 'pointer', padding: 2, opacity: 0.8 }}>
                ✕
              </button>
            </div>
          ))}
          <button onClick={() => setShowAddCat(!showAddCat)}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1.5px dashed #354f88', background: 'transparent', color: '#354f88', cursor: 'pointer', fontWeight: 600 }}>
            + Yeni Ana Başlık
          </button>
        </div>
        {showAddCat && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'white', border: '1.5px solid #354f88', borderRadius: 10, padding: 12, marginBottom: 8 }}>
            <input type="text" placeholder="Örn: Ahlak" value={newCatName} onChange={e => setNewCatName(e.target.value)}
              style={{ flex: 1, padding: 10, border: '1px solid #ddd', borderRadius: 6 }} />
            <button onClick={handleAddCategory}
              style={{ padding: '10px 16px', background: '#354f88', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
              Ekle
            </button>
            <button onClick={() => { setShowAddCat(false); setNewCatName(''); }}
              style={{ padding: '10px 12px', background: 'transparent', color: '#999', border: 'none', cursor: 'pointer' }}>
              Vazgeç
            </button>
          </div>
        )}

        {/* KUTULAR */}
        <div style={{ fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.03em', margin: '20px 0 8px' }}>
          Kutular {activeCategory ? `(${activeCategory.name})` : ''}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {boxes.map((box) => (
            <div key={box.id} onClick={() => setActiveBoxId(box.id)}
              style={{ background: 'white', border: activeBoxId === box.id ? '1.5px solid #354f88' : '1.5px solid #e0e0e0', boxShadow: activeBoxId === box.id ? '0 0 0 1px #354f88' : 'none', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
              <button onClick={(e) => { e.stopPropagation(); handleDeleteBox(box); }} title="Sil"
                style={{ position: 'absolute', top: 8, right: 10, fontSize: 12, color: 'white', background: 'rgba(0,0,0,0.4)', border: 'none', cursor: 'pointer', borderRadius: 4, width: 20, height: 20, zIndex: 2 }}>
                ✕
              </button>
              <div style={{ height: 80, background: '#e9edf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aab4cc', fontSize: 22, overflow: 'hidden' }}>
                {box.image_url ? <img src={box.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🖼️'}
              </div>
              <div style={{ padding: '12px 14px' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: 14, color: '#354f88' }}>{box.title || '(başlıksız)'}</h4>
                <p style={{ margin: 0, fontSize: 12, color: '#888', lineHeight: 1.5 }}>
                  {(box.short_desc || '').slice(0, 60)}
                </p>
              </div>
            </div>
          ))}
          <div onClick={() => setShowAddBox(!showAddBox)}
            style={{ border: '1.5px dashed #354f88', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#354f88', fontWeight: 600, fontSize: 14, cursor: 'pointer', minHeight: 132 }}>
            + Yeni Kutu Ekle
          </div>
        </div>

        {showAddBox && (
          <div style={{ background: 'white', border: '1.5px solid #354f88', borderRadius: 10, padding: 14, marginTop: 10 }}>
            <input type="text" placeholder="Kutu başlığı, örn: Gottes Namen" value={newBoxTitle} onChange={e => setNewBoxTitle(e.target.value)}
              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 6, boxSizing: 'border-box', marginBottom: 10 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
              <div style={{ width: 96, height: 72, borderRadius: 8, background: '#e9edf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aab4cc', fontSize: 22, flexShrink: 0, overflow: 'hidden' }}>
                {newBoxImageFile ? <img src={URL.createObjectURL(newBoxImageFile)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🖼️'}
              </div>
              <input type="file" accept="image/*" onChange={e => setNewBoxImageFile(e.target.files[0])} style={{ flex: 1 }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleAddBox}
                style={{ padding: '10px 16px', background: '#354f88', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                Ekle
              </button>
              <button onClick={() => { setShowAddBox(false); setNewBoxTitle(''); setNewBoxImageFile(null); }}
                style={{ padding: '10px 12px', background: 'transparent', color: '#999', border: 'none', cursor: 'pointer' }}>
                Vazgeç
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DÜZENLEME FORMU */}
      {activeBox && (
        <div style={{ background: 'white', border: '1px solid #e0e0e0', borderRadius: 12, padding: 24 }}>
          <h3 style={{ color: '#354f88', marginBottom: 4 }}>
            {activeCategory?.name} — {activeBox.title || '(başlıksız)'}
          </h3>
          <div style={{ fontSize: 12, color: '#aaa', marginBottom: 20 }}>Kutu düzenleniyor</div>

          {/* Kutu Bilgisi */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: '#354f88', marginBottom: 14 }}>
              <span>🧩</span> Kutu Bilgisi
            </div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: '#333' }}>Kutu Başlığı</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 6, boxSizing: 'border-box', marginBottom: 12 }} />

            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: '#333' }}>Kutu Görseli (kart üzerinde görünür)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 96, height: 72, borderRadius: 8, background: '#e9edf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aab4cc', fontSize: 22, flexShrink: 0, overflow: 'hidden' }}>
                {imageFile ? <img src={URL.createObjectURL(imageFile)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : activeBox.image_url ? <img src={activeBox.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🖼️'}
              </div>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ flex: 1 }} />
            </div>
          </div>

          {/* İçerik */}
          <div style={{ borderTop: '1px solid #eee', paddingTop: 20, marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: '#354f88', marginBottom: 14 }}>
              <span>📝</span> İçerik (Yazı)
            </div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: '#333' }}>Metin</label>
            <textarea value={form.short_desc} onChange={e => setForm({ ...form, short_desc: e.target.value })}
              rows={4} placeholder="Kutu açıldığında görünecek yazılı içerik..."
              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 6, boxSizing: 'border-box', marginBottom: 0, fontFamily: 'inherit' }} />
          </div>

          {/* Video */}
          <div style={{ borderTop: '1px solid #eee', paddingTop: 20, marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: '#354f88', marginBottom: 14 }}>
              <span>🎥</span> Video
            </div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: '#333' }}>Video Başlığı</label>
            <input value={form.video_title} onChange={e => setForm({ ...form, video_title: e.target.value })}
              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 6, boxSizing: 'border-box', marginBottom: 12 }} />

            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: '#333' }}>Video Açıklaması</label>
            <input value={form.video_desc} onChange={e => setForm({ ...form, video_desc: e.target.value })}
              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 6, boxSizing: 'border-box', marginBottom: 12 }} />

            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: '#333' }}>YouTube Video Linki</label>
            <input value={form.video_url} onChange={e => setForm({ ...form, video_url: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 6, boxSizing: 'border-box', marginBottom: 0 }} />
          </div>

          {/* PDF */}
          <div style={{ borderTop: '1px solid #eee', paddingTop: 20, marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: '#354f88', marginBottom: 14 }}>
              <span>📄</span> PDF
            </div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: '#333' }}>PDF Başlığı</label>
            <input value={form.pdf_title} onChange={e => setForm({ ...form, pdf_title: e.target.value })}
              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 6, boxSizing: 'border-box', marginBottom: 12 }} />

            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: '#333' }}>PDF Açıklaması</label>
            <input value={form.pdf_desc} onChange={e => setForm({ ...form, pdf_desc: e.target.value })}
              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 6, boxSizing: 'border-box', marginBottom: 12 }} />

            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: '#333' }}>PDF Dosyası</label>
            <input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files[0])}
              style={{ marginBottom: 24 }} />
          </div>

          {message && <div style={{ padding: 12, borderRadius: 6, background: message.includes('✅') ? '#e0ffe0' : '#ffe0e0', marginBottom: 16 }}>{message}</div>}

          <button onClick={handleSave} disabled={saving}
            style={{ width: '100%', padding: 14, background: '#354f88', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 16 }}>
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      )}
    </div>
  );
}
