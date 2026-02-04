import "./globals.css";
import Script from "next/script";

const TELEGRAM_LINK = "https://t.me/+d9TcoaiEqwQ3M2U1";

export const metadata = {
  title: "STREAMINGKU - Nonton Film Gratis",
  description: "Streaming film terbaru tanpa iklan banner",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <Script 
          src="https://pl27333728.effectivegatecpm.com/e4/6a/bf/e46abf385099c2b5d894dbb1c522e30c.js" 
          strategy="afterInteractive" 
        />
      </head>
      <body style={{ margin: 0, backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
        {children}

        {/* TOMBOL TELEGRAM */}
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
              textDecoration: 'none'
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            <span style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '12px',
              height: '12px',
              backgroundColor: '#ff0000',
              borderRadius: '50%',
              border: '2px solid #fff'
            }}></span>
          </a>
        </div>
      </body>
    </html>
  );
}
