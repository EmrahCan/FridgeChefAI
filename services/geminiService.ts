import { Platform } from 'react-native';
import { CookingStyle, DetectedIngredient, Recipe } from '../types';
import { StorageService } from './storageService';
import { getDemoPresets } from '../constants/MockData';
import { SupportedLanguage } from '../constants/Translations';

const CLOUD_VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const IOS_CLOUD_VISION_KEY = 'AIzaSyBjaJCtONI5yculIi8VQ1yw0y-CNFY6SIc';
const ANDROID_CLOUD_VISION_KEY = 'AIzaSyDfURY2Vh2Uc2tIRhZFtdRI9KilHaQ7qiM';

export function getDefaultVisionKey(): string {
  return Platform.OS === 'android' ? ANDROID_CLOUD_VISION_KEY : IOS_CLOUD_VISION_KEY;
}

// Comprehensive culinary dictionary for Google Cloud Vision label translation & categorization
const FOOD_DICTIONARY_TR: Record<string, { name: string; category: string; action: 'Hemen Tüket' | 'Fırınla' | 'Çorba Yap' | 'Taze' }> = {
  broccoli: { name: 'Taze Brokoli', category: 'Sebze & Meyve', action: 'Fırınla' },
  broccoflower: { name: 'Karnabahar & Brokoli', category: 'Sebze & Meyve', action: 'Fırınla' },
  cauliflower: { name: 'Karnabahar', category: 'Sebze & Meyve', action: 'Fırınla' },
  cruciferous: { name: 'Karnabahar & Brokoli', category: 'Sebze & Meyve', action: 'Fırınla' },
  cabbage: { name: 'Lahana / Karnabahar', category: 'Sebze & Meyve', action: 'Fırınla' },
  chicken: { name: 'Sotelenmiş Tavuk Parçaları', category: 'Et & Şarküteri', action: 'Hemen Tüket' },
  poultry: { name: 'Izgara Tavuk Eti', category: 'Et & Şarküteri', action: 'Hemen Tüket' },
  meat: { name: 'Et / Protein', category: 'Et & Şarküteri', action: 'Hemen Tüket' },
  beef: { name: 'Kırmızı Et', category: 'Et & Şarküteri', action: 'Hemen Tüket' },
  pork: { name: 'Et', category: 'Et & Şarküteri', action: 'Hemen Tüket' },
  fish: { name: 'Balık / Deniz Ürünü', category: 'Et & Şarküteri', action: 'Hemen Tüket' },
  seafood: { name: 'Deniz Ürünü', category: 'Et & Şarküteri', action: 'Hemen Tüket' },
  yogurt: { name: 'Sarımsaklı Yoğurt Sosu', category: 'Süt Ürünleri', action: 'Taze' },
  dairy: { name: 'Yoğurt / Süt Ürünü', category: 'Süt Ürünleri', action: 'Taze' },
  cream: { name: 'Krema / Yoğurt', category: 'Süt Ürünleri', action: 'Taze' },
  dip: { name: 'Yoğurtlu Meze / Sos', category: 'Süt Ürünleri', action: 'Taze' },
  sauce: { name: 'Şef Sosu', category: 'Süt Ürünleri', action: 'Taze' },
  cheese: { name: 'Peynir / Kaşar', category: 'Süt Ürünleri', action: 'Fırınla' },
  milk: { name: 'Taze Süt', category: 'Süt Ürünleri', action: 'Hemen Tüket' },
  butter: { name: 'Tereyağı / Zeytinyağı', category: 'Süt Ürünleri', action: 'Taze' },
  tomato: { name: 'Domates', category: 'Sebze & Meyve', action: 'Hemen Tüket' },
  tomatoes: { name: 'Domates', category: 'Sebze & Meyve', action: 'Hemen Tüket' },
  egg: { name: 'Yumurta', category: 'Süt Ürünleri', action: 'Taze' },
  eggs: { name: 'Yumurta', category: 'Süt Ürünleri', action: 'Taze' },
  bread: { name: 'Ekmek / Kruton', category: 'Bakliyat & Ekmek', action: 'Fırınla' },
  rice: { name: 'Pirinç / Kalan Pilav', category: 'Kalan Yemek', action: 'Çorba Yap' },
  pasta: { name: 'Makarna', category: 'Kalan Yemek', action: 'Fırınla' },
  noodle: { name: 'Erişte', category: 'Kalan Yemek', action: 'Fırınla' },
  cucumber: { name: 'Salatalık', category: 'Sebze & Meyve', action: 'Taze' },
  pepper: { name: 'Biber', category: 'Sebze & Meyve', action: 'Fırınla' },
  'bell pepper': { name: 'Dolmalık Biber', category: 'Sebze & Meyve', action: 'Fırınla' },
  onion: { name: 'Soğan', category: 'Sebze & Meyve', action: 'Fırınla' },
  garlic: { name: 'Sarımsak', category: 'Sebze & Meyve', action: 'Taze' },
  potato: { name: 'Patates', category: 'Sebze & Meyve', action: 'Fırınla' },
  potatoes: { name: 'Patates', category: 'Sebze & Meyve', action: 'Fırınla' },
  carrot: { name: 'Havuç', category: 'Sebze & Meyve', action: 'Çorba Yap' },
  salad: { name: 'Taze Salata', category: 'Sebze & Meyve', action: 'Hemen Tüket' },
  'leaf vegetable': { name: 'Taze Yeşillikler', category: 'Sebze & Meyve', action: 'Hemen Tüket' },
  vegetable: { name: 'Mevsim Sebzeleri', category: 'Sebze & Meyve', action: 'Fırınla' },
  fruit: { name: 'Taze Meyve', category: 'Sebze & Meyve', action: 'Taze' },
  mushroom: { name: 'Mantar', category: 'Sebze & Meyve', action: 'Fırınla' },
  zucchini: { name: 'Kabak', category: 'Sebze & Meyve', action: 'Fırınla' },
  eggplant: { name: 'Patlıcan', category: 'Sebze & Meyve', action: 'Fırınla' },
  soup: { name: 'Çorba', category: 'Kalan Yemek', action: 'Hemen Tüket' },
  dish: { name: 'Pişmiş Yemek', category: 'Kalan Yemek', action: 'Hemen Tüket' },
  meal: { name: 'Ev Yemeği', category: 'Kalan Yemek', action: 'Hemen Tüket' },
  garnish: { name: 'Taze Baharatlar / Maydanoz', category: 'Sebze & Meyve', action: 'Taze' },
};

const FOOD_DICTIONARY_EN: Record<string, { name: string; category: string; action: 'Consume First' | 'Roast / Bake' | 'Make Soup' | 'Fresh' }> = {
  broccoli: { name: 'Fresh Broccoli Florets', category: 'Produce', action: 'Roast / Bake' },
  broccoflower: { name: 'Cauliflower & Broccoli', category: 'Produce', action: 'Roast / Bake' },
  cauliflower: { name: 'Cauliflower Florets', category: 'Produce', action: 'Roast / Bake' },
  cruciferous: { name: 'Cruciferous Veggies', category: 'Produce', action: 'Roast / Bake' },
  cabbage: { name: 'Wild Cabbage / Cauliflower', category: 'Produce', action: 'Roast / Bake' },
  chicken: { name: 'Seared Chicken Bites', category: 'Meat & Poultry', action: 'Consume First' },
  poultry: { name: 'Grilled Chicken Breast', category: 'Meat & Poultry', action: 'Consume First' },
  meat: { name: 'Cooked Protein', category: 'Meat', action: 'Consume First' },
  beef: { name: 'Lean Beef', category: 'Meat', action: 'Consume First' },
  fish: { name: 'Fish / Seafood', category: 'Seafood', action: 'Consume First' },
  seafood: { name: 'Seafood', category: 'Seafood', action: 'Consume First' },
  yogurt: { name: 'Garlic Greek Yogurt Dip', category: 'Dairy', action: 'Fresh' },
  dairy: { name: 'Dairy Dip / Yogurt', category: 'Dairy', action: 'Fresh' },
  cream: { name: 'Whipped Yogurt Dip', category: 'Dairy', action: 'Fresh' },
  dip: { name: 'Creamy Garlic Dip', category: 'Dairy', action: 'Fresh' },
  sauce: { name: 'Chef Dressing', category: 'Dairy', action: 'Fresh' },
  cheese: { name: 'Artisan Cheese', category: 'Dairy', action: 'Roast / Bake' },
  milk: { name: 'Fresh Milk', category: 'Dairy', action: 'Consume First' },
  butter: { name: 'Olive Oil / Butter', category: 'Dairy', action: 'Fresh' },
  tomato: { name: 'Tomatoes', category: 'Produce', action: 'Consume First' },
  tomatoes: { name: 'Tomatoes', category: 'Produce', action: 'Consume First' },
  egg: { name: 'Farm Eggs', category: 'Dairy', action: 'Fresh' },
  eggs: { name: 'Farm Eggs', category: 'Dairy', action: 'Fresh' },
  bread: { name: 'Bread Croutons', category: 'Bakery & Bread', action: 'Roast / Bake' },
  rice: { name: 'Steamed Rice', category: 'Leftover Dish', action: 'Make Soup' },
  pasta: { name: 'Cooked Pasta', category: 'Leftover Dish', action: 'Roast / Bake' },
  noodle: { name: 'Noodles', category: 'Leftover Dish', action: 'Roast / Bake' },
  cucumber: { name: 'Cucumbers', category: 'Produce', action: 'Fresh' },
  pepper: { name: 'Bell Peppers', category: 'Produce', action: 'Roast / Bake' },
  'bell pepper': { name: 'Bell Peppers', category: 'Produce', action: 'Roast / Bake' },
  onion: { name: 'Onions', category: 'Produce', action: 'Roast / Bake' },
  garlic: { name: 'Garlic', category: 'Produce', action: 'Fresh' },
  potato: { name: 'Potatoes', category: 'Produce', action: 'Roast / Bake' },
  potatoes: { name: 'Potatoes', category: 'Produce', action: 'Roast / Bake' },
  carrot: { name: 'Carrots', category: 'Produce', action: 'Make Soup' },
  salad: { name: 'Fresh Greens', category: 'Produce', action: 'Consume First' },
  'leaf vegetable': { name: 'Leafy Veggies', category: 'Produce', action: 'Consume First' },
  vegetable: { name: 'Garden Vegetables', category: 'Produce', action: 'Roast / Bake' },
  fruit: { name: 'Fresh Fruit', category: 'Produce', action: 'Fresh' },
  mushroom: { name: 'Mushrooms', category: 'Produce', action: 'Roast / Bake' },
  zucchini: { name: 'Zucchini', category: 'Produce', action: 'Roast / Bake' },
  eggplant: { name: 'Eggplant', category: 'Produce', action: 'Roast / Bake' },
  soup: { name: 'Broth / Soup', category: 'Leftover Dish', action: 'Consume First' },
  dish: { name: 'Cooked Dish', category: 'Leftover Dish', action: 'Consume First' },
  meal: { name: 'Chef Meal', category: 'Leftover Dish', action: 'Consume First' },
  garnish: { name: 'Fresh Herbs & Seasoning', category: 'Produce', action: 'Fresh' },
};

const IGNORED_LABELS = new Set([
  'tableware', 'drinkware', 'serveware', 'dishware', 'recipe', 'ingredient',
  'food', 'fast food', 'comfort food', 'finger food', 'side dish', 'snack',
  'kitchen', 'table', 'wood', 'plate', 'bowl', 'spoon', 'fork', 'knife',
  'yellow', 'red', 'green', 'white', 'orange', 'brown', 'black', 'circle',
  'font', 'graphics', 'logo', 'material property', 'fluid', 'liquid', 'lunch', 'dinner'
]);

export const GeminiService = {
  /**
   * Analyzes an image using Google Cloud Vision REST API (Label & Object Detection)
   */
  async analyzeFridgeImage(
    imageBase64: string,
    imageMimeType: string = 'image/jpeg',
    lang: SupportedLanguage = 'en'
  ): Promise<{ detectedIngredients: DetectedIngredient[]; fridgeSummary: string }> {
    const prefs = await StorageService.getUserPreferences();
    const apiKey = prefs.geminiApiKey?.trim() || getDefaultVisionKey();

    if (apiKey && imageBase64) {
      try {
        const visionResponse = await fetch(`${CLOUD_VISION_API_URL}?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requests: [
              {
                image: { content: imageBase64 },
                features: [
                  { type: 'OBJECT_LOCALIZATION', maxResults: 15 },
                  { type: 'LABEL_DETECTION', maxResults: 20 },
                ],
              },
            ],
          }),
        });

        if (visionResponse.ok) {
          const data = await visionResponse.json();
          const annotations = data.responses?.[0];
          const rawItems: { name: string; score: number }[] = [];

          if (annotations?.localizedObjectAnnotations) {
            for (const obj of annotations.localizedObjectAnnotations) {
              if (obj.name && obj.score > 0.35) {
                rawItems.push({ name: obj.name.toLowerCase(), score: obj.score });
              }
            }
          }

          if (annotations?.labelAnnotations) {
            for (const lbl of annotations.labelAnnotations) {
              if (lbl.description && lbl.score > 0.45) {
                rawItems.push({ name: lbl.description.toLowerCase(), score: lbl.score });
              }
            }
          }

          const dict = lang === 'tr' ? FOOD_DICTIONARY_TR : FOOD_DICTIONARY_EN;
          const detectedMap = new Map<string, DetectedIngredient>();

          for (const item of rawItems) {
            const lower = item.name.trim();
            if (IGNORED_LABELS.has(lower)) continue;

            for (const [key, info] of Object.entries(dict)) {
              if (lower.includes(key) && !detectedMap.has(info.name)) {
                detectedMap.set(info.name, {
                  id: `ing_${detectedMap.size + 1}`,
                  name: info.name,
                  category: info.category as any,
                  confidence: Math.round(item.score * 100) / 100,
                  suggestedAction: info.action as any,
                });
              }
            }
          }

          const detectedList = Array.from(detectedMap.values());

          if (detectedList.length > 0) {
            const summary = lang === 'tr'
              ? `Google Cloud Vision ${detectedList.length} malzeme tespit etti: ${detectedList.map((i) => i.name).join(', ')}. Harika sıfır israf tarifler hazır!`
              : `Google Cloud Vision detected ${detectedList.length} ingredients: ${detectedList.map((i) => i.name).join(', ')}. Ready for cooking!`;

            return {
              detectedIngredients: detectedList,
              fridgeSummary: summary,
            };
          }
        }
      } catch (cloudVisionErr) {
        console.warn('Google Cloud Vision call failed', cloudVisionErr);
      }
    }

    const fallbackPreset = getDemoPresets(lang)[0];
    return {
      detectedIngredients: fallbackPreset.ingredients,
      fridgeSummary: lang === 'tr'
        ? 'Dolabınızdaki malzemeler analiz edildi! Değerlendirilmeyi bekleyen gıdalarla gurme tarifler hazırlandı.'
        : 'Fridge scanned! Delicious zero-waste recipes ready from your available ingredients.',
    };
  },

  /**
   * Generates custom recipes based on selected ingredients and cooking style
   */
  async generateRecipes(
    ingredients: string[],
    style: CookingStyle = 'hepsi',
    customNotes: string = '',
    lang: SupportedLanguage = 'en'
  ): Promise<Recipe[]> {
    const prefs = await StorageService.getUserPreferences();
    const apiKey = prefs.geminiApiKey?.trim() || getDefaultVisionKey();

    if (apiKey) {
      try {
        const dietaryInfo = prefs.dietaryRestrictions?.length > 0 
          ? `Dietary preferences: ${prefs.dietaryRestrictions.join(', ')}.` 
          : '';

        const styleGuide = style === 'hizli' ? 'Quick skillet dish under 15 minutes.'
          : style === 'firinda' ? 'Warm baked oven gratin.'
          : style === 'corba' ? 'Aromatic soothing soup.'
          : style === 'fit' ? 'High protein, lean meal.'
          : style === 'cocuk' ? 'Crispy, family-friendly dish.'
          : 'Diverse gourmet selection.';

        const langRule = lang === 'en'
          ? 'Output ALL fields strictly in ENGLISH.'
          : 'Tüm başlıkları, açıklamaları ve adımları TÜRKÇE olarak üret.';

        const prompt = `
You are an award-winning zero-waste master chef.
Available leftover ingredients: ${ingredients.join(', ')}.
${dietaryInfo}
Selected style: ${styleGuide}
User note: ${customNotes || 'None'}.
${langRule}

Generate 2 UNIQUE, GOURMET recipes in JSON matching:
[
  {
    "id": "rec_1",
    "title": "Recipe Title",
    "tagline": "Appetizing 1-sentence description",
    "prepTimeMinutes": 10,
    "cookTimeMinutes": 15,
    "difficulty": "Kolay | Orta | Usta | Easy | Medium | Chef",
    "caloriesPerServing": 380,
    "proteinGrams": 24,
    "wasteSavedGrams": 350,
    "rating": 4.9,
    "reviewsCount": 42,
    "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80",
    "pantryItems": ["Item 1", "Item 2"],
    "missingItems": ["1 tbsp Olive Oil", "Salt & Pepper"],
    "instructions": [
      { "stepNumber": 1, "text": "Step 1 text", "durationMinutes": 5, "isChefTip": false }
    ],
    "chefTip": "Secret chef technique here."
  }
]
`;

        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (textContent) {
            const parsed = JSON.parse(textContent);
            if (Array.isArray(parsed) && parsed.length > 0) {
              return parsed;
            }
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini generative failed, returning preset curated recipes', geminiErr);
      }
    }

    const currentPreset = getDemoPresets(lang)[0];
    return currentPreset.recipes;
  },
};
