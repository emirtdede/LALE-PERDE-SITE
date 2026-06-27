import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '../components/Providers';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ConsentBanner from '../components/ConsentBanner';
import ScrollToTop from '../components/ScrollToTop';
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata: Metadata = {
  title: 'Lale Perde',
  description: 'Lale Perde - Evinize zarafet katan modern lüks perde tasarımları. Tül, fon, stor ve akıllı motorlu perde çözümleriyle İskandinav minimalizmi ve editorial estetiği bir araya getiren premium koleksiyonlar.',
  icons: {
    icon: '/favicon.svg',
  }
};

import { supabase } from '../lib/supabaseClient';
import { 
  mapCategoryFromDb, 
  mapCurtainTypeFromDb, 
  mapFabricTypeFromDb, 
  mapMountingTypeFromDb, 
  mapSettingsFromDb, 
  mapHomeContentFromDb 
} from '../context/dbMappers';

export const revalidate = 60; // Cache data fetching in layout for 60 seconds

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialData = null;

  try {
    const [
      { data: rawCats },
      { data: rawCurtains },
      { data: rawFabrics },
      { data: rawSettings },
      { data: rawHome },
      { data: rawMountings }
    ] = await Promise.all([
      supabase.from('categories').select('*').order('display_order', { ascending: true }),
      supabase.from('curtain_types').select('*').order('display_order', { ascending: true }),
      supabase.from('fabric_types').select('*').order('display_order', { ascending: true }),
      supabase.from('site_settings').select('id, store_name, phone, email, address, whatsapp_number, google_maps_embed, announcement_tr, announcement_en, announcement_active, working_hours_tr, working_hours_en, google_ads_id, ads_label_whatsapp, ads_label_contact, shopier_url, instagram_url, facebook_url, linkedin_url, campaign_interval, logo_config'),
      supabase.from('home_page_content').select('*'),
      supabase.from('mounting_types').select('*').order('display_order', { ascending: true })
    ]);

    initialData = {
      categories: rawCats ? rawCats.map(mapCategoryFromDb) : [],
      curtainTypes: rawCurtains ? rawCurtains.map(mapCurtainTypeFromDb) : [],
      fabricTypes: rawFabrics ? rawFabrics.map(mapFabricTypeFromDb) : [],
      mountingTypes: rawMountings ? rawMountings.map(mapMountingTypeFromDb) : [],
      settings: (rawSettings && rawSettings[0]) ? mapSettingsFromDb(rawSettings[0]) : null,
      homeContent: (rawHome && rawHome[0]) ? mapHomeContentFromDb(rawHome[0]) : null,
    };
  } catch (err) {
    console.error('Layout data fetching error:', err);
  }

  return (
    <html lang="tr" suppressHydrationWarning data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <Providers initialData={initialData}>
          <Header />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
          <ConsentBanner />
          <ScrollToTop />
        </Providers>
        {Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string} />
        )}
      </body>
    </html>
  );
}
