import { supabasePublic as supabase } from '../lib/supabasePublicServer';
import HomeClient from './HomeClient';
import { 
  mapCategoryFromDb, 
  mapHomeContentFromDb, 
  mapServiceFromDb,
  mapProductFromDb
} from '../context/dbMappers';
import { ServiceItem, Product, Category, HomePageContent } from '../context/dbTypes';

export const revalidate = 60; // ISR cache for 60 seconds since it's a public landing page

export default async function Home() {
  let services: ServiceItem[] = [];
  let products: Product[] = [];
  let categories: Category[] = [];
  let homeContent: HomePageContent | null = null;

  try {
    const [servicesRes, productsRes, catsRes, homeRes] = await Promise.all([
      supabase.from('services').select('*').eq('status', 'active').order('display_order', { ascending: true }),
      supabase.from('products').select('*').eq('status', 'active').order('display_order', { ascending: true }).limit(8),
      supabase.from('categories').select('*').order('display_order', { ascending: true }),
      supabase.from('home_page_content').select('*')
    ]);

    if (servicesRes.error) console.error('Services error:', servicesRes.error);
    if (productsRes.error) console.error('Products error:', productsRes.error);
    
    if (servicesRes.data) services = servicesRes.data.map(mapServiceFromDb);
    if (productsRes.data) products = productsRes.data.map(mapProductFromDb);
    if (catsRes.data) categories = catsRes.data.map(mapCategoryFromDb);
    if (homeRes.data && homeRes.data[0]) homeContent = mapHomeContentFromDb(homeRes.data[0]);
  } catch (err) {
    console.error('Home page data fetching error:', err);
  }

  return (
    <HomeClient 
      initialServices={services} 
      initialProducts={products} 
      initialCategories={categories}
      initialHomeContent={homeContent}
    />
  );
}
