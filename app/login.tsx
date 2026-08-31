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
import { ChefHat, Mail, Lock, Sparkles, Shield, ArrowRight, Globe, Leaf } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(t('auth.loginErrorTitle'), t('auth.missingFields'));
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    setIsLoading(true);
    const res = await loginWithEmail(email, password);
    setIsLoading(false);

    if (res.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert(t('auth.loginErrorTitle'), res.error || 'Login failed.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    setIsLoading(true);
    const res = await loginWithGoogle();
    setIsLoading(false);

    if (res.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Google Sign-In', res.error || 'Google login failed.');
    }
  };

  const handleQuickDemoLogin = async (type: 'admin' | 'user') => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    setIsLoading(true);
    if (type === 'admin') {
      await loginWithEmail('admin@fridgechef.ai', 'admin123');
      router.replace('/(tabs)');
    } else {
      await loginWithEmail('chef@fridgechef.ai', 'chef123');
      router.replace('/(tabs)');
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* FULL-SCREEN CINEMATIC GOURMET BACKGROUND */}
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
        {/* Top Language Switcher Pill */}
        <View style={styles.topBar}>
          <View style={styles.brandEcoBadge}>
            <Leaf size={12} color="#5EEAD4" />
            <Text style={styles.brandEcoText}>Zero-Waste AI</Text>
          </View>

          <TouchableOpacity
            style={styles.langPillTop}
            activeOpacity={0.8}
            onPress={toggleLanguage}
          >
            <Globe size={13} color="#0F766E" />
            <Text style={styles.langPillText}>{language.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {/* Cinematic Branding Hero */}
        <View style={styles.brandHeader}>
          <View style={styles.logoCircleOuter}>
            <View style={styles.logoCircleInner}>
              <ChefHat size={36} color="#5EEAD4" />
            </View>
          </View>
          <Text style={styles.brandTitle}>FridgeChef AI</Text>
          <Text style={styles.brandSubtitle}>{t('auth.brandSubtitle')}</Text>
        </View>

        {/* GLASSMORPHIIC LOGIN CARD */}
        <View style={styles.glassCard}>
          <Text style={styles.cardHeading}>{t('auth.loginTitle')}</Text>
          <Text style={styles.cardSub}>{t('auth.loginSub')}</Text>

          {/* Google 1-Tap Login */}
          <TouchableOpacity
            style={styles.googleBtn}
            activeOpacity={0.88}
            onPress={handleGoogleLogin}
            disabled={isLoading}
          >
            <View style={styles.googleIconBadge}>
              <Text style={styles.googleIconLetter}>G</Text>
            </View>
            <Text style={styles.googleBtnText}>{t('auth.googleBtn')}</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t('auth.orEmail')}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email Input */}
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

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('auth.passwordLabel')}</Text>
            <View style={styles.inputWrapper}>
              <Lock size={17} color="#8A9C93" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="••••••••"
                placeholderTextColor="#687E74"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {/* Primary Submit Button */}
          <TouchableOpacity
            style={[styles.primaryBtn, isLoading && styles.primaryBtnDisabled]}
            activeOpacity={0.9}
            onPress={handleEmailLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#042F2E" />
            ) : (
              <View style={styles.btnContentRow}>
                <Text style={styles.primaryBtnText}>{t('auth.signInBtn')}</Text>
                <ArrowRight size={17} color="#042F2E" />
              </View>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>{t('auth.noAccount')} </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.footerLink}>{t('auth.signUpLink')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* QUICK DEMO TESTING WIDGET */}
        <View style={styles.demoWidget}>
          <View style={styles.demoHeader}>
            <Sparkles size={14} color="#5EEAD4" />
            <Text style={styles.demoTitle}>{t('auth.demoTitle')}</Text>
          </View>

          <View style={styles.demoButtonsRow}>
            <TouchableOpacity
              style={styles.demoBtnAdmin}
              activeOpacity={0.85}
              onPress={() => handleQuickDemoLogin('admin')}
              disabled={isLoading}
            >
              <Shield size={14} color="#FECDD3" />
              <Text style={styles.demoBtnAdminText}>{t('auth.adminLoginBtn')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoBtnChef}
              activeOpacity={0.85}
              onPress={() => handleQuickDemoLogin('user')}
              disabled={isLoading}
            >
              <ChefHat size={14} color="#5EEAD4" />
              <Text style={styles.demoBtnChefText}>{t('auth.chefLoginBtn')}</Text>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandEcoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.3)',
  },
  brandEcoText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#CCFBF1',
  },
  langPillTop: {
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
  brandHeader: {
    alignItems: 'center',
    marginBottom: 22,
  },
  logoCircleOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(94, 234, 212, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(94, 234, 212, 0.4)',
  },
  logoCircleInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#0F766E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5EEAD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.6,
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#CCFBF1',
    textAlign: 'center',
    paddingHorizontal: 16,
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
    marginBottom: 16,
  },
  cardHeading: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0D1714',
    letterSpacing: -0.4,
    marginBottom: 3,
  },
  cardSub: {
    fontSize: 12.5,
    color: '#556860',
    marginBottom: 18,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E1E6DF',
    borderRadius: 18,
    paddingVertical: 13,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  googleIconBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIconLetter: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
  },
  googleBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1E293B',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 11.5,
    color: '#9CA3AF',
    fontWeight: '600',
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
  primaryBtn: {
    backgroundColor: '#5EEAD4',
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  demoWidget: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  demoTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#CCFBF1',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  demoBtnAdmin: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  demoBtnAdminText: {
    color: '#FECDD3',
    fontWeight: '800',
    fontSize: 12,
  },
  demoBtnChef: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 118, 110, 0.35)',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.4)',
  },
  demoBtnChefText: {
    color: '#5EEAD4',
    fontWeight: '800',
    fontSize: 12,
  },
});
