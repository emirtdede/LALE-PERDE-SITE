import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixMountingTypes() {
  // Fetch products that start with 'prd-' (the ones we added)
  const { data: products, error: pError } = await supabase
    .from('products')
    .select('id, name_tr, category_id, mounting_type_ids')
    .ilike('id', 'prd-%');

  if (pError) {
    console.error('Error fetching products:', pError);
    return;
  }

  // Fetch all mounting types
  const { data: mountingTypes, error: mError } = await supabase
    .from('mounting_types')
    .select('id, category_id');

  if (mError) {
    console.error('Error fetching mounting types:', mError);
    return;
  }

  for (const product of products) {
    // If it already has mounting types, skip (unless it's empty)
    if (product.mounting_type_ids && product.mounting_type_ids.length > 0) {
      continue;
    }

    // Find a mounting type for this product's category
    const matchingMountingTypes = mountingTypes.filter(m => m.category_id === product.category_id);
    
    if (matchingMountingTypes.length > 0) {
      // Assign the first matching mounting type
      const mountingTypeId = matchingMountingTypes[0].id;
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ mounting_type_ids: [mountingTypeId] })
        .eq('id', product.id);
        
      if (updateError) {
        console.error(`Error updating product ${product.name_tr}:`, updateError);
      } else {
        console.log(`Updated product ${product.name_tr} with mounting type ${mountingTypeId}`);
      }
    } else {
      console.log(`No mounting type found for category ${product.category_id} (Product: ${product.name_tr})`);
    }
  }
}

fixMountingTypes();
