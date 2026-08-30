import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { X, Check, AlertCircle } from 'lucide-react-native';
import { DetectedIngredient } from '../types';
import { Colors } from '../constants/Colors';

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
  const getActionColor = (action?: string) => {
    switch (action) {
      case 'Hemen Tüket':
        return { bg: '#FEE2E2', text: '#DC2626', border: '#FCA5A5' };
      case 'Fırınla':
        return { bg: '#FFEDD5', text: '#EA580C', border: '#FDBA74' };
      case 'Çorba Yap':
        return { bg: '#DBEAFE', text: '#2563EB', border: '#93C5FD' };
      default:
        return { bg: '#D1FAE5', text: '#059669', border: '#6EE7B7' };
    }
  };

  const actionStyle = getActionColor(ingredient.suggestedAction);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onToggle}
      style={[
        styles.container,
        isSelected ? styles.selectedContainer : styles.unselectedContainer,
      ]}
    >
      <View style={styles.contentRow}>
        <Text style={[styles.nameText, !isSelected && styles.unselectedText]}>
          {ingredient.name}
        </Text>

        {ingredient.suggestedAction && (
          <View style={[styles.badge, { backgroundColor: actionStyle.bg, borderColor: actionStyle.border }]}>
            <Text style={[styles.badgeText, { color: actionStyle.text }]}>
              {ingredient.suggestedAction}
            </Text>
          </View>
        )}

        {isRemovable && onRemove && (
          <TouchableOpacity
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            style={styles.removeButton}
          >
            <X size={14} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1.5,
  },
  selectedContainer: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  unselectedContainer: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
    opacity: 0.6,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  unselectedText: {
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  removeButton: {
    padding: 2,
    marginLeft: 2,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
  },
});
