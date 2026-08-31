import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { X, Sparkles } from 'lucide-react-native';
import { DetectedIngredient } from '../types';
import * as Haptics from 'expo-haptics';

interface Props {
  ingredient: DetectedIngredient;
  onRemove?: () => void;
  isSelected?: boolean;
  onToggle?: () => void;
  isRemovable?: boolean;
}

export const IngredientTag: React.FC<Props> = ({
  ingredient,
  onRemove,
  isSelected = true,
  onToggle,
  isRemovable = true,
}) => {
  const getActionBadge = (action?: string) => {
    switch (action) {
      case 'Hemen Tüket':
        return { bg: '#FFE4E6', text: '#BE123C', dot: '#F43F5E', label: 'Hemen Tüket' };
      case 'Fırınla':
        return { bg: '#FFEDD5', text: '#C2410C', dot: '#F97316', label: 'Fırınla' };
      case 'Çorba Yap':
        return { bg: '#E0F2FE', text: '#0369A1', dot: '#0EA5E9', label: 'Çorba' };
      default:
        return { bg: '#CCFBF1', text: '#0F766E', dot: '#14B8A6', label: 'Taze' };
    }
  };

  const actionStyle = getActionBadge(ingredient.suggestedAction);

  const handlePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    onToggle?.();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handlePress}
      style={[
        styles.container,
        isSelected ? styles.selectedContainer : styles.unselectedContainer,
      ]}
    >
      <View style={styles.contentRow}>
        <View style={[styles.statusDot, { backgroundColor: isSelected ? actionStyle.dot : '#9CA3AF' }]} />
        <Text style={[styles.nameText, !isSelected && styles.unselectedText]}>
          {ingredient.name}
        </Text>

        {ingredient.suggestedAction && isSelected && (
          <View style={[styles.badge, { backgroundColor: actionStyle.bg }]}>
            <Text style={[styles.badgeText, { color: actionStyle.text }]}>
              {actionStyle.label}
            </Text>
          </View>
        )}

        {isRemovable && onRemove && (
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 8, right: 10 }}
            onPress={(e) => {
              e.stopPropagation();
              try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              } catch {}
              onRemove();
            }}
            style={styles.removeBtn}
          >
            <X size={12} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 24,
    marginRight: 8,
    marginBottom: 10,
    borderWidth: 1.2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  selectedContainer: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1DCD6',
  },
  unselectedContainer: {
    backgroundColor: '#F1F4F2',
    borderColor: '#E5EAE7',
    opacity: 0.5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  nameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F1F1A',
    letterSpacing: -0.2,
  },
  unselectedText: {
    color: '#7B8D85',
    textDecorationLine: 'line-through',
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  removeBtn: {
    padding: 3,
    backgroundColor: '#EFF3F0',
    borderRadius: 10,
    marginLeft: 2,
  },
});
