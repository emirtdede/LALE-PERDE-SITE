import { supabase } from '../../../lib/supabaseClient';
import { mapGuideFromDb } from '../../../context/dbMappers';
import RehberDetailClient from './RehberDetailClient';
import { Metadata } from 'next';

export const revalidate = 60; // ISR cache for 60 seconds

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { data: guide } = await supabase
    .from('guides')
    .select('title_tr, title_en, preview_tr, preview_en')
    .eq('id', resolvedParams.id)
    .single();

  if (!guide) {
    return {
      title: 'Lale Perde • Rehber',
    };
  }

  return {
    title: `Lale Perde • ${guide.title_tr}`,
    description: guide.preview_tr,
  };
}

export default async function RehberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let post = null;

  try {
    const { data: rawGuide, error } = await supabase
      .from('guides')
      .select('*')
      .eq('id', resolvedParams.id)
      .single();

    if (error) console.error('Guide detail fetch error:', error);
    
    if (rawGuide) {
      post = mapGuideFromDb(rawGuide);
    }
  } catch (err) {
    console.error('Guide detail SSR data fetching error:', err);
  }

  return <RehberDetailClient initialPost={post} />;
}
