'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';
import { useDb } from '../../context/DbContext';
import { Category, Product } from '../../context/dbTypes';

interface MeasureWizardClientProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

// Category limits definition
export const CATEGORY_LIMITS: Record<string, { label: string; labelEn: string; min_width: number; max_width: number; min_height: number; max_height: number }> = {
  "ev": { label: "Ev", labelEn: "Home", min_width: 40, max_width: 600, min_height: 60, max_height: 350 },
  "ofis": { label: "Ofis / Kurumsal", labelEn: "Office / Corporate", min_width: 50, max_width: 400, min_height: 100, max_height: 400 },
  "cami": { label: "Cami / İbadethane", labelEn: "Mosque / Place of Worship", min_width: 60, max_width: 300, min_height: 200, max_height: 1000 },
  "sahne": { label: "Sahne / Konferans", labelEn: "Stage / Conference", min_width: 300, max_width: 3000, min_height: 250, max_height: 1000 },
  "hastane": { label: "Hastane / Klinik", labelEn: "Hospital / Clinic", min_width: 150, max_width: 800, min_height: 150, max_height: 300 },
  "otel": { label: "Otel / Konaklama", labelEn: "Hotel / Lodging", min_width: 100, max_width: 800, min_height: 200, max_height: 400 },
  "dis_mekan": { label: "Dış Mekan / Teras", labelEn: "Outdoor / Terrace", min_width: 100, max_width: 600, min_height: 100, max_height: 400 },
  "endustriyel": { label: "Endüstriyel (PVC)", labelEn: "Industrial (PVC)", min_width: 80, max_width: 1000, min_height: 200, max_height: 600 },
  "karavan_tekne": { label: "Karavan / Tekne", labelEn: "RV / Boat", min_width: 20, max_width: 200, min_height: 20, max_height: 150 }
};

// Simple SVG Icons for step 1
const getCategoryIcon = (key: string) => {
  switch (key) {
    case 'ev':
      return <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
    case 'ofis':
      return <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
    case 'cami':
      return <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M17 5H7M12 5a5 5 0 0 1 5 5v12H7V10a5 5 0 0 1 5-5z"></path></svg>;
    case 'sahne':
      return <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 22h20M12 2a10 10 0 0 0-10 10v10h20V12A10 10 0 0 0 12 2z"></path><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path></svg>;
    case 'hastane':
      return <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>;
    case 'otel':
      return <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 17V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10M3 21h18M10 9h4M10 13h4M12 17v4"></path></svg>;
    case 'dis_mekan':
      return <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M6.34 17.66l-1.41 1.41M12 20v2M17.66 17.66l1.41 1.41M20 12h2M19.07 4.93l-1.41 1.41M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"></path></svg>;
    case 'endustriyel':
      return <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
    case 'karavan_tekne':
      return <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 18H2a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2z"></path><circle cx="6" cy="18" r="2"></circle><circle cx="18" cy="18" r="2"></circle><path d="M10 7v4h4V7"></path></svg>;
    default:
      return <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
  }
};

function MeasureWizardContent({ initialProducts, initialCategories }: MeasureWizardClientProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Wizard state: 1 = Category selection (Usage Area), 2 = Product Selection, 3 = Mechanism / Sub-type Selection, 4 = Width (A) Entry, 5 = Height (B) Entry
  const [step, setStep] = useState<number>(1);
  const { settings } = useDb();

  const categories = React.useMemo(() => {
    return initialCategories
      .filter(c => c.status === 'active')
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [initialCategories]);

  const products = React.useMemo(() => {
    return initialProducts.filter(p => p.status === 'active');
  }, [initialProducts]);

  // Selections
  const [selectedUsage, setSelectedUsage] = useState<string | null>(null);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSubtype, setSelectedSubtype] = useState<string | null>(null);

  // Width (A) and Height (B) in cm
  const [width, setWidth] = useState<number>(300);
  const [height, setHeight] = useState<number>(200);

  // Dragging states for 2D preview
  const [isDraggingWidth, setIsDraggingWidth] = useState(false);
  const [isDraggingHeight, setIsDraggingHeight] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Load URL parameter pre-selection
  useEffect(() => {
    const prodId = searchParams.get('product');
    if (prodId && products.length > 0 && categories.length > 0) {
      const matchedProd = products.find(p => p.id === prodId);
      if (matchedProd) {
        const matchedCat = categories.find(c => c.id === matchedProd.categoryId);
        if (matchedCat) {
          setSelectedUsage("ev"); // default usage to ev
          setSelectedCat(matchedCat);
          setSelectedProduct(matchedProd);
          
          // Set initial measurements to fit the category limits
          const limits = CATEGORY_LIMITS["ev"];
          setWidth(Math.round((limits.min_width + limits.max_width) / 2));
          setHeight(Math.round((limits.min_height + limits.max_height) / 2));
          
          setStep(3); // skip to sub-type selection
        }
      }
    }
  }, [searchParams, products, categories]);

  // Limits based on selected usage
  const limits = React.useMemo(() => {
    if (!selectedUsage) return { min_width: 40, max_width: 600, min_height: 60, max_height: 350 };
    return CATEGORY_LIMITS[selectedUsage];
  }, [selectedUsage]);

  // Ensure measurements are within category limits when usage area changes
  useEffect(() => {
    if (selectedUsage) {
      const currentLimits = CATEGORY_LIMITS[selectedUsage];
      if (width < currentLimits.min_width) setWidth(currentLimits.min_width);
      if (width > currentLimits.max_width) setWidth(currentLimits.max_width);
      if (height < currentLimits.min_height) setHeight(currentLimits.min_height);
      if (height > currentLimits.max_height) setHeight(currentLimits.max_height);
    }
  }, [selectedUsage]);

  // Handle pointer events for 2D dragging
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingWidth && !isDraggingHeight) return;
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      
      if (isDraggingWidth) {
        const relativeX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = relativeX / rect.width;
        // Map 10% - 90% to category limits
        const newWidth = Math.round(limits.min_width + (percentage * (limits.max_width - limits.min_width)));
        setWidth(Math.max(limits.min_width, Math.min(limits.max_width, newWidth)));
      }

      if (isDraggingHeight) {
        const relativeY = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
        const percentage = relativeY / rect.height;
        // Map 10% - 90% to category limits
        const newHeight = Math.round(limits.min_height + (percentage * (limits.max_height - limits.min_height)));
        setHeight(Math.max(limits.min_height, Math.min(limits.max_height, newHeight)));
      }
    };

    const handlePointerUp = () => {
      setIsDraggingWidth(false);
      setIsDraggingHeight(false);
    };

    if (isDraggingWidth || isDraggingHeight) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDraggingWidth, isDraggingHeight, limits]);

  const handleWhatsAppQuote = () => {
    if (!settings || !selectedProduct || !selectedUsage) return;
    
    const catName = language === 'tr' ? selectedProduct.categoryTr : selectedProduct.categoryEn;
    const prodName = language === 'tr' ? selectedProduct.nameTr : selectedProduct.nameEn;
    const usageLabel = language === 'tr' ? CATEGORY_LIMITS[selectedUsage].label : CATEGORY_LIMITS[selectedUsage].labelEn;
    const subtypeLabel = selectedSubtype || (language === 'tr' ? 'Standart' : 'Standard');
    
    const text = `Merhaba, ${catName} / ${prodName} ürünü için kendi aldığım ölçülerle fiyat teklifi almak istiyorum. \n\n*BİLGİLER*\nKullanım Alanı: ${usageLabel}\nAlt Tip / Mekanizma: ${subtypeLabel}\n\n*ÖLÇÜLER*\nEn (A): ${width} cm\nBoy (B): ${height} cm\n\nLütfen net fiyat ve keşif için dönüş yapar mısınız?`;
    
    const cleanPhone = settings.whatsappNumber.replace(/\D/g, '');
    const wpUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
    window.open(wpUrl, '_blank');
  };

  const getStepColor = (currentStep: number) => {
    return step === currentStep ? 'var(--color-accent)' : (step > currentStep ? '#A3B3C2' : '#5C6C7C');
  };

  // Get dynamic subtype options based on product category
  const subtypeOptions = React.useMemo(() => {
    if (!selectedCat) return [];
    const catName = (selectedCat.nameTr || '').toLowerCase();
    
    if (catName.includes('tül') || catName.includes('fon')) {
      return [
        { id: 'normal_pile', label: 'Normal Pile (1:2.5)', desc: 'Ekonomik ve şık standart görünüm' },
        { id: 'sik_pile', label: 'Sık Pile (1:3)', desc: 'Zengin ve dolgun duruş' },
        { id: 'seyrek_pile', label: 'Seyrek Pile (1:2)', desc: 'Minimalist ve hafif dökümlü' }
      ];
    } else if (catName.includes('stor') || catName.includes('zebra')) {
      return [
        { id: 'manuel_zincir', label: 'Manuel Zincirli', desc: 'Standart mekanizmalı kontrol' },
        { id: 'motorlu_kumanda', label: 'Motorlu Kumandalı', desc: 'Uzaktan kumanda ile kontrol' },
        { id: 'akilli_somfy', label: 'Somfy Akıllı Motor', desc: 'Akıllı ev sistemlerine entegre motor' }
      ];
    } else {
      return [
        { id: 'standart_montaj', label: 'Standart Montaj Aparatı', desc: 'Korniş veya tavan/duvar montaj aparatları dahil' },
        { id: 'kolay_montaj', label: 'Kolay Montaj (Deliksiz)', desc: 'Pencere kasasına doğrudan sıkıştırmalı geçme' }
      ];
    }
  }, [selectedCat]);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 2rem 5rem', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '4rem', alignItems: 'start' }}>
      
      {/* Left Sidebar Layout */}
      <aside style={{ position: 'sticky', top: '100px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-text)', marginBottom: '1rem', lineHeight: 1.1, whiteSpace: 'nowrap' }}>
          {language === 'tr' ? 'Ölçü Sihirbazı' : 'Measure Wizard'}
        </h1>
        <p style={{ opacity: 0.8, fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '3rem' }}>
          {language === 'tr' 
            ? 'Pencereleriniz için doğru perde ölçüsünü adım adım hesaplayın.' 
            : 'Calculate the right curtain size for your windows step by step.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: getStepColor(1), marginBottom: '0.3rem', fontWeight: 600 }}>ADIM 01</div>
            <div style={{ fontSize: '1rem', color: step >= 1 ? 'var(--color-text)' : '#5C6C7C', fontWeight: 500, textTransform: 'uppercase' }}>1. KULLANIM ALANI</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: getStepColor(2), marginBottom: '0.3rem', fontWeight: 600 }}>ADIM 02</div>
            <div style={{ fontSize: '1rem', color: step >= 2 ? 'var(--color-text)' : '#5C6C7C', fontWeight: 500, textTransform: 'uppercase' }}>2. ÜRÜN SEÇİMİ</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: getStepColor(3), marginBottom: '0.3rem', fontWeight: 600 }}>ADIM 03</div>
            <div style={{ fontSize: '1rem', color: step >= 3 ? 'var(--color-text)' : '#5C6C7C', fontWeight: 500, textTransform: 'uppercase' }}>3. MEKANİZMA / TİP</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: getStepColor(4), marginBottom: '0.3rem', fontWeight: 600 }}>ADIM 04</div>
            <div style={{ fontSize: '1rem', color: step >= 4 ? 'var(--color-text)' : '#5C6C7C', fontWeight: 500, textTransform: 'uppercase' }}>4. GENİŞLİK (EN)</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: getStepColor(5), marginBottom: '0.3rem', fontWeight: 600 }}>ADIM 05</div>
            <div style={{ fontSize: '1rem', color: step >= 5 ? 'var(--color-text)' : '#5C6C7C', fontWeight: 500, textTransform: 'uppercase' }}>5. YÜKSEKLİK (BOY)</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div>
        {/* STEP 1: Usage Area Selection */}
        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '2rem' }}>
              {language === 'tr' ? 'Kullanım Alanını Seçin' : 'Select Usage Area'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {Object.entries(CATEGORY_LIMITS).map(([key, data]) => (
                <div 
                  key={key} 
                  style={{ 
                    backgroundColor: 'var(--color-card-bg)', 
                    borderRadius: '8px', 
                    padding: '2rem 1.5rem',
                    cursor: 'pointer',
                    border: selectedUsage === key ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    textAlign: 'center'
                  }} 
                  onMouseOver={(e) => {
                    if (selectedUsage !== key) e.currentTarget.style.borderColor = 'rgba(189, 149, 75, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    if (selectedUsage !== key) e.currentTarget.style.borderColor = 'var(--color-border)';
                  }}
                  onClick={() => {
                    setSelectedUsage(key);
                    setStep(2);
                  }}
                >
                  <div style={{ color: selectedUsage === key ? 'var(--color-accent)' : 'var(--color-primary)', marginBottom: '0.5rem' }}>
                    {getCategoryIcon(key)}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-text)', margin: '0 0 0.5rem' }}>
                      {language === 'tr' ? data.label : data.labelEn}
                    </h3>
                    <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: 0 }}>
                      {language === 'tr' 
                        ? `En: ${data.min_width}-${data.max_width}cm | Boy: ${data.min_height}-${data.max_height}cm`
                        : `W: ${data.min_width}-${data.max_width}cm | H: ${data.min_height}-${data.max_height}cm`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Product Category & Fabric/Product Selection */}
        {step === 2 && (
          <div>
            <button 
              onClick={() => setStep(1)}
              style={{ background: 'none', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: '20px', padding: '0.4rem 1rem', cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}
            >
              ← Kullanım Alanına Dön
            </button>

            {!selectedCat ? (
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '2rem' }}>
                  {language === 'tr' ? 'Perde Türünü Seçin' : 'Select Curtain Type'}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                  {categories.map(cat => (
                    <div 
                      key={cat.id} 
                      style={{ 
                        backgroundColor: 'var(--color-card-bg)', 
                        borderRadius: '8px', 
                        overflow: 'hidden', 
                        cursor: 'pointer',
                        border: '1px solid var(--color-border)',
                        transition: 'transform 0.3s ease'
                      }} 
                      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      onClick={() => setSelectedCat(cat)}
                    >
                      <div style={{ position: 'relative', height: '250px', width: '100%' }}>
                        <Image 
                          src={cat.image || '/assets/hero.png'} 
                          alt={language === 'tr' ? cat.nameTr : cat.nameEn}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-primary)', margin: 0 }}>
                          {language === 'tr' ? cat.nameTr : cat.nameEn}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
                  <button 
                    onClick={() => setSelectedCat(null)}
                    style={{ background: 'none', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: '20px', padding: '0.3rem 0.8rem', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    ← Tür Seçimine Dön
                  </button>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-primary)', margin: 0 }}>
                    {language === 'tr' ? selectedCat.nameTr : selectedCat.nameEn}
                  </h2>
                </div>

                {products.filter(p => p.categoryId === selectedCat.id).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.7 }}>
                    {language === 'tr' ? 'Bu kategoride henüz ürün bulunmuyor.' : 'No products found.'}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                    {products.filter(p => p.categoryId === selectedCat.id).map(prod => (
                      <div 
                        key={prod.id} 
                        style={{ 
                          backgroundColor: 'var(--color-card-bg)', 
                          borderRadius: '8px', 
                          overflow: 'hidden', 
                          cursor: 'pointer',
                          border: '1px solid var(--color-border)',
                          transition: 'transform 0.3s ease'
                        }} 
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        onClick={() => {
                          setSelectedProduct(prod);
                          
                          // Set default dimensions within limits
                          const currentLimits = CATEGORY_LIMITS[selectedUsage || 'ev'];
                          setWidth(Math.round((currentLimits.min_width + currentLimits.max_width) / 2));
                          setHeight(Math.round((currentLimits.min_height + currentLimits.max_height) / 2));
                          
                          setStep(3);
                        }}
                      >
                        <div style={{ position: 'relative', height: '250px', width: '100%' }}>
                          <Image 
                            src={prod.coverImage || (prod.images.length > 0 ? prod.images[0] : '/assets/hero.png')} 
                            alt={language === 'tr' ? prod.nameTr : prod.nameEn}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-primary)', margin: 0 }}>
                            {language === 'tr' ? prod.nameTr : prod.nameEn}
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Sub-type / Mechanism Selection */}
        {step === 3 && selectedProduct && (
          <div>
            <button 
              onClick={() => setStep(2)}
              style={{ background: 'none', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: '20px', padding: '0.4rem 1rem', cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}
            >
              ← Ürün Seçimine Dön
            </button>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
              {language === 'tr' ? 'Dikim / Mekanizma Seçimi' : 'Mechanism & Pleat Selection'}
            </h2>
            <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '2.5rem' }}>
              {language === 'tr' 
                ? 'Perdenizin dikim şeklini veya çalışma mekanizmasını özelleştirin.' 
                : 'Customize the pleating style or operating mechanism for your curtain.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              {subtypeOptions.map(opt => (
                <div 
                  key={opt.id}
                  style={{
                    backgroundColor: 'var(--color-card-bg)',
                    borderRadius: '12px',
                    padding: '2rem 1.5rem',
                    cursor: 'pointer',
                    border: selectedSubtype === opt.label ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    if (selectedSubtype !== opt.label) e.currentTarget.style.borderColor = 'rgba(189, 149, 75, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    if (selectedSubtype !== opt.label) e.currentTarget.style.borderColor = 'var(--color-border)';
                  }}
                  onClick={() => {
                    setSelectedSubtype(opt.label);
                    setStep(4);
                  }}
                >
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--color-text)', margin: '0 0 0.8rem' }}>
                    {opt.label}
                  </h3>
                  <p style={{ fontSize: '0.9rem', opacity: 0.7, margin: 0, lineHeight: 1.5 }}>
                    {opt.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4 & 5: Interactive Sizing Form */}
        {(step === 4 || step === 5) && selectedProduct && selectedUsage && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: '2rem' }}>
              <button 
                onClick={() => setStep(step - 1)}
                style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: '20px', padding: '0.4rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}
              >
                ← {language === 'tr' ? 'Geri Dön' : 'Go Back'}
              </button>

              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-accent)', fontWeight: 600 }}>
                  {language === 'tr' ? selectedProduct.categoryTr : selectedProduct.categoryEn}
                </span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-text)', margin: '0.3rem 0 0' }}>
                  {language === 'tr' ? selectedProduct.nameTr : selectedProduct.nameEn}
                </h2>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem', alignItems: 'start' }}>
              
              {/* LEFT: 2D Interactive Preview */}
              <div 
                ref={containerRef}
                style={{ 
                  position: 'relative', 
                  backgroundColor: '#0a111a', 
                  borderRadius: '12px', 
                  border: '1px solid var(--color-border)',
                  height: '500px', 
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  touchAction: 'none',
                  overflow: 'hidden'
                }}
              >
                {/* Window Background (centered behind curtain) */}
                <div style={{
                  position: 'absolute',
                  width: '240px',
                  height: '220px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  border: '6px solid #162435',
                  borderRadius: '4px',
                  backgroundColor: '#a3c6e4',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gridTemplateRows: '1fr 1fr',
                  gap: '4px',
                  zIndex: 1,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
                }}>
                  <div style={{ backgroundColor: '#a5c4dd', opacity: 0.95 }} />
                  <div style={{ backgroundColor: '#a5c4dd', opacity: 0.95 }} />
                  <div style={{ backgroundColor: '#a5c4dd', opacity: 0.95 }} />
                  <div style={{ backgroundColor: '#a5c4dd', opacity: 0.95 }} />
                </div>

                {/* Semi-transparent Wavy Curtain */}
                <div style={{
                  position: 'absolute',
                  width: `${Math.max(30, ((width - limits.min_width) / (limits.max_width - limits.min_width || 1)) * 60 + 30)}%`,
                  height: `${Math.max(30, ((height - limits.min_height) / (limits.max_height - limits.min_height || 1)) * 60 + 30)}%`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'repeating-linear-gradient(90deg, rgba(245, 245, 247, 0.6) 0px, rgba(255, 255, 255, 0.8) 12px, rgba(245, 245, 247, 0.6) 24px, rgba(200, 200, 200, 0.3) 30px, rgba(245, 245, 247, 0.6) 36px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  zIndex: 2,
                  transition: isDraggingWidth || isDraggingHeight ? 'none' : 'all 0.3s ease-out'
                }}>
                  {/* Width dashed line and arrows (A) */}
                  <div style={{
                    position: 'absolute',
                    top: '-25px',
                    left: '0',
                    right: '0',
                    height: '2px',
                    borderTop: '2px dashed #BD954B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {/* Left Arrow */}
                    <div style={{
                      position: 'absolute',
                      left: '0',
                      top: '-5px',
                      borderTop: '5px transparent solid',
                      borderBottom: '5px transparent solid',
                      borderRight: '7px solid #BD954B',
                    }} />
                    {/* Right Arrow */}
                    <div style={{
                      position: 'absolute',
                      right: '0',
                      top: '-5px',
                      borderTop: '5px transparent solid',
                      borderBottom: '5px transparent solid',
                      borderLeft: '7px solid #BD954B',
                    }} />
                    {/* Width Label A */}
                    <div style={{
                      backgroundColor: '#0F172A',
                      color: '#BD954B',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: '1px solid #BD954B',
                      transform: 'translateY(-1px)',
                      whiteSpace: 'nowrap'
                    }}>
                      A: {width} cm
                    </div>
                  </div>

                  {/* Height dashed line and arrows (B) */}
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    bottom: '0',
                    right: '-25px',
                    width: '2px',
                    borderLeft: '2px dashed #BD954B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {/* Top Arrow */}
                    <div style={{
                      position: 'absolute',
                      top: '0',
                      left: '-5px',
                      borderLeft: '5px transparent solid',
                      borderRight: '5px transparent solid',
                      borderBottom: '7px solid #BD954B',
                    }} />
                    {/* Bottom Arrow */}
                    <div style={{
                      position: 'absolute',
                      bottom: '0',
                      left: '-5px',
                      borderLeft: '5px transparent solid',
                      borderRight: '5px transparent solid',
                      borderTop: '7px solid #BD954B',
                    }} />
                    {/* Height Label B */}
                    <div style={{
                      position: 'absolute',
                      backgroundColor: '#0F172A',
                      color: '#BD954B',
                      padding: '4px 6px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: '1px solid #BD954B',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      lineHeight: '1.1',
                      left: '10px',
                      whiteSpace: 'nowrap'
                    }}>
                      <span>B:</span>
                      <span>{height}</span>
                      <span>cm</span>
                    </div>
                  </div>

                  {/* Drag Handle - Width (Top Right) */}
                  <div 
                    onPointerDown={(e) => { e.preventDefault(); setIsDraggingWidth(true); }}
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-10px',
                      width: '24px',
                      height: '24px',
                      cursor: 'ew-resize',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{ width: '16px', height: '16px', backgroundColor: '#BD954B', border: '2px solid #FFF', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }} />
                  </div>

                  {/* Drag Handle - Height (Bottom Right) */}
                  <div 
                    onPointerDown={(e) => { e.preventDefault(); setIsDraggingHeight(true); }}
                    style={{
                      position: 'absolute',
                      bottom: '-10px',
                      right: '-10px',
                      width: '24px',
                      height: '24px',
                      cursor: 'ns-resize',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{ width: '16px', height: '16px', backgroundColor: '#BD954B', border: '2px solid #FFF', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }} />
                  </div>
                </div>

                {/* Info Icon (Bottom Left) */}
                <div style={{ position: 'absolute', bottom: '15px', left: '15px', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', zIndex: 3 }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </div>
              </div>

              {/* RIGHT: Specs & Input Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* How to measure guide hint */}
                <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                    <div style={{ color: 'var(--color-accent)', marginTop: '2px' }}>
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {language === 'tr' ? 'PROFESYONEL İPUCU' : 'PROFESSIONAL TIP'}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.6 }}>
                        {language === 'tr' 
                          ? 'Perde siparişi ederken pencerenizin değil, korniş ya da rayınızın genişliğini (En) ölçün. Boy ölçüsü için ise kornişten perdenin bitmesini istediğiniz yere kadar dikey ölçü alın.' 
                          : 'When ordering curtains, measure the width of your cornice or track, not your window. For height, measure vertically from the cornice to where you want the curtain to end.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sizing Input Panel */}
                <div style={{ backgroundColor: 'var(--color-card-bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  
                  {step === 4 ? (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 600 }}>
                        {language === 'tr' ? 'RAY GENİŞLİĞİ (A) - CM' : 'RAY WIDTH (A) - CM'}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input 
                          type="number" 
                          value={width} 
                          onChange={(e) => setWidth(Number(e.target.value))}
                          style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: '4px', fontSize: '1.2rem', outline: 'none' }}
                        />
                        <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '0.9rem' }}>cm</span>
                      </div>

                      {/* Width Limit Warnings */}
                      {(width < limits.min_width || width > limits.max_width) && (
                        <div style={{ color: '#FF4C4C', fontSize: '0.85rem', marginTop: '0.8rem', fontWeight: 500 }}>
                          {language === 'tr'
                            ? `${CATEGORY_LIMITS[selectedUsage].label} kategorisi için genişlik en az ${limits.min_width} cm, en fazla ${limits.max_width} cm olmalıdır.`
                            : `Width must be between ${limits.min_width} cm and ${limits.max_width} cm for ${CATEGORY_LIMITS[selectedUsage].labelEn}.`}
                        </div>
                      )}

                      <button 
                        disabled={width < limits.min_width || width > limits.max_width}
                        onClick={() => setStep(5)}
                        style={{ 
                          width: '100%', 
                          marginTop: '1.5rem',
                          padding: '1rem', 
                          backgroundColor: (width < limits.min_width || width > limits.max_width) ? 'rgba(189, 149, 75, 0.3)' : 'var(--color-accent)', 
                          color: '#FFF', 
                          border: 'none', 
                          borderRadius: '8px', 
                          fontSize: '1.1rem', 
                          fontWeight: 600, 
                          cursor: (width < limits.min_width || width > limits.max_width) ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s' 
                        }}
                      >
                        {language === 'tr' ? 'Devam Et' : 'Continue'}
                      </button>
                    </div>
                  ) : (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 600 }}>
                        {language === 'tr' ? 'PERDE YÜKSEKLİĞİ (B) - CM' : 'CURTAIN HEIGHT (B) - CM'}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input 
                          type="number" 
                          value={height} 
                          onChange={(e) => setHeight(Number(e.target.value))}
                          style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: '4px', fontSize: '1.2rem', outline: 'none' }}
                        />
                        <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '0.9rem' }}>cm</span>
                      </div>

                      {/* Height Limit Warnings */}
                      {(height < limits.min_height || height > limits.max_height) && (
                        <div style={{ color: '#FF4C4C', fontSize: '0.85rem', marginTop: '0.8rem', fontWeight: 500 }}>
                          {language === 'tr'
                            ? `${CATEGORY_LIMITS[selectedUsage].label} kategorisi için yükseklik en az ${limits.min_height} cm, en fazla ${limits.max_height} cm olmalıdır.`
                            : `Height must be between ${limits.min_height} cm and ${limits.max_height} cm for ${CATEGORY_LIMITS[selectedUsage].labelEn}.`}
                        </div>
                      )}

                      <button 
                        disabled={height < limits.min_height || height > limits.max_height}
                        onClick={handleWhatsAppQuote}
                        style={{ 
                          width: '100%', 
                          marginTop: '1.5rem',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: '0.8rem', 
                          padding: '1rem', 
                          backgroundColor: (height < limits.min_height || height > limits.max_height) ? '#1E6B38' : '#25D366', 
                          color: '#FFF', 
                          border: 'none', 
                          borderRadius: '8px', 
                          fontSize: '1.1rem', 
                          fontWeight: 600, 
                          cursor: (height < limits.min_height || height > limits.max_height) ? 'not-allowed' : 'pointer',
                          transition: 'transform 0.2s' 
                        }}
                        onMouseOver={(e) => {
                          if (height >= limits.min_height && height <= limits.max_height) {
                            e.currentTarget.style.transform = 'scale(1.02)';
                          }
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.031 2C6.49 2 2 6.48 2 12.01c0 1.77.46 3.49 1.34 5.01L2 22l5.12-1.34c1.47.8 3.12 1.22 4.9 1.22 5.54 0 10.03-4.48 10.03-10.01C22.05 6.48 17.56 2 12.03 2zm4.8 13.86c-.27.76-1.34 1.39-1.85 1.49-.46.09-.94.13-2.93-.68-2.54-1.04-4.18-3.62-4.31-3.79-.12-.17-.99-1.32-.99-2.51 0-1.2.62-1.78.84-2.03.22-.25.47-.31.62-.31.15 0 .31 0 .44.01.14 0 .32-.05.5.38.18.43.62 1.51.68 1.63.06.12.1.26.02.43-.08.17-.12.28-.25.43-.12.15-.26.33-.37.45-.12.13-.25.27-.11.51.14.24.63 1.03 1.36 1.68.93.83 1.72 1.09 1.97 1.21.25.12.39.1.53-.06.14-.17.62-.72.79-.97.17-.25.34-.21.58-.12.24.09 1.51.71 1.77.84.26.13.43.19.49.3.06.11.06.66-.21 1.42z"/>
                        </svg>
                        {language === 'tr' ? "WhatsApp'tan Teklif Al" : "Get Quote via WhatsApp"}
                      </button>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MeasureWizardClient(props: MeasureWizardClientProps) {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem 0' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(189, 149, 75, 0.2)', borderTopColor: '#BD954B', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    }>
      <MeasureWizardContent {...props} />
    </Suspense>
  );
}
