"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
const supabase = createClient(SB_URL, SB_KEY)

// API KEY KAMU SUDAH SAYA TANAM DI SINI
const MY_DOOD_API = "109446t4h65dr9m44eajs8"

export default function AdminPage() {
  const [isLogin, setIsLogin] = useState(false)
  const [pass, setPass] = useState('')
  const [limit, setLimit] = useState(5) // DEFAULT SEKARANG MINIMAL 5
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)

  // State Form Manual
  const [manualTitle, setManualTitle] = useState('')
  const [manualUrl, setManualUrl] = useState('')
  const [manualThumb, setManualThumb] = useState('')
  const [editData, setEditData] = useState(null)

  useEffect(() => {
    if (isLogin) fetchVideos()
  }, [isLogin])

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('id', { ascending: false })
    setVideos(data || [])
  }

  const handleLogin = () => {
    if (pass === '130903') setIsLogin(true) 
    else alert('Password Salah!')
  }

  const syncDood = async () => {
    setLoading(true)
    try {
      // Menggunakan API Key yang sudah ditanam di kode
      const res = await fetch(`https://doodapi.com/api/file/list?key=${MY_DOOD_API}`)
      const json = await res.json()
      
      if (json.result) {
        const limitedFiles = json.result.slice(0, limit)
        const toInsert = limitedFiles.map(f => ({
          title: f.title,
          url: `https://doodstream.com/e/${f.file_code}`,
          thumbnail: `https://thumbcdn.com/snaps/${f.file_code}.jpg`
        }))
        
        const { error } = await supabase.from('videos').insert(toInsert)
        if (!error) {
          alert(`Berhasil narik ${limitedFiles.length} video terbaru!`)
          fetchVideos()
        }
      } else {
        alert('API Key salah atau limit API Doodstream tercapai!')
      }
    } catch (e) { 
      alert('Gagal menyambung ke Doodstream!') 
    }
    setLoading(false)
  }

  const handleManualUpload = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('videos').insert([{ title: manualTitle, url: manualUrl, thumbnail: manualThumb }])
    if (!error) { 
      alert('Upload Manual Berhasil!')
      setManualTitle(''); setManualUrl(''); setManualThumb('')
      fetchVideos() 
    }
  }

  const deleteVideo = async (id) => {
    if (confirm('Hapus video ini?')) { 
      await supabase.from('videos').delete().eq('id', id)
      fetchVideos() 
    }
  }

  if (!isLogin) return (
    <div style={{ background: '#000', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#111', padding: '30px', borderRadius: '12px', textAlign: 'center', width: '320px', border: '1px solid #222' }}>
        <h3 style={{ color: '#E50914', marginBottom: '20px', letterSpacing: '1px' }}>ADMIN ACCESS</h3>
        <input type="password" placeholder="Password Admin" onChange={(e) => setPass(e.target.value)} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #333', marginBottom: '15px', width: '100%', background: '#000', color: '#fff', outline: 'none' }} />
        <button onClick={handleLogin} style={{ width: '100%', padding: '12px', background: '#E50914', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>LOGIN</button>
      </div>
    </div>
  )

  return (
    <div style={{ padding: '20px', background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#E50914', textAlign: 'center', marginBottom: '30px' }}>PANEL KENDALI</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        {/* SYNC DOODSTREAM */}
        <div style={{ background: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #222' }}>
          <h4 style={{ marginTop: 0, color: '#25D366' }}>SINKRONISASI OTOMATIS</h4>
          <p style={{ fontSize: '0.8rem', color: '#888' }}>API Key: <span style={{ color: '#555' }}>Terpasang (109446t...)</span></p>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '0.8rem', color: '#bbb' }}>Jumlah video yang ditarik:</label>
            <select value={limit} onChange={(e) => setLimit(parseInt(e.target.value))} style={{ width: '100%', padding: '12px', borderRadius: '6px', background: '#000', color: '#fff', border: '1px solid #333', marginTop: '5px', cursor: 'pointer' }}>
                <option value={5}>5 Video Terbaru</option>
                <option value={10}>10 Video Terbaru</option>
                <option value={20}>20 Video Terbaru</option>
                <option value={50}>50 Video Terbaru</option>
            </select>
          </div>
          
          <button onClick={syncDood} disabled={loading} style={{ width: '100%', padding: '15px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>
            {loading ? 'SEDANG MENARIK DATA...' : `TARIK ${limit} VIDEO SEKARANG`}
          </button>
        </div>

        {/* UPLOAD MANUAL */}
        <div style={{ background: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #222' }}>
          <h4 style={{ marginTop: 0, color: '#E50914' }}>TAMBAH MANUAL</h4>
          <form onSubmit={handleManualUpload}>
            <input placeholder="Judul Film" value={manualTitle} onChange={(e)=>setManualTitle(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '5px', background: '#000', color: '#fff', border: '1px solid #333', marginBottom: '10px', boxSizing: 'border-box' }} />
            <input placeholder="Link Embed (Iframe)" value={manualUrl} onChange={(e)=>setManualUrl(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '5px', background: '#000', color: '#fff', border: '1px solid #333', marginBottom: '10px', boxSizing: 'border-box' }} />
            <input placeholder="Link Gambar (Thumbnail)" value={manualThumb} onChange={(e)=>setManualThumb(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '5px', background: '#000', color: '#fff', border: '1px solid #333', marginBottom: '10px', boxSizing: 'border-box' }} />
            <button type="submit" style={{ width: '100%', padding: '12px', background: '#E50914', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>TAMBAHKAN KE DATABASE</button>
          </form>
        </div>
      </div>

      {/* DAFTAR VIDEO */}
      <div style={{ background: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #222' }}>
        <h4 style={{ marginTop: 0 }}>VIDEO TERDAFTAR ({videos.length})</h4>
        <div style={{ display: 'grid', gap: '10px' }}>
          {videos.map((v) => (
            <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', padding: '12px', borderRadius: '8px', border: '1px solid #222' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={v.thumbnail} style={{ width: '45px', height: '30px', objectFit: 'cover', borderRadius: '3px' }} onError={(e)=>e.target.src="https://via.placeholder.com/45x30"} />
                <span style={{ fontSize: '0.85rem', color: '#ddd' }}>{v.title}</span>
              </div>
              <button onClick={() => deleteVideo(v.id)} style={{ background: '#333', color: '#ff4d4d', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}>HAPUS</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
