import { AdminMetrics, User } from '../types';
import { AuthService } from './authService';

export const AdminService = {
  async getMetrics(): Promise<AdminMetrics> {
    const users = await AuthService.getAllUsers();

    return {
      totalUsers: 842 + users.length,
      totalScans: 3420,
      totalWasteSavedTons: 1.84,
      activeAiQueriesToday: 189,
      popularIngredients: [
        { name: 'Kalan Tavuk / Et', percentage: 28, count: 958 },
        { name: 'Dünden Kalan Pilav / Makarna', percentage: 24, count: 820 },
        { name: 'Bayat Ekmek & Pide', percentage: 21, count: 718 },
        { name: 'Peynir / Süt Ürünleri', percentage: 15, count: 512 },
        { name: 'Pörsümüş Sebzeler', percentage: 12, count: 410 },
      ],
      recentUsers: [
        { id: 'u1', name: 'Can Yılmaz', email: 'can.yilmaz@gmail.com', role: 'user', joinedDate: 'Bugün 11:20', scans: 4 },
        { id: 'u2', name: 'Selin Kaya', email: 'selin.k@hotmail.com', role: 'user', joinedDate: 'Bugün 09:45', scans: 12 },
        { id: 'u3', name: 'Mert Demir', email: 'mert.demir@outlook.com', role: 'user', joinedDate: 'Dün 20:15', scans: 7 },
        { id: 'u4', name: 'Gizem Aksoy', email: 'gizem@aksoy.com', role: 'user', joinedDate: 'Dün 14:02', scans: 18 },
        { id: 'u5', name: 'Sistem Yöneticisi', email: 'admin@fridgechef.ai', role: 'admin', joinedDate: '01.08.2026', scans: 94 },
      ],
      systemHealth: 'Mükemmel',
    };
  },
};
