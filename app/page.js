"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// --- ISI MANUAL (Sama dengan di halaman Admin tadi) ---
const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
// ------------------------------------------------------

const supabase = createClient(SB_URL, SB_KEY)

export default function Home() {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    const ambilData = async () => {
      // Menarik semua data dari tabel 'videos'
      const { data } = await supabase.from('videos').select('*')
      if (data) setVideos(data)
    }
    ambilData()
  }, [])

  return (
    <div style={{ backgroundColor: '#000', color: 'white', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#3b82f6', fontSize: '2.5rem', marginBottom: '40px' }}>
        🎬 My Streaming Web
      </h1>

      {videos.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Belum ada video. Yuk upload di panel admin!</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '25px' 
        }}>
          {videos.map((vid) => (
            <div key={vid.id} style={{ background: '#111', padding: '15px', borderRadius: '15px', border: '1px solid #222' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>{vid.title}</h3>
              <div style={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden', borderRadius: '8px' }}>
                <iframe 
                  src={vid.url} 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
