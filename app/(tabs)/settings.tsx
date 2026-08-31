import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Key,
  Sparkles,
  Check,
  Leaf,
  Shield,
  LogOut,
  Globe,
  ChevronRight,
  Sliders,
  FileText,
  Trash2,
  ChefHat,
  Award,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import * as Haptics from 'expo-haptics';

interface DietaryItem {
  id: string;
  key: string;
}

const DIETARY_ITEMS: DietaryItem[] = [
  { id: 'vegetarian', key: 'settings.dietary.vegetarian' },
  { id: 'vegan', key: 'settings.dietary.vegan' },
  { id: 'gluten_free', key: 'settings.dietary.gluten_free' },
  { id: 'lactose_free', key: 'settings.dietary.lactose_free' },
  { id: 'low_carb', key: 'settings.dietary.low_carb' },
  { id: 'mild', key: 'settings.dietary.mild' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [apiKey, setApiKey] = useState('');
  const [dietary, setDietary] = useState<string[]>([]);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  useEffect(() => {
    loadPrefs();
  }, []);

  const loadPrefs = async () => {
    const prefs = await StorageService.getUserPreferences();
    setApiKey(prefs.geminiApiKey || '');
    setDietary(prefs.dietaryRestrictions || []);
  };

  const handleSaveApiKey = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}

    await StorageService.saveUserPreferences({
      geminiApiKey: apiKey.trim(),
    });

    setIsSavedSuccess(true);
    setTimeout(() => setIsSavedSuccess(false), 2500);
    Alert.alert(t('settings.savedSuccess'), language === 'en' ? 'API key updated successfully.' : 'API anahtarı başarıyla güncellendi.');
  };

  const toggleDietary = async (id: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    const updated = dietary.includes(id)
      ? dietary.filter((d) => d !== id)
      : [...dietary, id];

    setDietary(updated);
    await StorageService.saveUserPreferences({ dietaryRestrictions: updated });
  };

  const handleClearCache = () => {
    Alert.alert(
      t('settings.clearCacheConfirmTitle'),
      t('settings.clearCacheConfirmMsg'),
      [
        { text: t('settings.cancel'), style: 'cancel' },
        {
          text: t('settings.clearCacheBtn'),
          style: 'destructive',
          onPress: async () => {
            try {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            } catch {}
            await StorageService.saveUserStats({
              totalMealsCooked: 0,
              totalWasteSavedKg: 0,
              estimatedMoneySavedTL: 0,
            });
            Alert.alert(t('settings.savedSuccess'), t('settings.cacheClearedMsg'));
          },
        },
      ]
    );
  };

  const showPrivacyPolicy = () => {
    Alert.alert(
      t('settings.privacyPolicy'),
      language === 'en'
        ? 'FridgeChef AI strictly respects your privacy. Photos captured in the app are processed anonymously and are never stored or sold to third parties.'
        : 'FridgeChef AI gizliliğinize tam saygı duyar. Çektiğiniz buzdolabı fotoğrafları yalnızca anlık yemek tespiti için işlenir ve asla üçüncü taraflarla paylaşılmaz.'
    );
  };

  const showTerms = () => {
    Alert.alert(
      t('settings.termsOfService'),
      language === 'en'
        ? 'By using FridgeChef AI, you agree that AI-suggested recipes are culinary recommendations. Always inspect food freshness and allergies before consumption.'
        : 'FridgeChef AI kullanarak, yapay zeka tariflerinin öneri niteliğinde olduğunu, tüketimden önce gıda tazeliğini ve alerjenleri kontrol edeceğinizi kabul etmiş olursunuz.'
    );
  };

  const handleLogout = () => {
    Alert.alert(
      t('settings.logoutConfirmTitle'),
      t('settings.logoutConfirmMsg'),
      [
        { text: t('settings.cancel'), style: 'cancel' },
        {
          text: t('settings.logoutBtn'),
          style: 'destructive',
          onPress: async () => {
            try {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            } catch {}
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.topHeader}>
          <Text style={styles.topHeaderLabel}>
            {language === 'en' ? 'CHEF WORKSPACE' : 'ŞEF PROFİLİ & AYARLAR'}
          </Text>
          <Text style={styles.topHeaderTitle}>
            {language === 'en' ? 'Account & Preferences ⚙️' : 'Hesap & Tercihler ⚙️'}
          </Text>
        </View>

        {/* LUXURY BENTO HERO: USER PROFILE */}
        {user && (
          <View style={styles.heroProfileCard}>
            <LinearGradient
              colors={['#0F4A3E', '#062B23']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroProfileGradient}
            >
              <View style={styles.glowSphere} />

              <View style={styles.profileMainRow}>
                <View style={styles.avatarHalo}>
                  <View style={styles.avatarInner}>
                    <Text style={styles.avatarLetter}>{user.name[0] || 'C'}</Text>
                  </View>
                </View>

                <View style={styles.profileTextInfo}>
                  <Text style={styles.profileName}>{user.name}</Text>
                  <Text style={styles.profileEmail}>{user.email}</Text>
                  <View style={[styles.roleBadge, user.role === 'admin' ? styles.adminBadge : styles.chefBadge]}>
                    <Text style={[styles.roleBadgeText, user.role === 'admin' ? styles.adminBadgeText : styles.chefBadgeText]}>
                      {user.role === 'admin' ? '👑 Executive Admin' : '👨‍🍳 Certified Master Chef'}
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Admin Dashboard Access (If Admin) */}
        {user?.role === 'admin' && (
          <TouchableOpacity
            style={styles.adminAccessBtn}
            activeOpacity={0.88}
            onPress={() => router.push('/admin')}
          >
            <View style={styles.adminAccessLeft}>
              <View style={styles.adminAccessIcon}>
                <Shield size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.adminAccessTitle}>{t('settings.adminDashboardBtn')}</Text>
                <Text style={styles.adminAccessSub}>{t('settings.adminDashboardSub')}</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#FEF08A" />
          </TouchableOpacity>
        )}

        {/* BENTO CARD: LANGUAGE SELECTOR */}
        <View style={styles.bentoCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconBox}>
              <Globe size={16} color="#0F766E" />
            </View>
            <Text style={styles.cardTitle}>{t('settings.languageTitle')}</Text>
          </View>

          <View style={styles.langSwitchRow}>
            <TouchableOpacity
              style={[styles.langOptionBtn, language === 'en' && styles.langOptionBtnSelected]}
              activeOpacity={0.85}
              onPress={() => setLanguage('en')}
            >
              <Text style={styles.langFlag}>🇬🇧</Text>
              <Text style={[styles.langName, language === 'en' && styles.langNameSelected]}>
                English (Primary)
              </Text>
              {language === 'en' && <Check size={16} color="#0F766E" />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.langOptionBtn, language === 'tr' && styles.langOptionBtnSelected]}
              activeOpacity={0.85}
              onPress={() => setLanguage('tr')}
            >
              <Text style={styles.langFlag}>🇹🇷</Text>
              <Text style={[styles.langName, language === 'tr' && styles.langNameSelected]}>
                Türkçe
              </Text>
              {language === 'tr' && <Check size={16} color="#0F766E" />}
            </TouchableOpacity>
          </View>
        </View>

        {/* BENTO CARD: DIETARY RESTRICTIONS */}
        <View style={styles.bentoCard}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBox, { backgroundColor: '#FFEDD5' }]}>
              <Sparkles size={16} color="#EA580C" />
            </View>
            <Text style={styles.cardTitle}>{t('settings.dietaryTitle')}</Text>
          </View>
          <Text style={styles.cardDesc}>{t('settings.dietaryDesc')}</Text>

          <View style={styles.dietaryList}>
            {DIETARY_ITEMS.map((item) => {
              const isSelected = dietary.includes(item.id);
              const label = t(item.key);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.dietaryItem, isSelected && styles.dietaryItemSelected]}
                  activeOpacity={0.85}
                  onPress={() => toggleDietary(item.id)}
                >
                  <Text style={[styles.dietaryText, isSelected && styles.dietaryTextSelected]}>
                    {label}
                  </Text>
                  {isSelected && <Check size={16} color="#0F766E" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* BENTO CARD: AI KEY CONFIGURATION */}
        <View style={styles.bentoCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconBox}>
              <Key size={16} color="#0F766E" />
            </View>
            <Text style={styles.cardTitle}>{t('settings.geminiKeyTitle')}</Text>
          </View>
          <Text style={styles.cardDesc}>{t('settings.geminiKeyDesc')}</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="AIzaSy..."
              placeholderTextColor="#8A9C93"
              value={apiKey}
              onChangeText={setApiKey}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveKeyBtn, isSavedSuccess && styles.saveKeyBtnSuccess]}
            activeOpacity={0.88}
            onPress={handleSaveApiKey}
          >
            {isSavedSuccess ? (
              <View style={styles.btnRow}>
                <Check size={16} color="#FFFFFF" />
                <Text style={styles.saveKeyBtnText}>{t('settings.savedSuccess')}</Text>
              </View>
            ) : (
              <Text style={styles.saveKeyBtnText}>{t('settings.saveKeyBtn')}</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* BENTO CARD: APP & COOKING PREFERENCES */}
        <View style={styles.bentoCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconBox}>
              <Sliders size={16} color="#0F766E" />
            </View>
            <Text style={styles.cardTitle}>{t('settings.appPreferencesTitle')}</Text>
          </View>

          {/* Units Selection */}
          <Text style={styles.preferenceLabel}>{t('settings.unitsTitle')}</Text>
          <View style={styles.unitsRow}>
            <TouchableOpacity
              style={[styles.unitBtn, unitSystem === 'metric' && styles.unitBtnSelected]}
              onPress={() => setUnitSystem('metric')}
            >
              <Text style={[styles.unitBtnText, unitSystem === 'metric' && styles.unitBtnTextSelected]}>
                {t('settings.metricUnits')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitBtn, unitSystem === 'imperial' && styles.unitBtnSelected]}
              onPress={() => setUnitSystem('imperial')}
            >
              <Text style={[styles.unitBtnText, unitSystem === 'imperial' && styles.unitBtnTextSelected]}>
                {t('settings.imperialUnits')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Haptics Switch */}
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>{t('settings.hapticsTitle')}</Text>
              <Text style={styles.switchDesc}>{t('settings.hapticsDesc')}</Text>
            </View>
            <Switch
              value={hapticsEnabled}
              onValueChange={setHapticsEnabled}
              trackColor={{ false: '#D1D5DB', true: '#5EEAD4' }}
              thumbColor={hapticsEnabled ? '#0F766E' : '#F4F3F4'}
            />
          </View>
        </View>

        {/* BENTO CARD: LEGAL & PRIVACY */}
        <View style={styles.bentoCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconBox}>
              <FileText size={16} color="#0F766E" />
            </View>
            <Text style={styles.cardTitle}>{t('settings.legalTitle')}</Text>
          </View>

          <TouchableOpacity style={styles.legalRow} onPress={showPrivacyPolicy}>
            <Text style={styles.legalRowText}>{t('settings.privacyPolicy')}</Text>
            <ChevronRight size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.legalRow} onPress={showTerms}>
            <Text style={styles.legalRowText}>{t('settings.termsOfService')}</Text>
            <ChevronRight size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* BENTO CARD: APP STORE INFO */}
        <View style={styles.bentoCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconBox}>
              <Leaf size={16} color="#0F766E" />
            </View>
            <Text style={styles.cardTitle}>{t('settings.aboutTitle')}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('settings.version')}</Text>
            <Text style={styles.infoValue}>1.0.0 (Build 1)</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('settings.platform')}</Text>
            <Text style={styles.infoValue}>{t('settings.platformValue')}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('settings.mission')}</Text>
            <Text style={styles.infoValue}>{t('settings.missionValue')}</Text>
          </View>
        </View>

        {/* RESET CACHE BUTTON */}
        <TouchableOpacity style={styles.clearCacheBtn} activeOpacity={0.85} onPress={handleClearCache}>
          <Trash2 size={15} color="#6B7280" />
          <Text style={styles.clearCacheBtnText}>{t('settings.clearCacheBtn')}</Text>
        </TouchableOpacity>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.88} onPress={handleLogout}>
          <LogOut size={17} color="#BE123C" />
          <Text style={styles.logoutBtnText}>{t('settings.logoutBtn')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8F6',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 50,
  },
  topHeader: {
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  topHeaderLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  topHeaderTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0D1714',
    letterSpacing: -0.6,
  },
  heroProfileCard: {
    borderRadius: 28,
    marginBottom: 18,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 6,
  },
  heroProfileGradient: {
    borderRadius: 28,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  glowSphere: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(94, 234, 212, 0.2)',
  },
  profileMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarHalo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(94, 234, 212, 0.4)',
  },
  avatarInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0F766E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  profileTextInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  profileEmail: {
    fontSize: 12,
    color: '#CCFBF1',
    marginTop: 2,
    marginBottom: 6,
    opacity: 0.9,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 10,
  },
  adminBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  chefBadge: {
    backgroundColor: 'rgba(94, 234, 212, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.35)',
  },
  roleBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  adminBadgeText: {
    color: '#FECDD3',
  },
  chefBadgeText: {
    color: '#5EEAD4',
  },
  adminAccessBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 22,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  adminAccessLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adminAccessIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminAccessTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  adminAccessSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  bentoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E1E6DF',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardIconBox: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#0D1714',
    letterSpacing: -0.2,
  },
  cardDesc: {
    fontSize: 12.5,
    color: '#556860',
    lineHeight: 18,
    marginBottom: 14,
  },
  langSwitchRow: {
    gap: 8,
  },
  langOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF8',
    borderWidth: 1.5,
    borderColor: '#E1E6DF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  langOptionBtnSelected: {
    backgroundColor: '#CCFBF1',
    borderColor: '#0F766E',
  },
  langFlag: {
    fontSize: 20,
    marginRight: 10,
  },
  langName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E36',
  },
  langNameSelected: {
    color: '#0F766E',
    fontWeight: '800',
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F8FAF8',
    borderWidth: 1.5,
    borderColor: '#E1E6DF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0D1714',
  },
  saveKeyBtn: {
    backgroundColor: '#0F766E',
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  saveKeyBtnSuccess: {
    backgroundColor: '#0B514B',
  },
  saveKeyBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dietaryList: {
    gap: 8,
  },
  dietaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAF8',
    borderWidth: 1.5,
    borderColor: '#E1E6DF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dietaryItemSelected: {
    backgroundColor: '#CCFBF1',
    borderColor: '#0F766E',
  },
  dietaryText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#2C3E36',
  },
  dietaryTextSelected: {
    color: '#0F766E',
    fontWeight: '800',
  },
  preferenceLabel: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#2C3E36',
    marginBottom: 8,
  },
  unitsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  unitBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F8FAF8',
    borderWidth: 1.5,
    borderColor: '#E1E6DF',
    alignItems: 'center',
  },
  unitBtnSelected: {
    backgroundColor: '#CCFBF1',
    borderColor: '#0F766E',
  },
  unitBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#687E74',
  },
  unitBtnTextSelected: {
    color: '#0F766E',
    fontWeight: '800',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F6F4',
  },
  switchTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0D1714',
  },
  switchDesc: {
    fontSize: 11.5,
    color: '#687E74',
    marginTop: 2,
  },
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F6F4',
  },
  legalRowText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#2C3E36',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F6F4',
  },
  infoLabel: {
    fontSize: 13,
    color: '#687E74',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#0D1714',
    fontWeight: '800',
  },
  clearCacheBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 13,
    borderRadius: 16,
    marginBottom: 12,
  },
  clearCacheBtnText: {
    color: '#4B5563',
    fontWeight: '700',
    fontSize: 13,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFE4E6',
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    paddingVertical: 15,
    borderRadius: 18,
    marginTop: 2,
    shadowColor: '#BE123C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  logoutBtnText: {
    color: '#BE123C',
    fontWeight: '800',
    fontSize: 14,
  },
});
