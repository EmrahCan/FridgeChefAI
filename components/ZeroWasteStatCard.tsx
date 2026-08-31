import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Leaf, Sparkles, TrendingUp, Utensils } from 'lucide-react-native';
import { UserStats } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  stats: UserStats;
}

export const ZeroWasteStatCard: React.FC<Props> = ({ stats }) => {
  const { t } = useLanguage();

  return (
    <View style={styles.outerContainer}>
      <LinearGradient
        colors={['#0F4A3E', '#062B23']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Ambient Glow Orb Behind */}
        <View style={styles.glowOrb} />

        {/* Top Header Pill */}
        <View style={styles.topHeader}>
          <View style={styles.ecoPill}>
            <Leaf size={12} color="#34D399" />
            <Text style={styles.ecoPillText}>{t('home.ecoPill')}</Text>
          </View>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>{t('home.liveCounter')}</Text>
          </View>
        </View>

        {/* Main Bento Hero Stat */}
        <View style={styles.heroRow}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroNumber}>
              {stats.totalWasteSavedKg.toFixed(1)}
              <Text style={styles.heroUnit}> kg</Text>
            </Text>
            <Text style={styles.heroDescription}>
              {t('home.foodSaved')}
            </Text>
          </View>

          {/* Eco Badge Ring */}
          <View style={styles.ecoRingWrapper}>
            <View style={styles.ecoRingOuter}>
              <View style={styles.ecoRingInner}>
                <Sparkles size={20} color="#34D399" />
              </View>
            </View>
          </View>
        </View>

        {/* Hairline Divider */}
        <View style={styles.hairline} />

        {/* Two Bento Sub-Tiles */}
        <View style={styles.subGrid}>
          <View style={styles.subTile}>
            <View style={[styles.subTileIconBox, { backgroundColor: 'rgba(52, 211, 153, 0.15)' }]}>
              <Utensils size={14} color="#34D399" />
            </View>
            <View>
              <Text style={styles.subTileValue}>{stats.totalMealsCooked}</Text>
              <Text style={styles.subTileLabel}>{t('home.cookedMeals')}</Text>
            </View>
          </View>

          <View style={styles.tileSeparator} />

          <View style={styles.subTile}>
            <View style={[styles.subTileIconBox, { backgroundColor: 'rgba(251, 146, 60, 0.15)' }]}>
              <TrendingUp size={14} color="#FB923C" />
            </View>
            <View>
              <Text style={styles.subTileValue}>~₺{stats.estimatedMoneySavedTL}</Text>
              <Text style={styles.subTileLabel}>{t('home.moneySaved')}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginHorizontal: 18,
    marginBottom: 20,
    shadowColor: '#052F26',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  container: {
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    position: 'relative',
    overflow: 'hidden',
  },
  glowOrb: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(20, 184, 166, 0.25)',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ecoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  ecoPillText: {
    color: '#E6FAF2',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  liveText: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: '700',
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  heroLeft: {
    flex: 1,
  },
  heroNumber: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1.5,
    lineHeight: 46,
  },
  heroUnit: {
    fontSize: 22,
    fontWeight: '600',
    color: '#6EE7B7',
    letterSpacing: 0,
  },
  heroDescription: {
    fontSize: 13,
    fontWeight: '500',
    color: '#D1FAE5',
    marginTop: 2,
  },
  ecoRingWrapper: {
    marginLeft: 14,
  },
  ecoRingOuter: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: 'rgba(52, 211, 153, 0.4)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ecoRingInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hairline: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: 16,
  },
  subGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subTile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  subTileIconBox: {
    width: 34,
    height: 34,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subTileValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subTileLabel: {
    fontSize: 10.5,
    color: '#A7F3D0',
    fontWeight: '500',
  },
  tileSeparator: {
    width: 1,
    height: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginHorizontal: 12,
  },
});
