import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, Flame, Sparkles, Heart, ChefHat, Leaf } from 'lucide-react-native';
import { Recipe } from '../types';
import { Colors } from '../constants/Colors';
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
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    onToggleSave?.();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={styles.card}
    >
      {/* Header Bar with Waste Badge and Favorite Button */}
      <View style={styles.topRow}>
        <View style={styles.wasteBadge}>
          <Leaf size={13} color="#059669" />
          <Text style={styles.wasteText}>🌱 {recipe.wasteSavedGrams}g İsraf Kurtarıldı</Text>
        </View>

        {onToggleSave && (
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={handleFavoritePress}
            style={styles.favButton}
          >
            <Heart
              size={20}
              color={isSaved ? '#EF4444' : '#9CA3AF'}
              fill={isSaved ? '#EF4444' : 'transparent'}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Title & Tagline */}
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.tagline} numberOfLines={2}>{recipe.tagline || recipe.description}</Text>

      {/* Ingredients Used Pills */}
      <View style={styles.ingredientsRow}>
        <Text style={styles.ingredientsLabel}>Kullanılan Kalanlar:</Text>
        <Text style={styles.ingredientsList} numberOfLines={1}>
          {recipe.ingredientsUsed.slice(0, 3).join(', ')}
          {recipe.ingredientsUsed.length > 3 ? ` +${recipe.ingredientsUsed.length - 3}` : ''}
        </Text>
      </View>

      {/* Footer Metrics */}
      <View style={styles.footerRow}>
        <View style={styles.metaItem}>
          <Clock size={14} color="#6B7280" />
          <Text style={styles.metaText}>{totalTime} dk</Text>
        </View>

        <View style={styles.metaItem}>
          <ChefHat size={14} color="#6B7280" />
          <Text style={styles.metaText}>{recipe.difficulty}</Text>
        </View>

        <View style={styles.metaItem}>
          <Flame size={14} color="#F97316" />
          <Text style={styles.metaText}>{recipe.caloriesPerServing} kcal</Text>
        </View>

        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{recipe.category || 'Pratik'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  wasteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  wasteText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  favButton: {
    padding: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 22,
  },
  tagline: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 18,
  },
  ingredientsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 12,
  },
  ingredientsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
    marginRight: 4,
  },
  ingredientsList: {
    flex: 1,
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  categoryBadge: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EA580C',
  },
});
