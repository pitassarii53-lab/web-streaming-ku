"use client"
import { useEffect, useState } from 'react'

export default function BridgePage() {
  const [countdown, setCountdown] = useState(3);
  const WEB_UTAMA = "/"; // Mengarah ke beranda web kamu
  const TELEGRAM_LINK = "https://t.me/+d9TcoaiEqwQ3M2U1"; // Ganti link tele kamu

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ 
      backgroundColor: '#0a0a0a', 
      color: '#fff', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: 'sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      {/* Tampilan seperti Portal Berita/Informasi agar aman dari bot Threads */}
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <h1 style={{ color: '#E50914', fontSize: '1.5rem', marginBottom: '10px' }}>INFO STREAMING</h1>
        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '30px' }}>
          Terima kasih telah berkunjung. Klik tombol di bawah untuk menuju server nonton.
        </p>

        {/* TOMBOL UTAMA */}
        <a href={WEB_UTAMA} style={{ 
          display: 'block', 
          background: '#E50914', 
          color: '#fff', 
          textDecoration: 'none', 
          padding: '15px', 
          borderRadius: '30px', 
          fontWeight: 'bold',
          marginBottom: '15px',
          boxShadow: '0 4px 15px rgba(229, 9, 20, 0.4)'
        }}>
          MULAI NONTON SEKARANG
        </a>

        {/* TOMBOL TELEGRAM (Back-up kalau web utama keblokir) */}
        <a href={TELEGRAM_LINK} style={{ 
          display: 'block', 
          background: '#0088cc', 
          color: '#fff', 
          textDecoration: 'none', 
          padding: '12px', 
          borderRadius: '30px', 
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          JOIN GRUP UPDATE FILM
        </a>

        <div style={{ marginTop: '40px', fontSize: '0.8rem', color: '#444' }}>
          <p>Situs ini aman dan bebas malware.</p>
          <p>© 2026 Portal Media Indonesia</p>
        </div>
      </div>
    </div>
  )
}
