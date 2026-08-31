import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, Flame, Heart, ChefHat, Leaf, ArrowUpRight } from 'lucide-react-native';
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

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.cardContainer}
    >
      {/* Top Banner Ribbon */}
      <View style={styles.ribbonRow}>
        <View style={styles.wasteRibbon}>
          <Leaf size={12} color="#0F766E" />
          <Text style={styles.wasteRibbonText}>{recipe.wasteSavedGrams}{t('common.gramsSaved')}</Text>
        </View>

        <View style={styles.topRightActions}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{recipe.category || 'Gourmet'}</Text>
          </View>

          {onToggleSave && (
            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={handleFavorite}
              style={styles.favBtn}
            >
              <Heart
                size={18}
                color={isSaved ? '#E11D48' : '#9CA3AF'}
                fill={isSaved ? '#E11D48' : 'transparent'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main Recipe Title & Tagline */}
      <View style={styles.titleRow}>
        <Text style={styles.titleText}>{recipe.title}</Text>
        <View style={styles.arrowBox}>
          <ArrowUpRight size={16} color="#0F766E" />
        </View>
      </View>

      <Text style={styles.taglineText} numberOfLines={2}>
        {recipe.tagline || recipe.description}
      </Text>

      {/* Ingredients Preview Bar */}
      <View style={styles.pantryRow}>
        <View style={styles.pantryLabelBox}>
          <Text style={styles.pantryLabel}>{t('recipe.prepTab')}:</Text>
        </View>
        <Text style={styles.pantryItems} numberOfLines={1}>
          {recipe.ingredientsUsed.slice(0, 3).join(' • ')}
          {recipe.ingredientsUsed.length > 3 ? ` (+${recipe.ingredientsUsed.length - 3})` : ''}
        </Text>
      </View>

      {/* Footer Metrics */}
      <View style={styles.footerRow}>
        <View style={styles.metricCapsule}>
          <Clock size={13} color="#0F766E" />
          <Text style={styles.metricCapsuleText}>{totalTime} {t('common.mins')}</Text>
        </View>

        <View style={styles.metricCapsule}>
          <ChefHat size={13} color="#D97706" />
          <Text style={styles.metricCapsuleText}>{getDifficultyLabel(recipe.difficulty)}</Text>
        </View>

        <View style={styles.metricCapsule}>
          <Flame size={13} color="#EA580C" />
          <Text style={styles.metricCapsuleText}>{recipe.caloriesPerServing} kcal</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E6EBE8',
    shadowColor: '#0F261E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  ribbonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  wasteRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 12,
  },
  wasteRibbonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
    letterSpacing: 0.2,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryPill: {
    backgroundColor: '#F3F5F3',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 10,
  },
  categoryPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#4B6358',
  },
  favBtn: {
    padding: 4,
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
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFF6F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taglineText: {
    fontSize: 13,
    color: '#556860',
    lineHeight: 18,
    marginBottom: 14,
  },
  pantryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    marginBottom: 14,
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
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F6F4',
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
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2C3E36',
  },
});
