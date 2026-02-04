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
  const [limit, setLimit] = useState(10) // DEFAULT TARIK 10 VIDEO
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)

  // State Pengumuman & Edit
  const [announcement, setAnnouncement] = useState('')
  const [editData, setEditData] = useState(null)

  useEffect(() => {
    if (isLogin) {
      fetchVideos()
      fetchSettings()
    }
  }, [isLogin])

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('id', { ascending: false })
    setVideos(data || [])
  }

  const fetchSettings = async () => {
    const { data } = await supabase.from('settings').select('announcement').eq('id', 1).single()
    if (data) setAnnouncement(data.announcement)
  }

  const handleLogin = () => {
    if (pass === '130903') setIsLogin(true) 
    else alert('Password Salah!')
  }

  // --- FUNGSI SYNC DENGAN LIMIT ---
  const syncDood = async () => {
    if (!apiDood) return alert('Isi API Key dulu!')
    setLoading(true)
    try {
      const res = await fetch(`https://doodapi.com/api/file/list?key=${apiDood}`)
      const json = await res.json()
      if (json.result) {
        // KITA POTONG VIDEONYA SESUAI LIMIT YANG DIPILIH
        const limitedFiles = json.result.slice(0, limit)
        
        const toInsert = limitedFiles.map(f => ({
          title: f.title,
          url: `https://doodstream.com/e/${f.file_code}`,
          thumbnail: `https://thumbcdn.com/snaps/${f.file_code}.jpg`
        }))

        const { error } = await supabase.from('videos').insert(toInsert)
        if (!error) {
            alert(`Berhasil menarik ${limitedFiles.length} video terbaru!`)
            fetchVideos()
        }
      }
    } catch (e) { alert('Gagal Sync!') }
    setLoading(false)
  }

  const handleUpdateAnnouncement = async () => {
    await supabase.from('settings').update({ announcement }).eq('id', 1)
    alert('Pengumuman Berhasil Diperbarui!')
  }

  if (!isLogin) return (
    <div style={{ background: '#000', height: '100vh', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#111', padding: '30px', borderRadius: '10px', textAlign: 'center' }}>
        <h3 style={{ color: '#E50914' }}>ADMIN LOGIN</h3>
        <input type="password" onChange={(e) => setPass(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: 'none', marginBottom: '10px', width: '100%' }} />
        <button onClick={handleLogin} style={{ width: '100%', padding: '10px', background: '#E50914', color: '#fff', border: 'none', borderRadius: '5px' }}>MASUK</button>
      </div>
    </div>
  )

  return (
    <div style={{ padding: '20px', background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#E50914', textAlign: 'center' }}>ADMIN PANEL PRO</h2>
      
      {/* 1. KOTAK PENGUMUMAN */}
      <div style={{ background: '#111', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #E50914' }}>
        <h4 style={{ marginTop: 0 }}>GANTI PENGUMUMAN BERJALAN</h4>
        <input value={announcement} onChange={(e) => setAnnouncement(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', background: '#000', color: '#fff', border: '1px solid #333', marginBottom: '10px', boxSizing: 'border-box' }} />
        <button onClick={handleUpdateAnnouncement} style={{ width: '100%', padding: '10px', background: '#0088cc', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>SIMPAN PENGUMUMAN</button>
      </div>

      {/* 2. SYNC DOODSTREAM DENGAN PILIHAN LIMIT */}
      <div style={{ background: '#111', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h4 style={{ marginTop: 0 }}>SYNC DOODSTREAM</h4>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <input 
                value={apiDood} 
                onChange={(e) => setApiDood(e.target.value)} 
                placeholder="Masukkan API Key Doodstream" 
                style={{ flex: 2, padding: '12px', borderRadius: '5px', background: '#000', color: '#fff', border: '1px solid #333', minWidth: '200px' }} 
            />
            <select 
                value={limit} 
                onChange={(e) => setLimit(parseInt(e.target.value))}
                style={{ flex: 1, padding: '12px', borderRadius: '5px', background: '#000', color: '#fff', border: '1px solid #333' }}
            >
                <option value={10}>Tarik 10 Vid</option>
                <option value={20}>Tarik 20 Vid</option>
                <option value={50}>Tarik 50 Vid</option>
                <option value={100}>Tarik 100 Vid</option>
            </select>
        </div>
        <button onClick={syncDood} disabled={loading} style={{ width: '100%', padding: '12px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '1rem' }}>
            {loading ? 'SEDANG MENARIK DATA...' : `SYNC ${limit} VIDEO TERBARU`}
        </button>
      </div>

      {/* ... SISANYA (UPLOAD MANUAL & DAFTAR VIDEO) ... */}
      <p style={{ color: '#888' }}>Database saat ini: {videos.length} Video</p>
    </div>
  )
}
