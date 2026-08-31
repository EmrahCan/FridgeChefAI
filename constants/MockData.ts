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
                title: 'Bağlayıcı Altın Sosu Çırpın',
                description: 'Bir kasede yoğurt, 1 yumurta, tuz, karabiber ve kırmızı biberi pürüzsüz kıvama gelene kadar çırpın.',
                durationMinutes: 3,
                tip: 'Sosun içine 1 diş ezilmiş sarımsak eklerseniz lezzet seviyesi katlanır.'
              },
              {
                stepNumber: 3,
                title: 'Kalan Malzemeleri Sosla Buluşturun',
                description: 'Pirinç pilavını, didilmiş tavukları ve doğranmış biberleri sosla karıştırıp fırın kabına yayın.',
                durationMinutes: 2,
              },
              {
                stepNumber: 4,
                title: 'Kaşar Peyniri Serpin ve Fırınlayın',
                description: 'Üzerini rendelenmiş kaşarla kaplayıp önceden ısıtılmış fırında 15 dakika üzeri kızarana kadar pişirin.',
                durationMinutes: 15,
              }
            ],
            chefTips: [
              'Pilav kuruysa sosun içine 2 yemek kaşığı ılık süt veya su ilave edin.',
              'Fırından çıkınca üzerine taze maydanoz veya kekik serpiştirin.'
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
            title: 'Kadife Kıvamlı Tavuklu Şifalı Yayla Çorbası',
            tagline: 'Kalan pilavla kaynatma derdi olmadan 10 dakikada hazırlanan şifa iksiri',
            description: 'Dünden kalan pirinç pilavı sayesinde pirinç haşlama adımını atlayın, ipeksi yoğurt terbiyesiyle tavukları buluşturun.',
            prepTimeMinutes: 3,
            cookTimeMinutes: 10,
            difficulty: 'Kolay',
            servings: 3,
            caloriesPerServing: 220,
            wasteSavedGrams: 300,
            category: 'Şifalı Çorba',
            imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1000&q=80',
            ingredientsUsed: ['Kalan Pirinç Pilavı', 'Didilmiş Tavuk', 'Sade Yoğurt'],
            pantryItemsNeeded: ['1 Yumurta Sarısı', '1 Yemek Kaşığı Un', 'Kuru Nane', 'Tereyağı veya Zeytinyağı', '3 Su Bardağı Sıcak Su'],
            instructions: [
              {
                stepNumber: 1,
                title: 'Yoğurt Terbiyesini Hazırlayın',
                description: 'Tencerede yoğurt, yumurta sarısı, un ve 1 bardak ılık suyu pürüzsüz olana kadar çırpın.',
                durationMinutes: 2,
              },
              {
                stepNumber: 2,
                title: 'Pilav ve Tavukla Kaynatın',
                description: 'Kalan 2 bardak sıcak suyu azar azar ekleyip orta ateşte kaynatın. Kaynayınca pilav ve tavukları ekleyin.',
                durationMinutes: 5,
              },
              {
                stepNumber: 3,
                title: 'Naneli Yağ Cızırtısı ile Servis Edin',
                description: 'Küçük tavada tereyağında kuru naneyi 30 saniye kızdırıp sıcak çorbanın üzerine dökün.',
                durationMinutes: 3,
              }
            ],
            chefTips: [
              'Yoğurdun kesilmemesi için tuzu ocaktan aldıktan sonra ekleyin.'
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
          tagline: 'Turn yesterday’s rice & chicken into a bubbly gourmet gratin in 15 mins!',
          description: 'Combine leftover shredded chicken and cooked rice with a light egg-yogurt liaison and melt-in-your-mouth golden cheese crust.',
          prepTimeMinutes: 5,
          cookTimeMinutes: 15,
          difficulty: 'Easy',
          servings: 2,
          caloriesPerServing: 380,
          wasteSavedGrams: 420,
          category: 'Oven & Gratin',
          imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1000&q=80',
          ingredientsUsed: ['Shredded Cooked Chicken', 'Cooked Rice', 'Cheese Scraps', 'Yogurt', 'Bell Pepper'],
          pantryItemsNeeded: ['1 Egg', 'Olive Oil', 'Black Pepper', 'Paprika', 'Salt'],
          instructions: [
            {
              stepNumber: 1,
              title: 'Preheat Oven and Oil Baking Dish',
              description: 'Set oven to 200°C (400°F). Lightly coat a small baking dish with 1 tsp olive oil.',
              durationMinutes: 2,
            },
            {
              stepNumber: 2,
              title: 'Whisk the Golden Binding Sauce',
              description: 'In a bowl, whisk yogurt, 1 egg, salt, black pepper, and paprika until velvety smooth.',
              durationMinutes: 3,
              tip: 'Add 1 minced garlic clove for an extra depth of savory flavor.'
            },
            {
              stepNumber: 3,
              title: 'Fold Leftovers with Sauce',
              description: 'Fold cooked rice, shredded chicken, and sliced bell pepper together with the sauce. Spread evenly in baking dish.',
              durationMinutes: 2,
            },
            {
              stepNumber: 4,
              title: 'Top with Cheese & Bake',
              description: 'Cover top with grated cheese scraps. Bake for 15 minutes until golden bubbly and soufflé-like.',
              durationMinutes: 15,
            }
          ],
          chefTips: [
            'If the rice feels dry, splash 2 tbsp of milk or warm water into the sauce.',
            'Garnish with freshly chopped parsley or thyme before serving.'
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
          title: 'Silky Chicken & Yogurt Elixir Soup',
          tagline: 'Traditional Yayla soup elevated with tender chicken shreds',
          description: 'Cooked leftover rice skips the boiling step. Whipped yogurt liaison and tender chicken create a soothing bowl in 10 mins.',
          prepTimeMinutes: 3,
          cookTimeMinutes: 10,
          difficulty: 'Easy',
          servings: 3,
          caloriesPerServing: 220,
          wasteSavedGrams: 300,
          category: 'Healing Soup',
          imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1000&q=80',
          ingredientsUsed: ['Cooked Rice', 'Shredded Cooked Chicken', 'Plain Yogurt'],
          pantryItemsNeeded: ['1 Egg Yolk', '1 tbsp Flour', 'Dried Mint', 'Butter or Olive Oil', '3 Cups Hot Water'],
          instructions: [
            {
              stepNumber: 1,
              title: 'Whisk the Yogurt Liaison',
              description: 'In a pot, whisk yogurt, egg yolk, flour, and 1 cup warm water until completely silky and smooth.',
              durationMinutes: 2,
            },
            {
              stepNumber: 2,
              title: 'Simmer with Rice & Chicken',
              description: 'Gradually pour remaining 2 cups hot water while whisking over medium heat. When simmering, add cooked rice and shredded chicken.',
              durationMinutes: 5,
            },
            {
              stepNumber: 3,
              title: 'Infuse Minted Butter Sizzle',
              description: 'Sizzle dried mint in melted butter or olive oil for 30 seconds and pour over hot soup.',
              durationMinutes: 3,
            }
          ],
          chefTips: [
            'Add salt only after removing from heat to keep yogurt perfectly smooth.'
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

export const DEMO_PRESETS = getDemoPresets('en');
