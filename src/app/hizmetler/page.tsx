'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { useDb } from '../../context/DbContext';

function ServiceCard({ srv, idx, language }: { srv: any; idx: number; language: string }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const appointmentUrl = `/?service=${encodeURIComponent(srv.titleTr)}#randevu`;

  return (
    <div 
      style={{ 
        perspective: '1000px',
        height: '300px',
        cursor: 'pointer'
      }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        style={{ 
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          borderRadius: '8px'
        }}
      >
        {/* FRONT SIDE */}
        <div 
          style={{ 
            position: 'absolute',
            inset: 0,
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            backgroundColor: 'var(--color-card-bg)', 
            border: '1px solid var(--color-border)', 
            borderRadius: '8px',
            padding: '2rem 1.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}
        >
          <span style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '2.8rem', fontWeight: 900, color: 'var(--color-primary)', opacity: 0.1, userSelect: 'none', pointerEvents: 'none' }}>
            {(idx + 1).toString().padStart(2, '0')}
          </span>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-primary)', lineHeight: 1.35, margin: 0 }}>
              {language === 'tr' ? srv.titleTr : srv.titleEn}
            </h3>
          </div>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.4rem 0.95rem',
            borderRadius: '20px',
            border: '1px solid rgba(189, 149, 75, 0.35)',
            backgroundColor: 'rgba(189, 149, 75, 0.06)',
            color: 'var(--color-accent)',
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>
            <span>{language === 'tr' ? 'İncele' : 'Explore'}</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
              <path d="M16 16h5v5"/>
            </svg>
          </div>
        </div>

        {/* BACK SIDE */}
        <div 
          style={{ 
            position: 'absolute',
            inset: 0,
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: 'var(--color-card-bg)', 
            border: '1px solid var(--color-accent)', 
            borderRadius: '8px',
            padding: '1.75rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(189, 149, 75, 0.15)'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-primary)', margin: 0, paddingRight: '0.5rem', lineHeight: 1.3 }}>
                {language === 'tr' ? srv.titleTr : srv.titleEn}
              </h4>
              <span style={{ fontSize: '0.9rem', color: 'var(--color-accent)', opacity: 0.7, padding: '0 0.2rem', cursor: 'pointer' }}>✕</span>
            </div>
            <p style={{ opacity: 0.9, lineHeight: 1.5, fontSize: '0.95rem', margin: 0 }}>
              {language === 'tr' ? srv.descriptionTr : srv.descriptionEn}
            </p>
          </div>

          <Link 
            href={appointmentUrl}
            onClick={(e) => e.stopPropagation()}
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.75rem 1.2rem',
              backgroundColor: 'var(--color-accent)',
              color: '#fff',
              borderRadius: '4px',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
              textAlign: 'center',
              transition: 'var(--transition-smooth)',
              cursor: 'pointer',
              marginTop: '0.75rem'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            {language === 'tr' ? 'Randevu Oluştur' : 'Book Appointment'}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const { t, language } = useLanguage();
  const { services: rawServices, fetchServicesLazy } = useDb();

  useEffect(() => {
    fetchServicesLazy?.();
  }, [fetchServicesLazy]);

  const servicesList = React.useMemo(() => {
    return [...rawServices].sort((a, b) => a.displayOrder - b.displayOrder);
  }, [rawServices]);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '6rem 2rem 2rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 className="section-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          {language === 'tr' ? 'Hizmetlerimiz' : 'Our Services'}
        </h1>
        <p style={{ opacity: 0.8, maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.6 }}>
          {language === 'tr' ? 'Lale Perde ayrıcalığıyla pencerelerinize kusursuz dokunuşlar katıyoruz.' : 'We add flawless touches to your windows with the privilege of Lale Perde.'}
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        {servicesList.map((srv, idx) => (
          <ServiceCard key={srv.id || idx} srv={srv} idx={idx} language={language} />
        ))}
      </div>
    </div>
  );
}
