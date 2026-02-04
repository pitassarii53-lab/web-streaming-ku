"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// 1. KONFIGURASI SUPABASE
const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
const supabase = createClient(SB_URL, SB_KEY)

export default function Home() {
  const [videos, setVideos] = useState([])
  const [filteredVideos, setFilteredVideos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const ambilData = async () => {
      const { data } = await supabase
        .from('videos')
        .select('*')
        .order('id', { ascending: false })
      
      if (data) {
        setVideos(data)
        setFilteredVideos(data)
      }
    }
    ambilData()
  }, [])

  useEffect(() => {
    const hasil = videos.filter(v => 
      v.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredVideos(hasil)
  }, [searchTerm, videos])

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* NAVBAR */}
      <nav style={{ 
        padding: '15px 5%', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: 'rgba(0,0,0,0.95)', 
        position: 'fixed', 
        width: '100%', 
        zIndex: 100,
        boxSizing: 'border-box',
        borderBottom: '1px solid #222'
      }}>
        <h1 style={{ color: '#E50914', margin: 0, fontSize: '1.3rem', fontWeight: 'bold', letterSpacing: '1px' }}>STREAMINGKU</h1>
        <input 
          placeholder="Cari film..." 
          onChange={(e) => setSearchTerm(e.target.value)} 
          style={{ 
            background: '#111', 
            color: '#fff', 
            border: '1px solid #444', 
            padding: '8px 12px', 
            borderRadius: '5px',
            outline: 'none',
            width: '130px'
          }} 
        />
      </nav>

      {/* GRID KONTEN */}
      <div style={{ paddingTop: '90px', paddingLeft: '4%', paddingRight: '4%', paddingBottom: '40px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', 
          gap: '12px' 
        }}>
          {filteredVideos.map((vid) => {
            // JURUS ANTI-BLANK ANDROID: Gunakan Proxy Weserv + No-Referrer
            // Kita bungkus link thumbnail aslinya
            const proxyUrl = vid.thumbnail 
              ? `https://images.weserv.nl/?url=${encodeURIComponent(vid.thumbnail)}&w=300&output=webp` 
              : "https://via.placeholder.com/300x450?text=No+Image";

            return (
              <a href={`/watch/${vid.id}`} key={vid.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ 
                  position: 'relative', 
                  paddingTop: '145%', 
                  borderRadius: '8px', 
                  overflow: 'hidden', 
                  background: '#111',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                }}>
                  <img 
                    src={proxyUrl} 
                    alt={vid.title}
                    referrerPolicy="no-referrer" // <--- Menghapus jejak agar tidak diblokir Android
                    loading="lazy"
                    style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }} 
                    onError={(e) => { e.target.src = "https://via.placeholder.com/300x450?text=Error+Image" }}
                  />
                </div>
                <h4 style={{ 
                  fontSize: '0.75rem', 
                  marginTop: '8px', 
                  textAlign: 'center', 
                  fontWeight: 'normal',
                  height: '2.5em',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {vid.title}
                </h4>
              </a>
            )
          })}
        </div>

        {filteredVideos.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>Video tidak ditemukan...</p>
        )}
      </div>
    </div>
  )
}
