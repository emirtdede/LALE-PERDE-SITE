import { supabasePublic as supabase } from '../../lib/supabasePublicServer';
import { mapProductFromDb, mapCategoryFromDb, mapMountingTypeFromDb, mapFabricTypeFromDb } from '../../context/dbMappers';
import MeasureWizardClient from './MeasureWizardClient';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const revalidate = 60; // ISR cache for 60 seconds

export const metadata: Metadata = {
  title: 'Lale Perde • Ölçü Sihirbazı',
  description: 'Evinizdeki perdelerin ölçüsünü nasıl alacağınızı öğrenin ve interaktif 2D panomuz üzerinden hızlıca fiyat teklifi alın.',
};

export default async function MeasureWizardPage() {
  // Fetch active products and categories securely on the server
  const [
    { data: rawProducts },
    { data: rawCats },
    { data: rawMountings },
    { data: rawFabrics }
  ] = await Promise.all([
    supabase.from('products').select('*').eq('status', 'active').order('display_order', { ascending: true }),
    supabase.from('categories').select('*').eq('status', 'active').order('display_order', { ascending: true }),
    supabase.from('mounting_types').select('*').order('display_order', { ascending: true }),
    supabase.from('fabric_types').select('*').order('display_order', { ascending: true })
  ]);

  const products = (rawProducts || []).map(mapProductFromDb);
  const categories = (rawCats || []).map(mapCategoryFromDb);
  const mountingTypes = (rawMountings || []).map(mapMountingTypeFromDb);
  const fabricTypes = (rawFabrics || []).map(mapFabricTypeFromDb);

  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem 0' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(189, 149, 75, 0.2)', borderTopColor: '#BD954B', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    }>
      <MeasureWizardClient 
        initialProducts={products} 
        initialCategories={categories} 
        initialMountingTypes={mountingTypes}
        initialFabricTypes={fabricTypes}
      />
    </Suspense>
  );
}
