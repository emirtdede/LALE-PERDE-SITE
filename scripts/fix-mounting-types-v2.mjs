import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixMountingTypes() {
  const { data: products, error: pError } = await supabase
    .from('products')
    .select('id, name_tr, category_id, curtain_type_id')
    .ilike('id', 'prd-%');

  if (pError) return console.error(pError);

  const { data: curtainTypes, error: cError } = await supabase
    .from('curtain_types')
    .select('id, category_id');
    
  if (cError) return console.error(cError);

  const { data: mountingTypes, error: mError } = await supabase
    .from('mounting_types')
    .select('id, category_id, curtain_type_id');

  if (mError) return console.error(mError);

  for (const product of products) {
    // Determine the curtain_type_id for this product (if not set, pick the first one for its category)
    let curtainTypeId = product.curtain_type_id;
    if (!curtainTypeId) {
      const matchingCurtainTypes = curtainTypes.filter(c => c.category_id === product.category_id);
      if (matchingCurtainTypes.length > 0) {
        curtainTypeId = matchingCurtainTypes[0].id;
      }
    }

    if (curtainTypeId) {
      // Find mounting types that EXACTLY match this curtain_type_id
      const compatibleMounts = mountingTypes
        .filter(m => m.category_id === product.category_id && m.curtain_type_id === curtainTypeId)
        .map(m => m.id);

      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          curtain_type_id: curtainTypeId,
          mounting_type_ids: compatibleMounts
        })
        .eq('id', product.id);

      if (updateError) {
        console.error(`Error updating ${product.name_tr}:`, updateError);
      } else {
        console.log(`Updated ${product.name_tr}:`);
        console.log(`  - Curtain Type ID assigned: ${curtainTypeId}`);
        console.log(`  - Compatible Mounts assigned: ${compatibleMounts.length}`);
      }
    } else {
      console.log(`Could not find a curtain type for category ${product.category_id} of product ${product.name_tr}`);
      
      // Revert mounts to empty if no curtain type exists
      await supabase.from('products').update({ mounting_type_ids: [] }).eq('id', product.id);
    }
  }
}

fixMountingTypes();
