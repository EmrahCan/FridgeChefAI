import { AdminMetrics, User } from '../types';
import { AuthService } from './authService';
import { SupportedLanguage } from '../constants/Translations';

export const AdminService = {
  async getMetrics(lang: SupportedLanguage = 'en'): Promise<AdminMetrics> {
    const users = await AuthService.getAllUsers();

    const popularEn = [
      { name: 'Leftover Chicken / Meat', percentage: 28, count: 958 },
      { name: 'Leftover Cooked Rice / Pasta', percentage: 24, count: 820 },
      { name: 'Stale Bread & Buns', percentage: 21, count: 718 },
      { name: 'Cheese & Dairy Scraps', percentage: 15, count: 512 },
      { name: 'Softening Produce & Veggies', percentage: 12, count: 410 },
    ];

    const popularTr = [
      { name: 'Kalan Tavuk / Et', percentage: 28, count: 958 },
      { name: 'Dünden Kalan Pilav / Makarna', percentage: 24, count: 820 },
      { name: 'Bayat Ekmek & Pide', percentage: 21, count: 718 },
      { name: 'Peynir / Süt Ürünleri', percentage: 15, count: 512 },
      { name: 'Pörsümüş Sebzeler', percentage: 12, count: 410 },
    ];

    const recentEn = users.map((u, i) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      joinedDate: new Date(u.createdAt).toLocaleDateString('en-US'),
      scans: 0,
    }));

    const recentTr = users.map((u, i) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      joinedDate: new Date(u.createdAt).toLocaleDateString('tr-TR'),
      scans: 0,
    }));

    return {
      totalUsers: users.length,
      totalScans: 0,
      totalWasteSavedTons: 0,
      activeAiQueriesToday: 0,
      popularIngredients: lang === 'en' ? popularEn : popularTr,
      recentUsers: lang === 'en' ? recentEn : recentTr,
      systemHealth: lang === 'en' ? 'Excellent' : 'Mükemmel',
    };
  },
};
