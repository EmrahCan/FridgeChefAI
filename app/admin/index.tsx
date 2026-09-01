import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
  Image,
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
  CheckCircle2,
  Lock,
  Trash2,
  ChevronRight,
  Zap,
  Globe,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { AdminService } from '../../services/adminService';
import { AuthService } from '../../services/authService';
import { AdminMetrics } from '../../types';
import * as Haptics from 'expo-haptics';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, [language]);

  const loadMetrics = async () => {
    try {
      const data = await AdminService.getMetrics(language);
      setMetrics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = (userId: string, userName: string, userEmail: string) => {
    if (userEmail === 'emrahcan@hotmail.com') {
      Alert.alert(
        language === 'en' ? 'Protected Account' : 'Korumalı Hesap',
        language === 'en' ? 'Main Executive Admin account cannot be deleted.' : 'Ana Yönetici hesabı silinemez.'
      );
      return;
    }

    Alert.alert(
      language === 'en' ? 'Delete User' : 'Kullanıcıyı Sil',
      language === 'en'
        ? `Are you sure you want to permanently delete ${userName} (${userEmail}) and all their data?`
        : `${userName} (${userEmail}) kullanıcısını ve tüm verilerini sistemden kalıcı olarak silmek istediğinize emin misiniz?`,
      [
        { text: language === 'en' ? 'Cancel' : 'Vazgeç', style: 'cancel' },
        {
          text: language === 'en' ? 'Delete User' : 'Kullanıcıyı Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            } catch {}
            await AuthService.deleteUserByAdmin(userId);
            await loadMetrics();
            Alert.alert(
              language === 'en' ? 'User Deleted' : 'Kullanıcı Silindi',
              language === 'en' ? 'User account has been removed.' : 'Kullanıcı hesabı başarıyla kaldırıldı.'
            );
          },
        },
      ]
    );
  };

  // Unauthorized Access Guard
  if (!user || user.role !== 'admin') {
    return (
      <View style={styles.safeArea}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=80' }}
          style={styles.ambientBackgroundImage}
        />
        <LinearGradient
          colors={['rgba(4, 31, 26, 0.70)', 'rgba(4, 47, 46, 0.88)', '#041F1A']}
          locations={[0, 0.45, 1]}
          style={styles.ambientGradientOverlay}
        />
        <View style={styles.unauthorizedBox}>
          <View style={styles.unauthorizedIconHalo}>
            <Lock size={40} color="#F87171" />
          </View>
          <Text style={styles.unauthorizedTitle}>{t('admin.unauthorizedTitle')}</Text>
          <Text style={styles.unauthorizedDesc}>{t('admin.unauthorizedDesc')}</Text>
          <TouchableOpacity
            style={styles.backHomeBtn}
            activeOpacity={0.88}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.backHomeBtnText}>{t('admin.backHome')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      {/* FULL CINEMATIC DARK GOURMET BACKGROUND */}
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=80',
        }}
        style={styles.ambientBackgroundImage}
      />
      <LinearGradient
        colors={['rgba(4, 31, 26, 0.70)', 'rgba(4, 47, 46, 0.88)', '#041F1A']}
        locations={[0, 0.45, 1]}
        style={styles.ambientGradientOverlay}
      />

      {/* TOP GLASSOID NAVBAR */}
      <View style={[styles.navBar, { paddingTop: Math.max(insets.top, 20) + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.navBackBtn}
          activeOpacity={0.8}
        >
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.navTitleRow}>
          <Shield size={16} color="#5EEAD4" />
          <Text style={styles.navTitle}>{t('admin.title')}</Text>
        </View>

        <View style={styles.statusBadge}>
          <View style={styles.statusPulseDot} />
          <Text style={styles.statusBadgeText}>{t('admin.systemActive')}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Math.max(insets.bottom, 20) + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* EXECUTIVE ADMIN HERO CARD */}
        <View style={styles.adminHeroCard}>
          <LinearGradient
            colors={['rgba(15, 118, 110, 0.45)', 'rgba(6, 44, 38, 0.85)', 'rgba(4, 31, 26, 0.95)']}
            locations={[0, 0.5, 1]}
            style={styles.adminHeroGradient}
          />
          <View style={styles.adminHeroContent}>
            <View style={styles.adminAvatarHalo}>
              <View style={styles.adminAvatarInner}>
                <Text style={styles.adminAvatarEmoji}>👑</Text>
              </View>
            </View>

            <View style={styles.adminHeroInfo}>
              <Text style={styles.adminWelcome}>{t('admin.welcome')}</Text>
              <Text style={styles.adminName}>{user.name}</Text>
              <Text style={styles.adminEmail}>{user.email}</Text>
            </View>
          </View>
        </View>

        {isLoading || !metrics ? (
          <ActivityIndicator size="large" color="#5EEAD4" style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* 4 LUXURY BENTO KPI METRICS */}
            <View style={styles.kpiGrid}>
              {/* Card 1: Users */}
              <View style={styles.kpiCard}>
                <View style={[styles.kpiIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.20)', borderColor: 'rgba(96, 165, 250, 0.4)' }]}>
                  <Users size={18} color="#60A5FA" />
                </View>
                <Text style={styles.kpiValue}>{metrics.totalUsers}</Text>
                <Text style={styles.kpiLabel}>{t('admin.kpiUsers')}</Text>
              </View>

              {/* Card 2: Scans */}
              <View style={styles.kpiCard}>
                <View style={[styles.kpiIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.20)', borderColor: 'rgba(94, 234, 212, 0.4)' }]}>
                  <Camera size={18} color="#5EEAD4" />
                </View>
                <Text style={styles.kpiValue}>{metrics.totalScans}</Text>
                <Text style={styles.kpiLabel}>{t('admin.kpiScans')}</Text>
              </View>

              {/* Card 3: Food Saved */}
              <View style={styles.kpiCard}>
                <View style={[styles.kpiIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.20)', borderColor: 'rgba(251, 191, 36, 0.4)' }]}>
                  <Leaf size={18} color="#FBBF24" />
                </View>
                <Text style={styles.kpiValue}>{metrics.totalWasteSavedTons} Ton</Text>
                <Text style={styles.kpiLabel}>{t('admin.kpiWasteSaved')} 🌱</Text>
              </View>

              {/* Card 4: AI Queries */}
              <View style={styles.kpiCard}>
                <View style={[styles.kpiIconBox, { backgroundColor: 'rgba(139, 92, 246, 0.20)', borderColor: 'rgba(167, 139, 250, 0.4)' }]}>
                  <Sparkles size={18} color="#A78BFA" />
                </View>
                <Text style={styles.kpiValue}>{metrics.activeAiQueriesToday}</Text>
                <Text style={styles.kpiLabel}>{t('admin.kpiAiQueries')}</Text>
              </View>
            </View>

            {/* BENTO CARD: POPULAR INGREDIENTS */}
            <View style={styles.bentoSectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBox}>
                  <TrendingUp size={16} color="#5EEAD4" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionTitle}>{t('admin.popularTitle')}</Text>
                  <Text style={styles.sectionSub}>{t('admin.popularSub')}</Text>
                </View>
              </View>

              <View style={styles.chartList}>
                {metrics.popularIngredients.map((item, idx) => (
                  <View key={idx} style={styles.chartItem}>
                    <View style={styles.chartItemHeader}>
                      <Text style={styles.chartItemName}>{item.name}</Text>
                      <Text style={styles.chartItemPercent}>%{item.percentage} ({item.count})</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${item.percentage * 2.5}%`,
                            backgroundColor: idx === 0 ? '#EF4444' : idx === 1 ? '#F97316' : '#5EEAD4',
                          },
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* BENTO CARD: REGISTERED USERS MANAGEMENT */}
            <View style={styles.bentoSectionCard}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.18)' }]}>
                  <Users size={16} color="#60A5FA" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionTitle}>{t('admin.recentUsersTitle')}</Text>
                  <Text style={styles.sectionSub}>
                    {language === 'en' ? 'Manage active registered chef accounts' : 'Kayıtlı kullanıcıları yönetin ve gerektiğinde silin'}
                  </Text>
                </View>
              </View>

              <View style={styles.userList}>
                {metrics.recentUsers.map((u) => (
                  <View key={u.id} style={styles.userRow}>
                    <View style={styles.userAvatarBox}>
                      <Text style={styles.userAvatarLetter}>{u.name[0] || 'U'}</Text>
                    </View>
                    <View style={styles.userInfoBox}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.userName}>{u.name}</Text>
                        {u.role === 'admin' && (
                          <View style={styles.adminPillTag}>
                            <Text style={styles.adminPillTagText}>ADMIN</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.userEmail}>{u.email}</Text>
                    </View>
                    <View style={styles.userMetaBox}>
                      <Text style={styles.userScans}>{u.scans} {t('admin.scansCount')}</Text>
                      <Text style={styles.userDate}>{u.joinedDate}</Text>
                    </View>

                    {u.email !== 'emrahcan@hotmail.com' ? (
                      <TouchableOpacity
                        style={styles.deleteUserBtn}
                        activeOpacity={0.75}
                        onPress={() => handleDeleteUser(u.id, u.name, u.email)}
                      >
                        <Trash2 size={14} color="#FDA4AF" />
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.adminBadgeSmall}>
                        <Text style={styles.adminBadgeSmallText}>👑</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* BENTO CARD: AI & SYSTEM HEALTH STATUS */}
            <View style={styles.healthCard}>
              <View style={styles.healthHeader}>
                <CheckCircle2 size={18} color="#5EEAD4" />
                <Text style={styles.healthTitle}>{t('admin.systemHealthTitle')}</Text>
              </View>
              <Text style={styles.healthDesc}>{t('admin.systemHealthDesc')}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#041F1A',
  },
  ambientBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.60,
    resizeMode: 'cover',
  },
  ambientGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  navBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.20)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  statusPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#5EEAD4',
  },
  statusBadgeText: {
    color: '#5EEAD4',
    fontSize: 11,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 18,
  },
  adminHeroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(94, 234, 212, 0.35)',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 4,
  },
  adminHeroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  adminHeroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 14,
  },
  adminAvatarHalo: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(254, 240, 138, 0.20)',
    borderWidth: 1.5,
    borderColor: 'rgba(251, 191, 36, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminAvatarInner: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#062C26',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminAvatarEmoji: {
    fontSize: 20,
  },
  adminHeroInfo: {
    flex: 1,
  },
  adminWelcome: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#5EEAD4',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  adminName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  adminEmail: {
    fontSize: 12,
    color: '#A7F3D0',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  kpiCard: {
    width: '48.5%',
    backgroundColor: 'rgba(6, 44, 38, 0.75)',
    borderWidth: 1.5,
    borderColor: 'rgba(94, 234, 212, 0.22)',
    borderRadius: 20,
    padding: 14,
  },
  kpiIconBox: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  kpiLabel: {
    fontSize: 11,
    color: '#CCFBF1',
    fontWeight: '700',
  },
  bentoSectionCard: {
    backgroundColor: 'rgba(6, 44, 38, 0.75)',
    borderWidth: 1.5,
    borderColor: 'rgba(94, 234, 212, 0.22)',
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  sectionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(15, 118, 110, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 1,
  },
  sectionSub: {
    fontSize: 11,
    color: '#A7F3D0',
  },
  chartList: {
    gap: 12,
  },
  chartItem: {
    gap: 6,
  },
  chartItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartItemName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chartItemPercent: {
    fontSize: 11.5,
    color: '#5EEAD4',
    fontWeight: '800',
  },
  progressBarBg: {
    height: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  userList: {
    gap: 9,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    padding: 12,
    borderRadius: 16,
  },
  userAvatarBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(15, 118, 110, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userAvatarLetter: {
    color: '#5EEAD4',
    fontWeight: '900',
    fontSize: 13,
  },
  userInfoBox: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  adminPillTag: {
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.5)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  adminPillTagText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#FDE68A',
  },
  userEmail: {
    fontSize: 11,
    color: '#A7F3D0',
    marginTop: 1,
  },
  userMetaBox: {
    alignItems: 'flex-end',
  },
  userScans: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#5EEAD4',
  },
  userDate: {
    fontSize: 9.5,
    color: '#9CA3AF',
    marginTop: 1,
  },
  deleteUserBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(239, 68, 68, 0.20)',
    borderWidth: 1,
    borderColor: 'rgba(253, 164, 175, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  adminBadgeSmall: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(254, 240, 138, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  adminBadgeSmallText: {
    fontSize: 11,
  },
  healthCard: {
    backgroundColor: 'rgba(6, 44, 38, 0.75)',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1.5,
    borderColor: 'rgba(94, 234, 212, 0.35)',
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 4,
  },
  healthTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  healthDesc: {
    fontSize: 11.5,
    color: '#CCFBF1',
    lineHeight: 16,
  },
  unauthorizedBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  unauthorizedIconHalo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(239, 68, 68, 0.20)',
    borderWidth: 1.5,
    borderColor: 'rgba(248, 113, 113, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  unauthorizedTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  unauthorizedDesc: {
    fontSize: 13,
    color: '#CCFBF1',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  backHomeBtn: {
    backgroundColor: '#0F766E',
    borderWidth: 1,
    borderColor: '#5EEAD4',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
  },
  backHomeBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13.5,
  },
});
