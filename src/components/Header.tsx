'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useDb } from '../context/DbContext';
import { supabase } from '../lib/supabaseClient';

interface SearchResultProduct {
  id: string;
  nameTr: string;
  nameEn: string;
  image: string;
}

interface SearchResultService {
  id: string;
  nameTr: string;
  nameEn: string;
}

interface SearchResultGuide {
  id: string;
  titleTr: string;
  titleEn: string;
  image: string;
}

interface StaticPageResult {
  nameTr: string;
  nameEn: string;
  url: string;
  category: 'Sayfa' | 'Bilgi' | 'Page' | 'Info';
}

const staticPages: StaticPageResult[] = [
  { nameTr: 'Hizmetler', nameEn: 'Services', url: '/hizmetler', category: 'Sayfa' },
  { nameTr: 'Ölçü Sihirbazı', nameEn: 'Measure Wizard', url: '/olcu-sihirbazi', category: 'Sayfa' },
  { nameTr: 'İletişim (İletişim Bilgileri)', nameEn: 'Contact Info', url: '/iletisim', category: 'Sayfa' },
  { nameTr: 'Kurumsal İletişim Formu', nameEn: 'Corporate Contact Form', url: '/iletisim', category: 'Sayfa' },
  { nameTr: 'Ücretsiz Keşif & Ölçü Randevusu (Randevu Formu)', nameEn: 'Free Survey & Measurement Appointment', url: '/#randevu', category: 'Sayfa' },
  { nameTr: 'Felsefemiz (Hakkımızda - Anasayfa)', nameEn: 'Our Philosophy (About Us - Home)', url: '/#hikayemiz', category: 'Sayfa' },
  { nameTr: 'Müşteri Yorumları (Hakkımızda Neler Dediler?)', nameEn: 'Customer Testimonials', url: '/#yorumlar', category: 'Sayfa' },
  { nameTr: 'Tamamlanan Seçkin Çalışmalarımız (Referans Projeler)', nameEn: 'Our Completed Premium Works', url: '/#projeler', category: 'Sayfa' },
  { nameTr: 'Gizlilik Politikası', nameEn: 'Privacy Policy', url: '/gizlilik-politikasi', category: 'Bilgi' },
  { nameTr: 'Çerez Politikası', nameEn: 'Cookie Policy', url: '/cerez-politikasi', category: 'Bilgi' },
  { nameTr: 'KVKK Aydınlatma Metni', nameEn: 'KVKK Clarification Text', url: '/kvkk-aydinlatma', category: 'Bilgi' },
  { nameTr: 'Kullanım Koşulları', nameEn: 'Terms of Use', url: '/kullanim-kosullari', category: 'Bilgi' },
  { nameTr: 'Mesafeli Satış Sözleşmesi', nameEn: 'Distant Sales Agreement', url: '/mesafeli-satis', category: 'Bilgi' },
  { nameTr: 'Ön Bilgilendirme Formu', nameEn: 'Preliminary Information Form', url: '/on-bilgilendirme', category: 'Bilgi' },
  { nameTr: 'İade ve Cayma Şartları', nameEn: 'Return and Cancellation Policy', url: '/iade-ve-cayma', category: 'Bilgi' }
];

export const Header: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';
  
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchData, setSearchData] = useState<{
    products: SearchResultProduct[];
    services: SearchResultService[];
    guides: SearchResultGuide[];
  } | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const { campaigns, incrementSearchLog, fetchCampaignsLazy } = useDb();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCampaignsLazy?.();
  }, [fetchCampaignsLazy]);

  // Filter active campaigns based on today's date
  const activeCampaigns = React.useMemo(() => {
    if (!campaigns) return [];
    const now = new Date().toISOString().split('T')[0];
    return campaigns.filter(c => {
      if (!c.isActive) return false;
      if (c.startDate && now < c.startDate) return false;
      if (c.endDate && now > c.endDate) return false;
      return true;
    });
  }, [campaigns]);

  // Construct banner list (active campaigns only)
  const bannerItems = React.useMemo(() => {
    const items: Array<{ textTr: string; textEn: string; duration: number }> = [];
    
    // Add active campaigns
    activeCampaigns.forEach(c => {
      items.push({
        textTr: `${c.titleTr}${c.descriptionTr ? ` : ${c.descriptionTr}` : ''}`,
        textEn: `${c.titleEn || c.titleTr}${c.descriptionEn ? ` : ${c.descriptionEn}` : (c.descriptionTr ? ` : ${c.descriptionTr}` : '')}`,
        duration: c.duration || 8,
      });
    });

    return items;
  }, [activeCampaigns]);

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [bannerFade, setBannerFade] = useState(true);

  // Dynamic banner rotation based on per-campaign custom duration
  useEffect(() => {
    if (bannerItems.length <= 1) {
      return;
    }
    
    const currentItem = bannerItems[currentBannerIndex];
    const durationMs = (currentItem?.duration || 8) * 1000;

    let innerTimer: NodeJS.Timeout;
    const timer = setTimeout(() => {
      setBannerFade(false); // Fade out
      innerTimer = setTimeout(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % bannerItems.length);
        setBannerFade(true); // Fade in
      }, 1000); // fade out duration
    }, durationMs);

    return () => {
      clearTimeout(timer);
      if (innerTimer) clearTimeout(innerTimer);
    };
  }, [bannerItems, currentBannerIndex]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (pathname?.startsWith('/admin') && !searchQuery) {
      window.dispatchEvent(new CustomEvent('admin-search', { detail: '' }));
    }
  }, [searchQuery, pathname]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  useEffect(() => {
    if (!searchQuery.trim() || pathname?.startsWith('/admin')) {
      setSearchData(null);
      return;
    }

    const query = searchQuery.trim().toLowerCase();
    const safeQuery = query.replace(/[,%"]/g, ''); // prevent PostgREST syntax breaking

    const debounceFn = setTimeout(async () => {
      try {
        const [prodRes, servRes, guideRes] = await Promise.all([
          supabase.from('products').select('id, name_tr, name_en, cover_image, images').eq('status', 'active').or(`name_tr.ilike.%${safeQuery}%,name_en.ilike.%${safeQuery}%`).limit(6),
          supabase.from('services').select('id, title_tr, title_en').eq('status', 'active').or(`title_tr.ilike.%${safeQuery}%,title_en.ilike.%${safeQuery}%`).limit(4),
          supabase.from('guides').select('id, title_tr, title_en, image').or(`title_tr.ilike.%${safeQuery}%,title_en.ilike.%${safeQuery}%`).limit(4)
        ]);

        const products = (prodRes.data || []).map(p => ({
          id: p.id,
          nameTr: p.name_tr,
          nameEn: p.name_en,
          image: p.cover_image || (p.images && p.images[0]) || '/assets/hero.png'
        }));

        const services = (servRes.data || []).map(s => ({
          id: s.id,
          nameTr: s.title_tr,
          nameEn: s.title_en
        }));

        const guides = (guideRes.data || []).map(g => ({
          id: g.id,
          titleTr: g.title_tr,
          titleEn: g.title_en,
          image: g.image || '/assets/hero.png'
        }));

        setSearchData({ products, services, guides });
      } catch (e) {
        console.warn('Failed to fetch debounced search data', e);
      }
    }, 350);

    return () => clearTimeout(debounceFn);
  }, [searchQuery, pathname]);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase().trim();

    const matchedStatic = staticPages.filter(p => 
      p.nameTr.toLowerCase().includes(query) || p.nameEn.toLowerCase().includes(query)
    );

    const matchedProducts = searchData ? searchData.products : [];
    const matchedServices = searchData ? searchData.services : [];
    const matchedGuides = searchData ? searchData.guides : [];

    const hasAny = matchedStatic.length > 0 || matchedProducts.length > 0 || matchedServices.length > 0 || matchedGuides.length > 0;
    return hasAny ? { pages: matchedStatic, products: matchedProducts, services: matchedServices, guides: matchedGuides } : null;
  }, [searchQuery, searchData]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (pathname?.startsWith('/admin')) {
        window.dispatchEvent(new CustomEvent('admin-search', { detail: searchQuery.trim() }));
        return;
      }
      incrementSearchLog(searchQuery.trim());
      router.push(`/urunler?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchExpanded(false);
    }
  };

  const handleSearchIconClick = (e: React.MouseEvent) => {
    if (!isSearchExpanded) {
      e.preventDefault();
      setIsSearchExpanded(true);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      if (!searchQuery.trim()) {
        setIsSearchExpanded(false);
      } else {
        handleSearchSubmit(e);
      }
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(false);
  }, [pathname]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const hasBanner = bannerItems.length > 0;

  return (
    <>
      {hasBanner && !pathname?.startsWith('/admin') && (
        <div className="announcement-banner">
          <div 
            style={{
              transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: bannerFade ? 1 : 0,
              display: 'inline-block',
              width: '100%',
              textAlign: 'center'
            }}
          >
            {language === 'tr' ? bannerItems[currentBannerIndex]?.textTr : bannerItems[currentBannerIndex]?.textEn}
          </div>
        </div>
      )}
      <header id="main-header" className={`${scrolled ? 'scrolled' : ''} ${hasBanner ? 'has-banner' : ''} ${!isHome ? 'not-home' : ''}`}>

        <Link 
          href="/" 
          className="logo-container" 
          style={{ textDecoration: 'none' }}
          onClick={(e) => {
            if (pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            setMobileMenuOpen(false);
          }}
        >
          <div className="logo">
            <Image src="/assets/laleperdelogo.svg" alt="Lale Perde" className="logo-icon" width={40} height={40} priority />
            <span className="logo-text">LALE PERDE</span>
          </div>
        </Link>

        {!pathname?.startsWith('/admin') && (
          <nav className="desktop-nav" suppressHydrationWarning>
            <Link suppressHydrationWarning href="/urunler" className={pathname?.startsWith('/urunler') ? 'active' : ''}>{t('nav.products')}</Link>
            <Link suppressHydrationWarning href="/hizmetler" className={pathname === '/hizmetler' ? 'active' : ''}>{t('nav.services')}</Link>
            <Link suppressHydrationWarning href="/rehber" className={pathname?.startsWith('/rehber') ? 'active' : ''}>{t('nav.guide')}</Link>
            <Link suppressHydrationWarning href="/olcu-sihirbazi" className={pathname === '/olcu-sihirbazi' ? 'active' : ''}>{t('nav.wizard')}</Link>
            <Link suppressHydrationWarning href="/iletisim" className={pathname === '/iletisim' ? 'active' : ''}>{t('nav.contact')}</Link>
          </nav>
        )}

        <div className="header-right">
          <form onSubmit={handleSearchSubmit} className={`header-search ${isSearchExpanded ? 'expanded' : ''}`}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder={pathname?.startsWith('/admin') ? 'Admin paneli ara...' : (language === 'tr' ? 'Sitede ara...' : 'Search site...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleFocus}
              onBlur={() => {
                setTimeout(() => {
                  setIsFocused(false);
                  if (!searchQuery.trim()) {
                    setIsSearchExpanded(false);
                  }
                }, 200);
              }}
            />
            <svg onClick={handleSearchIconClick} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>

            {isFocused && filteredResults && (
              <div 
                className="search-results-overlay"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  width: '380px',
                  backgroundColor: 'var(--color-neutral)',
                  border: '1px solid var(--color-accent)',
                  borderRadius: '8px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
                  marginTop: '0.5rem',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  zIndex: 9999,
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  textAlign: 'left'
                }}
                onMouseDown={(e) => e.preventDefault()}
              >
                {/* Pages Section */}
                {filteredResults.pages.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.2rem' }}>
                      {language === 'tr' ? 'Sayfalar & Bilgi' : 'Pages & Info'}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {filteredResults.pages.map(p => (
                        <Link 
                          key={p.nameTr}
                          href={p.url}
                          onClick={() => {
                            setSearchQuery('');
                            setIsSearchExpanded(false);
                            setIsFocused(false);
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none', padding: '0.3rem', borderRadius: '4px', transition: 'background-color 0.2s' }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <span style={{ fontSize: '0.9rem', color: 'var(--color-text)', paddingLeft: '0.2rem' }}>
                            📄 {language === 'tr' ? p.nameTr : p.nameEn}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products Section */}
                {filteredResults.products.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.2rem' }}>
                      {language === 'tr' ? 'Ürünler' : 'Products'}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {filteredResults.products.map(p => (
                        <Link 
                          key={p.id}
                          href={`/urunler/${p.id}`}
                          onClick={() => {
                            setSearchQuery('');
                            setIsSearchExpanded(false);
                            setIsFocused(false);
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none', padding: '0.3rem', borderRadius: '4px', transition: 'background-color 0.2s' }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div style={{ position: 'relative', width: '32px', height: '32px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                            <Image src={p.image} alt={language === 'tr' ? p.nameTr : p.nameEn} fill style={{ objectFit: 'cover' }} />
                          </div>
                          <span style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>
                            {language === 'tr' ? p.nameTr : p.nameEn}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Services Section */}
                {filteredResults.services.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.2rem' }}>
                      {language === 'tr' ? 'Hizmetler' : 'Services'}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {filteredResults.services.map(s => (
                        <Link 
                          key={s.id}
                          href={`/hizmetler?service=${encodeURIComponent(s.nameTr)}`}
                          onClick={() => {
                            setSearchQuery('');
                            setIsSearchExpanded(false);
                            setIsFocused(false);
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none', padding: '0.3rem', borderRadius: '4px', transition: 'background-color 0.2s' }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <span style={{ fontSize: '0.9rem', color: 'var(--color-text)', paddingLeft: '0.2rem' }}>
                            🛠️ {language === 'tr' ? s.nameTr : s.nameEn}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Guides Section */}
                {filteredResults.guides.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.2rem' }}>
                      {language === 'tr' ? 'Rehber ve Blog' : 'Guides & Blog'}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {filteredResults.guides.map(g => (
                        <Link 
                          key={g.id}
                          href={`/rehber/${g.id}`}
                          onClick={() => {
                            setSearchQuery('');
                            setIsSearchExpanded(false);
                            setIsFocused(false);
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none', padding: '0.3rem', borderRadius: '4px', transition: 'background-color 0.2s' }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div style={{ position: 'relative', width: '32px', height: '32px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                            <Image src={g.image} alt={language === 'tr' ? g.titleTr : g.titleEn} fill style={{ objectFit: 'cover' }} />
                          </div>
                          <span style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>
                            {language === 'tr' ? g.titleTr : g.titleEn}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>

          <button className="theme-toggle-btn" onClick={toggleTheme} title="Tema Değiştir">
            <span suppressHydrationWarning>{theme === 'light' ? '☾' : '☼'}</span>
          </button>

          <button 
            className="lang-switch-btn" 
            onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
            title="Language"
            suppressHydrationWarning
          >
            {language === 'tr' ? 'EN' : 'TR'}
          </button>

          {!pathname?.startsWith('/admin') && (
            <button 
              className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          )}

          {pathname?.startsWith('/admin') && (
            <Link 
              href="/"
              className="continue-site-btn" 
              style={{
                background: 'transparent',
                color: 'var(--color-accent)',
                border: '1px solid var(--color-accent)',
                padding: '0.4rem 0.8rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                marginLeft: '8px',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'var(--color-accent)';
                e.currentTarget.style.color = '#0A1118';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--color-accent)';
              }}
            >
              Siteye Devam Et
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Drawer Menu Overlay */}
      {!pathname?.startsWith('/admin') && (
        <div className={`mobile-drawer-overlay ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="logo">
                <Image src="/assets/laleperdelogo.svg" alt="Lale Perde" className="logo-icon" width={32} height={32} />
                <span className="logo-text" style={{ fontSize: '1.5rem' }}>LALE PERDE</span>
              </div>
              <button className="mobile-drawer-close" onClick={() => setMobileMenuOpen(false)}>✕</button>
            </div>

            <nav className="mobile-drawer-nav">
              <Link href="/" className={pathname === '/' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>{t('nav.home')}</Link>
              <Link href="/urunler" className={pathname?.startsWith('/urunler') ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>{t('nav.products')}</Link>
              <Link href="/hizmetler" className={pathname === '/hizmetler' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>{t('nav.services')}</Link>
              <Link href="/rehber" className={pathname?.startsWith('/rehber') ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>{t('nav.guide')}</Link>
              <Link href="/olcu-sihirbazi" className={pathname === '/olcu-sihirbazi' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>{t('nav.wizard')}</Link>
              <Link href="/iletisim" className={pathname === '/iletisim' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>{t('nav.contact')}</Link>
            </nav>

            <div className="mobile-drawer-footer">
              <div className="mobile-drawer-controls">
                <button className="theme-toggle-btn" onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <span suppressHydrationWarning>{theme === 'light' ? '☾ Koyu Mod' : '☼ Aydınlık Mod'}</span>
                </button>
                <button 
                  className="lang-switch-btn" 
                  onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                  style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                >
                  {language === 'tr' ? 'EN - English' : 'TR - Türkçe'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Header;
