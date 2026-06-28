'use client';


import Script from 'next/script';
import { useGoogleAds } from '../context/GoogleAdsContext';

export default function GoogleAdsTracker() {
  const { config, isReady } = useGoogleAds();

  if (!isReady || !config.adsId) return null;

  // Sanitize adsId to prevent XSS injection via malicious admin config
  const safeAdsId = (config.adsId || '').replace(/[^a-zA-Z0-9\-_]/g, '');

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${safeAdsId}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${safeAdsId}');
        `}
      </Script>
    </>
  );
}
