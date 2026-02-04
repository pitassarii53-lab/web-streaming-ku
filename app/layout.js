import "./globals.css";
import Script from "next/script";

// GANTI DENGAN LINK CHANNEL TELEGRAM KAMU
const TELEGRAM_LINK = "https://t.me/+d9TcoaiEqwQ3M2U1"; 

export const metadata = {
  title: "STREAMINGKU - Nonton Film Gratis",
  description: "Streaming film terbaru kualitas tinggi tanpa iklan banner",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* Adsterra Pop-under */}
        <Script 
          src="//pl25944186.highperformanceformat.com/8a/83/87/8a83870624029471f83c182582736142.js" 
          strategy="lazyOnload" 
        />
      </head>
      <body style={{ margin: 0, backgroundColor: '#000', color: '#fff' }}>
        {children}

        {/* --- TOMBOL TELEGRAM MELAYANG DENGAN NOTIFIKASI --- */}
        <div style={{ position: 'fixed', bottom: '25px', right: '20px', zIndex: 10000 }}>
          <a 
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '60px',
              height: '60px',
              backgroundColor: '#0088cc',
              borderRadius: '50%',
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
              textDecoration: 'none',
              transition: 'transform 0.3s ease',
              position: 'relative'
            }}
          >
            {/* Icon Pesawat Kertas Telegram */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>

            {/* TITIK MERAH BERKEDIP (Notification Dot) */}
            <span style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '15px',
              height: '15px',
              backgroundColor: '#ff0000',
              borderRadius: '50%',
              border: '2px solid #fff',
              zIndex: 1
            }}>
              <span style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#ff0000',
                borderRadius: '50%',
                animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                opacity: 0.75
              }}></span>
            </span>
          </a>
        </div>

        {/* CSS UNTUK ANIMASI BERKEDIP */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes ping {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
        `}} />
      </body>
    </html>
  );
}
