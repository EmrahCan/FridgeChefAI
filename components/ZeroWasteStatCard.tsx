import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Leaf, Award, TrendingUp, Utensils } from 'lucide-react-native';
import { UserStats } from '../types';

interface Props {
  stats: UserStats;
}

export const ZeroWasteStatCard: React.FC<Props> = ({ stats }) => {
  return (
    <LinearGradient
      colors={['#059669', '#10B981']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.badgePill}>
          <Leaf size={14} color="#059669" />
          <Text style={styles.badgeText}>Sıfır İsraf Etkisi</Text>
        </View>
        <Award size={20} color="#FEF08A" />
      </View>

      <Text style={styles.heroNumber}>
        {stats.totalWasteSavedKg.toFixed(1)} <Text style={styles.heroUnit}>kg</Text>
      </Text>
      <Text style={styles.heroLabel}>Gıda İsrafı Önlenerek Kurtarıldı 🌱</Text>

      <View style={styles.divider} />

      <View style={styles.subStatsRow}>
        <View style={styles.subStat}>
          <Utensils size={15} color="#D1FAE5" />
          <View>
            <Text style={styles.subStatValue}>{stats.totalMealsCooked}</Text>
            <Text style={styles.subStatLabel}>Pişirilen Tarif</Text>
          </View>
        </View>

        <View style={styles.statSeparator} />

        <View style={styles.subStat}>
          <TrendingUp size={15} color="#FEF08A" />
          <View>
            <Text style={styles.subStatValue}>~₺{stats.estimatedMoneySavedTL}</Text>
            <Text style={styles.subStatLabel}>Tasarruf Edildi</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
    textTransform: 'uppercase',
  },
  heroNumber: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 42,
  },
  heroUnit: {
    fontSize: 22,
    fontWeight: '600',
    color: '#D1FAE5',
  },
  heroLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#ECFDF5',
    marginTop: 2,
    marginBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 14,
  },
  subStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  subStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statSeparator: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  subStatValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subStatLabel: {
    fontSize: 11,
    color: '#D1FAE5',
  },
});
