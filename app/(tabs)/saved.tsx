import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Heart,
  ChefHat,
  Sparkles,
  Leaf,
  Clock,
  Flame,
  Bookmark,
  Compass,
  Star,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RecipeCard } from '../../components/RecipeCard';
import { StorageService } from '../../services/storageService';
import { useLanguage } from '../../context/LanguageContext';
import { Recipe } from '../../types';
import * as Haptics from 'expo-haptics';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SavedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { language, t } = useLanguage();
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const loadSaved = async () => {
    try {
      const recipes = await StorageService.getSavedRecipes();
      setSavedRecipes(recipes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const handleToggleSave = async (recipe: Recipe) => {
    await StorageService.toggleSaveRecipe(recipe);
    await loadSaved();
  };

  const totalWasteSaved = savedRecipes.reduce((acc, r) => acc + (r.wasteSavedGrams || 350), 0);
  const quickMealsCount = savedRecipes.filter(
    (r) => (r.prepTimeMinutes + r.cookTimeMinutes) <= 20
  ).length;

  const categories = language === 'en'
    ? [
        { id: 'all', label: 'All Saved' },
        { id: 'quick', label: '⚡ Quick <20m' },
        { id: 'oven', label: '🥧 Oven & Gratin' },
        { id: 'soup', label: '🍲 Soups' },
      ]
    : [
        { id: 'all', label: 'Tümü' },
        { id: 'quick', label: '⚡ Pratik <20dk' },
        { id: 'oven', label: '🥧 Fırın & Graten' },
        { id: 'soup', label: '🍲 Çorbalar' },
      ];

  const filteredRecipes = savedRecipes.filter((r) => {
    if (selectedFilter === 'quick') return (r.prepTimeMinutes + r.cookTimeMinutes) <= 20;
    if (selectedFilter === 'oven') return (r.category || '').toLowerCase().includes('oven') || (r.category || '').toLowerCase().includes('fırın');
    if (selectedFilter === 'soup') return (r.category || '').toLowerCase().includes('soup') || (r.category || '').toLowerCase().includes('çorba');
    return true;
  });

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 20) + 8,
            paddingBottom: Math.max(insets.bottom, 20) + 80,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP HEADER */}
        <View style={styles.topHeader}>
          <Text style={styles.topHeaderLabel}>
            {language === 'en' ? 'YOUR RECIPE VAULT' : 'KİŞİSEL ŞEF KOLEKSİYONU'}
          </Text>
          <Text style={styles.topHeaderTitle}>
            {language === 'en' ? 'Saved Creations 📖' : 'Kayıtlı Tariflerim 📖'}
          </Text>
        </View>

        {/* CINEMATIC HERO COVER BANNER */}
        <View style={styles.heroCoverCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80' }}
            style={styles.heroCoverImage}
          />
          <LinearGradient
            colors={['rgba(136, 19, 55, 0.4)', 'rgba(76, 5, 25, 0.85)', 'rgba(76, 5, 25, 0.96)']}
            locations={[0, 0.5, 1]}
            style={styles.heroCoverGradient}
          />

          <View style={styles.heroCoverContent}>
            <View style={styles.heroTopRow}>
              <View style={styles.heroBadgeGlass}>
                <Bookmark size={12} color="#FDA4AF" />
                <Text style={styles.heroBadgeGlassText}>
                  {language === 'en' ? 'Gourmet Vault' : 'Şef Koleksiyonu'}
                </Text>
              </View>

              <View style={styles.countPillGlass}>
                <Text style={styles.countPillText}>{savedRecipes.length}</Text>
              </View>
            </View>

            <Text style={styles.heroTitle}>
              {language === 'en'
                ? 'Zero-Waste Masterpieces'
                : 'Sıfır İsraf Başyapıtları'}
            </Text>
            <Text style={styles.heroSub}>
              {language === 'en'
                ? 'Your handcrafted gourmet dishes ready to cook anytime.'
                : 'Dolabınızdaki artık malzemelerle yarattığınız gurme lezzetler.'}
            </Text>

            {/* In-Hero Mini Bento Telemetry */}
            <View style={styles.heroStatsRow}>
              <View style={styles.heroStatItem}>
                <Leaf size={13} color="#FDA4AF" />
                <Text style={styles.heroStatValue}>
                  {(totalWasteSaved / 1000).toFixed(1)} kg
                </Text>
                <Text style={styles.heroStatLabel}>
                  {language === 'en' ? 'Rescued' : 'Kurtarılan'}
                </Text>
              </View>

              <View style={styles.heroStatDivider} />

              <View style={styles.heroStatItem}>
                <Clock size={13} color="#FDA4AF" />
                <Text style={styles.heroStatValue}>{quickMealsCount}</Text>
                <Text style={styles.heroStatLabel}>
                  {language === 'en' ? 'Fast Meals' : 'Pratik Menü'}
                </Text>
              </View>

              <View style={styles.heroStatDivider} />

              <View style={styles.heroStatItem}>
                <Star size={13} color="#FBBF24" fill="#FBBF24" />
                <Text style={styles.heroStatValue}>4.9</Text>
                <Text style={styles.heroStatLabel}>
                  {language === 'en' ? 'Rating' : 'Puan'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Filter Pills Carousel */}
        {savedRecipes.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {categories.map((cat) => {
              const isSelected = selectedFilter === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                  activeOpacity={0.8}
                  onPress={() => {
                    try {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    } catch {}
                    setSelectedFilter(cat.id);
                  }}
                >
                  <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Empty State vs Recipes List */}
        {savedRecipes.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconBox}>
              <Heart size={34} color="#E11D48" />
            </View>
            <Text style={styles.emptyTitle}>{t('saved.emptyTitle')}</Text>
            <Text style={styles.emptyDesc}>{t('saved.emptyDesc')}</Text>
            <TouchableOpacity
              style={styles.emptyCtaBtn}
              activeOpacity={0.88}
              onPress={() => router.push('/(tabs)/scan')}
            >
              <Compass size={18} color="#FFFFFF" />
              <Text style={styles.emptyCtaText}>{t('saved.scanCta')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.recipesList}>
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isSaved={true}
                onToggleSave={() => handleToggleSave(recipe)}
                onPress={() => {
                  router.push({
                    pathname: '/recipe/[id]',
                    params: { id: recipe.id, recipeJson: JSON.stringify(recipe) },
                  });
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8F6',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 50,
  },
  topHeader: {
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  topHeaderLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#9F1239',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  topHeaderTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0D1714',
    letterSpacing: -0.6,
  },
  heroCoverCard: {
    height: 240,
    borderRadius: 28,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 18,
    shadowColor: '#9F1239',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
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
    bottom: 16,
    left: 18,
    right: 18,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroBadgeGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  heroBadgeGlassText: {
    color: '#FFE4E6',
    fontSize: 11,
    fontWeight: '800',
  },
  countPillGlass: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countPillText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12.5,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginBottom: 3,
  },
  heroSub: {
    fontSize: 12,
    color: '#FECDD3',
    lineHeight: 16,
    marginBottom: 12,
    opacity: 0.95,
  },
  heroStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  heroStatItem: {
    alignItems: 'center',
    gap: 2,
  },
  heroStatValue: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13.5,
  },
  heroStatLabel: {
    color: '#FDA4AF',
    fontSize: 10,
    fontWeight: '600',
  },
  heroStatDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  filterScroll: {
    gap: 8,
    marginBottom: 18,
    paddingHorizontal: 2,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E1E6DF',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 16,
  },
  filterChipSelected: {
    backgroundColor: '#9F1239',
    borderColor: '#881337',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  recipesList: {},
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E6DF',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  emptyIconBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFE4E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0D1714',
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 12.5,
    color: '#687E74',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  emptyCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0F766E',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 16,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  emptyCtaText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
});
