import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
  {
    id: `prd-${Date.now()}-1`,
    name_tr: "Premium Lüks Salon Perdesi",
    name_en: "Premium Luxury Living Room Curtain",
    category_id: "cat-1782300274635-1",
    category_tr: "Ev Perdeleri",
    category_en: "Home Curtains",
    description_tr: "Evinizin salonuna zarafet ve lüks katacak, gold detaylı ve koyu lacivert tonlarda premium kalite perde.",
    description_en: "Premium quality curtain in dark navy tones with gold details that will add elegance and luxury to your living room.",
    cover_image: "/products/prod_cat_home_1782590667048.png",
    images: ["/products/prod_cat_home_1782590667048.png"],
    status: "active",
    display_order: 1,
    price_multiplier: 1.5,
    popularity: 95
  },
  {
    id: `prd-${Date.now()}-2`,
    name_tr: "Kurumsal Ofis Dikey Jaluzi",
    name_en: "Corporate Office Vertical Blinds",
    category_id: "cat-1782300276185-2",
    category_tr: "Ofis / Kurumsal",
    category_en: "Office / Corporate",
    description_tr: "Profesyonel çalışma alanları için özel olarak tasarlanmış, gün ışığını mükemmel filtreleyen modern dikey ofis jaluzisi.",
    description_en: "Modern vertical office blinds specially designed for professional workspaces, perfectly filtering daylight.",
    cover_image: "/products/prod_cat_office_1782590676952.png",
    images: ["/products/prod_cat_office_1782590676952.png"],
    status: "active",
    display_order: 2,
    price_multiplier: 1.2,
    popularity: 85
  },
  {
    id: `prd-${Date.now()}-3`,
    name_tr: "Dış Mekan Pergola Perdesi",
    name_en: "Outdoor Pergola Curtain",
    category_id: "cat-1782300282507-7",
    category_tr: "Dış Mekan / Teras",
    category_en: "Outdoor / Terrace",
    description_tr: "Teras ve dış mekanlar için rüzgar, güneş ve suya dayanıklı lüks dış mekan perdesi.",
    description_en: "Luxury outdoor curtain resistant to wind, sun, and water for terraces and outdoor spaces.",
    cover_image: "/products/prod_cat_outdoor_1782590686764.png",
    images: ["/products/prod_cat_outdoor_1782590686764.png"],
    status: "active",
    display_order: 3,
    price_multiplier: 1.8,
    popularity: 80
  },
  {
    id: `prd-${Date.now()}-4`,
    name_tr: "Endüstriyel PVC Şerit Perde",
    name_en: "Industrial PVC Strip Curtain",
    category_id: "cat-1782300283613-8",
    category_tr: "Endüstriyel (PVC)",
    category_en: "Industrial (PVC)",
    description_tr: "Fabrika, depo ve soğuk hava depoları için yüksek dayanımlı endüstriyel PVC şerit perde.",
    description_en: "High-strength industrial PVC strip curtains for factories, warehouses, and cold storage.",
    cover_image: "/products/prod_cat_industrial_1782590703701.png",
    images: ["/products/prod_cat_industrial_1782590703701.png"],
    status: "active",
    display_order: 4,
    price_multiplier: 1.0,
    popularity: 70
  },
  {
    id: `prd-${Date.now()}-5`,
    name_tr: "Marin & Karavan Karartma Perde",
    name_en: "Marine & Caravan Blackout Curtain",
    category_id: "cat-1782300284636-9",
    category_tr: "Karavan / Tekne",
    category_en: "Caravan / Boat",
    description_tr: "Yat, tekne ve karavanlar için özel üretilmiş, tam karartma (blackout) sağlayan şık marin perde.",
    description_en: "Stylish marine curtain specially produced for yachts, boats, and caravans, providing full blackout.",
    cover_image: "/products/prod_cat_caravan_1782590712971.png",
    images: ["/products/prod_cat_caravan_1782590712971.png"],
    status: "active",
    display_order: 5,
    price_multiplier: 2.0,
    popularity: 75
  },
  {
    id: `prd-${Date.now()}-6`,
    name_tr: "İbadethane İşlemeli Fon Perde",
    name_en: "Place of Worship Embroidered Curtain",
    category_id: "cat-1782300277477-3",
    category_tr: "Cami / İbadethane",
    category_en: "Mosque / Place of Worship",
    description_tr: "Cami ve ibadethaneler için görkemli ve manevi havaya uygun, özel işlemeli ağır kumaş fon perde.",
    description_en: "Magnificent and heavily embroidered fabric background curtain suitable for the spiritual atmosphere for mosques and places of worship.",
    cover_image: "/products/prod_cat_mosque_1782590722504.png",
    images: ["/products/prod_cat_mosque_1782590722504.png"],
    status: "active",
    display_order: 6,
    price_multiplier: 2.5,
    popularity: 60
  },
  {
    id: `prd-${Date.now()}-7`,
    name_tr: "Görkemli Sahne Perdesi",
    name_en: "Grand Stage Curtain",
    category_id: "cat-1782300278841-4",
    category_tr: "Sahne / Konferans",
    category_en: "Stage / Conference",
    description_tr: "Konferans ve tiyatro sahneleri için akustik özellikli ve gösterişli ağır kadife sahne perdesi.",
    description_en: "Showy heavy velvet stage curtain with acoustic features for conference and theater stages.",
    cover_image: "/products/prod_cat_stage_1782590738938.png",
    images: ["/products/prod_cat_stage_1782590738938.png"],
    status: "active",
    display_order: 7,
    price_multiplier: 3.0,
    popularity: 65
  },
  {
    id: `prd-${Date.now()}-8`,
    name_tr: "Klinik Anti-Bakteriyel Perde",
    name_en: "Clinic Anti-Bacterial Curtain",
    category_id: "cat-1782300280067-5",
    category_tr: "Hastane / Klinik",
    category_en: "Hospital / Clinic",
    description_tr: "Hastane ve klinikler için standartlara uygun, hijyenik ve anti-bakteriyel seperatör perde.",
    description_en: "Hygienic and anti-bacterial separator curtain compliant with standards for hospitals and clinics.",
    cover_image: "/guides/guide_cleaning_curtains_1782582445608.png",
    images: ["/guides/guide_cleaning_curtains_1782582445608.png"],
    status: "active",
    display_order: 8,
    price_multiplier: 1.3,
    popularity: 80
  },
  {
    id: `prd-${Date.now()}-9`,
    name_tr: "Lüks Otel Süit Perdesi",
    name_en: "Luxury Hotel Suite Curtain",
    category_id: "cat-1782300281278-6",
    category_tr: "Otel / Konaklama",
    category_en: "Hotel / Accommodation",
    description_tr: "Premium otel odaları için tasarlanmış, tül ve karartma kombinasyonlu lüks konaklama perdesi.",
    description_en: "Luxury accommodation curtain designed for premium hotel rooms, with a sheer and blackout combination.",
    cover_image: "/guides/guide_smart_home_1782582476348.png",
    images: ["/guides/guide_smart_home_1782582476348.png"],
    status: "active",
    display_order: 9,
    price_multiplier: 1.7,
    popularity: 90
  }
];

async function seedProducts() {
  for (const product of products) {
    const { data, error } = await supabase
      .from('products')
      .insert([product]);

    if (error) {
      console.error(`Error inserting product ${product.name_tr}:`, error);
    } else {
      console.log(`Inserted product: ${product.name_tr}`);
    }
  }
  console.log('Product seeding completed.');
}

seedProducts();
