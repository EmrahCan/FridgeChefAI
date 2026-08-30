import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  SafeAreaView,
  Platform,
} from 'react-native';
import {
  Key,
  ShieldCheck,
  Sparkles,
  Info,
  Check,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Leaf,
} from 'lucide-react-native';
import { StorageService } from '../../services/storageService';
import { UserPreferences } from '../../types';
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Ayarlar & Tercihler</Text>
        <Text style={styles.subtitle}>AI ve beslenme tercihlerinizi özelleştirin.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section 1: Gemini AI Key */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Key size={18} color="#10B981" />
            <Text style={styles.cardTitle}>Google Gemini Vision API</Text>
          </View>
          <Text style={styles.cardDesc}>
            Canlı fotoğraf analizi için kendi ücretsiz Google Gemini API anahtarınızı tanımlayabilirsiniz. Boş bırakıldığında akıllı yerel şef motoru kullanılır.
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
    paddingBottom: 40,
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
});
