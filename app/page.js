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
      if (data) {
        setVideos(data)
        setFilteredVideos(data)
      }
    }
    ambilData()
  }, [])

  useEffect(() => {
    const hasil = videos.filter(v => v.title.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredVideos(hasil)
  }, [searchTerm, videos])

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <nav style={{ padding: '15px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', position: 'fixed', width: '100%', zIndex: 10, boxSizing: 'border-box', borderBottom: '1px solid #222' }}>
        <h1 style={{ color: '#E50914', margin: 0, fontSize: '1.4rem' }}>STREAMINGKU</h1>
        <input placeholder="Cari video..." onChange={(e) => setSearchTerm(e.target.value)} style={{ background: '#111', color: '#fff', border: '1px solid #333', padding: '8px 15px', borderRadius: '5px', width: '150px' }} />
      </nav>

      <div style={{ paddingTop: '90px', paddingLeft: '5%', paddingRight: '5%', paddingBottom: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px' }}>
          {filteredVideos.map((vid) => (
            <a href={`/watch/${vid.id}`} key={vid.id} style={{ textDecoration: 'none', color: '#fff' }}>
              <div style={{ position: 'relative', paddingTop: '150%', borderRadius: '10px', overflow: 'hidden', background: '#1a1a1a', border: '1px solid #333' }}>
                <img 
                  src={vid.thumbnail} 
                  alt={vid.title}
                  referrerPolicy="no-referrer" // JURUS PAMUNGKAS DI SINI
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/300x450?text=Reload+Page"; }}
                />
              </div>
              <h3 style={{ fontSize: '0.75rem', marginTop: '10px', textAlign: 'center', fontWeight: '400', height: '2.4em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {vid.title}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
