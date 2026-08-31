import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Clock, Flame, Heart, ChefHat, Leaf, ArrowUpRight, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Recipe } from '../types';
import { useLanguage } from '../context/LanguageContext';
import * as Haptics from 'expo-haptics';

interface Props {
  recipe: Recipe;
  onPress: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export const RecipeCard: React.FC<Props> = ({
  recipe,
  onPress,
  isSaved = false,
  onToggleSave,
}) => {
  const { t } = useLanguage();
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  const handleFavorite = (e: any) => {
    e.stopPropagation();
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    onToggleSave?.();
  };

  const getDifficultyLabel = (diff: string) => {
    if (diff === 'Kolay') return t('common.kolay');
    if (diff === 'Orta') return t('common.orta');
    return t('common.usta');
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80';
  const displayImage = recipe.imageUrl || fallbackImage;

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      style={styles.cardContainer}
    >
      {/* FULL-BLEED GOURMET PHOTOGRAPHY HEADER */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: displayImage }} style={styles.foodImage} />

        {/* Gradient Vignette Overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.65)']}
          locations={[0, 0.4, 1]}
          style={styles.imageGradient}
        />

        {/* Top Floating Badges */}
        <View style={styles.topFloatRow}>
          <View style={styles.wasteRibbonGlass}>
            <Leaf size={12} color="#5EEAD4" />
            <Text style={styles.wasteRibbonText}>
              {recipe.wasteSavedGrams}{t('common.gramsSaved')}
            </Text>
          </View>

          {onToggleSave && (
            <TouchableOpacity
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              onPress={handleFavorite}
              style={styles.favBtnGlass}
            >
              <Heart
                size={18}
                color={isSaved ? '#F43F5E' : '#FFFFFF'}
                fill={isSaved ? '#F43F5E' : 'transparent'}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Bottom Floating Stats over Photo */}
        <View style={styles.bottomFloatRow}>
          <View style={styles.photoPill}>
            <Clock size={12} color="#FFFFFF" />
            <Text style={styles.photoPillText}>{totalTime} {t('common.mins')}</Text>
          </View>

          <View style={styles.photoPill}>
            <Star size={12} color="#FBBF24" fill="#FBBF24" />
            <Text style={styles.photoPillText}>4.9</Text>
          </View>

          <View style={[styles.photoPill, { marginLeft: 'auto' }]}>
            <Text style={styles.categoryPillText}>{recipe.category || 'Gourmet'}</Text>
          </View>
        </View>
      </View>

      {/* EDITORIAL CARD BODY */}
      <View style={styles.bodyContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.titleText}>{recipe.title}</Text>
          <View style={styles.arrowBox}>
            <ArrowUpRight size={15} color="#0F766E" />
          </View>
        </View>

        <Text style={styles.taglineText} numberOfLines={2}>
          {recipe.tagline || recipe.description}
        </Text>

        {/* Pantry Recovery Preview Strip */}
        <View style={styles.pantryRow}>
          <View style={styles.pantryLabelBox}>
            <Text style={styles.pantryLabel}>{t('recipe.prepTab')}:</Text>
          </View>
          <Text style={styles.pantryItems} numberOfLines={1}>
            {recipe.ingredientsUsed.slice(0, 3).join(' • ')}
            {recipe.ingredientsUsed.length > 3 ? ` (+${recipe.ingredientsUsed.length - 3})` : ''}
          </Text>
        </View>

        {/* Macro Nutrient Strip */}
        <View style={styles.footerRow}>
          <View style={styles.metricCapsule}>
            <ChefHat size={13} color="#D97706" />
            <Text style={styles.metricCapsuleText}>{getDifficultyLabel(recipe.difficulty)}</Text>
          </View>

          <View style={styles.metricCapsule}>
            <Flame size={13} color="#EA580C" />
            <Text style={styles.metricCapsuleText}>{recipe.caloriesPerServing} kcal</Text>
          </View>

          {recipe.nutritionalHighlights?.protein && (
            <View style={[styles.metricCapsule, { backgroundColor: '#EFF6FF' }]}>
              <Text style={[styles.metricCapsuleText, { color: '#2563EB' }]}>
                🍗 {recipe.nutritionalHighlights.protein}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E6EBE8',
    shadowColor: '#0F261E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 190,
    width: '100%',
    position: 'relative',
  },
  foodImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  topFloatRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wasteRibbonGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15, 118, 110, 0.88)',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.4)',
  },
  wasteRibbonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  favBtnGlass: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  bottomFloatRow: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  photoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  photoPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  categoryPillText: {
    color: '#CCFBF1',
    fontSize: 10.5,
    fontWeight: '800',
  },
  bodyContainer: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  titleText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: '#0F1F1A',
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  arrowBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EFF6F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taglineText: {
    fontSize: 12.5,
    color: '#556860',
    lineHeight: 18,
    marginBottom: 12,
  },
  pantryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EFF2EE',
  },
  pantryLabelBox: {
    marginRight: 6,
  },
  pantryLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
  },
  pantryItems: {
    flex: 1,
    fontSize: 11,
    color: '#3F524A',
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
    backgroundColor: '#F7FAF8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  metricCapsuleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2C3E36',
  },
});
