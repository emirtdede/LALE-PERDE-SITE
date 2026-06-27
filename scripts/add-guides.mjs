import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const guides = [
  {
    title_tr: "Perdenin Tarihçesi: Kökeni ve Gelişimi",
    title_en: "History of Curtains: Origin and Development",
    summary_tr: "Perde kelimesinin kökeni nereden gelir? Antik çağlardan günümüze perdelerin tarihsel gelişimi ve evrimi.",
    summary_en: "Where does the word curtain come from? The historical development and evolution of curtains from ancient times to the present.",
    content_tr: "Perde, insanlık tarihi boyunca barınma ve mahremiyet ihtiyacının bir sonucu olarak ortaya çıkmıştır. İlk perdeler genellikle hayvan derilerinden ve kalın yapraklardan yapılırken, zamanla dokumacılığın gelişmesiyle kumaş perdeler kullanılmaya başlanmıştır. Antik Mısır'da keten, Antik Roma'da ise ipek ve yün perdelerin zenginlik belirtisi olarak sarayları ve büyük evleri süslediği bilinmektedir. Orta Çağ Avrupa'sında şatolarda soğuğu kesmek için kullanılan kalın halı benzeri dokumalar, Rönesans dönemiyle birlikte daha estetik ve dekoratif bir hal almıştır. Günümüzde ise perdeler, sadece mahremiyet ve ısı yalıtımı değil, aynı zamanda mekanın karakterini belirleyen en önemli dekorasyon öğelerinden biri haline gelmiştir.",
    content_en: "Curtains have emerged throughout human history as a result of the need for shelter and privacy. While the first curtains were generally made of animal skins and thick leaves, over time, with the development of weaving, fabric curtains began to be used. It is known that in Ancient Egypt linen, and in Ancient Rome silk and wool curtains decorated palaces and large houses as a sign of wealth. Thick carpet-like weaves used to cut the cold in castles in medieval Europe became more aesthetic and decorative with the Renaissance period. Today, curtains have become one of the most important decoration elements that determine the character of the space, not only for privacy and thermal insulation.",
    image: "/guides/guide_history_curtains_1782582397689.png",
    status: "active",
    display_order: 1,
    date: new Date().toISOString().split('T')[0]
  },
  {
    title_tr: "Mekana Göre Perde Seçimi",
    title_en: "Choosing Curtains According to the Space",
    summary_tr: "Hangi odaya hangi perde seçilmeli? Salon, yatak odası, mutfak ve çocuk odası için doğru perde seçimi ipuçları.",
    summary_en: "Which curtain should be chosen for which room? Tips for choosing the right curtains for the living room, bedroom, kitchen, and nursery.",
    content_tr: "Perde seçimi yaparken odanın işlevi, aldığı doğal ışık miktarı ve genel dekorasyon tarzı dikkate alınmalıdır.\n\n**Salon:** Gösterişli ve mekanı tamamlayan perdeler tercih edilmelidir. Tül perdelerin yanında kalın fon perdeler (kruvaze veya düz) salonlara derinlik katar.\n**Yatak Odası:** Mahremiyetin ve uyku kalitesinin ön planda olduğu yatak odalarında ışığı tamamen kesen karartma (blackout) perdeler idealdir.\n**Mutfak:** Yemek pişirme sırasında nem ve kokuya maruz kaldığı için kolay temizlenebilir, pratik ve ışığı geçiren stor veya jaluzi perdeler tercih edilebilir.\n**Çocuk Odası:** Canlı renkler, yıkanabilir hafif kumaşlar ve toz tutmayan antialerjik perdeler çocuklar için en sağlıklı seçimdir.",
    content_en: "When choosing curtains, the function of the room, the amount of natural light it receives, and the general decoration style should be considered.\n\n**Living Room:** Showy curtains that complete the space should be preferred. Thick draperies (double-breasted or flat) alongside sheer curtains add depth to living rooms.\n**Bedroom:** Blackout curtains that completely block the light are ideal for bedrooms where privacy and sleep quality are at the forefront.\n**Kitchen:** Since it is exposed to moisture and odor during cooking, easy-to-clean, practical, and light-transmitting roller or venetian blinds can be preferred.\n**Nursery:** Vibrant colors, washable light fabrics, and dust-proof anti-allergic curtains are the healthiest choice for children.",
    image: "/guides/guide_choosing_curtains_1782582406868.png",
    status: "active",
    display_order: 2,
    date: new Date().toISOString().split('T')[0]
  },
  {
    title_tr: "Perdelik Kumaş Türleri ve Özellikleri",
    title_en: "Curtain Fabric Types and Features",
    summary_tr: "Keten, kadife, ipek, tafta ve tül... Perdelik kumaş türleri nelerdir ve hangi alanlarda kullanılır?",
    summary_en: "Linen, velvet, silk, taffeta, and sheer... What are the types of curtain fabrics and in which areas are they used?",
    content_tr: "Doğru kumaş seçimi perdenin duruşunu ve kullanım ömrünü belirler.\n\n**Keten:** Doğal, sade ve şık bir görünüm sunar. Yazlık evlerde ve modern, minimalist tasarımlarda sıkça tercih edilir.\n**Kadife:** Ağır, dökümlü ve lüks bir kumaştır. Işığı ve sesi iyi yalıttığı için klasik tarzda döşenmiş salonlarda ve yatak odalarında kullanılır.\n**İpek:** Zarif ve parlaktır ancak narin yapısı nedeniyle güneş ışığından çabuk etkilenir. Genellikle astar ile birlikte özel mekanlarda tercih edilir.\n**Tül (Polyester/Organze):** Işığı süzerek mekana aydınlık verir. Gündüz mahremiyeti sağlarken ferah bir ortam yaratır.",
    content_en: "Choosing the right fabric determines the stance and lifespan of the curtain.\n\n**Linen:** Offers a natural, simple, and stylish look. It is frequently preferred in summer houses and modern, minimalist designs.\n**Velvet:** It is a heavy, draped, and luxurious fabric. Because it insulates light and sound well, it is used in classically furnished living rooms and bedrooms.\n**Silk:** It is elegant and shiny, but due to its delicate structure, it is quickly affected by sunlight. It is generally preferred in special spaces along with a lining.\n**Sheer (Polyester/Organza):** Illuminates the space by filtering the light. It creates a spacious environment while providing daytime privacy.",
    image: "/guides/guide_fabric_types_1782582415932.png",
    status: "active",
    display_order: 3,
    date: new Date().toISOString().split('T')[0]
  },
  {
    title_tr: "Perde Montaj Sistemleri: Kornişten Rustiğe",
    title_en: "Curtain Mounting Systems: From Cornice to Rustic",
    summary_tr: "Doğru perde montajı nasıl yapılır? Korniş, rustik, ray ve stor perde mekanizmaları hakkında bilmeniz gerekenler.",
    summary_en: "How to mount curtains correctly? What you need to know about cornice, rustic, track, and roller blind mechanisms.",
    content_tr: "Perdenin güzelliğini gösteren en önemli detaylardan biri doğru montaj sistemidir.\n\n**Korniş Sistemi:** Geleneksel ve en yaygın yöntemdir. Tavana monte edilir ve birden fazla perdenin (tül, güneşlik, fon) aynı anda kullanılmasına olanak tanır.\n**Rustik (Boru) Sistem:** Genellikle metal veya ahşap borular şeklinde duvara monte edilir. Perde halkalarla veya halkasız olarak boruya geçirilir. Klasik, country ve vintage dekorasyonlar için vazgeçilmezdir.\n**Mekanizmalı Sistemler:** Stor, zebra, jaluzi gibi perdelerin takıldığı özel metal kasalardır. Tavana veya duvara monte edilebilirler. Doğru terazi alınarak takılması sistemin düzgün çalışması için çok önemlidir.",
    content_en: "One of the most important details that show the beauty of the curtain is the correct mounting system.\n\n**Cornice System:** It is the traditional and most common method. It is mounted on the ceiling and allows the simultaneous use of multiple curtains (sheer, sunshade, background).\n**Rustic (Pipe) System:** Usually mounted on the wall in the form of metal or wooden pipes. The curtain is threaded onto the pipe with or without rings. It is indispensable for classic, country, and vintage decorations.\n**Mechanized Systems:** These are special metal cases where curtains such as roller blinds, zebras, and venetian blinds are attached. They can be mounted on the ceiling or wall. Installing it by taking the correct balance is crucial for the proper operation of the system.",
    image: "/guides/guide_mounting_types_1782582433796.png",
    status: "active",
    display_order: 4,
    date: new Date().toISOString().split('T')[0]
  },
  {
    title_tr: "Pratik Perde Temizliği ve Yıkama Rehberi",
    title_en: "Practical Curtain Cleaning and Washing Guide",
    summary_tr: "Tül, stor ve zebra perdeler nasıl temizlenir? Perde ömrünü uzatan temizlik sırları ve bakım ipuçları.",
    summary_en: "How to clean sheer, roller, and zebra curtains? Cleaning secrets and maintenance tips that extend curtain life.",
    content_tr: "Düzenli temizlik perdelerin ömrünü uzatır ve evin havasını ferahlatır.\n\n**Tül Perdeler:** Makinede hassas programda, maksimum 30 derecede yıkanmalıdır. Kırışmaması için sıkma yapılmamalı ve makineden çıkar çıkmaz nemliyken asılmalıdır.\n**Stor ve Zebra Perdeler:** Çamaşır makinesinde yıkanmazlar. Düz bir zemine serilerek sabunlu su ve yumuşak bir sünger yardımıyla nazikçe silinmelidir. Kimyasal ağartıcılar kumaşın yapısını bozabilir.\n**Kadife ve Özel Kumaşlar:** Su lekelerine karşı hassas oldukları için genellikle kuru temizleme önerilir. Günlük bakımda ise özel toz alma aparatlarıyla hafifçe süpürülmelidir.",
    content_en: "Regular cleaning extends the life of curtains and freshens the air of the house.\n\n**Sheer Curtains:** Should be washed in the machine on a delicate program at a maximum of 30 degrees. To prevent wrinkling, it should not be spun and should be hung while damp as soon as it is taken out of the machine.\n**Roller and Zebra Blinds:** They are not washed in the washing machine. They should be laid on a flat surface and gently wiped with soapy water and a soft sponge. Chemical bleaches can ruin the fabric structure.\n**Velvet and Special Fabrics:** Dry cleaning is generally recommended as they are sensitive to water stains. In daily care, they should be lightly vacuumed with special dusting attachments.",
    image: "/guides/guide_cleaning_curtains_1782582445608.png",
    status: "active",
    display_order: 5,
    date: new Date().toISOString().split('T')[0]
  },
  {
    title_tr: "Perdeler İçin Mevsimsel Bakım",
    title_en: "Seasonal Maintenance for Curtains",
    summary_tr: "Yaz ve kış aylarına geçerken perdelerinize nasıl bakım yapmalısınız? Isı tasarrufu sağlayan ipuçları.",
    summary_en: "How should you care for your curtains when transitioning to summer and winter months? Tips for saving heat.",
    content_tr: "Perdeler, evin ısı yalıtımında büyük rol oynar. Mevsim geçişlerinde perdeleri değiştirmek veya uygun bakım yapmak enerji tasarrufu sağlar.\n\n**Kışlık Bakım:** Kış aylarında pencerelerden gelen soğuk havayı kesmek için kalın dokumalı, astarlı veya termal fon perdeler tercih edilmelidir. Kışa girerken yazlık ince tüllerin yıkanıp kaldırılması, yerine daha yoğun dokulu perdelerin asılması evin sıcaklığını artırır.\n**Yazlık Bakım:** Yaz aylarında güneş ışığından maksimum faydalanmak ve ortamı serin tutmak için pamuklu, keten gibi nefes alabilen hafif kumaşlar kullanılmalıdır. Yoğun güneş ışığı kumaşları soldurabileceği için, yaz aylarında stor perdeler veya güneşlikler ile asıl perdeler korunmalıdır.",
    content_en: "Curtains play a big role in the thermal insulation of the house. Changing curtains or doing appropriate maintenance during seasonal transitions saves energy.\n\n**Winter Maintenance:** In winter, thick-woven, lined, or thermal background curtains should be preferred to cut the cold air coming from the windows. Washing and storing thin summer sheers when entering winter and hanging more densely textured curtains instead increases the warmth of the house.\n**Summer Maintenance:** In summer, breathable light fabrics such as cotton and linen should be used to make maximum use of sunlight and keep the environment cool. Since intense sunlight can fade fabrics, main curtains should be protected with roller blinds or sunshades in the summer.",
    image: "/guides/guide_seasonal_maintenance_1782582454957.png",
    status: "active",
    display_order: 6,
    date: new Date().toISOString().split('T')[0]
  },
  {
    title_tr: "Akıllı Ev Sistemleri ve Motorlu Perdeler",
    title_en: "Smart Home Systems and Motorized Curtains",
    summary_tr: "Günümüz teknolojisi ile entegre motorlu perde sistemleri, uzaktan kumandalı perdeler ve akıllı ev uyumluluğu.",
    summary_en: "Motorized curtain systems integrated with today's technology, remote-controlled curtains, and smart home compatibility.",
    content_tr: "Teknolojinin gelişmesiyle birlikte perdeler de akıllandı. Motorlu perde sistemleri, konforu ve lüksü bir araya getiriyor.\n\n**Uzaktan Kontrol:** Motorlu sistemler sayesinde perdelerinizi yerinizden kalkmadan kumanda veya akıllı telefonunuz aracılığıyla açıp kapatabilirsiniz.\n**Akıllı Ev Entegrasyonu:** Alexa, Google Home veya Apple HomeKit gibi sistemlerle senkronize çalışabilen perdeler, sesli komutlarla kontrol edilebilir. Gün doğumu ve gün batımına göre otomatik açılıp kapanacak şekilde programlanabilir.\n**Geniş ve Yüksek Pencereler İçin İdeal:** Özellikle manuel olarak ulaşılması zor olan yüksek tavanlı evlerde veya büyük pencereli mekanlarda motorlu mekanizmalar vazgeçilmez bir rahatlık sunar.",
    content_en: "With the development of technology, curtains have also become smart. Motorized curtain systems bring comfort and luxury together.\n\n**Remote Control:** Thanks to motorized systems, you can open and close your curtains via a remote control or your smartphone without leaving your seat.\n**Smart Home Integration:** Curtains that can work synchronously with systems like Alexa, Google Home, or Apple HomeKit can be controlled with voice commands. They can be programmed to open and close automatically according to sunrise and sunset.\n**Ideal for Wide and High Windows:** Especially in homes with high ceilings or spaces with large windows, which are difficult to reach manually, motorized mechanisms offer indispensable convenience.",
    image: "/guides/guide_smart_home_1782582476348.png",
    status: "active",
    display_order: 7,
    date: new Date().toISOString().split('T')[0]
  },
  {
    title_tr: "Dekorasyonda Perde Rengi Seçimi",
    title_en: "Choosing Curtain Colors in Decoration",
    summary_tr: "Perde rengi mekanın psikolojisini nasıl etkiler? Duvar ve mobilyalarla uyumlu perde seçme sanatı.",
    summary_en: "How does curtain color affect the psychology of the space? The art of choosing curtains in harmony with walls and furniture.",
    content_tr: "Perde rengi, bir odanın atmosferini tamamen değiştirebilecek güce sahiptir.\n\n**Açık Tonlar:** Beyaz, krem, bej ve açık gri gibi renkler mekanı daha geniş, ferah ve aydınlık gösterir. Küçük odalar için idealdir.\n**Koyu Tonlar:** Lacivert, zümrüt yeşili, bordo veya antrasit renkler mekana derinlik, asalet ve lüks bir hava katar. Geniş salonlarda ve yatak odalarında güçlü bir odak noktası oluşturur.\n**Kontrast ve Uyum:** Perdelerinizi seçerken ya duvar renginizle ton sür ton (benzer tonlar) bir uyum yakalayabilir ya da zıt renkler kullanarak cesur bir kontrast oluşturabilirsiniz. Desenli perdeler seçiliyorsa mobilyaların daha sade olması göz yorgunluğunu engeller.",
    content_en: "Curtain color has the power to completely change the atmosphere of a room.\n\n**Light Tones:** Colors like white, cream, beige, and light gray make the space look wider, more spacious, and brighter. Ideal for small rooms.\n**Dark Tones:** Colors like navy blue, emerald green, burgundy, or anthracite add depth, nobility, and a luxurious vibe to the space. It creates a strong focal point in large living rooms and bedrooms.\n**Contrast and Harmony:** When choosing your curtains, you can either achieve a tone-on-tone (similar tones) harmony with your wall color or create a bold contrast using opposite colors. If patterned curtains are chosen, keeping the furniture simpler prevents eye fatigue.",
    image: "/guides/guide_color_decor_1782582484500.png",
    status: "active",
    display_order: 8,
    date: new Date().toISOString().split('T')[0]
  },
  {
    title_tr: "Ofis ve İş Yerleri İçin Perde Çözümleri",
    title_en: "Curtain Solutions for Offices and Workplaces",
    summary_tr: "Çalışma ortamlarında verimliliği artıran, profesyonel görünümlü ofis perdeleri: Jaluzi, Dikey ve Stor perde.",
    summary_en: "Professional-looking office curtains that increase efficiency in work environments: Venetian, Vertical, and Roller blinds.",
    content_tr: "İş yerlerinde perde seçimi, çalışan verimliliğini ve mekana gelen misafirlerin ilk izlenimini doğrudan etkiler.\n\n**Jaluzi Perdeler:** Alüminyum veya ahşap jaluziler, ofislere modern ve profesyonel bir görünüm katar. Bantların açısı ayarlanarak içeri giren ışık miktarı kolayca kontrol edilebilir, bilgisayar ekranlarında yansıma önlenir.\n**Dikey Perdeler:** Geniş ve uzun pencereler, toplantı salonları ve cam bölmeli ofisler için idealdir. Mekanı daha yüksek gösterir ve ışık kontrolü sağlar.\n**Screen (Sunscreen) Stor Perdeler:** Dışarıyı görmenizi sağlarken güneşin göz alıcı parlaklığını ve UV ışınlarını engeller. Modern ofislerde en çok tercih edilen kumaş türlerinden biridir.",
    content_en: "Choosing curtains in workplaces directly affects employee efficiency and the first impression of guests visiting the space.\n\n**Venetian Blinds:** Aluminum or wooden blinds add a modern and professional look to offices. By adjusting the angle of the slats, the amount of light entering can be easily controlled, preventing reflections on computer screens.\n**Vertical Blinds:** Ideal for wide and long windows, meeting rooms, and glass-partitioned offices. Makes the space look taller and provides light control.\n**Screen (Sunscreen) Roller Blinds:** Prevents the sun's glaring brightness and UV rays while allowing you to see outside. It is one of the most preferred fabric types in modern offices.",
    image: "/guides/guide_office_curtains_1782582493893.png",
    status: "active",
    display_order: 9,
    date: new Date().toISOString().split('T')[0]
  },
  {
    title_tr: "Sürdürülebilir Perdecilik ve Çevre Dostu Kumaşlar",
    title_en: "Sustainable Curtains and Eco-Friendly Fabrics",
    summary_tr: "Doğaya duyarlı, geri dönüştürülebilir kumaşlarla üretilen sürdürülebilir perde modelleri.",
    summary_en: "Sustainable curtain models produced with environmentally friendly, recyclable fabrics.",
    content_tr: "Çevre bilincinin artmasıyla birlikte tekstil sektöründe de sürdürülebilirlik önem kazanmıştır.\n\n**Geri Dönüştürülmüş Malzemeler:** Pet şişelerden veya atık pamuk ipliklerinden üretilen geri dönüştürülmüş polyester kumaşlar, karbon ayak izini azaltarak doğayı korur.\n**Organik Kumaşlar:** Üretim aşamasında kimyasal ilaç ve zararlı boya kullanılmayan organik pamuk, bambu ve keten perdeler, evinizdeki hava kalitesini artırır.\n**Enerji Verimliliği:** Kaliteli termal perdeler, kışın ısı kaybını önleyip yazın evin serin kalmasını sağlayarak ısıtma ve soğutma enerjisinden tasarruf edilmesine katkıda bulunur. Sürdürülebilir bir ev tasarımı, doğru yalıtımlı perdelerle başlar.",
    content_en: "With the increase in environmental awareness, sustainability has gained importance in the textile sector as well.\n\n**Recycled Materials:** Recycled polyester fabrics produced from PET bottles or waste cotton yarns protect nature by reducing the carbon footprint.\n**Organic Fabrics:** Organic cotton, bamboo, and linen curtains, which are produced without chemical pesticides and harmful dyes, improve the air quality in your home.\n**Energy Efficiency:** High-quality thermal curtains contribute to saving heating and cooling energy by preventing heat loss in winter and keeping the house cool in summer. A sustainable home design starts with properly insulated curtains.",
    image: "/guides/guide_sustainable_curtains_1782582504087.png",
    status: "active",
    display_order: 10,
    date: new Date().toISOString().split('T')[0]
  }
];

async function seedGuides() {
  console.log('Clearing existing guides (optional, skipping for safety)...');
  
  for (let i = 0; i < guides.length; i++) {
    const guide = guides[i];
    const guideWithId = {
      ...guide,
      id: `gd-${Date.now()}-${i}`
    };
    const { data, error } = await supabase
      .from('guides')
      .insert([guideWithId]);

    if (error) {
      console.error(`Error inserting guide ${guide.title_tr}:`, error);
    } else {
      console.log(`Inserted: ${guide.title_tr}`);
    }
  }
  console.log('Seed completed.');
}

seedGuides();
