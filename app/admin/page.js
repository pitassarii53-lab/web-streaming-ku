"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
const PASSWORD_ADMIN = "130903" 
const supabase = createClient(SB_URL, SB_KEY)

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  
  const [editId, setEditId] = useState(null)
  const [judul, setJudul] = useState('')
  const [linkVideo, setLinkVideo] = useState('')
  const [linkPoster, setLinkPoster] = useState('')
  const [limitSync, setLimitSync] = useState(10)

  useEffect(() => {
    const pass = prompt("Masukkan Password Admin:");
    if (pass === PASSWORD_ADMIN) { setIsLoggedIn(true); fetchVideos(); } 
    else { alert("Akses Ditolak!"); window.location.href = "/" }
  }, [])

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('id', { ascending: false })
    if (data) setVideos(data)
  }

  const syncDoodstream = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dood');
      const resData = await res.json();
      if (resData.status === 200) {
        const { data: existing } = await supabase.from('videos').select('url');
        const existingUrls = existing.map(v => v.url);
        const newFiles = resData.result.files.filter(f => !existingUrls.includes(`https://doodstream.com/e/${f.file_code}`));
        if (newFiles.length === 0) return alert("Semua video terbaru sudah ada!");
        const limitedFiles = newFiles.slice(0, limitSync);
        const toInsert = limitedFiles.map(f => ({
          title: f.title,
          url: `https://doodstream.com/e/${f.file_code}`,
          thumbnail: `https://thumbcdn.com/snaps/${f.file_code}.jpg`
        }));
        await supabase.from('videos').insert(toInsert);
        alert(`Berhasil sinkron ${limitedFiles.length} video baru!`);
        fetchVideos();
      }
    } catch (err) { alert("Error Sync: " + err.message); }
    finally { setLoading(false); }
  }

  const handleSimpan = async (e) => {
    e.preventDefault();
    if (editId) {
      await supabase.from('videos').update({ title: judul, url: linkVideo, thumbnail: linkPoster }).eq('id', editId);
      alert("Berhasil diupdate!"); setEditId(null);
    } else {
      await supabase.from('videos').insert([{ title: judul, url: linkVideo, thumbnail: linkPoster }]);
      alert("Berhasil ditambah!");
    }
    setJudul(''); setLinkVideo(''); setLinkPoster(''); fetchVideos();
  };

  const handleEditKlik = (v) => {
    setEditId(v.id); setJudul(v.title); setLinkVideo(v.url); setLinkPoster(v.thumbnail);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHapus = async (id) => {
    if (confirm("Hapus video ini?")) { await supabase.from('videos').delete().eq('id', id); fetchVideos(); }
  };

  // --- FUNGSI SALIN LINK ---
  const handleSalinLink = (id) => {
    const fullLink = `${window.location.origin}/watch/${id}`;
    navigator.clipboard.writeText(fullLink);
    alert("Link nonton berhasil disalin!");
  };

  if (!isLoggedIn) return null;

  return (
    <div style={{ padding: '20px', background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1>🛠 Admin Panel v5.2</h1>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
        {/* FORM INPUT / EDIT */}
        <div style={{ flex: 1, minWidth: '300px', background: '#111', padding: '20px', borderRadius: '10px', border: editId ? '2px solid #3498db' : 'none' }}>
          <h3>{editId ? "📝 Mode Edit Video" : "➕ Tambah Manual"}</h3>
          <input placeholder="Judul" value={judul} onChange={e => setJudul(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', color: '#000', borderRadius: '5px' }} />
          <input placeholder="Link Video" value={linkVideo} onChange={e => setLinkVideo(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', color: '#000', borderRadius: '5px' }} />
          <input placeholder="Link Thumbnail" value={linkPoster} onChange={e => setLinkPoster(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', color: '#000', borderRadius: '5px' }} />
          <button onClick={handleSimpan} style={{ width: '100%', padding: '12px', background: '#E50914', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '5px' }}>{editId ? "UPDATE SEKARANG" : "SIMPAN MANUAL"}</button>
          {editId && <button onClick={() => { setEditId(null); setJudul(''); setLinkVideo(''); setLinkPoster(''); }} style={{ width: '100%', padding: '12px', background: '#444', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '5px', marginTop: '5px' }}>BATAL</button>}
        </div>

        {/* BOX SINKRONISASI */}
        <div style={{ flex: 0.7, minWidth: '300px', background: '#111', padding: '20px', borderRadius: '10px' }}>
          <h3>🚀 Tarik Video API</h3>
          <input type="number" value={limitSync} onChange={e => setLimitSync(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', color: '#000', borderRadius: '5px' }} />
          <button onClick={syncDoodstream} disabled={loading} style={{ width: '100%', padding: '15px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>{loading ? "MENARIK DATA..." : `SYNC ${limitSync} VIDEO BARU`}</button>
        </div>
      </div>

      <h3>Daftar Koleksi:</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
        {videos.map(v => (
          <div key={v.id} style={{ background: '#111', padding: '10px', borderRadius: '8px', border: '1px solid #222' }}>
            <div style={{ width: '100%', height: '110px', background: '#000', borderRadius: '5px', overflow: 'hidden', marginBottom: '10px' }}>
                <img src={`https://images.weserv.nl/?url=${encodeURIComponent(v.thumbnail)}&w=300`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.src="https://via.placeholder.com/200x110"} />
            </div>
            <p style={{ fontSize: '0.75rem', height: '2.5em', overflow: 'hidden', margin: '5px 0' }}>{v.title}</p>
            
            <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
              <button onClick={() => handleEditKlik(v)} style={{ flex: 1, padding: '7px', background: '#f1c40f', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.7rem' }}>Edit</button>
              <button onClick={() => handleHapus(v.id)} style={{ flex: 1, padding: '7px', background: 'red', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.7rem' }}>Hapus</button>
            </div>
            
            {/* TOMBOL SALIN LINK BARU */}
            <button 
              onClick={() => handleSalinLink(v.id)} 
              style={{ width: '100%', padding: '7px', background: '#3498db', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.7rem' }}
            >
              🔗 SALIN LINK NONTON
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
