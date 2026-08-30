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
import { Camera, Image as ImageIcon, Sparkles, RefreshCw, CheckCircle, Info, ChefHat } from 'lucide-react-native';
import { GeminiService } from '../../services/geminiService';
import { DEMO_PRESETS } from '../../constants/MockData';
import * as Haptics from 'expo-haptics';

export default function ScanScreen() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStatus, setAnalysisStatus] = useState<string>('');

  const pickImageFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('İzin Gerekli', 'Fotoğraf seçmek için galeri izni vermeniz gerekmektedir.');
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
      Alert.alert('Hata', 'Fotoğraf seçilirken bir sorun oluştu.');
    }
  };

  const takePhotoWithCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('İzin Gerekli', 'Fotoğraf çekmek için kamera izni vermeniz gerekmektedir.');
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
      Alert.alert('Hata', 'Kamera açılırken bir sorun oluştu.');
    }
  };

  const analyzePhoto = async (base64Data: string, imageUri: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    setIsAnalyzing(true);
    setAnalysisStatus('Dolaptaki malzemeler ve kalan yemekler taranıyor...');

    try {
      const result = await GeminiService.analyzeFridgeImage(base64Data);

      setAnalysisStatus('Tarifler için malzemeler hazırlanıyor...');

      // Small delay for smooth UX
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
      Alert.alert('Analiz Hatası', 'Görsel taranırken bir sorun oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleUsePreset = (preset: typeof DEMO_PRESETS[0]) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    router.push({
      pathname: '/recipe/review',
      params: {
        ingredientsJson: JSON.stringify(preset.ingredients),
        summaryText: `${preset.name} başarıyla yüklendi.`,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📸 Dolabı / Masayı Tara</Text>
          <Text style={styles.subtitle}>
            Buzdolabınızı, kilerinizi veya yemek masasını fotoğraflayın. Yapay zeka tüm kalanları tanısın.
          </Text>
        </View>

        {/* Viewfinder Preview Box */}
        <View style={styles.viewfinderCard}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          ) : (
            <View style={styles.emptyViewfinder}>
              <View style={styles.scanTargetRing}>
                <Camera size={44} color="#10B981" />
              </View>
              <Text style={styles.emptyText}>Net ve aydınlık bir fotoğraf çekin</Text>
              <Text style={styles.emptySubtext}>Kalan yemek kapları, sebzeler veya açık paketler</Text>
            </View>
          )}

          {isAnalyzing && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#10B981" />
              <Text style={styles.loadingTitle}>Yapay Zeka İnceliyor 🧠</Text>
              <Text style={styles.loadingStatus}>{analysisStatus}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.cameraBtn]}
            onPress={takePhotoWithCamera}
            disabled={isAnalyzing}
          >
            <Camera size={20} color="#FFFFFF" />
            <Text style={styles.cameraBtnText}>Kamera ile Çek</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.galleryBtn]}
            onPress={pickImageFromGallery}
            disabled={isAnalyzing}
          >
            <ImageIcon size={20} color="#374151" />
            <Text style={styles.galleryBtnText}>Galeriden Seç</Text>
          </TouchableOpacity>
        </View>

        {/* Photo Tips Box */}
        <View style={styles.tipsBox}>
          <View style={styles.tipTitleRow}>
            <Info size={16} color="#059669" />
            <Text style={styles.tipBoxTitle}>En İyi Sonuç İçin İpuçları:</Text>
          </View>
          <Text style={styles.tipItem}>• Buzdolabı kapağını açıp rafı geniş açıyla çekin.</Text>
          <Text style={styles.tipItem}>• Kalan yemeklerin üzerindeki kapakları açın.</Text>
          <Text style={styles.tipItem}>• Birden fazla malzemeyi aynı karede toplayabilirsiniz.</Text>
        </View>

        {/* Simulator / Quick Presets */}
        <View style={styles.presetsSection}>
          <Text style={styles.presetSectionTitle}>💡 Simülatörde Test Etmek İçin Hazır Örnekler:</Text>
          {DEMO_PRESETS.map((preset) => (
            <TouchableOpacity
              key={preset.id}
              style={styles.presetChip}
              onPress={() => handleUsePreset(preset)}
            >
              <ChefHat size={16} color="#10B981" />
              <Text style={styles.presetChipText}>{preset.name}</Text>
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
    backgroundColor: '#F9FAFB',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
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
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  viewfinderCard: {
    height: 260,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  emptyViewfinder: {
    alignItems: 'center',
    padding: 20,
  },
  scanTargetRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#A7F3D0',
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  loadingOverlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginTop: 14,
    marginBottom: 4,
  },
  loadingStatus: {
    fontSize: 13,
    color: '#059669',
    textAlign: 'center',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
  },
  cameraBtn: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  cameraBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  galleryBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  galleryBtnText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '700',
  },
  tipsBox: {
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 20,
  },
  tipTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  tipBoxTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
  },
  tipItem: {
    fontSize: 12,
    color: '#047857',
    lineHeight: 18,
    marginBottom: 2,
  },
  presetsSection: {
    marginTop: 6,
  },
  presetSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 10,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  presetChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
});
