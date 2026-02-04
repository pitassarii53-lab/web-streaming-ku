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
  const [judul, setJudul] = useState('')
  const [linkVideo, setLinkVideo] = useState('')
  const [linkPoster, setLinkPoster] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const pass = prompt("Masukkan Password Admin:");
    if (pass === PASSWORD_ADMIN) { setIsLoggedIn(true); fetchVideos(); } 
    else { alert("Akses Ditolak!"); window.location.href = "/" }
  }, [])

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('id', { ascending: false })
    if (data) setVideos(data)
  }

  const handleUploadManual = async (e) => {
    e.preventDefault();
    // PAKAI NAMA KOLOM: thumbnail (Tanpa S)
    const { error } = await supabase.from('videos').insert([
      { title: judul, url: linkVideo, thumbnail: linkPoster }
    ]);
    if (error) alert("Gagal Simpan: " + error.message);
    else { alert("Berhasil!"); setJudul(''); setLinkVideo(''); setLinkPoster(''); fetchVideos(); }
  };

  const syncDoodstream = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dood');
      const resData = await res.json();

      if (resData.status === 200) {
        const { data: existing } = await supabase.from('videos').select('url');
        const existingUrls = existing.map(v => v.url);
        
        const newFiles = resData.result.files.filter(f => 
          !existingUrls.includes(`https://doodstream.com/e/${f.file_code}`)
        );

        if (newFiles.length === 0) return alert("Semua video sudah sinkron!");

        const toInsert = newFiles.map(f => ({
          title: f.title,
          url: `https://doodstream.com/e/${f.file_code}`,
          thumbnail: `https://thumbcdn.com/snaps/${f.file_code}.jpg` // Kolom: thumbnail
        }));

        const { error } = await supabase.from('videos').insert(toInsert);
        if (error) throw error;
        alert(`Berhasil nambah ${newFiles.length} video baru!`);
        fetchVideos();
      } else {
        alert("Gagal API Dood: " + resData.msg);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally { setLoading(false); }
  }

  const handleHapus = async (id) => {
    if (confirm("Hapus video ini?")) { await supabase.from('videos').delete().eq('id', id); fetchVideos(); }
  };

  if (!isLoggedIn) return null;

  return (
    <div style={{ padding: '20px', background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#E50914' }}>🛠 Admin Panel v2.6</h1>
      
      <button onClick={syncDoodstream} disabled={loading} style={{ padding: '15px', width: '100%', background: '#3498db', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px' }}>
        {loading ? "MENGECEK VIDEO..." : "🔥 SYNC DARI DOODSTREAM"}
      </button>

      <form onSubmit={handleUploadManual} style={{ background: '#111', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h3 style={{marginTop:0}}>📝 Tambah Manual</h3>
        <input placeholder="Judul" value={judul} onChange={e => setJudul(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', color: '#000' }} required />
        <input placeholder="Link Video" value={linkVideo} onChange={e => setLinkVideo(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', color: '#000' }} required />
        <input placeholder="Link Poster" value={linkPoster} onChange={e => setLinkPoster(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', color: '#000' }} />
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#E50914', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>SIMPAN MANUAL</button>
      </form>

      <div style={{ display: 'grid', gap: '10px' }}>
        {videos.map(v => (
          <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', padding: '10px', borderRadius: '5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={v.thumbnail} style={{ width: '50px', height: '35px', objectFit: 'cover' }} />
              <span style={{ fontSize: '0.8rem' }}>{v.title}</span>
            </div>
            <button onClick={() => handleHapus(v.id)} style={{ background: 'red', color: 'white', border: 'none', padding: '5px' }}>Hapus</button>
          </div>
        ))}
      </div>
    </div>
  )
}
