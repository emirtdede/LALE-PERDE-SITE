import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateProducts() {
  const updates = [
    {
      name_tr: "İbadethane İşlemeli Fon Perde",
      cover_image: "/products/prod_cat_mosque_new_1782591362923.png",
      images: ["/products/prod_cat_mosque_new_1782591362923.png"]
    },
    {
      name_tr: "Klinik Anti-Bakteriyel Perde",
      cover_image: "/products/prod_cat_clinic_new_1782591380435.png",
      images: ["/products/prod_cat_clinic_new_1782591380435.png"]
    }
  ];

  for (const update of updates) {
    const { data, error } = await supabase
      .from('products')
      .update({ 
        cover_image: update.cover_image, 
        images: update.images 
      })
      .eq('name_tr', update.name_tr);

    if (error) {
      console.error(`Error updating ${update.name_tr}:`, error);
    } else {
      console.log(`Successfully updated ${update.name_tr}`);
    }
  }
}

updateProducts();
