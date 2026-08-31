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
import { ChefHat, User as UserIcon, Mail, Lock, ArrowLeft, Check, Globe } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import * as Haptics from 'expo-haptics';

const DIETARY_CHOICES_EN = [
  'Vegetarian 🥬',
  'Vegan 🌱',
  'Gluten-Free 🌾',
  'Lactose-Free 🥛',
  'Fit & Low Cal 🥗',
];

const DIETARY_CHOICES_TR = [
  'Vejetaryen 🥬',
  'Vegan 🌱',
  'Glutensiz 🌾',
  'Laktozsuz 🥛',
  'Fit / Düşük Kalori 🥗',
];

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();

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
      Alert.alert(t('auth.registerErrorTitle'), t('auth.missingFields'));
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
      Alert.alert(t('auth.registerErrorTitle'), res.error || 'Registration failed.');
    }
  };

  const dietaryChoices = language === 'en' ? DIETARY_CHOICES_EN : DIETARY_CHOICES_TR;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topNavRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color="#0D1714" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.langPillTop} onPress={toggleLanguage}>
            <Globe size={13} color="#0F766E" />
            <Text style={styles.langPillText}>{language.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>{t('auth.registerTitle')}</Text>
          <Text style={styles.subtitle}>{t('auth.registerSub')}</Text>
        </View>

        <View style={styles.card}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('auth.fullNameLabel')}</Text>
            <View style={styles.inputWrapper}>
              <UserIcon size={17} color="#7D9087" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Alex Chef"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('auth.emailLabel')}</Text>
            <View style={styles.inputWrapper}>
              <Mail size={17} color="#7D9087" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="alex@mail.com"
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
            <Text style={styles.inputLabel}>{t('auth.passwordLabel')}</Text>
            <View style={styles.inputWrapper}>
              <Lock size={17} color="#7D9087" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder={t('auth.passwordMinHint')}
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {/* Dietary Options */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('auth.dietaryOptional')}</Text>
            <View style={styles.dietaryWrap}>
              {dietaryChoices.map((choice) => {
                const isSelected = selectedDietary.includes(choice);
                return (
                  <TouchableOpacity
                    key={choice}
                    style={[styles.dietaryChip, isSelected && styles.dietaryChipSelected]}
                    onPress={() => toggleDietary(choice)}
                  >
                    <Text style={[styles.dietaryText, isSelected && styles.dietaryTextSelected]}>
                      {choice}
                    </Text>
                    {isSelected && <Check size={14} color="#0F766E" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
            activeOpacity={0.88}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>{t('auth.createAccountBtn')}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginPromptRow}>
            <Text style={styles.promptText}>{t('auth.haveAccount')}</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLinkText}>{t('auth.signInBtn')}</Text>
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
    backgroundColor: '#F7F8F6',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backBtn: {
    padding: 6,
  },
  langPillTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  langPillText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#0F766E',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0D1714',
    letterSpacing: -0.6,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#556860',
    lineHeight: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E1E6DF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2C3E36',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF8',
    borderWidth: 1.5,
    borderColor: '#E1E6DF',
    borderRadius: 16,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0D1714',
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
    backgroundColor: '#F8FAF8',
    borderWidth: 1.5,
    borderColor: '#E1E6DF',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 14,
  },
  dietaryChipSelected: {
    backgroundColor: '#CCFBF1',
    borderColor: '#0F766E',
  },
  dietaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3E5049',
  },
  dietaryTextSelected: {
    color: '#0F766E',
  },
  submitBtn: {
    backgroundColor: '#0F766E',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  submitBtnDisabled: {
    backgroundColor: '#5EEAD4',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
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
    color: '#687E74',
  },
  loginLinkText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
});
