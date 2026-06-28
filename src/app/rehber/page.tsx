import { supabase } from '../../lib/supabaseClient';
import { mapGuideFromDb } from '../../context/dbMappers';
import RehberClient from './RehberClient';
import { Metadata } from 'next';

export const revalidate = 60; // ISR cache for 60 seconds

export const metadata: Metadata = {
  title: 'Lale Perde • Rehber',
  description: 'Perde seçimi, montajı, temizliği ve ölçü alımı hakkında pratik ipuçları ve güncel bilgiler.',
};

export default async function RehberPage() {
  let guides: any[] = [];

  try {
    const { data: rawGuides, error } = await supabase
      .from('guides')
      .select('*')
      .eq('status', 'active')
      .order('display_order', { ascending: true });

    if (error) console.error('Guides fetch error:', error);
    
    if (rawGuides) {
      guides = rawGuides.map(mapGuideFromDb);
    }
  } catch (err) {
    console.error('Guides SSR data fetching error:', err);
  }

  return <RehberClient initialGuides={guides} />;
}
