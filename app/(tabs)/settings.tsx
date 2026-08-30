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
  User as UserIcon,
  ChevronRight,
} from 'lucide-react-native';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import * as Haptics from 'expo-haptics';

const DIETARY_OPTIONS = [
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
    Alert.alert('Başarılı', 'Gemini API anahtarı başarıyla güncellendi.');
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
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Çıkış Yap',
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
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Ayarlar & Profil</Text>
        <Text style={styles.subtitle}>Hesap, AI ve beslenme tercihlerinizi yönetin.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        {user && (
          <View style={styles.profileCard}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarLetter}>{user.name[0] || 'U'}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
              <View style={[styles.roleBadge, user.role === 'admin' ? styles.adminRoleBadge : styles.userRoleBadge]}>
                <Text style={[styles.roleBadgeText, user.role === 'admin' ? styles.adminRoleText : styles.userRoleText]}>
                  {user.role === 'admin' ? '👑 Yönetici (Admin)' : '👨‍🍳 Şef Üye'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Admin Dashboard Entry Button (If Admin) */}
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
                <Text style={styles.adminAccessTitle}>Yönetici Paneline Git</Text>
                <Text style={styles.adminAccessSub}>Kullanıcılar, taramalar ve sistem KPI'ları</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#FEF08A" />
          </TouchableOpacity>
        )}

        {/* Section 1: Gemini AI Key */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Key size={18} color="#10B981" />
            <Text style={styles.cardTitle}>Google Gemini Vision API</Text>
          </View>
          <Text style={styles.cardDesc}>
            Canlı fotoğraf analizi için kendi ücretsiz Google Gemini API anahtarınızı tanımlayabilirsiniz.
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="AIzaSy..."
              placeholderTextColor="#9CA3AF"
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
                <Text style={styles.saveKeyBtnText}>Kaydedildi!</Text>
              </View>
            ) : (
              <Text style={styles.saveKeyBtnText}>API Anahtarını Kaydet</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Section 2: Dietary Restrictions */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Sparkles size={18} color="#F97316" />
            <Text style={styles.cardTitle}>Beslenme & Diyet Tercihleri</Text>
          </View>
          <Text style={styles.cardDesc}>
            Yapay zekanın üreteceği tariflerde bu tercihleriniz otomatik olarak dikkate alınır:
          </Text>

          <View style={styles.dietaryList}>
            {DIETARY_OPTIONS.map((opt) => {
              const isSelected = dietary.includes(opt);
              return (
                <TouchableOpacity
                  key={opt}
                  style={[styles.dietaryItem, isSelected && styles.dietaryItemSelected]}
                  onPress={() => toggleDietary(opt)}
                >
                  <Text
                    style={[
                      styles.dietaryText,
                      isSelected && styles.dietaryTextSelected,
                    ]}
                  >
                    {opt}
                  </Text>
                  {isSelected && <Check size={16} color="#059669" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section 3: App & Store Info */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Leaf size={18} color="#059669" />
            <Text style={styles.cardTitle}>FridgeChef AI Hakkında</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sürüm</Text>
            <Text style={styles.infoValue}>1.0.0 (Build 1)</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Platform</Text>
            <Text style={styles.infoValue}>iOS & Android Ready 📱</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Misyon</Text>
            <Text style={styles.infoValue}>Sıfır Gıda İsrafı 🌱</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color="#EF4444" />
          <Text style={styles.logoutBtnText}>Oturumu Kapat (Çıkış Yap)</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 50,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  avatarBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#10B981',
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
    color: '#111827',
  },
  profileEmail: {
    fontSize: 12,
    color: '#6B7280',
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
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
  },
  userRoleBadge: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  adminRoleText: {
    color: '#DC2626',
  },
  userRoleText: {
    color: '#059669',
  },
  adminAccessBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 20,
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
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    color: '#111827',
  },
  cardDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 14,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  saveKeyBtn: {
    backgroundColor: '#10B981',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveKeyBtnSuccess: {
    backgroundColor: '#059669',
  },
  saveKeyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
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
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dietaryItemSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  dietaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  dietaryTextSelected: {
    color: '#065F46',
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 6,
  },
  logoutBtnText: {
    color: '#DC2626',
    fontWeight: '800',
    fontSize: 14,
  },
});
