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
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Camera,
  Sparkles,
  Lightbulb,
  ArrowRight,
  ChefHat,
  ScanLine,
  Globe,
  Star,
  Clock,
  Leaf,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ZeroWasteStatCard } from '../../components/ZeroWasteStatCard';
import { RecipeCard } from '../../components/RecipeCard';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getDemoPresets, ZERO_WASTE_TIPS, DemoPreset } from '../../constants/MockData';
import { Recipe, UserStats } from '../../types';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();

  const [stats, setStats] = useState<UserStats>({
    totalMealsCooked: 3,
    totalWasteSavedKg: 1.4,
    estimatedMoneySavedTL: 320,
  });
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [randomTipIndex, setRandomTipIndex] = useState(0);

  const presets = getDemoPresets(language);
  const primaryPreset = presets[0];
  const spotlightRecipe = primaryPreset.recipes[0];

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
    const tipsList = ZERO_WASTE_TIPS[language] || ZERO_WASTE_TIPS['en'];
    setRandomTipIndex(Math.floor(Math.random() * tipsList.length));
  }, [language]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    const tipsList = ZERO_WASTE_TIPS[language] || ZERO_WASTE_TIPS['en'];
    setRandomTipIndex((prev) => (prev + 1) % tipsList.length);
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

  const handleSelectPreset = (preset: DemoPreset) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    router.push({
      pathname: '/recipe/review',
      params: {
        ingredientsJson: JSON.stringify(preset.ingredients),
        summaryText: language === 'en'
          ? `${preset.name} loaded for culinary review.`
          : `${preset.name} malzemeleri inceleniyor.`,
      },
    });
  };

  const currentTips = ZERO_WASTE_TIPS[language] || ZERO_WASTE_TIPS['en'];
  const currentTip = currentTips[randomTipIndex] || currentTips[0];

  const dateLocale = language === 'en' ? 'en-US' : 'tr-TR';

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
              {new Date().toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
            </Text>
            <Text style={styles.greetingText}>
              {t('home.greeting')} {user?.name?.split(' ')[0] || t('home.defaultChef')} 👋
            </Text>
          </View>

          <View style={styles.topRightRow}>
            {/* Quick Language Toggle Pill */}
            <TouchableOpacity
              style={styles.langPill}
              activeOpacity={0.8}
              onPress={toggleLanguage}
            >
              <Globe size={13} color="#0F766E" />
              <Text style={styles.langPillText}>{language.toUpperCase()}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.profileBadge}
              onPress={() => router.push('/(tabs)/settings')}
            >
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarLetter}>{user?.name?.[0] || 'C'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* SPOTLIGHT HERO: CINEMATIC FOOD PHOTOGRAPHY SPOTLIGHT */}
        {spotlightRecipe && (
          <TouchableOpacity
            style={styles.spotlightCard}
            activeOpacity={0.92}
            onPress={() => {
              router.push({
                pathname: '/recipe/[id]',
                params: { id: spotlightRecipe.id, recipeJson: JSON.stringify(spotlightRecipe) },
              });
            }}
          >
            <Image
              source={{ uri: spotlightRecipe.imageUrl || 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1000&q=80' }}
              style={styles.spotlightImage}
            />

            {/* Gradient Vignette */}
            <LinearGradient
              colors={['rgba(0,0,0,0.2)', 'transparent', 'rgba(13, 23, 20, 0.92)']}
              locations={[0, 0.35, 1]}
              style={styles.spotlightGradient}
            />

            {/* Floating Top Pill */}
            <View style={styles.spotlightTopRow}>
              <View style={styles.spotlightBadge}>
                <Sparkles size={12} color="#5EEAD4" />
                <Text style={styles.spotlightBadgeText}>
                  {language === 'en' ? "Chef's Daily Spotlight" : "Günün Şef Seçkisi"}
                </Text>
              </View>

              <View style={styles.spotlightRating}>
                <Star size={11} color="#FBBF24" fill="#FBBF24" />
                <Text style={styles.spotlightRatingText}>4.9</Text>
              </View>
            </View>

            {/* Spotlight Info Bottom */}
            <View style={styles.spotlightInfoBottom}>
              <View style={styles.spotlightMetaRow}>
                <View style={styles.spotlightWasteRibbon}>
                  <Leaf size={11} color="#5EEAD4" />
                  <Text style={styles.spotlightWasteText}>
                    {spotlightRecipe.wasteSavedGrams}{t('common.gramsSaved')}
                  </Text>
                </View>
                <View style={styles.spotlightTimePill}>
                  <Clock size={11} color="#FFFFFF" />
                  <Text style={styles.spotlightTimeText}>
                    {spotlightRecipe.prepTimeMinutes + spotlightRecipe.cookTimeMinutes} {t('common.mins')}
                  </Text>
                </View>
              </View>

              <Text style={styles.spotlightTitle}>{spotlightRecipe.title}</Text>
              <Text style={styles.spotlightTagline} numberOfLines={2}>
                {spotlightRecipe.tagline}
              </Text>
            </View>
          </TouchableOpacity>
        )}

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
                <Text style={styles.aiTagText}>{t('home.scanChamberBadge')}</Text>
              </View>
              <View style={styles.pulseRadar}>
                <ScanLine size={18} color="#5EEAD4" />
              </View>
            </View>

            <Text style={styles.scanChamberTitle}>{t('home.scanChamberTitle')}</Text>
            <Text style={styles.scanChamberSub}>{t('home.scanChamberSub')}</Text>

            <View style={styles.scanCtaRow}>
              <View style={styles.scanCtaButton}>
                <Camera size={18} color="#042F2E" />
                <Text style={styles.scanCtaText}>{t('home.launchCamera')}</Text>
              </View>
              <Text style={styles.scanHint}>{t('home.orUpload')}</Text>
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
              <Text style={styles.bentoTileTag}>{t('home.tipOfTheDay')}</Text>
            </View>
            <Text style={styles.tipTitleText} numberOfLines={2}>{currentTip.title}</Text>
            <Text style={styles.tipDescText} numberOfLines={3}>{currentTip.description}</Text>
          </View>

          {/* Tile 2: Instant Chef Preset */}
          <TouchableOpacity
            style={styles.bentoTileRight}
            activeOpacity={0.88}
            onPress={() => handleSelectPreset(primaryPreset)}
          >
            <View style={styles.bentoTileHeader}>
              <ChefHat size={16} color="#0F766E" />
              <Text style={[styles.bentoTileTag, { color: '#0F766E' }]}>{t('home.quickMenu')}</Text>
            </View>
            <Text style={styles.presetTitleText} numberOfLines={2}>
              {primaryPreset.name}
            </Text>
            <Text style={styles.presetDescText} numberOfLines={2}>
              {primaryPreset.subtitle}
            </Text>
            <View style={styles.presetLinkRow}>
              <Text style={styles.presetLinkText}>{t('home.inspectNow')}</Text>
              <ArrowRight size={13} color="#0F766E" />
            </View>
          </TouchableOpacity>
        </View>

        {/* SECTION: FEATURED ZERO WASTE RECIPES WITH HD PHOTOGRAPHY */}
        <View style={styles.recipesSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>{t('home.featuredTitle')}</Text>
              <Text style={styles.sectionSub}>{t('home.featuredSub')}</Text>
            </View>
            <TouchableOpacity onPress={handleStartScan}>
              <Text style={styles.sectionActionText}>{t('home.seeAll')}</Text>
            </TouchableOpacity>
          </View>

          {primaryPreset.recipes.map((recipe) => {
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
    paddingBottom: 14,
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
  topRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  langPillText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0F766E',
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
  spotlightCard: {
    marginHorizontal: 18,
    height: 240,
    borderRadius: 28,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  spotlightImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  spotlightGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  spotlightTopRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spotlightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15, 118, 110, 0.9)',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.4)',
  },
  spotlightBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  spotlightRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 12,
  },
  spotlightRatingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  spotlightInfoBottom: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  spotlightMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  spotlightWasteRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 10,
  },
  spotlightWasteText: {
    color: '#CCFBF1',
    fontSize: 10.5,
    fontWeight: '800',
  },
  spotlightTimePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 10,
  },
  spotlightTimeText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
  },
  spotlightTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginBottom: 3,
  },
  spotlightTagline: {
    fontSize: 12,
    color: '#D1D5DB',
    lineHeight: 16,
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
