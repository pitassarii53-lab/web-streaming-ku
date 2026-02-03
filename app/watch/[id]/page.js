"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useParams } from 'next/navigation'

const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
const supabase = createClient(SB_URL, SB_KEY)

export default function Watch() {
  const { id } = useParams()
  const [video, setVideo] = useState(null)

  useEffect(() => {
    const fetchVideo = async () => {
      const { data } = await supabase.from('videos').select('*').eq('id', id).single()
      if (data) setVideo(data)
    }
    fetchVideo()
  }, [id])

  if (!video) return <div style={{background:'#000', minHeight:'100vh', color:'#fff', padding:'20px'}}>Memuat video...</div>

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'Arial' }}>
      {/* Tombol Back */}
      <nav style={{ padding: '20px', background: '#141414' }}>
        <a href="/" style={{ color: '#E50914', textDecoration: 'none', fontWeight: 'bold' }}>← KEMBALI</a>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        {/* Video Besar */}
        <div style={{ position: 'relative', paddingTop: '56.25%', background: '#111', borderRadius: '8px', overflow: 'hidden' }}>
          <iframe 
            src={video.url} 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} 
            allowFullScreen
          ></iframe>
        </div>

        {/* Judul Saja */}
        <h1 style={{ marginTop: '20px', fontSize: '2rem' }}>{video.title}</h1>
      </div>
    </div>
  )
}
