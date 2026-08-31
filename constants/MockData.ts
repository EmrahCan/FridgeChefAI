import { Recipe, DetectedIngredient } from '../types';
import { SupportedLanguage } from './Translations';

export const ZERO_WASTE_TIPS: Record<SupportedLanguage, { title: string; description: string }[]> = {
  en: [
    {
      title: 'Revive Stale Bread 🍞',
      description: 'Dice stale bread, toss with olive oil and oregano, and bake for crunchy homemade salad & soup croutons.',
    },
    {
      title: 'Softening Tomatoes 🍅',
      description: 'Grate softening tomatoes and simmer with garlic and olive oil for an instant restaurant-grade pasta & shakshuka sauce.',
    },
    {
      title: 'Repurpose Leftover Rice 🍚',
      description: 'Yesterday’s cooked rice makes a stellar creamy Turkish yogurt soup (Yayla) or an authentic crispy fried rice.',
    },
    {
      title: 'Save Herb & Veggie Stems 🥦',
      description: 'Freeze broccoli stems, parsley & dill stalks to create rich, aromatic homemade vegetable broth cubes.',
    },
    {
      title: 'Hard Cheese Rinds 🧀',
      description: 'Grate drying cheddar, feta, or parmesan rinds over baked casseroles or melt them into warm breakfast toasts.',
    },
    {
      title: 'Brown Bananas & Soft Fruit 🍌',
      description: 'Freeze overripe bananas for creamy sugar-free smoothies, or caramelize in a skillet with cinnamon for oatmeal topping.',
    },
    {
      title: 'Leftover Boiled Potatoes 🥔',
      description: 'Smash cold boiled potatoes with a fork, brush with olive oil and garlic, and roast at 220°C for ultra-crispy smashed potatoes.',
    }
  ],
  tr: [
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
    },
    {
      title: 'Kararmış Muzlar & Yumuşak Meyveler 🍌',
      description: 'Fazla olgunlaşmış muzları dilimleyip dondurucuda saklayarak dondurma kıvamında şekersiz smoothie yapabilirsiniz.',
    },
    {
      title: 'Haşlanmış Kalan Patatesler 🥔',
      description: 'Soğumuş patatesleri bardağın altıyla ezip zeytinyağı, biberiye ve tuzla 220°C fırında çıtır patatese dönüştürün.',
    }
  ]
};

export interface DemoPreset {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  imageUrl: string;
  ingredients: DetectedIngredient[];
  recipes: Recipe[];
}

export function getDemoPresets(lang: SupportedLanguage = 'en'): DemoPreset[] {
  if (lang === 'tr') {
    return [
      {
        id: 'preset-chicken-rice',
        name: 'Dünden Kalan Tavuk & Pilav 🍗🍚',
        subtitle: 'Didilmiş tavuk, pirinç pilavı, kapya biber, yoğurt',
        icon: 'drumstick',
        imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1000&q=80',
        ingredients: [
          { id: '1', name: 'Didilmiş Haşlanmış Tavuk', category: 'Kalan Yemek', confidence: 0.98, suggestedAction: 'Hemen Tüket' },
          { id: '2', name: 'Dünden Kalan Pirinç Pilavı', category: 'Kalan Yemek', confidence: 0.95, suggestedAction: 'Hemen Tüket' },
          { id: '3', name: 'Kırmızı Kapya Biber', category: 'Sebze & Meyve', confidence: 0.91, suggestedAction: 'Fırınla' },
          { id: '4', name: 'Süzme / Sade Yoğurt', category: 'Süt Ürünleri', confidence: 0.88, suggestedAction: 'Taze' },
          { id: '5', name: 'Kalan Kaşar Peyniri', category: 'Süt Ürünleri', confidence: 0.93, suggestedAction: 'Fırınla' },
        ],
        recipes: [
          {
            id: 'rec-1',
            title: 'Fırında Altın Kabuklu Tavuklu Pilav Graten',
            tagline: 'Dünden kalan tavuk ve pilavı 15 dakikada nar gibi kızaran sufle kıvamında gratene dönüştürün!',
            description: 'Kalan pirinç pilavı ve tavuğu yumurta-yoğurt sosuyla harmanlayıp fırında eriyen kaşar kabuğuyla taçlandırın.',
            prepTimeMinutes: 5,
            cookTimeMinutes: 15,
            difficulty: 'Kolay',
            servings: 2,
            caloriesPerServing: 380,
            wasteSavedGrams: 420,
            category: 'Fırın & Graten',
            imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1000&q=80',
            ingredientsUsed: ['Didilmiş Tavuk', 'Kalan Pirinç Pilavı', 'Kaşar Peyniri', 'Yoğurt', 'Kapya Biber'],
            pantryItemsNeeded: ['1 Adet Yumurta', 'Zeytinyağı', 'Karabiber', 'Toz Kırmızı Biber', 'Tuz'],
            instructions: [
              {
                stepNumber: 1,
                title: 'Fırını Isıtın ve Fırın Kabını Yağlayın',
                description: 'Fırını 200°C dereceye ayarlayın. Küçük boy fırın kabını 1 tatlı kaşığı zeytinyağı ile yağlayın.',
                durationMinutes: 2,
              },
              {
                stepNumber: 2,
                title: 'Yumurtalı Yoğurt Sosunu Çırpın',
                description: 'Bir kasede 1 yumurta, 2 yemek kaşığı yoğurt, zeytinyağı, tuz ve baharatları pürüzsüzce çırpın.',
                durationMinutes: 2,
              },
              {
                stepNumber: 3,
                title: 'Harmanlayıp Fırınlayın',
                description: 'Didilmiş tavuk, pirinç pilavı ve doğranmış biberi sosla karıştırıp kaba yayın. Üzerine kaşar serpip 15 dk fırınlayın.',
                durationMinutes: 15,
              }
            ],
            chefTips: [
              'Pilavınız çok kuruysa karışıma 2 yemek kaşığı süt veya ılık su ekleyerek nem dengesini mükemmelleştirin.'
            ],
            nutritionalHighlights: {
              protein: '32g',
              carbs: '28g',
              fat: '14g'
            },
            createdAt: new Date().toISOString(),
          }
        ]
      },
      {
        id: 'preset-breakfast-veggies',
        name: 'Bayat Ekmek & Kahvaltılık Tava Pizzası 🥖🧀',
        subtitle: 'Bayat ekmek, beyaz peynir, 2 yumurta, domates, zeytin',
        icon: 'croissant',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80',
        ingredients: [
          { id: '10', name: 'Bayat Ekmek Dilimleri', category: 'Bakliyat & Ekmek', confidence: 0.99, suggestedAction: 'Fırınla' },
          { id: '11', name: 'Beyaz Peynir / Kaşar', category: 'Süt Ürünleri', confidence: 0.94, suggestedAction: 'Hemen Tüket' },
          { id: '12', name: '2 Adet Taze Yumurta', category: 'Et & Şarküteri', confidence: 0.97, suggestedAction: 'Taze' },
          { id: '13', name: '1 Adet Yumuşamış Domates', category: 'Sebze & Meyve', confidence: 0.89, suggestedAction: 'Fırınla' },
          { id: '14', name: 'Çekirdeksiz Zeytin', category: 'Diğer', confidence: 0.92, suggestedAction: 'Taze' },
        ],
        recipes: [
          {
            id: 'rec-3',
            title: 'Tavada Çıtır Bayat Ekmek Pizzası',
            tagline: 'Fırın açmadan 8 dakikada kahvaltılık artıklarla çıtır gurme tava pizzası!',
            description: 'Bayat ekmek küplerini çırpılmış yumurtayla taban yapıp domates, peynir ve zeytinle tavada çıtırlaştırın.',
            prepTimeMinutes: 4,
            cookTimeMinutes: 8,
            difficulty: 'Kolay',
            servings: 2,
            caloriesPerServing: 310,
            wasteSavedGrams: 360,
            category: 'Pratik & Hızlı',
            imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80',
            ingredientsUsed: ['Bayat Ekmek', 'Beyaz Peynir', 'Yumurta', 'Domates', 'Zeytin'],
            pantryItemsNeeded: ['Zeytinyağı', 'Kekik', 'Pul Biber'],
            instructions: [
              {
                stepNumber: 1,
                title: 'Ekmek Tabanını Hazırlayın',
                description: 'Bayat ekmekleri küp doğrayın. Yumurtaları tuzla çırpıp ekmeklerle harmanlayın.',
                durationMinutes: 2,
              },
              {
                stepNumber: 2,
                title: 'Tavaya Bastırarak Taban Oluşturun',
                description: 'Tavada 1 yemek kaşığı zeytinyağını ısıtıp ekmekli harcı bastırarak pizza tabanı formunda yayın.',
                durationMinutes: 2,
              },
              {
                stepNumber: 3,
                title: 'Malzemeleri Dizip Kapağını Kapatın',
                description: 'Üzerine doğranmış domates, peynir, zeytin ve kekik serpin. Kapağını kapatıp kısık ateşte peynirler eriyene kadar 8 dk pişirin.',
                durationMinutes: 8,
              }
            ],
            chefTips: [
              'Kapağı kapalı tutmak buharla peynirleri eritirken tabanın çıtırlaşmasını sağlar.'
            ],
            nutritionalHighlights: {
              protein: '16g',
              carbs: '34g',
              fat: '12g'
            },
            createdAt: new Date().toISOString(),
          }
        ]
      },
      {
        id: 'preset-veggie-ratatouille',
        name: 'Kalan Sebzelerden Fırın Ratatouille & Çorba 🥦🍅',
        subtitle: 'Yumuşamış domates, kabak, biber, havuç, zeytinyağı',
        icon: 'soup',
        imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1000&q=80',
        ingredients: [
          { id: '20', name: 'Yumuşamış Domatesler', category: 'Sebze & Meyve', confidence: 0.98, suggestedAction: 'Fırınla' },
          { id: '21', name: 'Kabak & Patlıcan Parçaları', category: 'Sebze & Meyve', confidence: 0.95, suggestedAction: 'Fırınla' },
          { id: '22', name: 'Kapya Biber', category: 'Sebze & Meyve', confidence: 0.92, suggestedAction: 'Fırınla' },
        ],
        recipes: [
          {
            id: 'rec-4',
            title: 'Köz Kokulu İpeksi Sebze Kremalı Çorba',
            tagline: 'Solmaya yüz tutmuş sebzeleri fırında karamelize edip pürüzsüz şef çorbasına çevirin!',
            description: 'Tüm yumuşayan sebzeleri fırınlayıp zeytinyağı ve sarımsakla püre haline getirerek lüks bir kış çorbası elde edin.',
            prepTimeMinutes: 5,
            cookTimeMinutes: 20,
            difficulty: 'Kolay',
            servings: 3,
            caloriesPerServing: 180,
            wasteSavedGrams: 450,
            category: 'Çorbalar',
            imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1000&q=80',
            ingredientsUsed: ['Domates', 'Kabak', 'Kapya Biber', 'Sarımsak'],
            pantryItemsNeeded: ['Zeytinyağı', 'Krema veya Süt', 'Tuz', 'Karabiber'],
            instructions: [
              {
                stepNumber: 1,
                title: 'Sebzeleri Fırında Közleyin',
                description: 'Sebzeleri iri doğrayıp zeytinyağı ve tuzla 200°C fırında 15 dk közleyin.',
                durationMinutes: 15,
              },
              {
                stepNumber: 2,
                title: 'Blenderdan Geçirip Kaynatın',
                description: 'Közlenen sebzeleri sıcak su veya et suyu ile blenderdan geçirip tencereye alın, 5 dk kaynatın.',
                durationMinutes: 5,
              }
            ],
            chefTips: ['Közlenmiş sarımsak çorbaya harika bir derinlik ve restorant tadı kazandırır.'],
            nutritionalHighlights: { protein: '6g', carbs: '22g', fat: '7g' },
            createdAt: new Date().toISOString(),
          }
        ]
      },
      {
        id: 'preset-potato-frittata',
        name: 'Haşlanmış Patates & Çıtır İspanyol Frittata 🥔🍳',
        subtitle: 'Kalan patates, 3 yumurta, maydanoz sapları, soğan',
        icon: 'egg',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80',
        ingredients: [
          { id: '30', name: 'Soğuk Haşlanmış Patates', category: 'Kalan Yemek', confidence: 0.98, suggestedAction: 'Hemen Tüket' },
          { id: '31', name: '3 Adet Yumurta', category: 'Et & Şarküteri', confidence: 0.96, suggestedAction: 'Taze' },
          { id: '32', name: 'Kalan Soğan & Yeşillik', category: 'Sebze & Meyve', confidence: 0.90, suggestedAction: 'Taze' },
        ],
        recipes: [
          {
            id: 'rec-5',
            title: 'Karamelize Soğanlı Çıtır Patates Frittata',
            tagline: 'Kalan patateslerle dışı çıtır, içi yumuşacık doyurucu ana öğün omlet!',
            description: 'Dilimlenen haşlanmış patatesleri tavada altın sarısı kızartıp yumurtayla birleştirin.',
            prepTimeMinutes: 5,
            cookTimeMinutes: 10,
            difficulty: 'Kolay',
            servings: 2,
            caloriesPerServing: 320,
            wasteSavedGrams: 380,
            category: 'Pratik & Hızlı',
            imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80',
            ingredientsUsed: ['Haşlanmış Patates', 'Yumurta', 'Soğan', 'Maydanoz'],
            pantryItemsNeeded: ['Zeytinyağı', 'Tuz', 'Karabiber'],
            instructions: [
              {
                stepNumber: 1,
                title: 'Patatesleri Tavada Çıtırlaştırın',
                description: 'Patatesleri küp veya yuvarlak dilimleyip zeytinyağında her iki tarafını 5 dk kızartın.',
                durationMinutes: 5,
              },
              {
                stepNumber: 2,
                title: 'Yumurtayı Ekleyip Pişirin',
                description: 'Çırpılmış yumurtayı patateslerin üzerine dökün. Kısık ateşte altı kızarana kadar pişirin.',
                durationMinutes: 5,
              }
            ],
            chefTips: ['Üzerine tabağı kapatıp ters çevirerek diğer tarafını da 2 dakika kızartabilirsiniz.'],
            nutritionalHighlights: { protein: '18g', carbs: '28g', fat: '14g' },
            createdAt: new Date().toISOString(),
          }
        ]
      }
    ];
  }

  // English (Default)
  return [
    {
      id: 'preset-chicken-rice',
      name: 'Leftover Chicken & Cooked Rice 🍗🍚',
      subtitle: 'Shredded chicken, cooked rice, bell pepper, yogurt',
      icon: 'drumstick',
      imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1000&q=80',
      ingredients: [
        { id: '1', name: 'Shredded Cooked Chicken', category: 'Leftover Dish', confidence: 0.98, suggestedAction: 'Consume First' },
        { id: '2', name: 'Cooked Rice Leftover', category: 'Leftover Dish', confidence: 0.95, suggestedAction: 'Consume First' },
        { id: '3', name: 'Red Bell Pepper', category: 'Produce & Veggies', confidence: 0.91, suggestedAction: 'Roast / Bake' },
        { id: '4', name: 'Plain Greek Yogurt', category: 'Dairy', confidence: 0.88, suggestedAction: 'Fresh' },
        { id: '5', name: 'Cheddar / Cheese Scraps', category: 'Dairy', confidence: 0.93, suggestedAction: 'Roast / Bake' },
      ],
      recipes: [
        {
          id: 'rec-1',
          title: 'Golden Baked Chicken & Rice Gratin',
          tagline: 'Turn yesterday’s dry rice and chicken into a bubbling 15-minute soufflé gratin!',
          description: 'Fold cooked rice and chicken with an egg-yogurt binder, blanket with bubbling cheese, and bake to golden perfection.',
          prepTimeMinutes: 5,
          cookTimeMinutes: 15,
          difficulty: 'Easy',
          servings: 2,
          caloriesPerServing: 380,
          wasteSavedGrams: 420,
          category: 'Oven & Gratin',
          imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1000&q=80',
          ingredientsUsed: ['Cooked Chicken', 'Leftover Rice', 'Cheddar Cheese', 'Yogurt', 'Bell Pepper'],
          pantryItemsNeeded: ['1 Egg', 'Olive Oil', 'Black Pepper', 'Paprika', 'Salt'],
          instructions: [
            {
              stepNumber: 1,
              title: 'Preheat & Oil Baking Dish',
              description: 'Preheat oven to 200°C (400°F). Brush small casserole dish with olive oil.',
              durationMinutes: 2,
            },
            {
              stepNumber: 2,
              title: 'Whisk the Custard Binder',
              description: 'In a bowl, whisk 1 egg, 2 tbsp yogurt, olive oil, salt, and spices until silky smooth.',
              durationMinutes: 2,
            },
            {
              stepNumber: 3,
              title: 'Bake Until Golden',
              description: 'Toss shredded chicken, rice, and diced pepper into sauce. Transfer to dish, top with cheese, and bake for 15 mins.',
              durationMinutes: 15,
            }
          ],
          chefTips: [
            'If the rice feels dry, splash 2 tbsp of milk or warm water into the sauce.'
          ],
          nutritionalHighlights: {
            protein: '32g',
            carbs: '28g',
            fat: '14g'
          },
          createdAt: new Date().toISOString(),
        }
      ]
    },
    {
      id: 'preset-breakfast-veggies',
      name: 'Stale Bread & Pantry Brunch 🥖🧀',
      subtitle: 'Stale bread loaf, cheese, 2 eggs, tomato, olives',
      icon: 'croissant',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80',
      ingredients: [
        { id: '10', name: 'Stale Bread Slices', category: 'Bakery & Bread', confidence: 0.99, suggestedAction: 'Roast / Bake' },
        { id: '11', name: 'Feta or White Cheese', category: 'Dairy', confidence: 0.94, suggestedAction: 'Consume First' },
        { id: '12', name: '2 Fresh Eggs', category: 'Meat & Deli', confidence: 0.97, suggestedAction: 'Fresh' },
        { id: '13', name: '1 Soft Tomato', category: 'Produce & Veggies', confidence: 0.89, suggestedAction: 'Roast / Bake' },
        { id: '14', name: 'Pitted Olives', category: 'Other', confidence: 0.92, suggestedAction: 'Fresh' },
      ],
      recipes: [
        {
          id: 'rec-3',
          title: 'Crispy Skillet Stale-Bread Pizza',
          tagline: 'No oven needed—crispy 8-minute gourmet pan pizza!',
          description: 'Dip stale bread cubes in beaten egg, layer in a hot oiled skillet with crushed tomato, cheese and olives, cover and crisp to perfection.',
          prepTimeMinutes: 4,
          cookTimeMinutes: 8,
          difficulty: 'Easy',
          servings: 2,
          caloriesPerServing: 310,
          wasteSavedGrams: 360,
          category: 'Quick & Easy',
          imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80',
          ingredientsUsed: ['Stale Bread', 'White Cheese', 'Eggs', 'Tomato', 'Olives'],
          pantryItemsNeeded: ['Olive Oil', 'Oregano', 'Red Pepper Flakes'],
          instructions: [
            {
              stepNumber: 1,
              title: 'Prepare Bread Pizza Crust',
              description: 'Dice stale bread. Whisk eggs with a pinch of salt and toss with bread cubes.',
              durationMinutes: 2,
            },
            {
              stepNumber: 2,
              title: 'Press into Skillet',
              description: 'Heat 1 tbsp olive oil in a pan. Press egg-soaked bread into a solid pizza base.',
              durationMinutes: 2,
            },
            {
              stepNumber: 3,
              title: 'Top & Cover',
              description: 'Layer diced tomato, crumbled cheese, olives, and oregano. Cover with lid and cook over low heat for 8 minutes until crust is crispy and cheese is melted.',
              durationMinutes: 8,
            }
          ],
          chefTips: [
            'Keeping the lid on traps steam to melt cheese while bottom turns golden crispy.'
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
}

/**
 * Returns daily rotated menu, spotlight recipe, and zero-waste tip based on current calendar day
 */
export function getDailyRotatedData(lang: SupportedLanguage = 'en') {
  const presets = getDemoPresets(lang);
  const tips = ZERO_WASTE_TIPS[lang] || ZERO_WASTE_TIPS['en'];

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const presetIndex = dayOfYear % presets.length;
  const tipIndex = dayOfYear % tips.length;

  const currentPreset = presets[presetIndex];
  const spotlightRecipe = currentPreset.recipes[0];
  const currentTip = tips[tipIndex];

  // Rotate presets array so today's preset is always at the top
  const rotatedPresets = [
    ...presets.slice(presetIndex),
    ...presets.slice(0, presetIndex),
  ];

  const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
  };
  const formattedDate = now.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', dateOptions);

  return {
    formattedDate,
    dayOfYear,
    currentPreset,
    spotlightRecipe,
    currentTip,
    rotatedPresets,
    allTips: tips,
  };
}

export const DEMO_PRESETS = getDemoPresets('en');
