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

    const recentEn = [
      { id: 'u1', name: 'Alex Johnson', email: 'alex.j@gmail.com', role: 'user' as const, joinedDate: 'Today 11:20', scans: 4 },
      { id: 'u2', name: 'Sarah Miller', email: 'sarah.m@hotmail.com', role: 'user' as const, joinedDate: 'Today 09:45', scans: 12 },
      { id: 'u3', name: 'David Smith', email: 'david.s@outlook.com', role: 'user' as const, joinedDate: 'Yesterday 20:15', scans: 7 },
      { id: 'u4', name: 'Emma Watson', email: 'emma@watson.com', role: 'user' as const, joinedDate: 'Yesterday 14:02', scans: 18 },
      { id: 'u5', name: 'System Admin', email: 'admin@fridgechef.ai', role: 'admin' as const, joinedDate: '01.08.2026', scans: 94 },
    ];

    const recentTr = [
      { id: 'u1', name: 'Can Yılmaz', email: 'can.yilmaz@gmail.com', role: 'user' as const, joinedDate: 'Bugün 11:20', scans: 4 },
      { id: 'u2', name: 'Selin Kaya', email: 'selin.k@hotmail.com', role: 'user' as const, joinedDate: 'Bugün 09:45', scans: 12 },
      { id: 'u3', name: 'Mert Demir', email: 'mert.demir@outlook.com', role: 'user' as const, joinedDate: 'Dün 20:15', scans: 7 },
      { id: 'u4', name: 'Gizem Aksoy', email: 'gizem@aksoy.com', role: 'user' as const, joinedDate: 'Dün 14:02', scans: 18 },
      { id: 'u5', name: 'Sistem Yöneticisi', email: 'admin@fridgechef.ai', role: 'admin' as const, joinedDate: '01.08.2026', scans: 94 },
    ];

    return {
      totalUsers: 842 + users.length,
      totalScans: 3420,
      totalWasteSavedTons: 1.84,
      activeAiQueriesToday: 189,
      popularIngredients: lang === 'en' ? popularEn : popularTr,
      recentUsers: lang === 'en' ? recentEn : recentTr,
      systemHealth: lang === 'en' ? 'Excellent' : 'Mükemmel',
    };
  },
};
