export type DifficultyLevel = 'Kolay' | 'Orta' | 'Usta';

export type CookingStyle = 
  | 'hepsi'
  | 'hizli'        // Pratik & Hızlı (<20 dk)
  | 'firinda'      // Fırın & Graten
  | 'corba'        // Şifalı Çorbalar
  | 'fit'          // Düşük Kalorili / Sağlıklı
  | 'cocuk'        // Çocuk Dostu & Atıştırmalık
  | 'kahvalti';    // Kahvaltılık & Brunch

export interface RecipeInstruction {
  stepNumber: number;
  title: string;
  description: string;
  durationMinutes?: number;
  tip?: string;
}

export interface Recipe {
  id: string;
  title: string;
  tagline: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty: DifficultyLevel;
  servings: number;
  caloriesPerServing: number;
  wasteSavedGrams: number; // e.g. 350 grams saved
  category: string;
  ingredientsUsed: string[];       // From user's fridge/leftovers
  pantryItemsNeeded: string[];     // Salt, pepper, olive oil, etc.
  optionalIngredients?: string[];
  instructions: RecipeInstruction[];
  chefTips: string[];
  nutritionalHighlights?: {
    protein: string;
    carbs: string;
    fat: string;
  };
  imageUrl?: string;
  createdAt: string;
  isFavorite?: boolean;
}

export interface DetectedIngredient {
  id: string;
  name: string;
  category: 'Kalan Yemek' | 'Sebze & Meyve' | 'Et & Şarküteri' | 'Süt Ürünleri' | 'Bakliyat & Ekmek' | 'Diğer';
  confidence: number;
  suggestedAction?: 'Hemen Tüket' | 'Fırınla' | 'Çorba Yap' | 'Taze';
}

export interface AnalysisResponse {
  detectedIngredients: DetectedIngredient[];
  fridgeSummary: string;
  wasteReductionScore: number; // 1-100
  recipes: Recipe[];
}

export interface UserStats {
  totalMealsCooked: number;
  totalWasteSavedKg: number;
  estimatedMoneySavedTL: number;
  lastCookedDate?: string;
}

export interface UserPreferences {
  geminiApiKey: string;
  dietaryRestrictions: string[]; // 'Vejetaryen', 'Glutensiz', 'Laktozsuz', 'Düşük Karbonhidrat'
  defaultServings: number;
  favoriteCuisines: string[];
  hasSeenOnboarding: boolean;
}
