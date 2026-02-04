"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
const PASSWORD_ADMIN = "130903" 
const DOOD_API_KEY = "109446t4h65dr9m44eajs8" // <-- GANTI DENGAN API KEY DOODSTREAM KAMU

const supabase = createClient(SB_URL, SB_KEY)

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [videos, setVideos] = useState([])
  const [judul, setJudul] = useState('')
  const [linkVideo, setLinkVideo] = useState('')
  const [linkPoster, setLinkPoster] = useState('')
  const [loading, setLoading] = useState(false)

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

  // --- FITUR 1: PROSES MANUAL ---
  const prosesLinkManual = () => {
    const inputLink = linkVideo.trim();
    const bagian = inputLink.split('/');
    const idVideo = bagian[bagian.length - 1];
    if (idVideo) {
      setLinkVideo(`https://myvidplay.com/e/${idVideo}`); 
      setLinkPoster(`https://thumbcdn.com/snaps/${idVideo}.jpg`); 
      alert("Link Manual Berhasil Dirakit!");
    }
  }

  const handleUploadManual = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('videos').insert([{ title: judul, url: linkVideo, thumbnail: linkPoster }]);
    if (error) alert(error.message);
    else { alert("Berhasil Simpan Manual!"); setJudul(''); setLinkVideo(''); setLinkPoster(''); fetchVideos(); }
  };

  // --- FITUR 2: TARIK OTOMATIS + ANTI DUPLIKAT ---
  const tarikVideoDood = async () => {
    setLoading(true);
    try {
      // 1. Ambil video yang sudah ada di database kita untuk dicek
      const { data: existingVideos } = await supabase.from('videos').select('url');
      const existingUrls = existingVideos.map(v => v.url);

      // 2. Panggil API Doodstream
      const response = await fetch(`https://doodapi.com/api/file/list?key=${DOOD_API_KEY}`);
      const resData = await response.json();

      if (resData.status === 200) {
        const files = resData.result.files;
        
        // 3. Filter: Hanya ambil video yang URL-nya belum ada di database kita
        const newFiles = files.filter(file => {
            const embedUrl = `https://doodstream.com/e/${file.file_code}`;
            return !existingUrls.includes(embedUrl);
        });

        if (newFiles.length === 0) {
            alert("Tidak ada video baru. Semua video sudah ada di database!");
            return;
        }

        // 4. Siapkan data baru untuk dimasukkan
        const dataToInsert = newFiles.map(file => ({
          title: file.title,
          url: `https://doodstream.com/e/${file.file_code}`,
          thumbnail: `https://thumbcdn.com/snaps/${file.file_code}.jpg`
        }));

        const { error } = await supabase.from('videos').insert(dataToInsert);

        if (error) throw error;
        alert(`BERHASIL! Menambahkan ${newFiles.length} video baru.`);
        fetchVideos();
      } else {
        alert("Gagal ambil data API: " + resData.msg);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleHapus = async (id) => {
    if (confirm("Hapus video ini?")) {
      await supabase.from('videos').delete().eq('id', id);
      fetchVideos();
    }
  };

  if (!isLoggedIn) return <div style={{background: '#000', minHeight: '100vh'}}></div>

  return (
    <div style={{ padding: '30px', background: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#E50914' }}>🛠 Super Admin Panel v2.0</h1>
      
      {/* SEKSI OTOMATIS */}
      <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '2px solid #3498db' }}>
        <h3 style={{ marginTop: 0 }}>🚀 Sinkronisasi Doodstream (Anti-Duplikat)</h3>
        <p style={{ fontSize: '0.8rem', color: '#ccc' }}>Sistem akan mendeteksi video baru di akun Doodstream kamu secara otomatis.</p>
        <button 
          onClick={tarikVideoDood} 
          disabled={loading}
          style={{ padding: '12px 20px', background: loading ? '#555' : '#3498db', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
        >
          {loading ? "MENGECEK DATA TERBARU..." : "SYNC VIDEO TERBARU"}
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px', color: '#555', fontWeight: 'bold' }}>OR</div>

      {/* SEKSI MANUAL */}
      <div style={{ background: '#111', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #333' }}>
        <h3 style={{ marginTop: 0 }}>📝 Input Manual (Videy/Lainnya)</h3>
        <input placeholder="Judul Video" value={judul} onChange={(e) => setJudul(e.target.value)} style={{ padding: '10px', width: '100%', marginBottom: '10px', color: '#000' }} />
        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
          <input placeholder="Link Video" value={linkVideo} onChange={(e) => setLinkVideo(e.target.value)} style={{ padding: '10px', flex: 1, color: '#000' }} />
          <button onClick={prosesLinkManual} style={{ padding: '10px', background: '#444', color: '#fff', cursor: 'pointer' }}>PROSES</button>
        </div>
        <input placeholder="Link Thumbnail" value={linkPoster} onChange={(e) => setLinkPoster(e.target.value)} style={{ padding: '10px', width: '100%', marginBottom: '15px', color: '#000' }} />
        <button onClick={handleUploadManual} style={{ padding: '12px', background: '#E50914', color: '#fff', border: 'none', borderRadius: '5px', width: '100%', fontWeight: 'bold', cursor: 'pointer' }}>SIMPAN MANUAL</button>
      </div>

      {/* LIST VIDEO */}
      <h3>Database ({videos.length} Video):</h3>
      <div style={{ display: 'grid', gap: '10px' }}>
        {videos.map((vid) => (
          <div key={vid.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', padding: '10px', borderRadius: '8px', border: '1px solid #222' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={vid.thumbnail} style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '4px' }} alt="" />
              <span style={{ fontSize: '0.9rem' }}>{vid.title}</span>
            </div>
            <button onClick={() => handleHapus(vid.id)} style={{ background: '#ff4444', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
}
