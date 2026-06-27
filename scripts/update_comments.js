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

const supabase = createClient(supabaseUrl, supabaseKey);

const newComments = [
  // 1. Ev Perdeleri
  {
    id: 'comm-ev-1',
    author: 'Mehmet Yılmaz',
    content_tr: 'Salonumuz için aldığımız tül ve fon perdeler evimize harika bir hava kattı. Kumaş kalitesi ve dökümü gerçekten muazzam.',
    content_en: 'The sheer and drape curtains we bought for our living room added a wonderful atmosphere to our home. The fabric quality and draping are truly magnificent.',
    rating: 5,
    is_active: true,
    display_order: 1
  },
  {
    id: 'comm-ev-2',
    author: 'Fatma Kaya',
    content_tr: 'Evimin tüm pencerelerine plise ve tül perde yaptırdık. Ölçüler milimetrik oturdu, işçilik için çok teşekkür ederim.',
    content_en: 'We had pleated and sheer curtains installed on all windows of my home. The measurements fit down to the millimeter, thank you very much for the craftsmanship.',
    rating: 5,
    is_active: true,
    display_order: 2
  },
  // 2. Ofis / Kurumsal
  {
    id: 'comm-ofis-1',
    author: 'Mustafa Demir',
    content_tr: 'Plaza katındaki ofisimiz için motorized stor perde sistemleri tercih ettik. Toplantı salonlarında ışık kontrolü ve sessiz çalışma mükemmel.',
    content_en: 'We chose motorized roller blind systems for our plaza office. Light control in meeting rooms and silent operation are excellent.',
    rating: 5,
    is_active: true,
    display_order: 3
  },
  {
    id: 'comm-ofis-2',
    author: 'Ayşe Şahin',
    content_tr: 'Mimar büromuzun pencereleri için dikey perde ve jaluzi çözümleri uygulandı. Kurumsal kimliğimize çok şık bir dokunuş sağlandı.',
    content_en: 'Vertical blind and venetian solutions were applied for our architectural firm windows. A very stylish touch was provided to our corporate identity.',
    rating: 5,
    is_active: true,
    display_order: 4
  },
  // 3. Cami / İbadethane
  {
    id: 'comm-cami-1',
    author: 'Ahmet Çelik',
    content_tr: 'Camimizin yüksek pencereleri için otomatik motorlu raylı perde sistemleri yapıldı. İbadet alanına yakışır vakur ve kaliteli bir uygulama oldu.',
    content_en: 'Automatic motorized rail curtain systems were installed for our mosque\'s high windows. It became a dignified and quality application worthy of the place of worship.',
    rating: 5,
    is_active: true,
    display_order: 5
  },
  {
    id: 'comm-cami-2',
    author: 'Emine Yıldız',
    content_tr: 'Kuran kursu ve ibadethane salonumuz için kadife kaplama ses yalıtımlı perdeler takıldı. Kumaşın dokusu ve duruşu çok kaliteli.',
    content_en: 'Velvet soundproof curtains were installed for our Quran course and worship hall. The texture and stance of the fabric are high quality.',
    rating: 5,
    is_active: true,
    display_order: 6
  },
  // 4. Sahne / Konferans
  {
    id: 'comm-sahne-1',
    author: 'Ali Yıldırım',
    content_tr: 'Konferans salonumuzun kadife sahne perdesi ve motorlu mekanizması tam zamanında teslim edildi. Akustik performansı ve duruşu harika.',
    content_en: 'The velvet stage curtain and motorized mechanism of our conference hall were delivered right on time. Acoustic performance and stance are wonderful.',
    rating: 5,
    is_active: true,
    display_order: 7
  },
  {
    id: 'comm-sahne-2',
    author: 'Hatice Öztürk',
    content_tr: 'Kültür merkezimizin tiyatro sahnesi için yangına dayanıklı (FR) kadife perdeler uygulandı. Profesyonel işçiliklerinden dolayı tebrik ederim.',
    content_en: 'Fire-retardant (FR) velvet curtains were applied for the theater stage of our cultural center. I congratulate them for their professional craftsmanship.',
    rating: 5,
    is_active: true,
    display_order: 8
  },
  // 5. Hastane / Klinik
  {
    id: 'comm-hastane-1',
    author: 'Hüseyin Aydın',
    content_tr: 'Klinik muayenehanelerimiz için antibakteriyel ve yıkanabilir hasta bölme seperatör perdeleri temin ettik. Hijyen standartlarına tam uygun.',
    content_en: 'We procured antibacterial and washable patient separator curtains for our clinical examination rooms. Fully compliant with hygiene standards.',
    rating: 5,
    is_active: true,
    display_order: 9
  },
  {
    id: 'comm-hastane-2',
    author: 'Zeynep Özdemir',
    content_tr: 'Hastane odalarımız için blackout (karartma) ve leke tutmaz stor perdeler takıldı. Hastalarımızın konforu için çok memnun kaldık.',
    content_en: 'Blackout and stain-resistant roller blinds were installed for our hospital rooms. We were very pleased for the comfort of our patients.',
    rating: 5,
    is_active: true,
    display_order: 10
  },
  // 6. Otel / Konaklama
  {
    id: 'comm-otel-1',
    author: 'Hasan Arslan',
    content_tr: 'Boutique otelimizin tüm süit odalarına tam karartma (blackout) fon ve tül perdeler uygulandı. Müşterilerimizden harika geri dönüşler alıyoruz.',
    content_en: 'Full blackout drapes and sheers were applied to all suite rooms of our boutique hotel. We receive wonderful feedback from our guests.',
    rating: 5,
    is_active: true,
    display_order: 11
  },
  {
    id: 'comm-otel-2',
    author: 'Elif Doğan',
    content_tr: 'Otel restoranımız ve lobi alanımız için motorlu dökümlü keten perdeler tercih ettik. Mekanın lüks ve ferah havasını tamamladı.',
    content_en: 'We preferred motorized flowing linen curtains for our hotel restaurant and lobby area. It completed the luxurious and spacious atmosphere of the venue.',
    rating: 5,
    is_active: true,
    display_order: 12
  },
  // 7. Dış Mekan / Teras
  {
    id: 'comm-dis-1',
    author: 'İbrahim Kılıç',
    content_tr: 'Restoranımızın açık terası için rüzgara dayanıklı zip perde (fermuarlı stor) sistemleri kuruldu. Olumsuz hava koşullarında bile müşterilerimiz rahat ediyor.',
    content_en: 'Wind-resistant zip blind systems were installed for our restaurant\'s outdoor terrace. Our customers are comfortable even in adverse weather conditions.',
    rating: 5,
    is_active: true,
    display_order: 13
  },
  {
    id: 'comm-dis-2',
    author: 'Meryem Aslan',
    content_tr: 'Villa bahçemiz ve pergolamız için şeffaf branda ve bambu jaluzi uygulaması yapıldı. Dış mekan keyfimizi ikiye katladı.',
    content_en: 'Transparent tarpaulin and bamboo blind applications were made for our villa garden and pergola. It doubled our outdoor enjoyment.',
    rating: 5,
    is_active: true,
    display_order: 14
  },
  // 8. Endüstriyel (PVC)
  {
    id: 'comm-endustriyel-1',
    author: 'İsmail Çetin',
    content_tr: 'Lojistik depomuz ve soğuk hava tesisimiz için şerit PVC perde kapıları takıldı. Isı kaybını minimuma indirdi, enerji tasarrufu sağladık.',
    content_en: 'Strip PVC curtain doors were installed for our logistics warehouse and cold storage facility. It minimized heat loss and provided energy savings.',
    rating: 5,
    is_active: true,
    display_order: 15
  },
  {
    id: 'comm-endustriyel-2',
    author: 'Şerife Kara',
    content_tr: 'Üretim fabrikamızdaki kaynak alanları ve bölmeler için özel PVC koruma perdeleri kullandık. İş güvenliği ve alan ayrımı için mükemmel çözüm.',
    content_en: 'We used special PVC protection curtains for welding areas and partitions in our manufacturing factory. Perfect solution for occupational safety and space separation.',
    rating: 5,
    is_active: true,
    display_order: 16
  }
];

async function updateComments() {
  console.log('Deleting existing comments...');
  const { error: delErr } = await supabase.from('comments').delete().neq('id', 'non_existing_id');
  if (delErr) {
    console.error('Error deleting comments:', delErr);
    return;
  }
  console.log('Deleted existing comments successfully.');

  console.log('Inserting 16 new comments...');
  const { data, error: insErr } = await supabase.from('comments').insert(newComments).select();
  if (insErr) {
    console.error('Error inserting comments:', insErr);
  } else {
    console.log(`Successfully inserted ${data.length} comments.`);
  }
}

updateComments();
