"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// --- KONFIGURASI ---
const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
const supabase = createClient(SB_URL, SB_KEY)

export default function Home() {
  const [videos, setVideos] = useState([])
  const [filteredVideos, setFilteredVideos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ambilData = async () => {
      const { data } = await supabase.from('videos').select('*').order('id', { ascending: false })
      if (data) {
        setVideos(data)
        setFilteredVideos(data)
      }
      setLoading(false)
    }
    ambilData()
  }, [])

  // Fungsi Filter Pencarian
  useEffect(() => {
    const hasilCari = videos.filter(video =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredVideos(hasilCari)
  }, [searchTerm, videos])

  return (
    <div style={{ backgroundColor: '#141414', color: '#fff', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Navbar dengan Search Bar */}
      <nav style={{ 
        padding: '15px 4%', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: '#000', 
        position: 'fixed', 
        top: 0, 
        width: '100%', 
        zIndex: 100 
      }}>
        <h1 style={{ color: '#E50914', fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>STREAMINGKU</h1>
        
        <div style={{ position: 'relative' }}>
          <input 
            type="text"
            placeholder="Cari judul video..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              background: 'rgba(0,0,0,0.75)', 
              color: 'white', 
              border: '1px solid #fff', 
              padding: '8px 15px', 
              borderRadius: '4px',
              width: '250px',
              fontSize: '0.9rem'
            }}
          />
        </div>
      </nav>

      {/* Spasi agar konten tidak tertutup Navbar */}
      <div style={{ paddingTop: '80px', paddingLeft: '4%', paddingRight: '4%' }}>
        
        <h2 style={{ fontSize: '1.8rem', margin: '20px 0' }}>
          {searchTerm ? `Hasil pencarian: "${searchTerm}"` : "Koleksi Terbaru"}
        </h2>
        
        {loading ? (
          <p>Memuat database...</p>
        ) : filteredVideos.length === 0 ? (
          <p style={{ color: '#888' }}>Video tidak ditemukan. Coba kata kunci lain.</p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '25px',
            paddingBottom: '50px'
          }}>
            {filteredVideos.map((vid) => (
              <div key={vid.id} className="card" style={{ background: '#181818', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                  <iframe 
                    src={vid.url} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} 
                    allowFullScreen
                  ></iframe>
                </div>
                <div style={{ padding: '15px' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>{vid.title}</h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .card { transition: transform 0.2s; }
        .card:hover { transform: translateY(-5px); border: 1px solid #E50914; }
      `}</style>
    </div>
  )
}
