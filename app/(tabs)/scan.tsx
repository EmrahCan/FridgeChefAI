import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  Camera,
  Image as ImageIcon,
  Sparkles,
  ScanLine,
  Info,
  ChefHat,
  Zap,
  ArrowRight,
  ShieldCheck,
  Flame,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GeminiService } from '../../services/geminiService';
import { useLanguage } from '../../context/LanguageContext';
import { getDemoPresets, DemoPreset } from '../../constants/MockData';
import * as Haptics from 'expo-haptics';

export default function ScanScreen() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStatus, setAnalysisStatus] = useState<string>('');

  const presets = getDemoPresets(language);

  const pickImageFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(t('scan.permissionTitle'), t('scan.galleryPermissionMsg'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedImage(asset.uri);
        analyzePhoto(asset.base64 || '', asset.uri);
      }
    } catch (e) {
      console.error(e);
      Alert.alert(t('scan.errorTitle'), t('scan.scanError'));
    }
  };

  const takePhotoWithCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(t('scan.permissionTitle'), t('scan.cameraPermissionMsg'));
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedImage(asset.uri);
        analyzePhoto(asset.base64 || '', asset.uri);
      }
    } catch (e) {
      console.error(e);
      Alert.alert(t('scan.errorTitle'), t('scan.scanError'));
    }
  };

  const analyzePhoto = async (base64Data: string, imageUri: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    setIsAnalyzing(true);
    setAnalysisStatus(t('scan.analyzingStatus'));

    try {
      const result = await GeminiService.analyzeFridgeImage(base64Data, 'image/jpeg', language);

      setAnalysisStatus(t('scan.prepStatus'));

      setTimeout(() => {
        setIsAnalyzing(false);
        router.push({
          pathname: '/recipe/review',
          params: {
            imageUri: imageUri,
            ingredientsJson: JSON.stringify(result.detectedIngredients),
            summaryText: result.fridgeSummary,
          },
        });
      }, 700);
    } catch (err) {
      setIsAnalyzing(false);
      Alert.alert(t('scan.errorTitle'), t('scan.scanError'));
    }
  };

  const handleUsePreset = (preset: DemoPreset) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    router.push({
      pathname: '/recipe/review',
      params: {
        ingredientsJson: JSON.stringify(preset.ingredients),
        summaryText: language === 'en'
          ? `${preset.name} loaded for review.`
          : `${preset.name} başarıyla yüklendi.`,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* CINEMATIC HERO COVER BANNER */}
        <View style={styles.heroCoverCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80' }}
            style={styles.heroCoverImage}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(13, 23, 20, 0.75)', 'rgba(13, 23, 20, 0.95)']}
            locations={[0, 0.5, 1]}
            style={styles.heroCoverGradient}
          />

          <View style={styles.heroCoverContent}>
            <View style={styles.heroBadgeRow}>
              <View style={styles.visionGlassBadge}>
                <Sparkles size={12} color="#5EEAD4" />
                <Text style={styles.visionGlassBadgeText}>
                  {language === 'en' ? 'AI Culinary Scanner 2.0' : 'Akıllı Şef Tarayıcı 2.0'}
                </Text>
              </View>
              <View style={styles.instantPill}>
                <Zap size={11} color="#FBBF24" />
                <Text style={styles.instantPillText}>
                  {language === 'en' ? 'Live Multimodal' : 'Canlı Analiz'}
                </Text>
              </View>
            </View>

            <Text style={styles.heroCoverTitle}>{t('scan.title')}</Text>
            <Text style={styles.heroCoverSubtitle}>{t('scan.subtitle')}</Text>
          </View>
        </View>

        {/* CYBER-ORGANIC VIEWFINDER */}
        <View style={styles.viewfinderWrapper}>
          <View style={styles.viewfinderCard}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            ) : (
              <View style={styles.viewfinderEmpty}>
                {/* 4 Framing Reticle Corners */}
                <View style={[styles.cornerBracket, styles.bracketTL]} />
                <View style={[styles.cornerBracket, styles.bracketTR]} />
                <View style={[styles.cornerBracket, styles.bracketBL]} />
                <View style={[styles.cornerBracket, styles.bracketBR]} />

                {/* Center Target Lens */}
                <View style={styles.centerLensOuter}>
                  <View style={styles.centerLensInner}>
                    <ScanLine size={32} color="#0F766E" />
                  </View>
                </View>

                <Text style={styles.viewfinderHint}>{t('scan.viewfinderHint')}</Text>
                <Text style={styles.viewfinderSub}>{t('scan.viewfinderSub')}</Text>
              </View>
            )}

            {/* Analysis In-Progress Glass Overlay */}
            {isAnalyzing && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#0F766E" />
                <Text style={styles.loadingTitle}>{t('scan.analyzingTitle')}</Text>
                <Text style={styles.loadingStatus}>{analysisStatus}</Text>
              </View>
            )}
          </View>
        </View>

        {/* FLOATING ACTION DECK */}
        <View style={styles.actionDeck}>
          <TouchableOpacity
            style={styles.primaryCameraBtn}
            activeOpacity={0.88}
            onPress={takePhotoWithCamera}
            disabled={isAnalyzing}
          >
            <Camera size={20} color="#FFFFFF" />
            <Text style={styles.primaryCameraBtnText}>{t('scan.takePhoto')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryGalleryBtn}
            activeOpacity={0.88}
            onPress={pickImageFromGallery}
            disabled={isAnalyzing}
          >
            <ImageIcon size={18} color="#0F766E" />
            <Text style={styles.secondaryGalleryBtnText}>{t('scan.pickGallery')}</Text>
          </TouchableOpacity>
        </View>

        {/* TIPS PILL CARD */}
        <View style={styles.tipsCard}>
          <View style={styles.tipHeaderRow}>
            <Info size={15} color="#0F766E" />
            <Text style={styles.tipCardTitle}>{t('scan.chefTipsTitle')}</Text>
          </View>
          <Text style={styles.tipLine}>{t('scan.tip1')}</Text>
          <Text style={styles.tipLine}>{t('scan.tip2')}</Text>
          <Text style={styles.tipLine}>{t('scan.tip3')}</Text>
        </View>

        {/* INSTANT PANTRY TEST PRESETS WITH HD PHOTOGRAPHY */}
        <View style={styles.presetsWrapper}>
          <View style={styles.presetsHeader}>
            <Zap size={14} color="#D97706" />
            <Text style={styles.presetsTitle}>{t('scan.presetsTitle')}</Text>
          </View>

          {presets.map((preset) => (
            <TouchableOpacity
              key={preset.id}
              style={styles.presetPhotoCard}
              activeOpacity={0.9}
              onPress={() => handleUsePreset(preset)}
            >
              <Image source={{ uri: preset.imageUrl }} style={styles.presetImage} />
              <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
                style={styles.presetGradient}
              />

              <View style={styles.presetContent}>
                <View style={styles.presetTopTag}>
                  <ChefHat size={12} color="#5EEAD4" />
                  <Text style={styles.presetTopTagText}>
                    {preset.ingredients.length} {language === 'en' ? 'Ingredients Detected' : 'Malzeme Hazır'}
                  </Text>
                </View>
                <Text style={styles.presetNameText}>{preset.name}</Text>
                <Text style={styles.presetSubText} numberOfLines={1}>{preset.subtitle}</Text>
              </View>

              <View style={styles.presetArrowBtn}>
                <ArrowRight size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ))}
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
  container: {
    padding: 18,
    paddingBottom: 50,
  },
  heroCoverCard: {
    height: 170,
    borderRadius: 26,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  heroCoverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroCoverGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  heroCoverContent: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  visionGlassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15, 118, 110, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.35)',
  },
  visionGlassBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  instantPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  instantPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FBBF24',
  },
  heroCoverTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginBottom: 2,
  },
  heroCoverSubtitle: {
    fontSize: 12,
    color: '#D1D5DB',
    lineHeight: 16,
  },
  viewfinderWrapper: {
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  viewfinderCard: {
    height: 270,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E1E6DF',
    position: 'relative',
  },
  viewfinderEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FAFBF9',
  },
  cornerBracket: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#0F766E',
  },
  bracketTL: {
    top: 18,
    left: 18,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  bracketTR: {
    top: 18,
    right: 18,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  bracketBL: {
    bottom: 18,
    left: 18,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  bracketBR: {
    bottom: 18,
    right: 18,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  centerLensOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  centerLensInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  viewfinderHint: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D1714',
    marginBottom: 4,
  },
  viewfinderSub: {
    fontSize: 12,
    color: '#687E74',
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 16,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0D1714',
    marginTop: 14,
    marginBottom: 4,
  },
  loadingStatus: {
    fontSize: 13,
    color: '#0F766E',
    fontWeight: '700',
    textAlign: 'center',
  },
  actionDeck: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  primaryCameraBtn: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0F766E',
    paddingVertical: 15,
    borderRadius: 18,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryCameraBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryGalleryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D1DCD6',
    paddingVertical: 15,
    borderRadius: 18,
  },
  secondaryGalleryBtnText: {
    color: '#0F766E',
    fontSize: 13.5,
    fontWeight: '800',
  },
  tipsCard: {
    backgroundColor: '#EFF5F2',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D8E2DC',
    marginBottom: 20,
  },
  tipHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  tipCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tipLine: {
    fontSize: 12,
    color: '#34473F',
    lineHeight: 18,
    marginBottom: 2,
  },
  presetsWrapper: {},
  presetsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  presetsTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#7D9087',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  presetPhotoCard: {
    height: 110,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E6EBE8',
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  presetImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },
  presetGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  presetContent: {
    padding: 14,
    paddingRight: 50,
  },
  presetTopTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 4,
  },
  presetTopTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#5EEAD4',
  },
  presetNameText: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  presetSubText: {
    fontSize: 11.5,
    color: '#E5E7EB',
  },
  presetArrowBtn: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 118, 110, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});
