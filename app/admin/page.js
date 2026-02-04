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

  // State Form Manual
  const [manualTitle, setManualTitle] = useState('')
  const [manualUrl, setManualUrl] = useState('')
  const [manualThumb, setManualThumb] = useState('')

  // State Pengumuman
  const [announcement, setAnnouncement] = useState('')

  // State Edit Video
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

  const syncDood = async () => {
    if (!apiDood) return alert('Isi API Key dulu!')
    setLoading(true)
    try {
      const res = await fetch(`https://doodapi.com/api/file/list?key=${apiDood}`)
      const json = await res.json()
      if (json.result) {
        const toInsert = json.result.map(f => ({
          title: f.title,
          url: `https://doodstream.com/e/${f.file_code}`,
          thumbnail: `https://thumbcdn.com/snaps/${f.file_code}.jpg`
        }))
        await supabase.from('videos').insert(toInsert)
        alert('Sync Berhasil!'); fetchVideos()
      }
    } catch (e) { alert('Gagal Sync!') }
    setLoading(false)
  }

  const handleManualUpload = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('videos').insert([{ title: manualTitle, url: manualUrl, thumbnail: manualThumb }])
    if (!error) { alert('Berhasil!'); setManualTitle(''); setManualUrl(''); setManualThumb(''); fetchVideos() }
  }

  const handleUpdateAnnouncement = async () => {
    const { error } = await supabase.from('settings').update({ announcement }).eq('id', 1)
    if (!error) alert('Pengumuman Berhasil Diperbarui!')
  }

  const deleteVideo = async (id) => {
    if (confirm('Hapus video ini?')) {
      await supabase.from('videos').delete().eq('id', id)
      fetchVideos()
    }
  }

  const handleUpdateVideo = async () => {
    await supabase.from('videos').update({ title: editData.title, thumbnail: editData.thumbnail, url: editData.url }).eq('id', editData.id)
    setEditData(null); fetchVideos()
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
      <h2 style={{ color: '#E50914', textAlign: 'center' }}>ADMIN PANEL</h2>
      
      {/* 1. KOTAK PENGUMUMAN */}
      <div style={{ background: '#111', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #E50914' }}>
        <h4 style={{ marginTop: 0 }}>GANTI PENGUMUMAN BERJALAN</h4>
        <input value={announcement} onChange={(e) => setAnnouncement(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', background: '#000', color: '#fff', border: '1px solid #333', marginBottom: '10px', boxSizing: 'border-box' }} />
        <button onClick={handleUpdateAnnouncement} style={{ width: '100%', padding: '10px', background: '#0088cc', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>SIMPAN PENGUMUMAN</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {/* 2. SYNC DOOD */}
        <div style={{ background: '#111', padding: '20px', borderRadius: '10px' }}>
          <h4>SYNC DOODSTREAM</h4>
          <input value={apiDood} onChange={(e) => setApiDood(e.target.value)} placeholder="API Key" style={{ padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #333', background: '#000', color: '#fff', marginBottom: '10px', boxSizing: 'border-box' }} />
          <button onClick={syncDood} disabled={loading} style={{ width: '100%', padding: '10px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '5px' }}>{loading ? 'SINKRONISASI...' : 'SYNC SEKARANG'}</button>
        </div>

        {/* 3. UPLOAD MANUAl */}
        <div style={{ background: '#111', padding: '20px', borderRadius: '10px' }}>
          <h4>UPLOAD MANUAL</h4>
          <form onSubmit={handleManualUpload}>
            <input placeholder="Judul" value={manualTitle} onChange={(e)=>setManualTitle(e.target.value)} required style={{ padding: '8px', width: '100%', borderRadius: '5px', border: '1px solid #333', background: '#000', color: '#fff', marginBottom: '8px', boxSizing: 'border-box' }} />
            <input placeholder="URL Video" value={manualUrl} onChange={(e)=>setManualUrl(e.target.value)} required style={{ padding: '8px', width: '100%', borderRadius: '5px', border: '1px solid #333', background: '#000', color: '#fff', marginBottom: '8px', boxSizing: 'border-box' }} />
            <input placeholder="URL Thumbnail" value={manualThumb} onChange={(e)=>setManualThumb(e.target.value)} required style={{ padding: '8px', width: '100%', borderRadius: '5px', border: '1px solid #333', background: '#000', color: '#fff', marginBottom: '8px', boxSizing: 'border-box' }} />
            <button type="submit" style={{ width: '100%', padding: '10px', background: '#E50914', color: '#fff', border: 'none', borderRadius: '5px' }}>TAMBAHKAN VIDEO</button>
          </form>
        </div>
      </div>

      {/* 4. DAFTAR VIDEO */}
      <p>Total: {videos.length} Video</p>
      <div style={{ display: 'grid', gap: '10px' }}>
        {videos.map((v) => (
          <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', padding: '10px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={v.thumbnail} style={{ width: '50px', height: '30px', objectFit: 'cover' }} />
                <span style={{ fontSize: '0.8rem' }}>{v.title}</span>
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button onClick={() => setEditData(v)} style={{ background: '#0088cc', border: 'none', color: '#fff', padding: '5px 10px', borderRadius: '4px' }}>Edit</button>
              <button onClick={() => deleteVideo(v.id)} style={{ background: '#444', border: 'none', color: '#fff', padding: '5px 10px', borderRadius: '4px' }}>Hapus</button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL EDIT */}
      {editData && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#111', padding: '20px', borderRadius: '10px', width: '100%', maxWidth: '400px' }}>
            <h4>EDIT DATA VIDEO</h4>
            <input value={editData.title} onChange={(e) => setEditData({...editData, title: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#000', color: '#fff', border: '1px solid #333' }} />
            <input value={editData.thumbnail} onChange={(e) => setEditData({...editData, thumbnail: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#000', color: '#fff', border: '1px solid #333' }} />
            <input value={editData.url} onChange={(e) => setEditData({...editData, url: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '20px', background: '#000', color: '#fff', border: '1px solid #333' }} />
            <button onClick={handleUpdateVideo} style={{ width: '100%', padding: '10px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '5px', marginBottom: '10px' }}>SIMPAN</button>
            <button onClick={() => setEditData(null)} style={{ width: '100%', padding: '10px', background: '#444', color: '#fff', border: 'none', borderRadius: '5px' }}>BATAL</button>
          </div>
        </div>
      )}
    </div>
  )
}
