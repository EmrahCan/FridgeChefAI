import { StorageService } from './storageService';
import { SupportedLanguage } from '../constants/Translations';

export interface ChefBadge {
  id: string;
  titleEn: string;
  titleTr: string;
  descEn: string;
  descTr: string;
  icon: string;
  isUnlocked: boolean;
  progressPercent: number;
}

export const GamificationService = {
  async getBadges(lang: SupportedLanguage = 'en'): Promise<ChefBadge[]> {
    const stats = await StorageService.getUserStats();
    const saved = await StorageService.getSavedRecipes();

    const mealsCount = stats.totalMealsCooked || 0;
    const wasteKg = stats.totalWasteSavedKg || 0;

    return [
      {
        id: 'rescuer_bronze',
        titleEn: '🥉 Food Rescuer',
        titleTr: '🥉 Gıda Kurtarıcısı',
        descEn: 'Rescue at least 1.0 kg of food from waste',
        descTr: 'En az 1.0 kg gıdayı çöpe gitmekten kurtar',
        icon: '🌱',
        isUnlocked: wasteKg >= 1.0,
        progressPercent: Math.min(100, Math.round((wasteKg / 1.0) * 100)),
      },
      {
        id: 'streak_3',
        titleEn: '🔥 3-Day Cooking Streak',
        titleTr: '🔥 3 Günlük Şef Serisi',
        descEn: 'Cook 3 zero-waste meals',
        descTr: '3 sıfır israf yemeği tamamla',
        icon: '🔥',
        isUnlocked: mealsCount >= 3,
        progressPercent: Math.min(100, Math.round((mealsCount / 3) * 100)),
      },
      {
        id: 'bread_wizard',
        titleEn: '🥖 Artisan Bread Wizard',
        titleTr: '🥖 Ekmek Büyücüsü',
        descEn: 'Save stale bread & create gourmet croutons or pizzas',
        descTr: 'Bayat ekmekleri gurme lezzetlere dönüştür',
        icon: '🥖',
        isUnlocked: saved.some((r) => r.title.toLowerCase().includes('ekmek') || r.title.toLowerCase().includes('bread') || r.title.toLowerCase().includes('pizza')),
        progressPercent: saved.some((r) => r.title.toLowerCase().includes('ekmek') || r.title.toLowerCase().includes('bread') || r.title.toLowerCase().includes('pizza')) ? 100 : 50,
      },
      {
        id: 'soup_master',
        titleEn: '🍲 Healing Soup Alchemist',
        titleTr: '🍲 Şifa İksiri Ustası',
        descEn: 'Transform leftover rice or vegetables into comforting soup',
        descTr: 'Kalan pilav veya sebzelerden şifalı çorba yap',
        icon: '🍲',
        isUnlocked: saved.some((r) => r.category.toLowerCase().includes('soup') || r.category.toLowerCase().includes('çorba')),
        progressPercent: saved.some((r) => r.category.toLowerCase().includes('soup') || r.category.toLowerCase().includes('çorba')) ? 100 : 50,
      },
      {
        id: 'master_champion',
        titleEn: '👑 Michelin Zero-Waste Legend',
        titleTr: '👑 Sıfır İsraf Efsanesi',
        descEn: 'Cook 10+ meals and rescue over 5.0 kg of food',
        descTr: '10+ yemek tamamla ve 5.0 kg gıdayı kurtar',
        icon: '👑',
        isUnlocked: mealsCount >= 10 && wasteKg >= 5.0,
        progressPercent: Math.min(100, Math.round(((mealsCount / 10) * 50) + ((wasteKg / 5.0) * 50))),
      },
    ];
  }
};
