"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
const supabase = createClient(SB_URL, SB_KEY)

export default function AdminPage() {
  const [isLogin, setIsLogin] = useState(false)
  const [pass, setPass] = useState('')
  const [apiDood, setApiDood] = useState('')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isLogin) fetchVideos()
  }, [isLogin])

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('id', { ascending: false })
    setVideos(data || [])
  }

  const handleLogin = () => {
    if (pass === '130903') setIsLogin(true) // Ganti password sesukamu
    else alert('Password Salah!')
  }

  const syncDood = async () => {
    if (!apiDood) return alert('Isi API Key Doodstream dulu!')
    setLoading(true)
    try {
      const res = await fetch(`https://doodapi.com/api/file/list?key=${apiDood}`)
      const json = await res.json()
      if (json.result) {
        const toInsert = json.result.map(f => ({
          title: f.title,
          url: `https://doodstream.com/e/${f.file_code}`,
          thumbnail: f.single_img || `https://thumbcdn.com/snaps/${f.file_code}.jpg`
        }))
        await supabase.from('videos').insert(toInsert)
        alert('Berhasil Sync!')
        fetchVideos()
      }
    } catch (e) { alert('Gagal Sync!') }
    setLoading(false)
  }

  const deleteVideo = async (id) => {
    if (confirm('Yakin mau hapus video ini?')) {
      await supabase.from('videos').delete().eq('id', id)
      fetchVideos()
    }
  }

  const editTitle = async (id, oldTitle) => {
    const newTitle = prompt("Edit Judul Video:", oldTitle)
    if (newTitle) {
      await supabase.from('videos').update({ title: newTitle }).eq('id', id)
      fetchVideos()
    }
  }

  if (!isLogin) return (
    <div style={{ background: '#000', height: '100vh', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#111', padding: '30px', borderRadius: '10px', textAlign: 'center' }}>
        <h3>ADMIN LOGIN</h3>
        <input type="password" onChange={(e) => setPass(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: 'none', marginBottom: '10px', width: '100%' }} />
        <button onClick={handleLogin} style={{ width: '100%', padding: '10px', background: '#E50914', color: '#fff', border: 'none', borderRadius: '5px' }}>MASUK</button>
      </div>
    </div>
  )

  return (
    <div style={{ padding: '20px', background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#E50914' }}>DASHBOARD ADMIN</h2>
      
      {/* TOOLBAR */}
      <div style={{ background: '#111', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <p style={{ margin: '0 0 10px 0' }}>API Key Doodstream:</p>
        <input value={apiDood} onChange={(e) => setApiDood(e.target.value)} placeholder="Masukkan API Key..." style={{ padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #333', background: '#000', color: '#fff', marginRight: '10px' }} />
        <button onClick={syncDood} disabled={loading} style={{ padding: '10px 20px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '5px' }}>
          {loading ? 'SINKRONISASI...' : 'SYNC DARI DOODSTREAM'}
        </button>
        <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '10px' }}>Total Video: {videos.length}</p>
      </div>

      {/* DAFTAR VIDEO */}
      <div style={{ display: 'grid', gap: '10px' }}>
        {videos.map((v) => (
          <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', padding: '15px', borderRadius: '8px', border: '1px solid #222' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img src={v.thumbnail} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                <span style={{ fontSize: '0.9rem' }}>{v.title}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => editTitle(v.id, v.title)} style={{ background: '#0088cc', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
              <button onClick={() => deleteVideo(v.id)} style={{ background: '#E50914', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' }}>Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
