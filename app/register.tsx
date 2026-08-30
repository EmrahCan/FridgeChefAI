import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChefHat, User as UserIcon, Mail, Lock, Sparkles, ArrowLeft, Check } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import * as Haptics from 'expo-haptics';

const DIETARY_CHOICES = [
  'Vejetaryen 🥬',
  'Vegan 🌱',
  'Glutensiz 🌾',
  'Laktozsuz 🥛',
  'Fit / Düşük Kalori 🥗',
];

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleDietary = (item: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setSelectedDietary((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Eksik Alanlar', 'Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    setIsLoading(true);
    const res = await register(name, email, password, selectedDietary);
    setIsLoading(false);

    if (res.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Kayıt Hatası', res.error || 'Kayıt işlemi başarısız.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Yeni Şef Kaydı 👨‍🍳</Text>
          <Text style={styles.subtitle}>
            Kişiselleştirilmiş sıfır israf tariflerine hemen başlayın.
          </Text>
        </View>

        <View style={styles.card}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Ad Soyad</Text>
            <View style={styles.inputWrapper}>
              <UserIcon size={18} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Ahmet Yılmaz"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>E-Posta Adresi</Text>
            <View style={styles.inputWrapper}>
              <Mail size={18} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="ahmet@mail.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Şifre</Text>
            <View style={styles.inputWrapper}>
              <Lock size={18} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="En az 4 karakter"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {/* Dietary Options */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Beslenme Tercihiniz (İsteğe Bağlı)</Text>
            <View style={styles.dietaryWrap}>
              {DIETARY_CHOICES.map((choice) => {
                const isSelected = selectedDietary.includes(choice);
                return (
                  <TouchableOpacity
                    key={choice}
                    style={[styles.dietaryChip, isSelected && styles.dietaryChipSelected]}
                    onPress={() => toggleDietary(choice)}
                  >
                    <Text
                      style={[styles.dietaryText, isSelected && styles.dietaryTextSelected]}
                    >
                      {choice}
                    </Text>
                    {isSelected && <Check size={14} color="#059669" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>Hesabı Oluştur & Başla</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginPromptRow}>
            <Text style={styles.promptText}>Zaten üye misiniz?</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLinkText}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  backBtn: {
    padding: 8,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  dietaryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dietaryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
  },
  dietaryChipSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  dietaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  dietaryTextSelected: {
    color: '#065F46',
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: {
    backgroundColor: '#6EE7B7',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  loginPromptRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 18,
  },
  promptText: {
    fontSize: 13,
    color: '#6B7280',
  },
  loginLinkText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#10B981',
  },
});
