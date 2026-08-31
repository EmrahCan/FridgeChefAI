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

export const DEMO_PRESETS: {
  id: string;
  name: string;
  nameEn: string;
  subtitle: string;
  subtitleEn: string;
  icon: string;
  ingredients: DetectedIngredient[];
  recipes: Recipe[];
}[] = [
  {
    id: 'preset-chicken-rice',
    name: 'Dünden Kalan Tavuk & Pilav 🍗🍚',
    nameEn: 'Leftover Chicken & Cooked Rice 🍗🍚',
    subtitle: 'Haşlanmış tavuk, pirinç pilavı, kapya biber, yoğurt',
    subtitleEn: 'Shredded chicken, cooked rice, bell pepper, yogurt',
    icon: 'drumstick',
    ingredients: [
      { id: '1', name: 'Shredded Cooked Chicken', category: 'Kalan Yemek', confidence: 0.98, suggestedAction: 'Hemen Tüket' },
      { id: '2', name: 'Cooked Rice Leftover', category: 'Kalan Yemek', confidence: 0.95, suggestedAction: 'Hemen Tüket' },
      { id: '3', name: 'Red Bell Pepper', category: 'Sebze & Meyve', confidence: 0.91, suggestedAction: 'Fırınla' },
      { id: '4', name: 'Plain Yogurt', category: 'Süt Ürünleri', confidence: 0.88, suggestedAction: 'Taze' },
      { id: '5', name: 'Cheese Scraps (Cheddar/Kaşar)', category: 'Süt Ürünleri', confidence: 0.93, suggestedAction: 'Fırınla' },
    ],
    recipes: [
      {
        id: 'rec-1',
        title: 'Golden Baked Chicken & Rice Gratin',
        tagline: 'Turn yesterday’s rice & chicken into a bubbly gourmet gratin!',
        description: 'Combine leftover shredded chicken and cooked rice with a light egg-yogurt emulsion and melt-in-your-mouth cheese crust.',
        prepTimeMinutes: 5,
        cookTimeMinutes: 15,
        difficulty: 'Kolay',
        servings: 2,
        caloriesPerServing: 380,
        wasteSavedGrams: 420,
        category: 'Oven & Gratin',
        ingredientsUsed: ['Shredded Cooked Chicken', 'Cooked Rice', 'Cheese Scraps', 'Yogurt', 'Bell Pepper'],
        pantryItemsNeeded: ['1 Egg', 'Olive Oil', 'Black Pepper', 'Paprika', 'Salt'],
        instructions: [
          {
            stepNumber: 1,
            title: 'Preheat Oven and Oil Baking Dish',
            description: 'Set oven to 200°C (400°F). Lightly coat a small baking dish or skillet with 1 tsp olive oil.',
            durationMinutes: 2,
          },
          {
            stepNumber: 2,
            title: 'Whisk the Golden Binding Sauce',
            description: 'In a bowl, whisk yogurt, 1 egg, salt, black pepper, and paprika. This keeps the rice delightfully moist and soufflé-like.',
            durationMinutes: 3,
            tip: 'Add 1 minced garlic clove for an extra burst of savory flavor.'
          },
          {
            stepNumber: 3,
            title: 'Combine Leftovers and Sauce',
            description: 'Fold cooked rice, shredded chicken, and sliced bell pepper together with the sauce. Spread evenly in the baking dish.',
            durationMinutes: 2,
          },
          {
            stepNumber: 4,
            title: 'Top with Cheese & Bake',
            description: 'Cover top with grated cheese scraps. Bake in preheated oven for 15 minutes until golden bubbly.',
            durationMinutes: 15,
          }
        ],
        chefTips: [
          'If the rice feels dry, splash 2 tbsp of milk or water into the sauce.',
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
        difficulty: 'Kolay',
        servings: 3,
        caloriesPerServing: 220,
        wasteSavedGrams: 300,
        category: 'Healing Soup',
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
    name: 'Bayat Ekmek & Kahvaltılıklar 🥖🧀',
    nameEn: 'Stale Bread & Pantry Brunch 🥖🧀',
    subtitle: 'Bayat ekmek, peynir, 2 yumurta, domates, zeytin',
    subtitleEn: 'Stale bread loaf, cheese, 2 eggs, tomato, olives',
    icon: 'croissant',
    ingredients: [
      { id: '10', name: 'Stale Bread Slices', category: 'Bakliyat & Ekmek', confidence: 0.99, suggestedAction: 'Fırınla' },
      { id: '11', name: 'Feta or White Cheese', category: 'Süt Ürünleri', confidence: 0.94, suggestedAction: 'Hemen Tüket' },
      { id: '12', name: '2 Fresh Eggs', category: 'Et & Şarküteri', confidence: 0.97, suggestedAction: 'Taze' },
      { id: '13', name: '1 Soft Tomato', category: 'Sebze & Meyve', confidence: 0.89, suggestedAction: 'Fırınla' },
      { id: '14', name: 'Pitted Olives', category: 'Diğer', confidence: 0.92, suggestedAction: 'Taze' },
    ],
    recipes: [
      {
        id: 'rec-3',
        title: 'Crispy Skillet Stale-Bread Pizza',
        tagline: 'No oven needed—crispy 8-minute gourmet pan pizza!',
        description: 'Dip stale bread cubes in beaten egg, layer in a hot oiled skillet with crushed tomato, cheese and olives, cover and crisp to perfection.',
        prepTimeMinutes: 4,
        cookTimeMinutes: 8,
        difficulty: 'Kolay',
        servings: 2,
        caloriesPerServing: 310,
        wasteSavedGrams: 360,
        category: 'Quick & Easy',
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
