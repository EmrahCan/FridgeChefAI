import AsyncStorage from '@react-native-async-storage/async-storage';
import { DetectedIngredient } from '../types';
import { SupportedLanguage } from '../constants/Translations';

export interface ExpiryItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  daysRemaining: number;
  urgency: 'critical' | 'warning' | 'fresh';
  scannedAt: string;
  isOpened?: boolean;
  openedAt?: string;
  expiryDate?: string;
}

const PANTRY_RADAR_KEY = '@fridge_chef_pantry_radar_v4';

export const OPENED_DECAY_DAYS: Record<string, number> = {
  süt: 4,
  milk: 4,
  yoğurt: 7,
  yogurt: 7,
  peynir: 7,
  cheese: 7,
  kaşar: 7,
  salça: 10,
  sos: 7,
  sauce: 7,
  tavuk: 2,
  chicken: 2,
  et: 2,
  meat: 2,
  balık: 2,
  fish: 2,
  pilav: 3,
  rice: 3,
  makarna: 3,
  pasta: 3,
  domates: 3,
  tomato: 3,
  default: 4,
};

export function getIngredientIcon(name: string, category: string = ''): string {
  const text = `${name} ${category}`.toLowerCase();
  if (text.includes('tavuk') || text.includes('chicken')) return '🍗';
  if (text.includes('pilav') || text.includes('rice')) return '🍚';
  if (text.includes('domates') || text.includes('tomato')) return '🍅';
  if (text.includes('peynir') || text.includes('cheese') || text.includes('kaşar')) return '🧀';
  if (text.includes('ekmek') || text.includes('bread')) return '🥖';
  if (text.includes('et') || text.includes('beef') || text.includes('meat') || text.includes('kıyma')) return '🥩';
  if (text.includes('balık') || text.includes('fish') || text.includes('somon')) return '🐟';
  if (text.includes('yumurta') || text.includes('egg')) return '🥚';
  if (text.includes('yoğurt') || text.includes('yogurt') || text.includes('süt') || text.includes('milk')) return '🥛';
  if (text.includes('salça') || text.includes('sauce') || text.includes('sos')) return '🥫';
  if (text.includes('biber') || text.includes('pepper')) return '🫑';
  if (text.includes('havuç') || text.includes('carrot')) return '🥕';
  if (text.includes('patates') || text.includes('potato')) return '🥔';
  if (text.includes('soğan') || text.includes('onion')) return '🧅';
  if (text.includes('makarna') || text.includes('pasta')) return '🍝';
  if (text.includes('sebze') || text.includes('veggie') || text.includes('yeşillik')) return '🥬';
  return '🍲';
}

export function calculateOpenedDecay(name: string, category: string = ''): number {
  const text = `${name} ${category}`.toLowerCase();
  for (const [key, days] of Object.entries(OPENED_DECAY_DAYS)) {
    if (text.includes(key)) {
      return days;
    }
  }
  return OPENED_DECAY_DAYS.default;
}

const DEFAULT_RADAR_EN: ExpiryItem[] = [
  {
    id: 'rad-1',
    name: 'Shredded Cooked Chicken',
    category: 'Leftovers',
    icon: '🍗',
    daysRemaining: 1,
    urgency: 'critical',
    scannedAt: new Date().toISOString(),
    isOpened: true,
  },
  {
    id: 'rad-2',
    name: 'Leftover Steamed Rice',
    category: 'Leftovers',
    icon: '🍚',
    daysRemaining: 2,
    urgency: 'critical',
    scannedAt: new Date().toISOString(),
    isOpened: true,
  },
  {
    id: 'rad-3',
    name: 'Whole Milk (Opened 🥛)',
    category: 'Dairy',
    icon: '🥛',
    daysRemaining: 3,
    urgency: 'warning',
    scannedAt: new Date().toISOString(),
    isOpened: true,
  },
  {
    id: 'rad-4',
    name: 'Aged Cheddar & Feta Cheese',
    category: 'Dairy',
    icon: '🧀',
    daysRemaining: 6,
    urgency: 'fresh',
    scannedAt: new Date().toISOString(),
    isOpened: false,
  },
];

const DEFAULT_RADAR_TR: ExpiryItem[] = [
  {
    id: 'rad-1',
    name: 'Haşlanmış Didilmiş Tavuk',
    category: 'Kalan Yemek',
    icon: '🍗',
    daysRemaining: 1,
    urgency: 'critical',
    scannedAt: new Date().toISOString(),
    isOpened: true,
  },
  {
    id: 'rad-2',
    name: 'Dünden Kalan Pirinç Pilavı',
    category: 'Kalan Yemek',
    icon: '🍚',
    daysRemaining: 2,
    urgency: 'critical',
    scannedAt: new Date().toISOString(),
    isOpened: true,
  },
  {
    id: 'rad-3',
    name: 'Tam Yağlı Süt (Açıldı 🥛)',
    category: 'Süt Ürünleri',
    icon: '🥛',
    daysRemaining: 3,
    urgency: 'warning',
    scannedAt: new Date().toISOString(),
    isOpened: true,
  },
  {
    id: 'rad-4',
    name: 'Kaşar & Beyaz Peynir Uçları',
    category: 'Süt Ürünleri',
    icon: '🧀',
    daysRemaining: 6,
    urgency: 'fresh',
    scannedAt: new Date().toISOString(),
    isOpened: false,
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
            icon: getIngredientIcon(ing.name, ing.category),
            daysRemaining: days,
            urgency,
            scannedAt: new Date().toISOString(),
            isOpened: false,
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

  async addManualItem(
    item: {
      name: string;
      category?: string;
      daysRemaining?: number;
      isOpened?: boolean;
      expiryDate?: string;
    },
    lang: SupportedLanguage = 'en'
  ): Promise<ExpiryItem[]> {
    try {
      const current = await this.getRadarItems(lang);
      const days = item.daysRemaining ?? (item.isOpened ? calculateOpenedDecay(item.name, item.category) : 5);
      const urgency: 'critical' | 'warning' | 'fresh' =
        days <= 2 ? 'critical' : days <= 4 ? 'warning' : 'fresh';

      const newItem: ExpiryItem = {
        id: `rad-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: item.name,
        category: item.category || (lang === 'en' ? 'Pantry' : 'Dolap'),
        icon: getIngredientIcon(item.name, item.category),
        daysRemaining: days,
        urgency,
        scannedAt: new Date().toISOString(),
        isOpened: item.isOpened ?? false,
        openedAt: item.isOpened ? new Date().toISOString() : undefined,
        expiryDate: item.expiryDate,
      };

      const updated = [newItem, ...current];
      await AsyncStorage.setItem(`${PANTRY_RADAR_KEY}_${lang}`, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to add manual radar item', e);
      return [];
    }
  },

  async toggleOpenedStatus(id: string, lang: SupportedLanguage = 'en'): Promise<ExpiryItem[]> {
    try {
      const current = await this.getRadarItems(lang);
      const updated = current.map((item) => {
        if (item.id === id) {
          const nextOpened = !item.isOpened;
          const decayDays = nextOpened ? calculateOpenedDecay(item.name, item.category) : 6;
          const urgency: 'critical' | 'warning' | 'fresh' =
            decayDays <= 2 ? 'critical' : decayDays <= 4 ? 'warning' : 'fresh';

          return {
            ...item,
            isOpened: nextOpened,
            daysRemaining: decayDays,
            urgency,
            openedAt: nextOpened ? new Date().toISOString() : undefined,
          };
        }
        return item;
      });

      await AsyncStorage.setItem(`${PANTRY_RADAR_KEY}_${lang}`, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to toggle opened status', e);
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
