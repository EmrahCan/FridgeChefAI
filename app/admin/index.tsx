import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Shield,
  Users,
  Camera,
  Leaf,
  Sparkles,
  ArrowLeft,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { AdminService } from '../../services/adminService';
import { AdminMetrics } from '../../types';
import * as Haptics from 'expo-haptics';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const data = await AdminService.getMetrics();
      setMetrics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Unauthorized Access Guard
  if (!user || user.role !== 'admin') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.unauthorizedBox}>
          <Lock size={48} color="#EF4444" />
          <Text style={styles.unauthorizedTitle}>Yetkisiz Erişim</Text>
          <Text style={styles.unauthorizedDesc}>
            Bu sayfayı yalnızca yönetici (admin) rolündeki kullanıcılar görüntüleyebilir.
          </Text>
          <TouchableOpacity
            style={styles.backHomeBtn}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.backHomeBtnText}>Ana Sayfaya Dön</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <ArrowLeft size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.navTitleRow}>
          <Shield size={18} color="#FEF08A" />
          <Text style={styles.navTitle}>Yönetici (Admin) Paneli</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Admin Header Banner */}
        <View style={styles.adminHeaderBanner}>
          <View>
            <Text style={styles.adminWelcome}>Hoş Geldiniz,</Text>
            <Text style={styles.adminName}>{user.name}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Activity size={12} color="#10B981" />
            <Text style={styles.statusBadgeText}>Sistem Aktif</Text>
          </View>
        </View>

        {isLoading || !metrics ? (
          <ActivityIndicator size="large" color="#10B981" style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* 4 Big KPI Cards */}
            <View style={styles.kpiGrid}>
              <View style={[styles.kpiCard, { borderColor: '#93C5FD' }]}>
                <View style={[styles.kpiIconBox, { backgroundColor: '#EFF6FF' }]}>
                  <Users size={20} color="#3B82F6" />
                </View>
                <Text style={styles.kpiValue}>{metrics.totalUsers}</Text>
                <Text style={styles.kpiLabel}>Kayıtlı Kullanıcı</Text>
              </View>

              <View style={[styles.kpiCard, { borderColor: '#A7F3D0' }]}>
                <View style={[styles.kpiIconBox, { backgroundColor: '#ECFDF5' }]}>
                  <Camera size={20} color="#10B981" />
                </View>
                <Text style={styles.kpiValue}>{metrics.totalScans}</Text>
                <Text style={styles.kpiLabel}>Dolap Taraması</Text>
              </View>

              <View style={[styles.kpiCard, { borderColor: '#FDE68A' }]}>
                <View style={[styles.kpiIconBox, { backgroundColor: '#FEFCE8' }]}>
                  <Leaf size={20} color="#CA8A04" />
                </View>
                <Text style={styles.kpiValue}>{metrics.totalWasteSavedTons} Ton</Text>
                <Text style={styles.kpiLabel}>Kurtarılan Gıda 🌱</Text>
              </View>

              <View style={[styles.kpiCard, { borderColor: '#DDD6FE' }]}>
                <View style={[styles.kpiIconBox, { backgroundColor: '#F5F3FF' }]}>
                  <Sparkles size={20} color="#7C3AED" />
                </View>
                <Text style={styles.kpiValue}>{metrics.activeAiQueriesToday}</Text>
                <Text style={styles.kpiLabel}>Bugünkü AI Sorgusu</Text>
              </View>
            </View>

            {/* Popular Leftover Ingredients Chart */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <TrendingUp size={18} color="#10B981" />
                <Text style={styles.sectionTitle}>En Çok İsraf Edilen / Taranan Gıdalar</Text>
              </View>
              <Text style={styles.sectionSub}>Kullanıcıların buzdolabında en sık kalan ürünler:</Text>

              <View style={styles.chartList}>
                {metrics.popularIngredients.map((item, idx) => (
                  <View key={idx} style={styles.chartItem}>
                    <View style={styles.chartItemHeader}>
                      <Text style={styles.chartItemName}>{item.name}</Text>
                      <Text style={styles.chartItemPercent}>%{item.percentage} ({item.count} kez)</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${item.percentage * 2.5}%`,
                            backgroundColor: idx === 0 ? '#EF4444' : idx === 1 ? '#F97316' : '#10B981',
                          },
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Recent Users & Activity Table */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Users size={18} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Son Kullanıcı Aktiviteleri</Text>
              </View>

              <View style={styles.userList}>
                {metrics.recentUsers.map((u) => (
                  <View key={u.id} style={styles.userRow}>
                    <View style={styles.userAvatarBox}>
                      <Text style={styles.userAvatarLetter}>{u.name[0]}</Text>
                    </View>
                    <View style={styles.userInfoBox}>
                      <Text style={styles.userName}>{u.name}</Text>
                      <Text style={styles.userEmail}>{u.email}</Text>
                    </View>
                    <View style={styles.userMetaBox}>
                      <Text style={styles.userScans}>{u.scans} Tarama</Text>
                      <Text style={styles.userDate}>{u.joinedDate}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* AI & System Health Status */}
            <View style={styles.healthCard}>
              <View style={styles.healthHeader}>
                <CheckCircle2 size={20} color="#059669" />
                <Text style={styles.healthTitle}>Google Gemini AI Servis Durumu</Text>
              </View>
              <Text style={styles.healthDesc}>
                Gemini 1.5 Flash Vision ve JSON schema motoru %99.98 uptime ile stabil çalışıyor. Ortalama yanıt süresi: 1.2 sn.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  navBtn: {
    padding: 6,
  },
  navTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  adminHeaderBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  adminWelcome: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  adminName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#064E3B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34D399',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  kpiCard: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
  },
  kpiIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  kpiLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sectionSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 14,
  },
  chartList: {
    gap: 12,
  },
  chartItem: {},
  chartItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chartItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  chartItemPercent: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '700',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  userList: {
    gap: 10,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 14,
  },
  userAvatarBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userAvatarLetter: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  userInfoBox: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  userEmail: {
    fontSize: 11,
    color: '#94A3B8',
  },
  userMetaBox: {
    alignItems: 'flex-end',
  },
  userScans: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  userDate: {
    fontSize: 10,
    color: '#64748B',
  },
  healthCard: {
    backgroundColor: '#064E3B',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#059669',
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  healthTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ECFDF5',
  },
  healthDesc: {
    fontSize: 12,
    color: '#A7F3D0',
    lineHeight: 18,
  },
  unauthorizedBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  unauthorizedTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#EF4444',
    marginTop: 16,
    marginBottom: 8,
  },
  unauthorizedDesc: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  backHomeBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },
  backHomeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
