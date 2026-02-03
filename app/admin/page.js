"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
const PASSWORD_ADMIN = "admin123"
const supabase = createClient(SB_URL, SB_KEY)

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [videos, setVideos] = useState([])

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

  const handleUpload = async (e) => {
    e.preventDefault();
    const judul = e.target.judul.value;
    const link = e.target.link.value;
    
    let finalUrl = link.includes("watch?v=") ? link.replace("watch?v=", "embed/") : link;

    const { error } = await supabase.from('videos').insert([{ title: judul, url: finalUrl }]);

    if (error) {
      alert("Gagal Simpan: " + error.message);
    } else {
      alert("MANTAP! Berhasil tersimpan.");
      e.target.reset();
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
      <h1>🛠 Admin Panel (Original)</h1>
      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '40px', background: '#111', padding: '20px', borderRadius: '10px' }}>
        <input name="judul" placeholder="Judul Film" style={{ padding: '12px' }} required />
        <input name="link" placeholder="Link Video (YouTube)" style={{ padding: '12px' }} required />
        <button type="submit" style={{ padding: '15px', background: '#E50914', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>UPLOAD</button>
      </form>

      <div>
        <h3>Daftar Koleksi:</h3>
        {videos.map((vid) => (
          <div key={vid.id} style={{ display: 'flex', justifyContent: 'space-between', background: '#111', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
            <span>{vid.title}</span>
            <button onClick={() => handleHapus(vid.id)} style={{ background: '#ff4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
}
