'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#1a2e40',
          color: '#ffffff',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <h1 style={{ color: '#bd954b', marginBottom: '1rem' }}>Üzgünüz, Sistemsel Bir Hata Oluştu</h1>
          <p style={{ opacity: 0.8, marginBottom: '2rem' }}>Uygulama çalışırken beklenmeyen bir durumla karşılaşıldı. Lütfen sayfayı yenilemeyi deneyin.</p>
          <button 
            onClick={() => reset()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#bd954b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Yeniden Dene
          </button>
        </div>
      </body>
    </html>
  );
}
