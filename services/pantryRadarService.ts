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

const PANTRY_RADAR_KEY = '@fridge_chef_pantry_radar_v1';

export const PantryRadarService = {
  async getRadarItems(): Promise<ExpiryItem[]> {
    try {
      const data = await AsyncStorage.getItem(PANTRY_RADAR_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load pantry radar', e);
    }

    // Default intelligent mock radar items
    return [
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
  },

  async registerScannedIngredients(ingredients: DetectedIngredient[]): Promise<ExpiryItem[]> {
    try {
      const current = await this.getRadarItems();
      const existingNames = new Set(current.map((i) => i.name.toLowerCase()));

      const newItems: ExpiryItem[] = ingredients
        .filter((ing) => !existingNames.has(ing.name.toLowerCase()))
        .map((ing) => {
          let days = 3;
          let urgency: 'critical' | 'warning' | 'fresh' = 'warning';

          const lower = ing.name.toLowerCase();
          if (lower.includes('tavuk') || lower.includes('chicken') || lower.includes('et') || lower.includes('meat') || lower.includes('pilav') || lower.includes('rice')) {
            days = 1;
            urgency = 'critical';
          } else if (lower.includes('süt') || lower.includes('milk') || lower.includes('balık') || lower.includes('fish')) {
            days = 2;
            urgency = 'critical';
          } else if (lower.includes('peynir') || lower.includes('cheese') || lower.includes('havuç') || lower.includes('carrot')) {
            days = 7;
            urgency = 'fresh';
          }

          return {
            id: `rad-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name: ing.name,
            category: ing.category,
            daysRemaining: days,
            urgency,
            scannedAt: new Date().toISOString(),
          };
        });

      const updated = [...newItems, ...current];
      await AsyncStorage.setItem(PANTRY_RADAR_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to register radar items', e);
      return [];
    }
  },

  async removeRadarItem(id: string): Promise<ExpiryItem[]> {
    try {
      const current = await this.getRadarItems();
      const updated = current.filter((i) => i.id !== id);
      await AsyncStorage.setItem(PANTRY_RADAR_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to remove radar item', e);
      return [];
    }
  }
};
