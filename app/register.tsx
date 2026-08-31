import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChefHat, User as UserIcon, Mail, Lock, ArrowLeft, Check, Globe, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  const insets = useSafeAreaInsets();
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

  const dietaryList = language === 'en' ? DIETARY_CHOICES_EN : DIETARY_CHOICES_TR;

  return (
    <View style={styles.container}>
      {/* CINEMATIC BACKGROUND */}
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=80' }}
        style={styles.backgroundImage}
      />
      <LinearGradient
        colors={['rgba(4, 47, 46, 0.75)', 'rgba(6, 30, 25, 0.92)', '#041F1A']}
        locations={[0, 0.45, 1]}
        style={styles.gradientOverlay}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 20) + 12,
            paddingBottom: Math.max(insets.bottom, 20) + 24,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Navbar */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.langPill}
            activeOpacity={0.8}
            onPress={toggleLanguage}
          >
            <Globe size={13} color="#0F766E" />
            <Text style={styles.langPillText}>{language.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {/* Header Title */}
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <View style={styles.chefBadge}>
              <ChefHat size={13} color="#5EEAD4" />
              <Text style={styles.chefBadgeText}>New Master Chef</Text>
            </View>
          </View>
          <Text style={styles.title}>{t('auth.registerTitle')}</Text>
          <Text style={styles.subtitle}>{t('auth.registerSub')}</Text>
        </View>

        {/* GLASSMORPHIIC FORM CARD */}
        <View style={styles.glassCard}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('auth.fullNameLabel')}</Text>
            <View style={styles.inputWrapper}>
              <UserIcon size={17} color="#8A9C93" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Gordon Ramsay"
                placeholderTextColor="#687E74"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('auth.emailLabel')}</Text>
            <View style={styles.inputWrapper}>
              <Mail size={17} color="#8A9C93" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="chef@mail.com"
                placeholderTextColor="#687E74"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('auth.passwordLabel')}</Text>
            <View style={styles.inputWrapper}>
              <Lock size={17} color="#8A9C93" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder={t('auth.passwordMinHint')}
                placeholderTextColor="#687E74"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {/* Dietary Preferences Select */}
          <View style={styles.dietarySection}>
            <Text style={styles.inputLabel}>{t('auth.dietaryOptional')}</Text>
            <View style={styles.dietaryChipsWrapper}>
              {dietaryList.map((item) => {
                const isSelected = selectedDietary.includes(item);
                return (
                  <TouchableOpacity
                    key={item}
                    style={[styles.dietaryChip, isSelected && styles.dietaryChipSelected]}
                    activeOpacity={0.8}
                    onPress={() => toggleDietary(item)}
                  >
                    <Text style={[styles.dietaryChipText, isSelected && styles.dietaryChipTextSelected]}>
                      {item}
                    </Text>
                    {isSelected && <Check size={12} color="#0F766E" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Create Button */}
          <TouchableOpacity
            style={[styles.primaryBtn, isLoading && styles.primaryBtnDisabled]}
            activeOpacity={0.9}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#042F2E" />
            ) : (
              <Text style={styles.primaryBtnText}>{t('auth.createAccountBtn')}</Text>
            )}
          </TouchableOpacity>

          {/* Login Back Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>{t('auth.haveAccount')} </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.footerLink}>{t('auth.signInBtn')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#041F1A',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  langPillText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0F766E',
  },
  header: {
    marginBottom: 20,
  },
  badgeRow: {
    marginBottom: 6,
  },
  chefBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.3)',
  },
  chefBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#5EEAD4',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#CCFBF1',
    lineHeight: 18,
    opacity: 0.9,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 28,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 13,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2C3E36',
    marginBottom: 5,
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
    paddingVertical: 11,
    fontSize: 13.5,
    color: '#0D1714',
  },
  dietarySection: {
    marginBottom: 16,
  },
  dietaryChipsWrapper: {
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
    paddingVertical: 7,
    borderRadius: 12,
  },
  dietaryChipSelected: {
    backgroundColor: '#CCFBF1',
    borderColor: '#0F766E',
  },
  dietaryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#556860',
  },
  dietaryChipTextSelected: {
    color: '#0F766E',
    fontWeight: '800',
  },
  primaryBtn: {
    backgroundColor: '#5EEAD4',
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#5EEAD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryBtnDisabled: {
    opacity: 0.7,
  },
  primaryBtnText: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#042F2E',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12.5,
    color: '#687E74',
  },
  footerLink: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F766E',
  },
});
