const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const detailedServices = [
  { id: 'srv-1', title_tr: 'Ücretsiz Keşif & Ölçü', title_en: 'Free Survey & Measurement', description_tr: 'Evinize veya iş yerinize gelerek profesyonel ekibimizle milimetrik ölçü alımı yapıyoruz. Hata payını sıfıra indirerek kusursuz bir görünüm sağlıyoruz.', description_en: 'We visit your home or workplace to take precise millimeter measurements with our professional team, ensuring a flawless look by eliminating margins of error.', icon: 'Ruler', display_order: 1, status: 'active', focal_x: 50, focal_y: 50 },
  { id: 'srv-2', title_tr: 'Tasarım Danışmanlığı', title_en: 'Design Consultancy', description_tr: 'İç mimarlarımız eşliğinde mekanınızın ruhuna, mobilyalarınıza ve ışık alma durumuna en uygun kumaş, renk ve model seçimi konusunda profesyonel destek veriyoruz.', description_en: 'Accompanied by our interior architects, we provide professional support in choosing the most suitable fabric, color, and model for your space\'s spirit, furniture, and lighting.', icon: 'Palette', display_order: 2, status: 'active', focal_x: 50, focal_y: 50 },
  { id: 'srv-3', title_tr: 'Profesyonel Montaj', title_en: 'Professional Installation', description_tr: 'Siparişleriniz hazırlandıktan sonra, deneyimli montaj ekibimiz tarafından temiz, hızlı ve mekanınıza zarar vermeyecek şekilde kurulum işlemleri gerçekleştirilir.', description_en: 'Once your orders are ready, our experienced installation team performs clean and fast installation without damaging your space.', icon: 'Wrench', display_order: 3, status: 'active', focal_x: 50, focal_y: 50 },
  { id: 'srv-4', title_tr: 'Akıllı Ev Entegrasyonu', title_en: 'Smart Home Integration', description_tr: 'Motorlu perde sistemlerinizi Apple HomeKit, Google Home ve diğer otomasyon ağlarına entegre ederek konforunuzu en üst düzeye çıkarıyoruz.', description_en: 'We maximize your comfort by integrating your motorized curtain systems with Apple HomeKit, Google Home, and other automation networks.', icon: 'Lightbulb', display_order: 4, status: 'active', focal_x: 50, focal_y: 50 },
  { id: 'srv-5', title_tr: 'Perde Yıkama & Temizlik', title_en: 'Curtain Cleaning & Washing', description_tr: 'Stor, zebra ve narin tül perdeleriniz için kumaşın dokusuna zarar vermeyen özel, profesyonel temizlik hizmeti sunuyoruz.', description_en: 'We offer specialized, professional cleaning services for your roller, zebra, and delicate sheer curtains without damaging the fabric\'s texture.', icon: 'Wrench', display_order: 5, status: 'active', focal_x: 50, focal_y: 50 },
  { id: 'srv-6', title_tr: 'Özel Tasarım & Dikim', title_en: 'Custom Design & Tailoring', description_tr: 'Standart ölçülerin dışına çıkarak, tamamen sizin zevkinize ve pencere yapınıza özel, birinci sınıf işçilikle perde dikimi yapıyoruz.', description_en: 'Going beyond standard sizes, we tailor curtains entirely to your taste and window structure with first-class workmanship.', icon: 'Palette', display_order: 6, status: 'active', focal_x: 50, focal_y: 50 },
  { id: 'srv-7', title_tr: 'Bakım, Tamir & Yedek Parça', title_en: 'Maintenance, Repair & Spare Parts', description_tr: 'Zamanla yıpranan veya arızalanan mekanizmalı perdeleriniz için hızlı tamir ve orijinal yedek parça temini hizmetimiz mevcuttur.', description_en: 'We offer quick repair and original spare parts supply services for your mechanized curtains that wear out or malfunction over time.', icon: 'Wrench', display_order: 7, status: 'active', focal_x: 50, focal_y: 50 },
  { id: 'srv-8', title_tr: 'Kurumsal & Proje Çözümleri', title_en: 'Corporate & Project Solutions', description_tr: 'Otel, hastane, ofis, okul ve büyük çaplı konut projeleri için toptan üretim, özel şartnamelere uygun tasarım ve uygulama desteği.', description_en: 'Wholesale production, design tailored to specific requirements, and application support for hotels, hospitals, offices, schools, and large-scale residential projects.', icon: 'Lightbulb', display_order: 8, status: 'active', focal_x: 50, focal_y: 50 }
];

async function updateServices() {
  console.log('Clearing old services...');
  const { error: delErr } = await supabase.from('services').delete().neq('id', 'dummy');
  if (delErr) {
    console.error('Error deleting old services:', delErr);
    return;
  }
  
  console.log('Inserting new detailed services...');
  const { error: insErr } = await supabase.from('services').insert(detailedServices);
  if (insErr) {
    console.error('Error inserting services:', insErr);
    return;
  }
  
  console.log('Successfully updated services!');
}

updateServices();
