import { supabasePublic as supabase } from '../../lib/supabasePublicServer';
import { mapServiceFromDb } from '../../context/dbMappers';
import ServicesClient from './ServicesClient';
import { Metadata } from 'next';

export const revalidate = 60; // ISR cache for 60 seconds

export const metadata: Metadata = {
  title: 'Lale Perde • Hizmetler',
  description: 'Profesyonel ölçü, ücretsiz keşif, motorlu sistem entegrasyonu ve 5 yıl garanti gibi sunduğumuz ayrıcalıklı hizmetleri keşfedin.',
};

export default async function ServicesPage() {
  let services: any[] = [];

  try {
    const { data: rawServices, error } = await supabase
      .from('services')
      .select('*')
      .eq('status', 'active')
      .order('display_order', { ascending: true });

    if (error) console.error('Services fetch error:', error);
    
    if (rawServices) {
      services = rawServices.map(mapServiceFromDb);
    }
  } catch (err) {
    console.error('Services SSR data fetching error:', err);
  }

  return <ServicesClient initialServices={services} />;
}
