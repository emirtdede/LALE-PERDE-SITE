'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../../../context/LanguageContext';
import { Product, SystemSettings } from '../../../context/dbTypes';
import { useDb } from '../../../context/DbContext';
import { useGoogleAds } from '../../../context/GoogleAdsContext';

interface ProductDetailClientProps {
  initialProduct: Product;
}

export default function ProductDetailClient({ initialProduct }: ProductDetailClientProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { trackConversion } = useGoogleAds();

  const [product] = useState<Product>(initialProduct);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Image zoom lightbox states
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (zoomScale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      e.currentTarget.setPointerCapture(e.pointerId);
    } else {
      setZoomScale(1.5);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging && zoomScale > 1) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const zoomFactor = 0.125;
    setZoomScale(prev => {
      let nextScale = prev;
      if (e.deltaY < 0) {
        nextScale = Math.min(prev + zoomFactor, 4);
      } else {
        nextScale = Math.max(prev - zoomFactor, 1);
      }
      if (nextScale <= 1) {
        setPanOffset({ x: 0, y: 0 });
      }
      return nextScale;
    });
  };

  useEffect(() => {
    if (isZoomOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isZoomOpen]);

  // Measuring inputs
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  const { settings: dbSettings } = useDb();

  useEffect(() => {
    if (product) {
      if (product.images && product.images.length > 0) {
        setActiveImage(product.images[0]);
      } else if (product.coverImage) {
        setActiveImage(product.coverImage);
      }
    }
  }, [product]);

  useEffect(() => {
    if (dbSettings) {
      setSettings(dbSettings);
    }
  }, [dbSettings]);

  // Handle live calculation
  useEffect(() => {
    if (!product || !width || !height) {
      setEstimatedPrice(null);
      return;
    }
    const w = parseFloat(width);
    const h = parseFloat(height);
    if (!isNaN(w) && !isNaN(h)) {
      // Calculate a rough estimated price
      const price = w * h * product.priceMultiplier;
      setEstimatedPrice(Math.round(price));
    }
  }, [width, height, product]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleWhatsAppQuote = () => {
    const latestSettings = dbSettings || settings;
    if (!latestSettings) return;

    const w = width.trim();
    const h = height.trim();
    const categoryName = language === 'tr' ? product.categoryTr : product.categoryEn;
    const productName = language === 'tr' ? product.nameTr : product.nameEn;

    let messageText = '';
    if (w && h) {
      messageText = `Merhaba Lale Perde, ${categoryName} kategorisindeki "${productName}" ürünü için En: ${w} cm, Boy: ${h} cm ölçülerinde fiyat teklifi almak istiyorum.`;
    } else {
      messageText = `Merhaba Lale Perde, ${categoryName} kategorisindeki "${productName}" ürünü hakkında bilgi almak istiyorum.`;
    }

    // Filter non-digit characters from the phone number
    const cleanPhone = latestSettings.whatsappNumber.replace(/\D/g, '');
    const wpUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(messageText)}`;

    // Track Google Ads Conversion
    trackConversion('whatsapp');

    // Open WhatsApp in a new tab
    window.open(wpUrl, '_blank');
  };

  return (
    <div className="product-detail-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '6rem 2rem 4rem', minHeight: 'calc(100vh - 220px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Link href="/urunler" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem', color: 'var(--color-accent)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
        ← {t('catalog.backToCatalog')}
      </Link>

      <div className="product-detail-layout" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'start' }}>
        {/* Left Column: Image Gallery */}
        <div>
          <div 
            className="product-detail-image-wrapper" 
            onClick={() => { setIsZoomOpen(true); setZoomScale(1); setPanOffset({ x: 0, y: 0 }); }}
            style={{ position: 'relative', height: '550px', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem', backgroundColor: 'var(--color-neutral)', cursor: 'zoom-in' }}
          >
            <Image 
              src={activeImage || '/assets/hero.png'} 
              alt={language === 'tr' ? product.nameTr : product.nameEn}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              {product.images.map((img, index) => (
                <div 
                  key={index}
                  onClick={() => setActiveImage(img)}
                  style={{ 
                    position: 'relative',
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '4px', 
                    overflow: 'hidden', 
                    cursor: 'pointer', 
                    border: activeImage === img ? '2px solid var(--color-accent)' : '1px solid var(--color-border)' 
                  }}
                >
                  <Image src={img} alt="Varyant" fill style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Calculator */}
        <div>
          <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-accent)', letterSpacing: '0.05em', fontWeight: 600 }}>
            {language === 'tr' ? product.categoryTr : product.categoryEn}
          </span>
          <h1 className="product-detail-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', margin: '0.5rem 0 1.5rem', color: 'var(--color-primary)', whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: '1.2' }}>
            {language === 'tr' ? product.nameTr : product.nameEn}
          </h1>

          <div style={{ paddingBottom: '2rem', borderBottom: '1px solid var(--color-border)', marginBottom: '2rem' }}>
            <h4 className="product-detail-label" style={{ textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--color-accent)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              {t('catalog.fabricType')}
            </h4>
            <p style={{ fontSize: '1.05rem', fontWeight: 400 }}>
              {language === 'tr' ? product.fabricTypeTr : product.fabricTypeEn}
            </p>
          </div>

          <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.7, marginBottom: '2rem' }}>
            {language === 'tr' ? product.descriptionTr : product.descriptionEn}
          </p>

          {/* Colors available */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 className="product-detail-label" style={{ textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--color-accent)', marginBottom: '0.8rem', letterSpacing: '0.05em' }}>
              {t('catalog.color')}
            </h4>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {product.colors.map((color, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: color.hex, border: '1px solid rgba(0,0,0,0.1)' }} />
                  <span style={{ fontSize: '0.9rem' }}>{language === 'tr' ? color.nameTr : color.nameEn}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech specs */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h4 className="product-detail-label" style={{ textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--color-accent)', marginBottom: '0.8rem', letterSpacing: '0.05em' }}>
              {language === 'tr' ? 'Özellikler' : 'Specs'}
            </h4>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.95rem', opacity: 0.8 }}>
              {(language === 'tr' ? product.techSpecsTr : product.techSpecsEn).map((spec, i) => (
                <li key={i} style={{ marginBottom: '0.4rem' }}>{spec}</li>
              ))}
            </ul>
          </div>

            <button 
              onClick={() => {
                setIsRedirecting(true);
                setTimeout(() => {
                  router.push(`/olcu-sihirbazi?product=${product.id}`);
                }, 2800);
              }}
              className="btn-primary" 
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', padding: '1rem 2rem' }}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.031 2C6.49 2 2 6.48 2 12.01c0 1.77.46 3.49 1.34 5.01L2 22l5.12-1.34c1.47.8 3.12 1.22 4.9 1.22 5.54 0 10.03-4.48 10.03-10.01C22.05 6.48 17.56 2 12.03 2zm4.8 13.86c-.27.76-1.34 1.39-1.85 1.49-.46.09-.94.13-2.93-.68-2.54-1.04-4.18-3.62-4.31-3.79-.12-.17-.99-1.32-.99-2.51 0-1.2.62-1.78.84-2.03.22-.25.47-.31.62-.31.15 0 .31 0 .44.01.14 0 .32-.05.5.38.18.43.62 1.51.68 1.63.06.12.1.26.02.43-.08.17-.12.28-.25.43-.12.15-.26.33-.37.45-.12.13-.25.27-.11.51.14.24.63 1.03 1.36 1.68.93.83 1.72 1.09 1.97 1.21.25.12.39.1.53-.06.14-.17.62-.72.79-.97.17-.25.34-.21.58-.12.24.09 1.51.71 1.77.84.26.13.43.19.49.3.06.11.06.66-.21 1.42z"/>
              </svg>
              {t('catalog.sendWpBtn')}
            </button>
        </div>
      </div>

      {/* Redirect Screen Overlay */}
      {isRedirecting && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(10, 17, 24, 0.96)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 99999,
          color: '#FFF',
          fontFamily: 'var(--font-sans)',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            maxWidth: '500px',
            width: '90%',
            padding: '3rem 2rem',
            backgroundColor: '#0F1820',
            border: '1px solid rgba(189, 149, 75, 0.4)',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.8rem',
            animation: 'scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{ position: 'relative', width: '70px', height: '70px' }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '2px solid rgba(212, 175, 55, 0.1)',
                borderTopColor: '#D4AF37',
                animation: 'spin 1.2s linear infinite'
              }} />
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'pulse-custom 1.8s infinite' }}>
                  <path d="M21.3 8.11L15.89 2.7a1 1 0 0 0-1.41 0L2.7 14.48a1 1 0 0 0 0 1.41l5.41 5.41a1 1 0 0 0 1.41 0L21.3 9.52a1 1 0 0 0 0-1.41z" />
                  <line x1="6.3" y1="9.12" x2="7.71" y2="7.71" />
                  <line x1="9.13" y1="11.95" x2="11.96" y2="9.12" />
                  <line x1="11.96" y1="14.78" x2="13.37" y2="13.37" />
                  <line x1="14.78" y1="17.6" x2="17.61" y2="14.78" />
                </svg>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: '#D4AF37', fontSize: '1.5rem', margin: 0, letterSpacing: '0.02em', fontWeight: 500 }}>
                {language === 'tr' ? 'Ölçüm Sihirbazına Yönlendiriliyorsunuz' : 'Redirecting to Measurement Wizard'}
              </h3>
              <p style={{ color: '#A3B3C2', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                {language === 'tr' 
                  ? `"${product.nameTr}" ürünü için ölçüm sihirbazına yönlendiriliyorsunuz. Ölçülerinizi girdikten sonra doğrudan teklif alabilirsiniz.`
                  : `You are being redirected to the measurement wizard for "${product.nameEn}". You can request a quote right after entering your dimensions.`}
              </p>
            </div>

            <div style={{
              width: '100%',
              height: '3px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '2.5px',
              overflow: 'hidden',
              marginTop: '0.5rem'
            }}>
              <div style={{
                height: '100%',
                backgroundColor: '#D4AF37',
                width: '0%',
                animation: 'fillProgress 2.8s linear forwards'
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Zoom Modal Overlay */}
      {isZoomOpen && (
        <div 
          onClick={() => setIsZoomOpen(false)}
          onWheel={handleWheel}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(10, 17, 24, 0.95)',
            zIndex: 999999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'zoom-out',
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          {/* Zoom controls panel */}
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              display: 'flex',
              gap: '10px',
              zIndex: 1000000,
              backgroundColor: 'rgba(15, 27, 39, 0.85)',
              padding: '8px 12px',
              borderRadius: '30px',
              border: '1px solid rgba(189, 149, 75, 0.3)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <button 
              onClick={() => setZoomScale(prev => Math.min(prev + 0.25, 4))}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFF',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              title={language === 'tr' ? 'Yakınlaştır' : 'Zoom In'}
            >
              +
            </button>
            <button 
              onClick={() => setZoomScale(prev => {
                const next = prev - 0.25;
                if (next <= 1) {
                  setPanOffset({ x: 0, y: 0 });
                  return 1;
                }
                return next;
              })}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFF',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              title={language === 'tr' ? 'Uzaklaştır' : 'Zoom Out'}
            >
              -
            </button>
            <button 
              onClick={() => { setZoomScale(1); setPanOffset({ x: 0, y: 0 }); }}
              style={{
                padding: '0 12px',
                height: '36px',
                borderRadius: '18px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFF',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            >
              {language === 'tr' ? 'Sıfırla' : 'Reset'}
            </button>
            <button 
              onClick={() => setIsZoomOpen(false)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-accent)',
                border: 'none',
                color: '#FFF',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              ✕
            </button>
          </div>

          {/* Draggable/Pannable Image Container */}
          <div 
            onClick={(e) => e.stopPropagation()}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              position: 'relative',
              width: '90%',
              height: '80%',
              maxWidth: '1000px',
              maxHeight: '700px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              cursor: zoomScale > 1 ? 'grab' : 'zoom-in',
              touchAction: 'none'
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
                transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.1, 0.8, 0.25, 1)',
                pointerEvents: 'none',
                userSelect: 'none'
              }}
            >
              <Image 
                src={activeImage || '/assets/hero.png'} 
                alt={language === 'tr' ? product.nameTr : product.nameEn}
                fill
                style={{ objectFit: 'contain' }}
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
