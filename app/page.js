"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
const supabase = createClient(SB_URL, SB_KEY)

export default function Home() {
  const [videos, setVideos] = useState([])
  const [filteredVideos, setFilteredVideos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const ambilData = async () => {
      const { data } = await supabase.from('videos').select('*').order('id', { ascending: false })
      if (data) { setVideos(data); setFilteredVideos(data); }
    }
    ambilData()
  }, [])

  useEffect(() => {
    const hasil = videos.filter(v => v.title.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredVideos(hasil)
  }, [searchTerm, videos])

  return (
    <div style={{ backgroundColor: '#141414', color: '#fff', minHeight: '100vh', fontFamily: 'Arial' }}>
      <nav style={{ padding: '15px 4%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', position: 'fixed', width: '100%', zIndex: 100 }}>
        <h1 style={{ color: '#E50914', margin: 0, fontSize: '1.2rem' }}>STREAMINGKU</h1>
        <input placeholder="Cari..." onChange={(e) => setSearchTerm(e.target.value)} style={{ background: '#333', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', width: '150px' }} />
      </nav>

      <div style={{ paddingTop: '80px', paddingLeft: '4%', paddingRight: '4%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' }}>
          {filteredVideos.map((vid) => (
            <a href={`/watch/${vid.id}`} key={vid.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card">
                <div style={{ position: 'relative', paddingTop: '140%', borderRadius: '8px', overflow: 'hidden', background: '#222' }}>
                  <img 
                    src={vid.thumbnail || "https://via.placeholder.com/300x450?text=No+Poster"} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <h4 style={{ fontSize: '0.85rem', marginTop: '8px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{vid.title}</h4>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        .card { transition: transform 0.2s; }
        .card:hover { transform: scale(1.05); }
      `}</style>
    </div>
  )
}
