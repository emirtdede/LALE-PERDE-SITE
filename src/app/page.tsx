import { supabase } from '../lib/supabaseClient';
import HomeClient from './HomeClient';
import { 
  mapCategoryFromDb, 
  mapSettingsFromDb, 
  mapHomeContentFromDb, 
  mapServiceFromDb,
  mapProductFromDb
} from '../context/dbMappers';

export const revalidate = 60; // ISR cache for 60 seconds since it's a public landing page

export default async function Home() {
  let services: any[] = [];
  let products: any[] = [];

  try {
    const [servicesRes, productsRes] = await Promise.all([
      supabase.from('services').select('*').eq('status', 'active').order('display_order', { ascending: true }),
      supabase.from('products').select('*').eq('status', 'active').order('display_order', { ascending: true })
    ]);

    if (servicesRes.error) console.error('Services error:', servicesRes.error);
    if (productsRes.error) console.error('Products error:', productsRes.error);

    services = (servicesRes.data || []).map(mapServiceFromDb);
    products = (productsRes.data || []).map(mapProductFromDb);
  } catch (err) {
    console.error('Home Page SSR data fetching error:', err);
  }

  return (
    <HomeClient 
      initialServices={services}
      initialProducts={products}
    />
  );
}
