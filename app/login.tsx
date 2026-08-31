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
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChefHat,
  Mail,
  Lock,
  Sparkles,
  Shield,
  ArrowRight,
  Globe,
  Leaf,
  ScanLine,
  Hourglass,
  Volume2,
  ChevronLeft,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();

  const [viewMode, setViewMode] = useState<'intro' | 'loginForm'>('intro');
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
        source={{
          uri: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=80',
        }}
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
            paddingBottom: Math.max(insets.bottom, 20) + 30,
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

        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <View style={styles.logoCircleOuter}>
            <View style={styles.logoCircleInner}>
              <ChefHat size={34} color="#5EEAD4" />
            </View>
          </View>
          <Text style={styles.brandTitle}>FridgeChef AI</Text>
        </View>

        {viewMode === 'intro' ? (
          /* =========================================================================
             VIEW 1: LUXURY PRODUCT INTRO & VALUE PROPOSITION HERO
             ========================================================================= */
          <View style={styles.introContainer}>
            {/* Catchy Value Headline */}
            <Text style={styles.introHeading}>
              {language === 'en'
                ? 'Turn Refrigerator Leftovers into Gourmet Feasts 🍳'
                : 'Buzdolabındaki Kalanları Gurme Lezzetlere Dönüştürün 🍳'}
            </Text>
            <Text style={styles.introSubheading}>
              {language === 'en'
                ? 'Snap a photo of your fridge, generate AI zero-waste recipes in 10 seconds, and save both your budget & the planet.'
                : 'Buzdolabını fotoğrafla, yapay zekayla 10 saniyede sıfır israf tarifler üret, ev ekonomini ve gezegeni koru.'}
            </Text>

            {/* 3 Bento Feature Highlights Cards */}
            <View style={styles.featuresStack}>
              <View style={styles.featurePillCard}>
                <View style={styles.featureIconHalo}>
                  <ScanLine size={16} color="#5EEAD4" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featureCardTitle}>
                    {language === 'en' ? 'Smart Vision AI Scanner' : 'Görsel Yapay Zeka Taraması'}
                  </Text>
                  <Text style={styles.featureCardDesc}>
                    {language === 'en'
                      ? 'Identifies cooked dishes & veggies from a single photo.'
                      : 'Tek fotoğrafla tencereleri, kalan yemekleri ve sebzeleri anında tanır.'}
                  </Text>
                </View>
              </View>

              <View style={styles.featurePillCard}>
                <View style={[styles.featureIconHalo, { backgroundColor: 'rgba(217, 119, 6, 0.18)' }]}>
                  <Hourglass size={16} color="#FBBF24" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featureCardTitle}>
                    {language === 'en' ? 'Pantry Expiry Radar' : 'Dolap Tazelik Radarı'}
                  </Text>
                  <Text style={styles.featureCardDesc}>
                    {language === 'en'
                      ? 'Prioritizes perishables before they spoil.'
                      : 'Bozulma riski olan gıdaları son kullanmadan önce kurtarır.'}
                  </Text>
                </View>
              </View>

              <View style={styles.featurePillCard}>
                <View style={[styles.featureIconHalo, { backgroundColor: 'rgba(59, 130, 246, 0.18)' }]}>
                  <Volume2 size={16} color="#93C5FD" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featureCardTitle}>
                    {language === 'en' ? 'Hands-Free Voice Chef' : 'Eller Serbest Sesli Şef'}
                  </Text>
                  <Text style={styles.featureCardDesc}>
                    {language === 'en'
                      ? 'Reads steps aloud so your hands stay clean in the kitchen.'
                      : 'Mutfakta elleriniz kirlenmeden tarif adımlarını sesli dinleyin.'}
                  </Text>
                </View>
              </View>
            </View>

            {/* ACTION DECK */}
            <View style={styles.actionDeck}>
              {/* Primary Launch / Explore Button */}
              <TouchableOpacity
                style={styles.primaryBtn}
                activeOpacity={0.9}
                onPress={() => handleQuickDemoLogin('user')}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#042F2E" />
                ) : (
                  <View style={styles.btnContentRow}>
                    <Text style={styles.primaryBtnText}>
                      {language === 'en' ? 'Get Started / Free Explore' : 'Hemen Başla / Keşfet'}
                    </Text>
                    <ArrowRight size={18} color="#042F2E" />
                  </View>
                )}
              </TouchableOpacity>

              {/* Secondary Email Login Switcher Button */}
              <TouchableOpacity
                style={styles.glassOutlineBtn}
                activeOpacity={0.88}
                onPress={() => {
                  try {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  } catch {}
                  setViewMode('loginForm');
                }}
              >
                <Mail size={16} color="#CCFBF1" />
                <Text style={styles.glassOutlineBtnText}>
                  {language === 'en' ? 'Sign In with Email' : 'E-Posta ile Giriş Yap'}
                </Text>
              </TouchableOpacity>

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
            </View>

            {/* Quick Demo Footer */}
            <View style={styles.demoButtonsRow}>
              <TouchableOpacity
                style={styles.demoBtnAdmin}
                activeOpacity={0.85}
                onPress={() => handleQuickDemoLogin('admin')}
                disabled={isLoading}
              >
                <Shield size={13} color="#FECDD3" />
                <Text style={styles.demoBtnAdminText}>{t('auth.adminLoginBtn')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.demoBtnChef}
                activeOpacity={0.85}
                onPress={() => handleQuickDemoLogin('user')}
                disabled={isLoading}
              >
                <ChefHat size={13} color="#5EEAD4" />
                <Text style={styles.demoBtnChefText}>{t('auth.chefLoginBtn')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* =========================================================================
             VIEW 2: DIRECT EMAIL & PASSWORD LOGIN FORM
             ========================================================================= */
          <View style={styles.glassCard}>
            {/* Back to Intro Button */}
            <TouchableOpacity
              style={styles.backToIntroBtn}
              onPress={() => {
                try {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                } catch {}
                setViewMode('intro');
              }}
            >
              <ChevronLeft size={16} color="#5EEAD4" />
              <Text style={styles.backToIntroText}>
                {language === 'en' ? 'Back to Overview' : 'Tanıtıma Dön'}
              </Text>
            </TouchableOpacity>

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
        )}
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
    marginBottom: 14,
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
    color: '#5EEAD4',
    letterSpacing: 0.3,
  },
  langPillTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  langPillText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0F766E',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoCircleOuter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(94, 234, 212, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(94, 234, 212, 0.4)',
    marginBottom: 8,
  },
  logoCircleInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0F766E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },

  /* INTRO STYLES */
  introContainer: {
    marginTop: 4,
  },
  introHeading: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  introSubheading: {
    fontSize: 13,
    color: '#A7F3D0',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  featuresStack: {
    gap: 10,
    marginBottom: 24,
  },
  featurePillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  featureIconHalo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(94, 234, 212, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureCardTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  featureCardDesc: {
    fontSize: 11.5,
    color: '#94A3B8',
    lineHeight: 15,
  },
  actionDeck: {
    gap: 10,
    marginBottom: 16,
  },
  glassOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(94, 234, 212, 0.35)',
    paddingVertical: 14,
    borderRadius: 18,
  },
  glassOutlineBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#CCFBF1',
  },

  /* FORM STYLES */
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 28,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  backToIntroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 12,
  },
  backToIntroText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  cardHeading: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0D1714',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 12.5,
    color: '#687E74',
    marginBottom: 16,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 18,
    paddingVertical: 12,
    gap: 10,
  },
  googleIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EA4335',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIconLetter: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  googleBtnText: {
    color: '#1F2937',
    fontSize: 13.5,
    fontWeight: '800',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 11.5,
    color: '#9CA3AF',
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0D1714',
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8F6',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6EBE8',
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0D1714',
    fontWeight: '600',
  },
  primaryBtn: {
    backgroundColor: '#5EEAD4',
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#5EEAD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryBtnDisabled: {
    opacity: 0.6,
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    color: '#042F2E',
    fontSize: 14.5,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  footerText: {
    fontSize: 12.5,
    color: '#687E74',
  },
  footerLink: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0F766E',
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  demoBtnAdmin: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.35)',
    paddingVertical: 10,
    borderRadius: 14,
  },
  demoBtnAdminText: {
    color: '#FECDD3',
    fontSize: 11.5,
    fontWeight: '800',
  },
  demoBtnChef: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(94, 234, 212, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.35)',
    paddingVertical: 10,
    borderRadius: 14,
  },
  demoBtnChefText: {
    color: '#5EEAD4',
    fontSize: 11.5,
    fontWeight: '800',
  },
});
