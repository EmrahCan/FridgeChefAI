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
} from 'lucide-react-native';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import * as Haptics from 'expo-haptics';

const DIETARY_OPTIONS_EN = [
  'Vegetarian 🥬',
  'Vegan 🌱',
  'Gluten-Free 🌾',
  'Lactose-Free 🥛',
  'Low Carb (Keto) 🥑',
  'Mild / Non-Spicy 🌶️',
];

const DIETARY_OPTIONS_TR = [
  'Vejetaryen 🥬',
  'Vegan 🌱',
  'Glutensiz 🌾',
  'Laktozsuz 🥛',
  'Düşük Karbonhidrat (Keto) 🥑',
  'Acı Sevmeyen 🌶️',
];

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [apiKey, setApiKey] = useState('');
  const [dietary, setDietary] = useState<string[]>([]);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

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
    Alert.alert(t('settings.savedSuccess'), 'Gemini API key updated.');
  };

  const toggleDietary = async (option: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    const updated = dietary.includes(option)
      ? dietary.filter((d) => d !== option)
      : [...dietary, option];

    setDietary(updated);
    await StorageService.saveUserPreferences({ dietaryRestrictions: updated });
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

  const dietaryChoices = language === 'en' ? DIETARY_OPTIONS_EN : DIETARY_OPTIONS_TR;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('settings.title')}</Text>
        <Text style={styles.subtitle}>{t('settings.subtitle')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        {user && (
          <View style={styles.profileCard}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarLetter}>{user.name[0] || 'C'}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
              <View style={[styles.roleBadge, user.role === 'admin' ? styles.adminRoleBadge : styles.userRoleBadge]}>
                <Text style={[styles.roleBadgeText, user.role === 'admin' ? styles.adminRoleText : styles.userRoleText]}>
                  {user.role === 'admin' ? '👑 Admin' : '👨‍🍳 Chef Member'}
                </Text>
              </View>
            </View>
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

        {/* Language Selection Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Globe size={18} color="#0F766E" />
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

        {/* Section 1: Gemini AI Key */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Key size={18} color="#0F766E" />
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

        {/* Section 2: Dietary Restrictions */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Sparkles size={18} color="#EA580C" />
            <Text style={styles.cardTitle}>{t('settings.dietaryTitle')}</Text>
          </View>
          <Text style={styles.cardDesc}>{t('settings.dietaryDesc')}</Text>

          <View style={styles.dietaryList}>
            {dietaryChoices.map((opt) => {
              const isSelected = dietary.includes(opt);
              return (
                <TouchableOpacity
                  key={opt}
                  style={[styles.dietaryItem, isSelected && styles.dietaryItemSelected]}
                  onPress={() => toggleDietary(opt)}
                >
                  <Text style={[styles.dietaryText, isSelected && styles.dietaryTextSelected]}>
                    {opt}
                  </Text>
                  {isSelected && <Check size={16} color="#0F766E" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section 3: App & Store Info */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Leaf size={18} color="#0F766E" />
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

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color="#BE123C" />
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
  header: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E6EBE8',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0D1714',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#556860',
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 50,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E1E6DF',
    marginBottom: 16,
  },
  avatarBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0F766E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D1714',
  },
  profileEmail: {
    fontSize: 12,
    color: '#687E74',
    marginTop: 2,
    marginBottom: 6,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  adminRoleBadge: {
    backgroundColor: '#FFE4E6',
    borderColor: '#FECDD3',
    borderWidth: 1,
  },
  userRoleBadge: {
    backgroundColor: '#CCFBF1',
    borderColor: '#99F6E4',
    borderWidth: 1,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  adminRoleText: {
    color: '#BE123C',
  },
  userRoleText: {
    color: '#0F766E',
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
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E1E6DF',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D1714',
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
    marginTop: 6,
  },
  logoutBtnText: {
    color: '#BE123C',
    fontWeight: '800',
    fontSize: 14,
  },
});
