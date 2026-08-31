import AsyncStorage from '@react-native-async-storage/async-storage';
import { DetectedIngredient } from '../types';
import { SupportedLanguage } from '../constants/Translations';

export interface ExpiryItem {
  id: string;
  name: string;
  category: string;
  daysRemaining: number;
  urgency: 'critical' | 'warning' | 'fresh';
  scannedAt: string;
}

const PANTRY_RADAR_KEY = '@fridge_chef_pantry_radar_v2';

const DEFAULT_RADAR_EN: ExpiryItem[] = [
  {
    id: 'rad-1',
    name: 'Shredded Cooked Chicken',
    category: 'Leftovers',
    daysRemaining: 1,
    urgency: 'critical',
    scannedAt: new Date().toISOString(),
  },
  {
    id: 'rad-2',
    name: 'Leftover Steamed Rice',
    category: 'Leftovers',
    daysRemaining: 2,
    urgency: 'critical',
    scannedAt: new Date().toISOString(),
  },
  {
    id: 'rad-3',
    name: 'Soft Heirloom Tomatoes',
    category: 'Produce',
    daysRemaining: 3,
    urgency: 'warning',
    scannedAt: new Date().toISOString(),
  },
  {
    id: 'rad-4',
    name: 'Aged Cheddar / Feta Cheese',
    category: 'Dairy',
    daysRemaining: 6,
    urgency: 'fresh',
    scannedAt: new Date().toISOString(),
  },
];

const DEFAULT_RADAR_TR: ExpiryItem[] = [
  {
    id: 'rad-1',
    name: 'Haşlanmış Didilmiş Tavuk',
    category: 'Kalan Yemek',
    daysRemaining: 1,
    urgency: 'critical',
    scannedAt: new Date().toISOString(),
  },
  {
    id: 'rad-2',
    name: 'Kalan Pirinç Pilavı',
    category: 'Kalan Yemek',
    daysRemaining: 2,
    urgency: 'critical',
    scannedAt: new Date().toISOString(),
  },
  {
    id: 'rad-3',
    name: 'Yumuşamış Domates',
    category: 'Sebze & Meyve',
    daysRemaining: 3,
    urgency: 'warning',
    scannedAt: new Date().toISOString(),
  },
  {
    id: 'rad-4',
    name: 'Kaşar / Beyaz Peynir',
    category: 'Süt Ürünleri',
    daysRemaining: 6,
    urgency: 'fresh',
    scannedAt: new Date().toISOString(),
  },
];

export const PantryRadarService = {
  async getRadarItems(lang: SupportedLanguage = 'en'): Promise<ExpiryItem[]> {
    try {
      const data = await AsyncStorage.getItem(`${PANTRY_RADAR_KEY}_${lang}`);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load pantry radar', e);
    }

    return lang === 'tr' ? DEFAULT_RADAR_TR : DEFAULT_RADAR_EN;
  },

  async registerScannedIngredients(
    ingredients: DetectedIngredient[],
    lang: SupportedLanguage = 'en'
  ): Promise<ExpiryItem[]> {
    try {
      const current = await this.getRadarItems(lang);
      const existingNames = new Set(current.map((i) => i.name.toLowerCase()));

      const newItems: ExpiryItem[] = ingredients
        .filter((ing) => !existingNames.has(ing.name.toLowerCase()))
        .map((ing) => {
          let days = 5;
          let urgency: 'critical' | 'warning' | 'fresh' = 'fresh';

          const lowerCat = (ing.category || '').toLowerCase();
          const lowerName = ing.name.toLowerCase();

          if (
            lowerCat.includes('kalan') ||
            lowerCat.includes('leftover') ||
            lowerName.includes('tavuk') ||
            lowerName.includes('chicken') ||
            lowerName.includes('balık') ||
            lowerName.includes('fish')
          ) {
            days = 1;
            urgency = 'critical';
          } else if (
            lowerCat.includes('süt') ||
            lowerCat.includes('dairy') ||
            lowerName.includes('domates') ||
            lowerName.includes('tomato')
          ) {
            days = 3;
            urgency = 'warning';
          }

          return {
            id: `rad-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: ing.name,
            category: ing.category,
            daysRemaining: days,
            urgency,
            scannedAt: new Date().toISOString(),
          };
        });

      const merged = [...newItems, ...current];
      await AsyncStorage.setItem(`${PANTRY_RADAR_KEY}_${lang}`, JSON.stringify(merged));
      return merged;
    } catch (e) {
      console.error('Failed to register scanned ingredients in radar', e);
      return [];
    }
  },

  async removeRadarItem(id: string, lang: SupportedLanguage = 'en'): Promise<ExpiryItem[]> {
    try {
      const current = await this.getRadarItems(lang);
      const filtered = current.filter((item) => item.id !== id);
      await AsyncStorage.setItem(`${PANTRY_RADAR_KEY}_${lang}`, JSON.stringify(filtered));
      return filtered;
    } catch (e) {
      console.error('Failed to remove radar item', e);
      return [];
    }
  },
};
