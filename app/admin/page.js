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

  // JURUS OTOMATIS: Disesuaikan dengan pola thumbcdn.com kamu
  const prosesLink = () => {
    if (!linkVideo.includes("dood")) {
      alert("Masukkan link Doodstream dulu bos!");
      return;
    }
    
    // Ambil ID dari link. Kita split berdasarkan '/' dan ambil bagian terakhirnya
    // Contoh: https://doodstream.com/d/km8i6jmoju9q8r7u -> ID-nya: km8i6jmoju9q8r7u
    const cleanedLink = linkVideo.trim();
    const bagian = cleanedLink.split('/');
    const idVideo = bagian[bagian.length - 1];

    if (idVideo) {
      // Ubah link jadi format Embed (/e/)
      setLinkVideo(`https://doodstream.com/e/${idVideo}`); 
      // Rakit link thumbnail sesuai pola yang kamu kasih
      setLinkPoster(`https://thumbcdn.com/snaps/${idVideo}.jpg`); 
      alert("Link & Thumbnail Doodstream berhasil dirakit!");
    } else {
      alert("ID Video tidak ditemukan!");
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!judul || !linkVideo || !linkPoster) return alert("Isi semua data dulu!");

    const { error } = await supabase.from('videos').insert([
      { title: judul, url: linkVideo, thumbnail: linkPoster }
    ]);

    if (error) {
      alert("Gagal: " + error.message);
    } else {
      alert("MANTAP! Tersimpan ke Database.");
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
      <h1>🛠 Admin Panel (Dood Auto-Thumb)</h1>
      
      <div style={{ background: '#111', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #E50914' }}>
        <label>Judul Video:</label>
        <input 
          placeholder="Contoh: Film Action Terbaru" 
          value={judul} 
          onChange={(e) => setJudul(e.target.value)}
          style={{ padding: '12px', width: '100%', marginBottom: '15px', borderRadius: '5px', border: 'none' }} 
        />
        
        <label>Link Doodstream:</label>
        <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
          <input 
            placeholder="https://doodstream.com/d/..." 
            value={linkVideo}
            onChange={(e) => setLinkVideo(e.target.value)}
            style={{ padding: '12px', flex: 1, borderRadius: '5px', border: 'none' }} 
          />
          <button onClick={prosesLink} style={{ padding: '10px 20px', background: '#333', color: '#fff', border: '1px solid #E50914', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>PROSES</button>
        </div>

        <label>Link Thumbnail (Auto):</label>
        <input 
          placeholder="Hasil proses akan muncul di sini..." 
          value={linkPoster}
          onChange={(e) => setLinkPoster(e.target.value)}
          style={{ padding: '12px', width: '100%', marginBottom: '20px', borderRadius: '5px', border: 'none', background: '#222', color: '#aaa' }} 
        />

        <button onClick={handleUpload} style={{ padding: '15px', background: '#E50914', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', width: '100%', cursor: 'pointer', fontSize: '1rem' }}>SIMPAN KOLEKSI</button>
      </div>

      <div>
        <h3>Daftar Video di Database:</h3>
        {videos.map((vid) => (
          <div key={vid.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', padding: '10px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={vid.thumbnail} style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '4px' }} alt="" />
              <span>{vid.title}</span>
            </div>
            <button onClick={() => handleHapus(vid.id)} style={{ background: '#ff4444', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
}
