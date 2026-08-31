import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe, UserStats, UserPreferences } from '../types';

const KEYS = {
  SAVED_RECIPES: '@fridge_chef_saved_recipes',
  USER_STATS: '@fridge_chef_user_stats',
  USER_PREFS: '@fridge_chef_user_prefs',
  SCAN_HISTORY: '@fridge_chef_scan_history',
};

const DEFAULT_STATS: UserStats = {
  totalMealsCooked: 3,
  totalWasteSavedKg: 1.4,
  estimatedMoneySavedTL: 320,
};

const DEFAULT_PREFS: UserPreferences = {
  geminiApiKey: 'AIzaSyBjaJCtONI5yculIi8VQ1yw0y-CNFY6SIc',
  dietaryRestrictions: [],
  defaultServings: 2,
  favoriteCuisines: ['Türk Mutfağı', 'Pratik & Hızlı'],
  hasSeenOnboarding: false,
};

export const StorageService = {
  // === FAVORITES / SAVED RECIPES ===
  async getSavedRecipes(): Promise<Recipe[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SAVED_RECIPES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading saved recipes', e);
      return [];
    }
  },

  async toggleSaveRecipe(recipe: Recipe): Promise<boolean> {
    try {
      const saved = await this.getSavedRecipes();
      const exists = saved.some(r => r.id === recipe.id);
      let updated: Recipe[];

      if (exists) {
        updated = saved.filter(r => r.id !== recipe.id);
      } else {
        updated = [{ ...recipe, isFavorite: true, createdAt: new Date().toISOString() }, ...saved];
      }

      await AsyncStorage.setItem(KEYS.SAVED_RECIPES, JSON.stringify(updated));
      return !exists;
    } catch (e) {
      console.error('Error toggling save recipe', e);
      return false;
    }
  },

  async isRecipeSaved(recipeId: string): Promise<boolean> {
    try {
      const saved = await this.getSavedRecipes();
      return saved.some(r => r.id === recipeId);
    } catch (e) {
      return false;
    }
  },

  // === STATS & WASTE TRACKING ===
  async getUserStats(): Promise<UserStats> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_STATS);
      return data ? JSON.parse(data) : DEFAULT_STATS;
    } catch (e) {
      return DEFAULT_STATS;
    }
  },

  async saveUserStats(stats: UserStats): Promise<UserStats> {
    try {
      await AsyncStorage.setItem(KEYS.USER_STATS, JSON.stringify(stats));
      return stats;
    } catch (e) {
      return DEFAULT_STATS;
    }
  },

  async recordMealCooked(wasteGrams: number = 300): Promise<UserStats> {
    try {
      const current = await this.getUserStats();
      const wasteSavedKg = Number((current.totalWasteSavedKg + wasteGrams / 1000).toFixed(2));
      const estimatedSaved = current.estimatedMoneySavedTL + Math.round(wasteGrams * 0.25);

      const updated: UserStats = {
        totalMealsCooked: current.totalMealsCooked + 1,
        totalWasteSavedKg: wasteSavedKg,
        estimatedMoneySavedTL: estimatedSaved,
        lastCookedDate: new Date().toISOString(),
      };

      await AsyncStorage.setItem(KEYS.USER_STATS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      return DEFAULT_STATS;
    }
  },

  // === PREFERENCES & API KEY ===
  async getUserPreferences(): Promise<UserPreferences> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_PREFS);
      return data ? { ...DEFAULT_PREFS, ...JSON.parse(data) } : DEFAULT_PREFS;
    } catch (e) {
      return DEFAULT_PREFS;
    }
  },

  async saveUserPreferences(prefs: Partial<UserPreferences>): Promise<UserPreferences> {
    try {
      const current = await this.getUserPreferences();
      const updated = { ...current, ...prefs };
      await AsyncStorage.setItem(KEYS.USER_PREFS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      return DEFAULT_PREFS;
    }
  },
};
