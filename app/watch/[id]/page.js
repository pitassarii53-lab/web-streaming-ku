"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useParams } from 'next/navigation'

const SB_URL = "https://wakwbmuanzglmawqzopi.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indha3dibXVhbnpnbG1hd3F6b3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDc5MjYsImV4cCI6MjA4NTY4MzkyNn0.oVcKaJY9-RNu4QSk32fi3h8Lb-mBm4FXFuEfwKFmLZo"
const supabase = createClient(SB_URL, SB_KEY)

export default function WatchPage() {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [related, setRelated] = useState([])
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    if (id) {
      fetchVideoDetail()
      fetchRelated()
      setCurrentUrl(window.location.href) // Ambil link buat di-share
    }
  }, [id])

  const fetchVideoDetail = async () => {
    const { data } = await supabase.from('videos').select('*').eq('id', id).single()
    if (data) setVideo(data)
  }

  const fetchRelated = async () => {
    const { data } = await supabase.from('videos').select('*').limit(10).order('id', { ascending: false })
    if (data) setRelated(data.filter(v => v.id != id))
  }

  const shareTo = (platform) => {
    const text = `Nonton ${video.title} gratis di sini! 🍿`
    const url = encodeURIComponent(currentUrl)
    let shareUrl = ""

    if (platform === 'wa') shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`
    if (platform === 'tg') shareUrl = `https://t.me/share/url?url=${url}&text=${text}`
    if (platform === 'copy') {
      navigator.clipboard.writeText(currentUrl)
      alert("Link berhasil disalin!")
      return
    }
    window.open(shareUrl, '_blank')
  }

  if (!video) return <div style={{ background: '#000', height: '100vh', color: '#fff', textAlign: 'center', paddingTop: '100px' }}>Memuat Video...</div>

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      <nav style={{ padding: '15px 5%', background: '#000', borderBottom: '1px solid #222' }}>
        <a href="/" style={{ color: '#E50914', textDecoration: 'none', fontWeight: 'bold' }}>← BERANDA</a>
      </nav>

      <div style={{ padding: '20px 5%', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* PLAYER */}
        <div style={{ position: 'relative', paddingTop: '56.25%', background: '#111', borderRadius: '12px', overflow: 'hidden' }}>
          <iframe src={video.url} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen />
        </div>

        {/* INFO & SHARE */}
        <div style={{ marginTop: '20px' }}>
          <h1 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>{video.title}</h1>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button onClick={() => shareTo('wa')} style={{ background: '#25D366', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>WhatsApp</button>
            <button onClick={() => shareTo('tg')} style={{ background: '#0088cc', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>Telegram</button>
            <button onClick={() => shareTo('copy')} style={{ background: '#444', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>Salin Link</button>
          </div>
          
          <div style={{ height: '1px', background: '#222', width: '100%' }}></div>
        </div>

        {/* REKOMENDASI */}
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ fontSize: '1rem', color: '#E50914', marginBottom: '15px' }}>REKOMENDASI</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '15px' }}>
            {related.map((v) => (
              <a href={`/watch/${v.id}`} key={v.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ position: 'relative', paddingTop: '145%', background: '#111', borderRadius: '8px', overflow: 'hidden' }}>
                  <img 
                    src={`https://images.weserv.nl/?url=${encodeURIComponent(v.thumbnail)}&w=300`} 
                    referrerPolicy="no-referrer"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <p style={{ fontSize: '0.7rem', marginTop: '5px', textAlign: 'center', height: '2.4em', overflow: 'hidden' }}>{v.title}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
