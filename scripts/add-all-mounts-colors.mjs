import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const paletteColors = [
  { nameTr: "Koyu Lacivert", nameEn: "Dark Navy", hex: "#0A1118" },
  { nameTr: "Altın Sarısı", nameEn: "Gold", hex: "#BD954B" },
  { nameTr: "Soft Gri", nameEn: "Soft Grey", hex: "#A3B3C2" }
];

async function updateProducts() {
  const { data: products, error: pError } = await supabase
    .from('products')
    .select('id, name_tr, category_id')
    .ilike('id', 'prd-%');

  if (pError) {
    console.error('Error fetching products:', pError);
    return;
  }

  const { data: mountingTypes, error: mError } = await supabase
    .from('mounting_types')
    .select('id, category_id');

  if (mError) {
    console.error('Error fetching mounting types:', mError);
    return;
  }

  for (const product of products) {
    // Get ALL matching mounting types for the product's category
    const matchingMounts = mountingTypes
      .filter(m => m.category_id === product.category_id)
      .map(m => m.id);

    // Some products like "Endüstriyel PVC Şerit Perde" might have distinct industrial colors,
    // but the user requested "ürün görsellerine uygun şekilde renkleri de ekle" 
    // And I generated ALL images using the brand's exact color palette!
    // So adding these 3 colors to all the 9 products is exactly right.
    
    const { error: updateError } = await supabase
      .from('products')
      .update({ 
        mounting_type_ids: matchingMounts,
        colors: paletteColors 
      })
      .eq('id', product.id);
      
    if (updateError) {
      console.error(`Error updating product ${product.name_tr}:`, updateError);
    } else {
      console.log(`Updated product ${product.name_tr}:`);
      console.log(`  - Mounting Types assigned: ${matchingMounts.length}`);
      console.log(`  - Colors assigned: 3`);
    }
  }
}

updateProducts();
