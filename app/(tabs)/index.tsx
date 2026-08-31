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
  Flame,
  ChefHat,
  Leaf,
  ScanLine,
  ArrowUpRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ZeroWasteStatCard } from '../../components/ZeroWasteStatCard';
import { RecipeCard } from '../../components/RecipeCard';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { DEMO_PRESETS, ZERO_WASTE_TIPS } from '../../constants/MockData';
import { Recipe, UserStats } from '../../types';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
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
    router.push({
      pathname: '/recipe/review',
      params: {
        ingredientsJson: JSON.stringify(preset.ingredients),
        summaryText: `${preset.name} malzemeleri inceleniyor.`,
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0F766E" />
        }
      >
        {/* Editorial Top Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.dateLabel}>
              {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
            </Text>
            <Text style={styles.greetingText}>
              Merhaba, {user?.name?.split(' ')[0] || 'Şef'} 👋
            </Text>
          </View>

          <TouchableOpacity
            style={styles.profileBadge}
            onPress={() => router.push('/(tabs)/settings')}
          >
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarLetter}>{user?.name?.[0] || 'Ş'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* BENTO HERO: THE SCAN CHAMBER */}
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={handleStartScan}
          style={styles.scanChamberCard}
        >
          <LinearGradient
            colors={['#0F766E', '#115E59', '#042F2E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.scanChamberGradient}
          >
            {/* Holographic light sphere */}
            <View style={styles.ambientSphere} />

            <View style={styles.scanChamberTop}>
              <View style={styles.aiTag}>
                <Sparkles size={12} color="#5EEAD4" />
                <Text style={styles.aiTagText}>Gemini 1.5 Vision</Text>
              </View>
              <View style={styles.pulseRadar}>
                <ScanLine size={18} color="#5EEAD4" />
              </View>
            </View>

            <Text style={styles.scanChamberTitle}>Dolabını Fotoğrafla & İsrafı Durdur</Text>
            <Text style={styles.scanChamberSub}>
              Kalan yemekleri ve sebzeleri yapay zekaya gösterin, 10 saniyede sıfır israflı gurme menüler hazırlasın.
            </Text>

            <View style={styles.scanCtaRow}>
              <View style={styles.scanCtaButton}>
                <Camera size={18} color="#042F2E" />
                <Text style={styles.scanCtaText}>Kamerayı Başlat</Text>
              </View>
              <Text style={styles.scanHint}>veya galeriden yükle 📸</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* BENTO ECO IMPACT STATS WIDGET */}
        <ZeroWasteStatCard stats={stats} />

        {/* BENTO 2-COLUMN TILES: TIPS & QUICK ACTIONS */}
        <View style={styles.bentoGridRow}>
          {/* Tile 1: Tip of the day */}
          <View style={styles.bentoTileLeft}>
            <View style={styles.bentoTileHeader}>
              <Lightbulb size={16} color="#D97706" />
              <Text style={styles.bentoTileTag}>Günün İpucu</Text>
            </View>
            <Text style={styles.tipTitleText} numberOfLines={2}>{currentTip.title}</Text>
            <Text style={styles.tipDescText} numberOfLines={3}>{currentTip.description}</Text>
          </View>

          {/* Tile 2: Instant Chef Preset */}
          <TouchableOpacity
            style={styles.bentoTileRight}
            activeOpacity={0.88}
            onPress={() => handleSelectPreset(DEMO_PRESETS[0])}
          >
            <View style={styles.bentoTileHeader}>
              <ChefHat size={16} color="#0F766E" />
              <Text style={[styles.bentoTileTag, { color: '#0F766E' }]}>Hızlı Menü</Text>
            </View>
            <Text style={styles.presetTitleText} numberOfLines={2}>Tavuk & Pilav Kurtarma</Text>
            <Text style={styles.presetDescText}>Dünden kalanları 15 dakikada lüks fırın gratenine dönüştürün.</Text>
            <View style={styles.presetLinkRow}>
              <Text style={styles.presetLinkText}>Hemen İncele</Text>
              <ArrowRight size={13} color="#0F766E" />
            </View>
          </TouchableOpacity>
        </View>

        {/* SECTION: FEATURED ZERO WASTE RECIPES */}
        <View style={styles.recipesSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Şefin Kurtarma Seçkisi 👨‍🍳</Text>
              <Text style={styles.sectionSub}>Günün öne çıkan sıfır israf tarifleri</Text>
            </View>
            <TouchableOpacity onPress={handleStartScan}>
              <Text style={styles.sectionActionText}>Tümünü Gör</Text>
            </TouchableOpacity>
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
    backgroundColor: '#F7F8F6',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 16,
  },
  dateLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0D1714',
    letterSpacing: -0.5,
  },
  profileBadge: {
    padding: 3,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0F766E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  profileAvatarLetter: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  scanChamberCard: {
    marginHorizontal: 18,
    borderRadius: 28,
    marginBottom: 20,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 8,
  },
  scanChamberGradient: {
    borderRadius: 28,
    padding: 22,
    position: 'relative',
    overflow: 'hidden',
  },
  ambientSphere: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(94, 234, 212, 0.22)',
  },
  scanChamberTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  aiTagText: {
    color: '#CCFBF1',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  pulseRadar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanChamberTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight: 28,
    marginBottom: 8,
  },
  scanChamberSub: {
    fontSize: 13,
    color: '#CCFBF1',
    lineHeight: 18,
    marginBottom: 20,
    opacity: 0.9,
  },
  scanCtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  scanCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#5EEAD4',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#5EEAD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  scanCtaText: {
    color: '#042F2E',
    fontSize: 13.5,
    fontWeight: '800',
  },
  scanHint: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
    fontWeight: '600',
  },
  bentoGridRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 18,
    marginBottom: 24,
  },
  bentoTileLeft: {
    flex: 1,
    backgroundColor: '#FFFBEB',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  bentoTileRight: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6EBE8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  bentoTileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  bentoTileTag: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#B45309',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipTitleText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#78350F',
    marginBottom: 4,
    lineHeight: 18,
  },
  tipDescText: {
    fontSize: 11.5,
    color: '#92400E',
    lineHeight: 16,
  },
  presetTitleText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0D1714',
    marginBottom: 4,
    lineHeight: 18,
  },
  presetDescText: {
    fontSize: 11.5,
    color: '#556860',
    lineHeight: 16,
    marginBottom: 10,
  },
  presetLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 'auto',
  },
  presetLinkText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  recipesSection: {
    paddingHorizontal: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0D1714',
    letterSpacing: -0.3,
  },
  sectionSub: {
    fontSize: 12,
    color: '#687E74',
    marginTop: 2,
  },
  sectionActionText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F766E',
  },
});
