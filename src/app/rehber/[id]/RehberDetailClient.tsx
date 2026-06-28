'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../../../context/LanguageContext';
import { useDb } from '../../../context/DbContext';
import { GuideItem } from '../../../context/dbTypes';

import DOMPurify from 'isomorphic-dompurify';

export default function RehberDetailClient({ initialPost }: { initialPost: GuideItem | null }) {
  const { language } = useLanguage();
  const router = useRouter();
  const [post, setPost] = useState<GuideItem | null>(initialPost);

  const [prevInitialPost, setPrevInitialPost] = useState(initialPost);
  if (initialPost !== prevInitialPost) {
    setPrevInitialPost(initialPost);
    if (initialPost) {
      setPost(initialPost);
    }
  }

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem' }}>
        <h2>Yazı bulunamadı / Article not found.</h2>
        <a 
          href="#"
          onClick={(e) => {
            e.preventDefault();
            router.back();
          }}
          style={{ color: 'var(--color-accent)', textDecoration: 'underline', marginTop: '2rem', display: 'inline-block', cursor: 'pointer' }}
        >
          Rehbere Dön
        </a>
      </div>
    );
  }

  const title = language === 'tr' ? post.titleTr : post.titleEn;
  const content = language === 'tr' ? post.contentTr : post.contentEn;
  const summary = language === 'tr' ? post.summaryTr : post.summaryEn;

  return (
    <div className="rehber-detail-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px 2rem 5rem' }}>
      <a 
        href="#"
        onClick={(e) => {
          e.preventDefault();
          router.back();
        }}
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          marginBottom: '2.5rem', 
          color: 'var(--color-accent)', 
          textTransform: 'uppercase', 
          fontSize: '0.8rem', 
          letterSpacing: '0.05em',
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
        ← {language === 'tr' ? 'Rehbere Dön' : 'Back to Guides'}
      </a>

      <article>
        <header style={{ marginBottom: '3rem' }}>
          <h1 
            className="rehber-detail-title"
            style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: '3rem', 
              lineHeight: 1.2, 
              color: 'var(--color-primary)', 
              marginTop: '1rem', 
              marginBottom: '1.5rem' 
            }}
          >
            {title}
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.85, lineHeight: 1.6, fontStyle: 'italic', color: 'var(--color-text)' }}>
            {summary}
          </p>
        </header>

        <div className="rehber-detail-image-wrapper" style={{ position: 'relative', height: '400px', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden', marginBottom: '3rem' }}>
          <Image src={post.image} alt={title} fill style={{ objectFit: 'cover' }} priority />
        </div>

        <div 
          className="guide-rich-content" 
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} 
          style={{
            fontSize: '1.1rem',
            lineHeight: 1.8,
            color: 'var(--color-text)',
            opacity: 0.9
          }}
        />
      </article>

      <style jsx global>{`
        .guide-rich-content h2 {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          color: var(--color-primary);
          margin-top: 2.5rem;
          margin-bottom: 1rem;
        }
        .guide-rich-content p {
          margin-bottom: 1.5rem;
        }
        .guide-rich-content ul {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        .guide-rich-content li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}
