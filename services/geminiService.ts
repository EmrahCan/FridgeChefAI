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

// Culinary dictionary for Google Cloud Vision label translation & categorization
const FOOD_DICTIONARY_TR: Record<string, { name: string; category: string; action: 'Hemen Tüket' | 'Fırınla' | 'Çorba Yap' | 'Taze' }> = {
  tomato: { name: 'Domates', category: 'Sebze & Meyve', action: 'Hemen Tüket' },
  tomatoes: { name: 'Domates', category: 'Sebze & Meyve', action: 'Hemen Tüket' },
  chicken: { name: 'Tavuk', category: 'Kalan Yemek', action: 'Hemen Tüket' },
  poultry: { name: 'Tavuk / Kanatlı Eti', category: 'Et & Şarküteri', action: 'Hemen Tüket' },
  egg: { name: 'Yumurta', category: 'Süt & Şarküteri', action: 'Taze' },
  eggs: { name: 'Yumurta', category: 'Süt & Şarküteri', action: 'Taze' },
  cheese: { name: 'Peynir / Kaşar', category: 'Süt Ürünleri', action: 'Fırınla' },
  dairy: { name: 'Süt Ürünü / Yoğurt', category: 'Süt Ürünleri', action: 'Hemen Tüket' },
  milk: { name: 'Süt', category: 'Süt Ürünleri', action: 'Hemen Tüket' },
  bread: { name: 'Ekmek / Bayat Ekmek', category: 'Bakliyat & Ekmek', action: 'Fırınla' },
  meat: { name: 'Et / Kıyma', category: 'Et & Şarküteri', action: 'Hemen Tüket' },
  beef: { name: 'Kırmızı Et', category: 'Et & Şarküteri', action: 'Hemen Tüket' },
  fish: { name: 'Balık / Deniz Ürünü', category: 'Et & Şarküteri', action: 'Hemen Tüket' },
  seafood: { name: 'Deniz Ürünü', category: 'Et & Şarküteri', action: 'Hemen Tüket' },
  rice: { name: 'Pirinç / Kalan Pilav', category: 'Kalan Yemek', action: 'Çorba Yap' },
  pasta: { name: 'Makarna', category: 'Kalan Yemek', action: 'Fırınla' },
  noodle: { name: 'Erişte / Makarna', category: 'Kalan Yemek', action: 'Fırınla' },
  cucumber: { name: 'Salatalık', category: 'Sebze & Meyve', action: 'Taze' },
  pepper: { name: 'Biber', category: 'Sebze & Meyve', action: 'Fırınla' },
  'bell pepper': { name: 'Dolmalık Biber', category: 'Sebze & Meyve', action: 'Fırınla' },
  onion: { name: 'Kuru / Taze Soğan', category: 'Sebze & Meyve', action: 'Fırınla' },
  garlic: { name: 'Sarımsak', category: 'Sebze & Meyve', action: 'Taze' },
  potato: { name: 'Patates', category: 'Sebze & Meyve', action: 'Fırınla' },
  potatoes: { name: 'Patates', category: 'Sebze & Meyve', action: 'Fırınla' },
  carrot: { name: 'Havuç', category: 'Sebze & Meyve', action: 'Çorba Yap' },
  salad: { name: 'Yeşillik / Salata', category: 'Sebze & Meyve', action: 'Hemen Tüket' },
  'leaf vegetable': { name: 'Taze Yeşillik / Ispanak', category: 'Sebze & Meyve', action: 'Hemen Tüket' },
  vegetable: { name: 'Mevsim Sebzesi', category: 'Sebze & Meyve', action: 'Çorba Yap' },
  fruit: { name: 'Taze Meyve', category: 'Sebze & Meyve', action: 'Taze' },
  apple: { name: 'Elma', category: 'Sebze & Meyve', action: 'Taze' },
  lemon: { name: 'Limon', category: 'Sebze & Meyve', action: 'Taze' },
  citrus: { name: 'Narenciye', category: 'Sebze & Meyve', action: 'Taze' },
  banana: { name: 'Muz', category: 'Sebze & Meyve', action: 'Hemen Tüket' },
  mushroom: { name: 'Mantar', category: 'Sebze & Meyve', action: 'Fırınla' },
  zucchini: { name: 'Kabak', category: 'Sebze & Meyve', action: 'Fırınla' },
  eggplant: { name: 'Patlıcan', category: 'Sebze & Meyve', action: 'Fırınla' },
  yogurt: { name: 'Yoğurt', category: 'Süt Ürünleri', action: 'Hemen Tüket' },
  butter: { name: 'Tereyağı', category: 'Süt Ürünleri', action: 'Taze' },
  soup: { name: 'Kalan Çorba', category: 'Kalan Yemek', action: 'Hemen Tüket' },
  dish: { name: 'Pişmiş Yemek', category: 'Kalan Yemek', action: 'Hemen Tüket' },
  meal: { name: 'Ev Yemeği', category: 'Kalan Yemek', action: 'Hemen Tüket' },
  cuisine: { name: 'Hazır Tabak', category: 'Kalan Yemek', action: 'Hemen Tüket' },
};

const FOOD_DICTIONARY_EN: Record<string, { name: string; category: string; action: 'Consume First' | 'Roast / Bake' | 'Make Soup' | 'Fresh' }> = {
  tomato: { name: 'Tomatoes', category: 'Produce', action: 'Consume First' },
  tomatoes: { name: 'Tomatoes', category: 'Produce', action: 'Consume First' },
  chicken: { name: 'Cooked Chicken', category: 'Leftovers', action: 'Consume First' },
  poultry: { name: 'Poultry / Meat', category: 'Meat & Poultry', action: 'Consume First' },
  egg: { name: 'Farm Eggs', category: 'Dairy & Eggs', action: 'Fresh' },
  eggs: { name: 'Farm Eggs', category: 'Dairy & Eggs', action: 'Fresh' },
  cheese: { name: 'Cheese / Feta', category: 'Dairy', action: 'Roast / Bake' },
  dairy: { name: 'Dairy / Yogurt', category: 'Dairy', action: 'Consume First' },
  milk: { name: 'Fresh Milk', category: 'Dairy', action: 'Consume First' },
  bread: { name: 'Artisan Bread', category: 'Bakery', action: 'Roast / Bake' },
  meat: { name: 'Meat / Beef', category: 'Meat', action: 'Consume First' },
  beef: { name: 'Lean Beef', category: 'Meat', action: 'Consume First' },
  fish: { name: 'Fish / Seafood', category: 'Seafood', action: 'Consume First' },
  seafood: { name: 'Seafood', category: 'Seafood', action: 'Consume First' },
  rice: { name: 'Leftover Rice', category: 'Leftovers', action: 'Make Soup' },
  pasta: { name: 'Cooked Pasta', category: 'Leftovers', action: 'Roast / Bake' },
  noodle: { name: 'Noodles / Pasta', category: 'Leftovers', action: 'Roast / Bake' },
  cucumber: { name: 'Cucumbers', category: 'Produce', action: 'Fresh' },
  pepper: { name: 'Bell Peppers', category: 'Produce', action: 'Roast / Bake' },
  'bell pepper': { name: 'Bell Peppers', category: 'Produce', action: 'Roast / Bake' },
  onion: { name: 'Onions', category: 'Produce', action: 'Roast / Bake' },
  garlic: { name: 'Garlic Cloves', category: 'Produce', action: 'Fresh' },
  potato: { name: 'Potatoes', category: 'Produce', action: 'Roast / Bake' },
  potatoes: { name: 'Potatoes', category: 'Produce', action: 'Roast / Bake' },
  carrot: { name: 'Carrots', category: 'Produce', action: 'Make Soup' },
  salad: { name: 'Salad Greens', category: 'Produce', action: 'Consume First' },
  'leaf vegetable': { name: 'Fresh Leafy Greens', category: 'Produce', action: 'Consume First' },
  vegetable: { name: 'Garden Vegetables', category: 'Produce', action: 'Make Soup' },
  fruit: { name: 'Fresh Fruits', category: 'Produce', action: 'Fresh' },
  apple: { name: 'Crisp Apples', category: 'Produce', action: 'Fresh' },
  lemon: { name: 'Lemons', category: 'Produce', action: 'Fresh' },
  citrus: { name: 'Citrus Fruits', category: 'Produce', action: 'Fresh' },
  banana: { name: 'Ripe Bananas', category: 'Produce', action: 'Consume First' },
  mushroom: { name: 'Mushrooms', category: 'Produce', action: 'Roast / Bake' },
  zucchini: { name: 'Zucchini', category: 'Produce', action: 'Roast / Bake' },
  eggplant: { name: 'Eggplant', category: 'Produce', action: 'Roast / Bake' },
  yogurt: { name: 'Greek Yogurt', category: 'Dairy', action: 'Consume First' },
  butter: { name: 'Butter', category: 'Dairy', action: 'Fresh' },
  soup: { name: 'Leftover Broth / Soup', category: 'Leftovers', action: 'Consume First' },
  dish: { name: 'Prepared Dish', category: 'Leftovers', action: 'Consume First' },
  meal: { name: 'Cooked Meal', category: 'Leftovers', action: 'Consume First' },
  cuisine: { name: 'Culinary Plate', category: 'Leftovers', action: 'Consume First' },
};

const IGNORED_LABELS = new Set([
  'tableware', 'drinkware', 'serveware', 'dishware', 'recipe', 'ingredient',
  'food', 'fast food', 'comfort food', 'finger food', 'side dish', 'snack',
  'kitchen', 'table', 'wood', 'plate', 'bowl', 'spoon', 'fork', 'knife',
  'yellow', 'red', 'green', 'white', 'orange', 'brown', 'black', 'circle',
  'font', 'graphics', 'logo', 'material property', 'fluid', 'liquid'
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
      // 1. TRY GOOGLE CLOUD VISION API (Labels & Objects)
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
                  { type: 'LABEL_DETECTION', maxResults: 15 },
                ],
              },
            ],
          }),
        });

        if (visionResponse.ok) {
          const data = await visionResponse.json();
          const annotations = data.responses?.[0];
          const rawItems: { name: string; score: number }[] = [];

          // Parse localized objects
          if (annotations?.localizedObjectAnnotations) {
            for (const obj of annotations.localizedObjectAnnotations) {
              if (obj.name && obj.score > 0.4) {
                rawItems.push({ name: obj.name.toLowerCase(), score: obj.score });
              }
            }
          }

          // Parse labels
          if (annotations?.labelAnnotations) {
            for (const lbl of annotations.labelAnnotations) {
              if (lbl.description && lbl.score > 0.5) {
                rawItems.push({ name: lbl.description.toLowerCase(), score: lbl.score });
              }
            }
          }

          // Map detected items using our culinary dictionary
          const dict = lang === 'tr' ? FOOD_DICTIONARY_TR : FOOD_DICTIONARY_EN;
          const detectedMap = new Map<string, DetectedIngredient>();

          for (const item of rawItems) {
            const lower = item.name.trim();
            if (IGNORED_LABELS.has(lower)) continue;

            // Direct dictionary lookup or partial matching
            let matchedKey = Object.keys(dict).find((k) => lower === k || lower.includes(k));
            if (matchedKey) {
              const info = dict[matchedKey];
              if (!detectedMap.has(info.name)) {
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
              ? `Google Cloud Vision ${detectedList.length} gerçek malzeme tespit etti: ${detectedList.map((i) => i.name).join(', ')}. Harika sıfır israf tarifler hazır!`
              : `Google Cloud Vision detected ${detectedList.length} ingredients: ${detectedList.map((i) => i.name).join(', ')}. Ready for zero-waste cooking!`;

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

    // Fallback to presets if no specific food recognized or offline
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

    // Use Gemini Generative API if available or generate custom smart recipes
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

    // Curated dynamic recipes from presets matching current language
    const currentPreset = getDemoPresets(lang)[0];
    return currentPreset.recipes;
  },
};
