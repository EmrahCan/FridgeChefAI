import AsyncStorage from '@react-native-async-storage/async-storage';
import { SupportedLanguage } from '../constants/Translations';

export interface GroceryItem {
  id: string;
  name: string;
  category?: string;
  recipeTitle?: string;
  isCompleted: boolean;
  createdAt: string;
}

const GROCERY_STORAGE_KEY = '@fridge_chef_grocery_list_v1';

export const GroceryService = {
  async getItems(): Promise<GroceryItem[]> {
    try {
      const data = await AsyncStorage.getItem(GROCERY_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get grocery items', e);
      return [];
    }
  },

  async addItems(itemNames: string[], recipeTitle?: string): Promise<GroceryItem[]> {
    try {
      const current = await this.getItems();
      const newItems: GroceryItem[] = itemNames.map((name) => ({
        id: `groc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: name.trim(),
        recipeTitle: recipeTitle,
        isCompleted: false,
        createdAt: new Date().toISOString(),
      }));

      // Avoid duplicates
      const existingNames = new Set(current.map((i) => i.name.toLowerCase()));
      const filteredNew = newItems.filter((i) => !existingNames.has(i.name.toLowerCase()));

      const updated = [...filteredNew, ...current];
      await AsyncStorage.setItem(GROCERY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to add grocery items', e);
      return [];
    }
  },

  async toggleItem(id: string): Promise<GroceryItem[]> {
    try {
      const current = await this.getItems();
      const updated = current.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      );
      await AsyncStorage.setItem(GROCERY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to toggle grocery item', e);
      return [];
    }
  },

  async removeItem(id: string): Promise<GroceryItem[]> {
    try {
      const current = await this.getItems();
      const updated = current.filter((item) => item.id !== id);
      await AsyncStorage.setItem(GROCERY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to remove grocery item', e);
      return [];
    }
  },

  async clearCompleted(): Promise<GroceryItem[]> {
    try {
      const current = await this.getItems();
      const updated = current.filter((item) => !item.isCompleted);
      await AsyncStorage.setItem(GROCERY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to clear completed grocery items', e);
      return [];
    }
  },

  formatForExport(items: GroceryItem[], lang: SupportedLanguage = 'en'): string {
    if (items.length === 0) return '';

    const title = lang === 'tr'
      ? '🛒 FridgeChef AI — Mutfak Alışveriş Listesi\n━━━━━━━━━━━━━━━━━━━━'
      : '🛒 FridgeChef AI — Smart Grocery Checklist\n━━━━━━━━━━━━━━━━━━━━';

    const listLines = items.map((i) => {
      const status = i.isCompleted ? '✅' : '⬜';
      const fromRecipe = i.recipeTitle ? ` (${i.recipeTitle})` : '';
      return `${status} ${i.name}${fromRecipe}`;
    });

    const footer = lang === 'tr'
      ? '\n🌱 Sıfır İsraf Şef Asistanı ile hazırlandı.'
      : '\n🌱 Crafted with FridgeChef AI Zero-Waste Assistant.';

    return `${title}\n${listLines.join('\n')}\n${footer}`;
  }
};
