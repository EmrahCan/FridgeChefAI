import { Recipe, DetectedIngredient } from '../types';

export const ZERO_WASTE_TIPS = [
  {
    title: 'Bayat Ekmekleri Değerlendirin 🍞',
    description: 'Bayat ekmekleri küp küp doğrayıp zeytinyağı ve kekikle fırınlayarak harika çorba krutonları yapabilirsiniz.',
  },
  {
    title: 'Yumuşamış Domatesler 🍅',
    description: 'Şeklini kaybeden domatesleri rendeleyip sarımsak ve zeytinyağı ile pişirerek nefis bir makarna/menemen sosuna çevirin.',
  },
  {
    title: 'Kalan Pilavı Çorbaya Dönüştürün 🍚',
    description: 'Dünden kalan pirinç veya bulgur pilavını yoğurtlu yayla çorbası veya köfte harcında mükemmel bir bağlayıcı olarak kullanabilirsiniz.',
  },
  {
    title: 'Sebze Saplarını Atmayın 🥦',
    description: 'Brokoli, maydanoz ve dereotu saplarını dondurucuda biriktirip sebze suyu (bulyon) yapımında kullanabilirsiniz.',
  },
  {
    title: 'Kalan Peynir Uçları 🧀',
    description: 'Kuruyan kaşar, beyaz peynir veya tulum peynirlerini rendeleyip fırın böreğinde veya fırınlanmış sebzelerde eritebilirsiniz.',
  }
];

export const DEMO_PRESETS: {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  ingredients: DetectedIngredient[];
  recipes: Recipe[];
}[] = [
  {
    id: 'preset-chicken-rice',
    name: 'Dünden Kalan Tavuk & Pilav 🍗🍚',
    subtitle: 'Haşlanmış tavuk, pirinç pilavı, yarım biber, yoğurt',
    icon: 'drumstick',
    ingredients: [
      { id: '1', name: 'Didiklenmiş Haşlanmış Tavuk', category: 'Kalan Yemek', confidence: 0.98, suggestedAction: 'Hemen Tüket' },
      { id: '2', name: 'Dünden Kalan Pirinç Pilavı', category: 'Kalan Yemek', confidence: 0.95, suggestedAction: 'Hemen Tüket' },
      { id: '3', name: 'Yarım Kırmızı Kapya Biber', category: 'Sebze & Meyve', confidence: 0.91, suggestedAction: 'Fırınla' },
      { id: '4', name: 'Yarım Kase Yoğurt', category: 'Süt Ürünleri', confidence: 0.88, suggestedAction: 'Taze' },
      { id: '5', name: 'Kaşar Peyniri (Kalan Parça)', category: 'Süt Ürünleri', confidence: 0.93, suggestedAction: 'Fırınla' },
    ],
    recipes: [
      {
        id: 'rec-1',
        title: 'Fırında Kremamsı Tavuklu Pilav Graten',
        tagline: 'Kalan pilav ve tavukları lüks bir fırın yemeğine çevirin!',
        description: 'Dünden kalan pilav ve didiklenmiş tavuk etlerini yoğurtlu-yumurtalı hafif bir sos ve kaşar peyniriyle fırınlayarak 15 dakikada çıtır bir lezzet şölenine dönüştürün.',
        prepTimeMinutes: 5,
        cookTimeMinutes: 15,
        difficulty: 'Kolay',
        servings: 2,
        caloriesPerServing: 380,
        wasteSavedGrams: 420,
        category: 'Fırın & Graten',
        ingredientsUsed: ['Didiklenmiş Haşlanmış Tavuk', 'Pirinç Pilavı', 'Kaşar Peyniri', 'Yoğurt', 'Kırmızı Kapya Biber'],
        pantryItemsNeeded: ['1 adet Yumurta', 'Zeytinyağı', 'Karabiber', 'Pul Biber', 'Tuz'],
        instructions: [
          {
            stepNumber: 1,
            title: 'Fırını Isıtın ve Tepsiyi Yağlayın',
            description: 'Fırını 200°C dereceye getirin. Küçük bir borcam veya fırın kabını 1 tatlı kaşığı zeytinyağı ile hafifçe yağlayın.',
            durationMinutes: 2,
          },
          {
            stepNumber: 2,
            title: 'Sos Karışımını Hazırlayın',
            description: 'Bir kasede yarım kase yoğurdu, 1 yumurtayı, tuz, karabiber ve pul biberi çırpın. Bu sos pilavın kurumasını önleyip sufle kıvamı verir.',
            durationMinutes: 3,
            tip: 'Dilerseniz içine 1 diş ezilmiş sarımsak ekleyerek lezzeti ikiye katlayabilirsiniz.'
          },
          {
            stepNumber: 3,
            title: 'Malzemeleri Birleştirin',
            description: 'Kalan pilavı, didiklenmiş tavukları ve ince doğranmış kapya biberi kaba dökün. Üzerine hazırladığınız sosu gezdirip hafifçe harmanlayın.',
            durationMinutes: 2,
          },
          {
            stepNumber: 4,
            title: 'Kaşar ile Fırınlayın',
            description: 'Üzerine rendelenmiş kaşar peynirini serpiştirin. Önceden ısıtılmış fırında üzeri nar gibi kızarana kadar yaklaşık 15 dakika pişirin.',
            durationMinutes: 15,
          }
        ],
        chefTips: [
          'Eğer pilavınız biraz kuruysa sos karışımına 2 yemek kaşığı süt veya su ekleyebilirsiniz.',
          'Servis ederken üzerine taze kekik veya maydanoz serpiştirin.'
        ],
        nutritionalHighlights: {
          protein: '32g',
          carbs: '28g',
          fat: '14g'
        },
        createdAt: new Date().toISOString(),
      },
      {
        id: 'rec-2',
        title: 'Tavuklu & Yoğurtlu Şifa Yayla Çorbası',
        tagline: 'Kalan pilav ve tavuk suyunun en lezzetli buluşması',
        description: 'Dünden kalan pilav taneleri bu çorbada pirinç haşlama derdini ortadan kaldırır. Yoğurt terbiyesi ve tavuk parçalarıyla 10 dakikada hazır.',
        prepTimeMinutes: 3,
        cookTimeMinutes: 10,
        difficulty: 'Kolay',
        servings: 3,
        caloriesPerServing: 220,
        wasteSavedGrams: 300,
        category: 'Şifalı Çorbalar',
        ingredientsUsed: ['Pirinç Pilavı', 'Didiklenmiş Haşlanmış Tavuk', 'Yoğurt'],
        pantryItemsNeeded: ['1 Yumurta Sarısı', '1 Yemek Kaşığı Un', 'Kuru Nane', 'Tereyağı / Zeytinyağı', '3 Su Bardağı Sıcak Su'],
        instructions: [
          {
            stepNumber: 1,
            title: 'Terbiyeyi Çırpın',
            description: 'Tencereye yoğurt, yumurta sarısı, un ve 1 bardak ılık suyu alıp pürüzsüz olana kadar tel çırpıcı ile karıştırın.',
            durationMinutes: 2,
          },
          {
            stepNumber: 2,
            title: 'Pilav ve Tavukları Ekleyin',
            description: 'Kalan 2 bardak sıcak suyu azar azar eklerken karıştırmaya devam edin. Orta ateşte kaynamaya başlayınca hazır pilavı ve didiklenmiş tavukları ekleyin.',
            durationMinutes: 5,
          },
          {
            stepNumber: 3,
            title: 'Naneli Yağ ile Taçlandırın',
            description: 'Küçük bir tavada tereyağı veya zeytinyağında kuru naneyi kızdırıp çorbanın üzerine dökün. Sıcak servis yapın.',
            durationMinutes: 3,
          }
        ],
        chefTips: [
          'Yoğurt kesilmesin diye tuzu çorba piştikten sonra en son ocaktan alırken ekleyin.'
        ],
        nutritionalHighlights: {
          protein: '22g',
          carbs: '18g',
          fat: '6g'
        },
        createdAt: new Date().toISOString(),
      }
    ]
  },
  {
    id: 'preset-breakfast-veggies',
    name: 'Bayat Ekmek & Kahvaltılıklar 🥖🧀',
    subtitle: 'Bayat ekmek, beyaz peynir, 2 yumurta, 1 domates, zeytin',
    icon: 'croissant',
    ingredients: [
      { id: '10', name: 'Yarım Somun Bayat Ekmek', category: 'Bakliyat & Ekmek', confidence: 0.99, suggestedAction: 'Fırınla' },
      { id: '11', name: 'Beyaz Peynir Kırıntıları', category: 'Süt Ürünleri', confidence: 0.94, suggestedAction: 'Hemen Tüket' },
      { id: '12', name: '2 adet Yumurta', category: 'Et & Şarküteri', confidence: 0.97, suggestedAction: 'Taze' },
      { id: '13', name: '1 adet Yumuşamış Domates', category: 'Sebze & Meyve', confidence: 0.89, suggestedAction: 'Fırınla' },
      { id: '14', name: 'Bir Avuç Çekirdeksiz Zeytin', category: 'Diğer', confidence: 0.92, suggestedAction: 'Taze' },
    ],
    recipes: [
      {
        id: 'rec-3',
        title: 'Tava Pizza Böreği (Bayat Ekmek Pizzası)',
        tagline: 'Fırın yakmadan 10 dakikada tavada nefis çıtır pizza!',
        description: 'Bayat ekmek dilimlerini çırpılmış yumurtalı sütle yumuşatıp tavaya dizin, üzerine ezilmiş domates, peynir ve zeytinleri ekleyip kapağını kapatın.',
        prepTimeMinutes: 4,
        cookTimeMinutes: 8,
        difficulty: 'Kolay',
        servings: 2,
        caloriesPerServing: 310,
        wasteSavedGrams: 360,
        category: 'Pratik & Hızlı',
        ingredientsUsed: ['Bayat Ekmek', 'Beyaz Peynir', 'Yumurta', 'Domates', 'Zeytin'],
        pantryItemsNeeded: ['Zeytinyağı', 'Kekik', 'Pul Biber'],
        instructions: [
          {
            stepNumber: 1,
            title: 'Ekmek Tabanını Hazırlayın',
            description: 'Bayat ekmekleri küp küp veya dilim halinde doğrayın. Yumurtaları bir tutam tuz ile çırpıp ekmeklerle harmanlayın.',
            durationMinutes: 2,
          },
          {
            stepNumber: 2,
            title: 'Tavaya Yayın',
            description: 'Tavayı 1 yemek kaşığı zeytinyağı ile yağlayın. Ekmekli karışımı tabana bastırarak yayın.',
            durationMinutes: 2,
          },
          {
            stepNumber: 3,
            title: 'Üst Malzemeleri Dizip Pişirin',
            description: 'Rendelenmiş/küp domatesi, ufalanmış peyniri, zeytinleri ve kekiği ekleyin. Tavanın kapağını kapatıp kısık ateşte altı çıtırlaşana kadar 8 dk pişirin.',
            durationMinutes: 8,
          }
        ],
        chefTips: [
          'Kapağı kapalı tutmak peynirlerin pizza gibi erimesini sağlar.'
        ],
        nutritionalHighlights: {
          protein: '16g',
          carbs: '34g',
          fat: '12g'
        },
        createdAt: new Date().toISOString(),
      }
    ]
  }
];
