'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';

function RehberClientContent({ initialGuides }: { initialGuides: any[] }) {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentSearchParam = searchParams.get('search') || '';
  const currentCategoryParam = searchParams.get('category') || (language === 'tr' ? 'Hepsi' : 'All');

  const [searchQuery, setSearchQuery] = useState(currentSearchParam);
  const [selectedCategory, setSelectedCategory] = useState(currentCategoryParam);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [prevSearchParam, setPrevSearchParam] = useState(currentSearchParam);
  const [prevCategoryParam, setPrevCategoryParam] = useState(currentCategoryParam);

  if (currentSearchParam !== prevSearchParam) {
    setPrevSearchParam(currentSearchParam);
    setSearchQuery(currentSearchParam);
  }

  if (currentCategoryParam !== prevCategoryParam) {
    setPrevCategoryParam(currentCategoryParam);
    setSelectedCategory(currentCategoryParam);
  }

  const updateUrl = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (!value || value === 'Hepsi' || value === 'All') {
      current.delete(key);
    } else {
      current.set(key, value);
    }
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`/rehber${query}`, { scroll: false });
  };

  const clearAllFilters = () => {
    setSelectedCategory(language === 'tr' ? 'Hepsi' : 'All');
    setSearchQuery('');
    router.push('/rehber', { scroll: false });
  };

  // Helper mapping function to categorize each guide based on its category field
  const getCategory = (post: any, lang: string): string => {
    const dbCat = post.category || 'Genel';
    if (lang === 'en') {
      const mapping: Record<string, string> = {
        'Genel': 'General',
        'Ev Perdeleri': 'Home Curtains',
        'Ofis / Kurumsal': 'Office / Corporate',
        'Cami / İbadethane': 'Mosque / Worship',
        'Sahne / Konferans': 'Stage / Conference',
        'Hastane / Klinik': 'Hospital / Clinic',
        'Otel / Konaklama': 'Hotel / Lodging',
        'Dış Mekan / Teras': 'Outdoor / Terrace',
        'Endüstriyel (PVC)': 'Industrial (PVC)',
        'Karavan / Tekne': 'Caravan / Boat',
      };
      return mapping[dbCat] || dbCat;
    }
    return dbCat;
  };

  const categories = useMemo(() => {
    if (language === 'tr') {
      return [
        'Hepsi',
        'Genel',
        'Ev Perdeleri',
        'Ofis / Kurumsal',
        'Cami / İbadethane',
        'Sahne / Konferans',
        'Hastane / Klinik',
        'Otel / Konaklama',
        'Dış Mekan / Teras',
        'Endüstriyel (PVC)',
        'Karavan / Tekne'
      ];
    } else {
      return [
        'All',
        'General',
        'Home Curtains',
        'Office / Corporate',
        'Mosque / Worship',
        'Stage / Conference',
        'Hospital / Clinic',
        'Hotel / Lodging',
        'Outdoor / Terrace',
        'Industrial (PVC)',
        'Caravan / Boat'
      ];
    }
  }, [language]);

  // Keep selected category in sync when language changes
  const [prevLanguage, setPrevLanguage] = useState(language);
  if (language !== prevLanguage) {
    setPrevLanguage(language);
    setSelectedCategory(language === 'tr' ? 'Hepsi' : 'All');
  }

  const filteredGuides = useMemo(() => {
    let list = [...initialGuides];
    
    // Sort by display order
    list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    // Filter by category
    const allKey = language === 'tr' ? 'Hepsi' : 'All';
    if (selectedCategory !== allKey) {
      list = list.filter(post => {
        const cat = getCategory(post, language);
        return cat === selectedCategory;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(post => {
        const title = (language === 'tr' ? post.titleTr : post.titleEn) || '';
        const summary = (language === 'tr' ? post.summaryTr : post.summaryEn) || '';
        return title.toLowerCase().includes(q) || summary.toLowerCase().includes(q);
      });
    }

    return list;
  }, [initialGuides, selectedCategory, searchQuery, language]);

  return (
    <div className="rehber-container" style={{ maxWidth: '1440px', margin: '0 auto', padding: '6rem 2rem 3rem' }}>
      <style>{`
        .rehber-layout-wrapper {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
          align-items: start;
        }
        .rehber-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        @media (max-width: 1199px) {
          .rehber-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 991px) {
          .rehber-layout-wrapper {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 767px) {
          .rehber-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="section-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          {language === 'tr' ? 'Rehber ve Blog' : 'Guides & Blog'}
        </h1>
        <p style={{ opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
          {language === 'tr' ? 'Perde seçimi, bakımı ve modern dekorasyon fikirleri hakkında uzman tavsiyeler.' : 'Expert advice on curtain selection, care, and modern decoration ideas.'}
        </p>
      </header>

      <div className="rehber-layout-wrapper">
        {/* Left Sidebar Filter Panel */}
        <aside 
          className="rehber-sidebar"
          style={{ 
            backgroundColor: 'var(--color-neutral)', 
            padding: '2rem', 
            borderRadius: '8px', 
            border: '1px solid var(--color-border)', 
            height: 'fit-content' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', margin: 0, color: 'var(--color-primary)' }}>
              {language === 'tr' ? 'Filtreler' : 'Filters'}
            </h3>
            {(selectedCategory !== (language === 'tr' ? 'Hepsi' : 'All') || searchQuery !== '') && (
              <button 
                onClick={clearAllFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-accent)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  padding: 0
                }}
              >
                {language === 'tr' ? 'Sıfırla' : 'Clear'}
              </button>
            )}
          </div>

          {/* Search Input */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', color: 'var(--color-accent)' }}>
              {language === 'tr' ? 'ARAMA' : 'SEARCH'}
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text"
                placeholder={language === 'tr' ? 'Rehberlerde ara...' : 'Search...'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  updateUrl('search', e.target.value);
                }}
                style={{
                  width: '100%',
                  padding: '0.6rem 2rem 0.6rem 0.6rem',
                  borderRadius: '4px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'var(--transition-smooth)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    updateUrl('search', '');
                  }}
                  style={{
                    position: 'absolute',
                    right: '0.6rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-accent)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    padding: '0.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.7,
                    transition: 'opacity 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '0.7'}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Sector Category Dropdown */}
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', color: 'var(--color-accent)' }}>
              {language === 'tr' ? 'ANA SEKTÖR' : 'MAIN SECTOR'}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                updateUrl('category', e.target.value);
              }}
              style={{
                width: '100%',
                padding: '0.6rem',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
                background: 'var(--color-card-bg)',
                color: 'var(--color-text)',
                outline: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* Right Main Content Area */}
        <main className="rehber-main-content">
          {filteredGuides.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', opacity: 0.6 }}>
              {language === 'tr' ? 'Aradığınız kriterlere uygun rehber bulunamadı.' : 'No guides found matching your criteria.'}
            </div>
          ) : (
            <div className="rehber-grid">
              {filteredGuides.map((post) => (
                <Link 
                  key={post.id}
                  href={`/rehber/${post.id}`}
                  style={{ 
                    backgroundColor: 'var(--color-card-bg)', 
                    border: '1px solid var(--color-border)', 
                    borderRadius: '8px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'var(--transition-smooth)',
                    cursor: 'pointer',
                    height: '100%'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                    <Image src={post.image} alt={language === 'tr' ? post.titleTr : post.titleEn} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 33vw" />
                    <span 
                      style={{ 
                        position: 'absolute', 
                        top: '0.8rem', 
                        left: '0.8rem', 
                        backgroundColor: 'rgba(10, 25, 47, 0.85)', 
                        color: 'var(--color-accent)', 
                        padding: '0.25rem 0.7rem', 
                        borderRadius: '20px', 
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        border: '1px solid var(--color-accent)'
                      }}
                    >
                      {getCategory(post, language)}
                    </span>
                  </div>
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '0.8rem', lineHeight: 1.4 }}>
                        {language === 'tr' ? post.titleTr : post.titleEn}
                      </h3>
                      <p style={{ opacity: 0.8, lineHeight: 1.5, fontSize: '0.9rem' }}>
                        {language === 'tr' ? post.summaryTr : post.summaryEn}
                      </p>
                    </div>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.8rem', marginTop: '1rem' }}>
                      {language === 'tr' ? 'Daha Fazla Oku →' : 'Read More →'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function RehberClient(props: { initialGuides: any[] }) {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '5rem', color: 'var(--color-primary)' }}>Loading...</div>}>
      <RehberClientContent {...props} />
    </Suspense>
  );
}

