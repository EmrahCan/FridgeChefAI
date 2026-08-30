import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Camera,
  Sparkles,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Flame,
  ChefHat,
} from 'lucide-react-native';
import { ZeroWasteStatCard } from '../../components/ZeroWasteStatCard';
import { RecipeCard } from '../../components/RecipeCard';
import { StorageService } from '../../services/storageService';
import { DEMO_PRESETS, ZERO_WASTE_TIPS } from '../../constants/MockData';
import { Recipe, UserStats } from '../../types';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats>({
    totalMealsCooked: 3,
    totalWasteSavedKg: 1.4,
    estimatedMoneySavedTL: 320,
  });
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [randomTipIndex, setRandomTipIndex] = useState(0);

  const loadData = async () => {
    try {
      const currentStats = await StorageService.getUserStats();
      const saved = await StorageService.getSavedRecipes();
      setStats(currentStats);
      setSavedRecipes(saved);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    setRandomTipIndex(Math.floor(Math.random() * ZERO_WASTE_TIPS.length));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRandomTipIndex((prev) => (prev + 1) % ZERO_WASTE_TIPS.length);
    setRefreshing(false);
  };

  const handleToggleSave = async (recipe: Recipe) => {
    await StorageService.toggleSaveRecipe(recipe);
    await loadData();
  };

  const handleStartScan = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    router.push('/(tabs)/scan');
  };

  const handleSelectPreset = (preset: typeof DEMO_PRESETS[0]) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    // Navigate to review screen with serialized detected ingredients
    router.push({
      pathname: '/recipe/review',
      params: {
        ingredientsJson: JSON.stringify(preset.ingredients),
        summaryText: `${preset.name} üzerinden malzemeler aktarıldı.`,
      },
    });
  };

  const currentTip = ZERO_WASTE_TIPS[randomTipIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10B981" />
        }
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hoş Geldin Şef 👨‍🍳</Text>
            <Text style={styles.appTitle}>FridgeChef AI</Text>
          </View>

          <TouchableOpacity style={styles.scanHeaderBtn} onPress={handleStartScan}>
            <Camera size={18} color="#FFFFFF" />
            <Text style={styles.scanHeaderBtnText}>Tara</Text>
          </TouchableOpacity>
        </View>

        {/* User Stats Card */}
        <ZeroWasteStatCard stats={stats} />

        {/* Big Quick Scan Banner */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.heroBanner}
          onPress={handleStartScan}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Sparkles size={13} color="#EA580C" />
              <Text style={styles.heroBadgeText}>AI Görüntü Analizi</Text>
            </View>
            <Text style={styles.heroTitle}>Dolaptaki Kalanları Fotoğrafla</Text>
            <Text style={styles.heroSubtitle}>
              Kalan yemeklerin ve sebzelerin fotoğrafını çekin, yapay zeka sıfır israflı gurme tariflere dönüştürsün.
            </Text>

            <View style={styles.heroButtonRow}>
              <View style={styles.heroCta}>
                <Camera size={16} color="#FFFFFF" />
                <Text style={styles.heroCtaText}>Hemen Fotoğraf Çek</Text>
                <ArrowRight size={16} color="#FFFFFF" />
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Presets / Test Scenarios */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⚡ Hızlı Örnek Senaryolar</Text>
            <Text style={styles.sectionSubtitle}>Fotoğrafsız hemen test edin</Text>
          </View>

          {DEMO_PRESETS.map((preset) => (
            <TouchableOpacity
              key={preset.id}
              style={styles.presetCard}
              activeOpacity={0.8}
              onPress={() => handleSelectPreset(preset)}
            >
              <View style={styles.presetIconBox}>
                <ChefHat size={22} color="#10B981" />
              </View>
              <View style={styles.presetTextBox}>
                <Text style={styles.presetName}>{preset.name}</Text>
                <Text style={styles.presetSubtitle} numberOfLines={1}>
                  {preset.subtitle}
                </Text>
              </View>
              <ArrowRight size={18} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Zero Waste Tip of the Day */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Lightbulb size={20} color="#F59E0B" />
            <Text style={styles.tipHeaderTitle}>Günün Sıfır İsraf İpucu</Text>
          </View>
          <Text style={styles.tipTitle}>{currentTip.title}</Text>
          <Text style={styles.tipDescription}>{currentTip.description}</Text>
        </View>

        {/* Featured / Sample Recipes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🍳 Öne Çıkan Kurtarma Tarifleri</Text>
          </View>

          {DEMO_PRESETS[0].recipes.map((recipe) => {
            const isSaved = savedRecipes.some((r) => r.id === recipe.id);
            return (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isSaved={isSaved}
                onToggleSave={() => handleToggleSave(recipe)}
                onPress={() => {
                  router.push({
                    pathname: '/recipe/[id]',
                    params: { id: recipe.id, recipeJson: JSON.stringify(recipe) },
                  });
                }}
              />
            );
          })}
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
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
  },
  scanHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  scanHeaderBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  heroBanner: {
    backgroundColor: '#FFFBEB',
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#FEF3C7',
    marginBottom: 20,
  },
  heroContent: {},
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFEDD5',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EA580C',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 16,
  },
  heroButtonRow: {
    flexDirection: 'row',
  },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EA580C',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  heroCtaText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  presetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  presetIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  presetTextBox: {
    flex: 1,
  },
  presetName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  presetSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  tipCard: {
    backgroundColor: '#FEF9C3',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FEF08A',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  tipHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
    textTransform: 'uppercase',
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#78350F',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
});
