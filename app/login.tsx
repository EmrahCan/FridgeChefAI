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
import { ChefHat, Mail, Lock, Sparkles, Shield, ArrowRight, Globe } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const router = useRouter();
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Language Switcher Pill in Login Top Right */}
        <TouchableOpacity
          style={styles.langPillTop}
          activeOpacity={0.8}
          onPress={toggleLanguage}
        >
          <Globe size={13} color="#0F766E" />
          <Text style={styles.langPillText}>{language.toUpperCase()}</Text>
        </TouchableOpacity>

        {/* Editorial Luxury Branding Header */}
        <View style={styles.brandBox}>
          <LinearGradient
            colors={['#0F766E', '#064E3B']}
            style={styles.logoBadge}
          >
            <ChefHat size={40} color="#5EEAD4" />
          </LinearGradient>
          <Text style={styles.brandTitle}>FridgeChef AI</Text>
          <Text style={styles.brandSubtitle}>
            {t('auth.brandSubtitle')}
          </Text>
        </View>

        {/* Auth Glass Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('auth.loginTitle')}</Text>
          <Text style={styles.cardSub}>{t('auth.loginSub')}</Text>

          {/* Google Sign In Button */}
          <TouchableOpacity
            style={styles.googleBtn}
            activeOpacity={0.85}
            onPress={handleGoogleLogin}
            disabled={isLoading}
          >
            <View style={styles.googleGBox}>
              <Text style={styles.googleG}>G</Text>
            </View>
            <Text style={styles.googleBtnText}>{t('auth.googleBtn')}</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t('auth.orEmail')}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('auth.emailLabel')}</Text>
            <View style={styles.inputWrapper}>
              <Mail size={17} color="#7D9087" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="chef@mail.com"
                placeholderTextColor="#9CA3AF"
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
              <Lock size={17} color="#7D9087" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
            activeOpacity={0.88}
            onPress={handleEmailLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={styles.btnRow}>
                <Text style={styles.submitBtnText}>{t('auth.signInBtn')}</Text>
                <ArrowRight size={18} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.registerPromptRow}>
            <Text style={styles.promptText}>{t('auth.noAccount')}</Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.registerLinkText}>{t('auth.signUpLink')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Demo Fast Login Box */}
        <View style={styles.demoCard}>
          <Text style={styles.demoTitle}>{t('auth.demoTitle')}</Text>
          <View style={styles.demoButtonsRow}>
            <TouchableOpacity
              style={[styles.demoBtn, styles.demoAdminBtn]}
              activeOpacity={0.8}
              onPress={() => handleQuickDemoLogin('admin')}
            >
              <Shield size={15} color="#BE123C" />
              <Text style={styles.demoAdminBtnText}>{t('auth.adminLoginBtn')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoBtn, styles.demoUserBtn]}
              activeOpacity={0.8}
              onPress={() => handleQuickDemoLogin('user')}
            >
              <ChefHat size={15} color="#0F766E" />
              <Text style={styles.demoUserBtnText}>{t('auth.chefLoginBtn')}</Text>
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
  langPillTop: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#99F6E4',
    marginBottom: 6,
  },
  langPillText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#0F766E',
  },
  brandBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    width: 78,
    height: 78,
    borderRadius: 39,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0D1714',
    letterSpacing: -0.8,
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#556860',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
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
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0D1714',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    color: '#687E74',
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
    paddingVertical: 13,
    borderRadius: 18,
    marginBottom: 18,
  },
  googleGBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleG: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
  },
  googleBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1F2937',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E1E6DF',
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 11.5,
    color: '#8A9C93',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 14,
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
  submitBtn: {
    backgroundColor: '#0F766E',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  submitBtnDisabled: {
    backgroundColor: '#5EEAD4',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  registerPromptRow: {
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
  registerLinkText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  demoCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E1E6DF',
  },
  demoTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#7D9087',
    marginBottom: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  demoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
  },
  demoAdminBtn: {
    backgroundColor: '#FFE4E6',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  demoAdminBtnText: {
    color: '#BE123C',
    fontWeight: '800',
    fontSize: 12.5,
  },
  demoUserBtn: {
    backgroundColor: '#CCFBF1',
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  demoUserBtnText: {
    color: '#0F766E',
    fontWeight: '800',
    fontSize: 12.5,
  },
});
