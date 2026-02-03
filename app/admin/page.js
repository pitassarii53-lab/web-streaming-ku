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

  useEffect(() => {
    const pass = prompt("Masukkan Password Admin:")
    if (pass === PASSWORD_ADMIN) {
      setIsLoggedIn(true)
      fetchVideos()
    } else {
      alert("Akses Ditolak!");
      window.location.href = "/"
    }
  }, [])

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('id', { ascending: false })
    if (data) setVideos(data)
  }

  // JURUS OTOMATIS: Mendukung Doodstream & MyVidPlay
  const prosesLink = () => {
    const inputLink = linkVideo.trim();
    if (!inputLink) return alert("Masukkan link dulu!");

    // Mengambil ID video (bagian terakhir dari link)
    const bagian = inputLink.split('/');
    const idVideo = bagian[bagian.length - 1];

    if (idVideo) {
      // 1. Set Link Video jadi format Embed MyVidPlay
      setLinkVideo(`https://myvidplay.com/e/${idVideo}`); 
      
      // 2. Set Link Thumbnail otomatis ke pola thumbcdn
      setLinkPoster(`https://thumbcdn.com/snaps/${idVideo}.jpg`); 
      
      alert("Link MyVidPlay & Thumbnail berhasil diproses!");
    } else {
      alert("ID Video tidak ditemukan!");
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!judul || !linkVideo) return alert("Isi judul dan link dulu!");

    const { error } = await supabase.from('videos').insert([
      { title: judul, url: linkVideo, thumbnail: linkPoster }
    ]);

    if (error) {
      alert("Gagal: " + error.message);
    } else {
      alert("MANTAP! Tersimpan.");
      setJudul(''); setLinkVideo(''); setLinkPoster('');
      fetchVideos();
    }
  };

  const handleHapus = async (id) => {
    if (confirm("Hapus video ini?")) {
      await supabase.from('videos').delete().eq('id', id);
      fetchVideos();
    }
  };

  if (!isLoggedIn) return <div style={{background: '#000', minHeight: '100vh'}}></div>

  return (
    <div style={{ padding: '40px', background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#E50914' }}>🛠 MyVidPlay Admin</h1>
      
      <div style={{ background: '#111', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #333' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Judul Video:</label>
          <input 
            placeholder="Masukkan judul..." 
            value={judul} 
            onChange={(e) => setJudul(e.target.value)}
            style={{ padding: '12px', width: '100%', borderRadius: '5px', border: 'none', color: '#000' }} 
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Link Video (MyVidPlay/Dood):</label>
          <div style={{ display: 'flex', gap: '5px' }}>
            <input 
              placeholder="https://myvidplay.com/e/..." 
              value={linkVideo}
              onChange={(e) => setLinkVideo(e.target.value)}
              style={{ padding: '12px', flex: 1, borderRadius: '5px', border: 'none', color: '#000' }} 
            />
            <button onClick={prosesLink} style={{ padding: '10px 20px', background: '#E50914', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>PROSES</button>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Link Thumbnail (Bisa Paste link Twitter di sini):</label>
          <input 
            placeholder="Link otomatis dari PROSES atau paste link Twitter..." 
            value={linkPoster}
            onChange={(e) => setLinkPoster(e.target.value)}
            style={{ padding: '12px', width: '100%', borderRadius: '5px', border: 'none', color: '#000' }} 
          />
        </div>

        <button onClick={handleUpload} style={{ padding: '15px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', width: '100%', cursor: 'pointer' }}>SIMPAN VIDEO</button>
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        <h3>Koleksi Database:</h3>
        {videos.map((vid) => (
          <div key={vid.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={vid.thumbnail} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} alt="" />
              <span>{vid.title}</span>
            </div>
            <button onClick={() => handleHapus(vid.id)} style={{ background: '#ff4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
}
