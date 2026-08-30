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
import { ChefHat, Mail, Lock, Sparkles, Shield, ArrowRight } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const router = useRouter();
  const { loginWithEmail, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Eksik Bilgi', 'Lütfen e-posta ve şifrenizi girin.');
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
      Alert.alert('Giriş Hatası', res.error || 'Giriş yapılamadı.');
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
      Alert.alert('Google Girişi', res.error || 'Google ile giriş başarısız.');
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
        {/* Branding & Logo */}
        <View style={styles.brandBox}>
          <View style={styles.iconCircle}>
            <ChefHat size={42} color="#FFFFFF" />
          </View>
          <Text style={styles.brandTitle}>FridgeChef AI</Text>
          <Text style={styles.brandSubtitle}>
            Buzdolabındaki kalan yemeklerden yapay zeka ile gurme tarifler 🍳
          </Text>
        </View>

        {/* Auth Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>Üye Girişi</Text>
          <Text style={styles.cardHeaderSub}>
            Lütfen devam etmek için hesabınıza giriş yapın.
          </Text>

          {/* Google Sign In Button */}
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={handleGoogleLogin}
            disabled={isLoading}
          >
            <View style={styles.googleIconBadge}>
              <Text style={styles.googleG}>G</Text>
            </View>
            <Text style={styles.googleBtnText}>Google ile Devam Et</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>veya e-posta ile</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>E-Posta Adresi</Text>
            <View style={styles.inputWrapper}>
              <Mail size={18} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="ornek@mail.com"
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
            <Text style={styles.inputLabel}>Şifre</Text>
            <View style={styles.inputWrapper}>
              <Lock size={18} color="#9CA3AF" style={styles.inputIcon} />
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
            onPress={handleEmailLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={styles.btnRow}>
                <Text style={styles.submitBtnText}>Giriş Yap</Text>
                <ArrowRight size={18} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.registerPromptRow}>
            <Text style={styles.promptText}>Hesabınız yok mu?</Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.registerLinkText}>Yeni Üye Kaydı</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Demo Fast Login Box */}
        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>⚡ Simülatör Hızlı Test Girişleri</Text>
          <View style={styles.demoButtonsRow}>
            <TouchableOpacity
              style={[styles.demoBtn, styles.demoAdminBtn]}
              onPress={() => handleQuickDemoLogin('admin')}
            >
              <Shield size={16} color="#DC2626" />
              <Text style={styles.demoAdminBtnText}>👑 Admin Girişi</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoBtn, styles.demoUserBtn]}
              onPress={() => handleQuickDemoLogin('user')}
            >
              <ChefHat size={16} color="#059669" />
              <Text style={styles.demoUserBtnText}>👨‍🍳 Şef Girişi</Text>
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
  brandBox: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  cardHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  cardHeaderSub: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 18,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingVertical: 13,
    borderRadius: 16,
    marginBottom: 18,
  },
  googleIconBadge: {
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
    fontSize: 14,
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
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 14,
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
  submitBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: {
    backgroundColor: '#6EE7B7',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
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
    color: '#6B7280',
  },
  registerLinkText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#10B981',
  },
  demoBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
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
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  demoAdminBtnText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 13,
  },
  demoUserBtn: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  demoUserBtnText: {
    color: '#059669',
    fontWeight: '700',
    fontSize: 13,
  },
});
