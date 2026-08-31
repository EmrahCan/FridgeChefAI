import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Share,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Heart,
  Share2,
  Clock,
  Flame,
  ChefHat,
  Leaf,
  CheckCircle2,
  Circle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Award,
  Timer as TimerIcon,
} from 'lucide-react-native';
import { Recipe } from '../../types';
import { StorageService } from '../../services/storageService';
import * as Haptics from 'expo-haptics';

export default function RecipeDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; recipeJson?: string }>();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'cook' | 'prep'>('cook');

  // Interactive step timer state
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerStepIndex, setTimerStepIndex] = useState<number | null>(null);

  useEffect(() => {
    if (params.recipeJson) {
      try {
        const parsed = JSON.parse(params.recipeJson);
        setRecipe(parsed);
        checkIfSaved(parsed.id);
      } catch (e) {
        console.error(e);
      }
    }
  }, [params.recipeJson]);

  // Timer countdown tick
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds !== null && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
      Alert.alert('⏱️ Süre Doldu!', 'Pişirme adımı tamamlandı. Bir sonraki adıma geçebilirsiniz!');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const checkIfSaved = async (id: string) => {
    const saved = await StorageService.isRecipeSaved(id);
    setIsSaved(saved);
  };

  const handleToggleFavorite = async () => {
    if (!recipe) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    const newStatus = await StorageService.toggleSaveRecipe(recipe);
    setIsSaved(newStatus);
  };

  const handleShare = async () => {
    if (!recipe) return;
    try {
      await Share.share({
        message: `🍳 ${recipe.title}\n${recipe.tagline}\n\nFridgeChef AI ile buzdolabımdaki kalan malzemelerle sıfır israfla pişirdim! 🌱`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleStep = (stepNumber: number) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const toggleIngredient = (name: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setCheckedIngredients((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const startTimer = (minutes: number, stepIndex: number) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    setTimerStepIndex(stepIndex);
    setTimerSeconds(minutes * 60);
    setIsTimerRunning(true);
  };

  const handleCompleteMeal = async () => {
    if (!recipe) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}

    await StorageService.recordMealCooked(recipe.wasteSavedGrams || 350);

    Alert.alert(
      '🎉 Tebrikler Şef!',
      `Bu tarifle ${recipe.wasteSavedGrams}g gıda israfını önlediniz ve mutfağınıza lezzet kattınız! Sıfır israf puanınız arttı. 🌱`,
      [
        {
          text: 'Harika!',
          onPress: () => router.push('/(tabs)'),
        },
      ]
    );
  };

  if (!recipe) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingBox}>
          <Text>Tarif yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <ArrowLeft size={20} color="#0D1714" />
        </TouchableOpacity>

        <View style={styles.navActions}>
          <TouchableOpacity onPress={handleShare} style={styles.navIconBtn}>
            <Share2 size={19} color="#3E5049" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToggleFavorite} style={styles.navIconBtn}>
            <Heart
              size={21}
              color={isSaved ? '#E11D48' : '#3E5049'}
              fill={isSaved ? '#E11D48' : 'transparent'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Waste Saved Badge */}
        <View style={styles.wasteHeroBanner}>
          <Leaf size={14} color="#0F766E" />
          <Text style={styles.wasteHeroText}>
            🌱 Bu tarifle {recipe.wasteSavedGrams}g gıda kurtarıldı!
          </Text>
        </View>

        {/* Master Title & Tagline */}
        <Text style={styles.titleText}>{recipe.title}</Text>
        <Text style={styles.taglineText}>{recipe.tagline || recipe.description}</Text>

        {/* Bento Metrics Strip */}
        <View style={styles.metricsStrip}>
          <View style={styles.metricTile}>
            <Clock size={16} color="#0F766E" />
            <Text style={styles.metricTileValue}>
              {recipe.prepTimeMinutes + recipe.cookTimeMinutes} dk
            </Text>
            <Text style={styles.metricTileLabel}>Toplam Süre</Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricTile}>
            <ChefHat size={16} color="#D97706" />
            <Text style={styles.metricTileValue}>{recipe.difficulty}</Text>
            <Text style={styles.metricTileLabel}>Zorluk</Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricTile}>
            <Flame size={16} color="#EA580C" />
            <Text style={styles.metricTileValue}>{recipe.caloriesPerServing}</Text>
            <Text style={styles.metricTileLabel}>kcal/Porsiyon</Text>
          </View>
        </View>

        {/* Tab Switcher: Cook Timeline vs Ingredients */}
        <View style={styles.tabBarWrapper}>
          <TouchableOpacity
            style={[styles.tabSegment, activeTab === 'cook' && styles.tabSegmentActive]}
            onPress={() => setActiveTab('cook')}
          >
            <Text style={[styles.tabSegmentText, activeTab === 'cook' && styles.tabSegmentTextActive]}>
              👨‍🍳 Pişirme Adımları
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabSegment, activeTab === 'prep' && styles.tabSegmentActive]}
            onPress={() => setActiveTab('prep')}
          >
            <Text style={[styles.tabSegmentText, activeTab === 'prep' && styles.tabSegmentTextActive]}>
              🥗 Malzemeler
            </Text>
          </TouchableOpacity>
        </View>

        {/* FLOATING TIMER CAPSULE (When Active) */}
        {timerSeconds !== null && (
          <View style={styles.floatingTimerCard}>
            <View style={styles.timerTop}>
              <TimerIcon size={18} color="#EA580C" />
              <Text style={styles.timerTopTitle}>
                Adım {Number(timerStepIndex) + 1} Pişirme Sayacı
              </Text>
            </View>
            <Text style={styles.timerValue}>{formatTimer(timerSeconds)}</Text>
            <View style={styles.timerActionsRow}>
              <TouchableOpacity
                style={styles.timerPlayBtn}
                onPress={() => setIsTimerRunning(!isTimerRunning)}
              >
                {isTimerRunning ? (
                  <>
                    <Pause size={15} color="#FFFFFF" />
                    <Text style={styles.timerPlayBtnText}>Duraklat</Text>
                  </>
                ) : (
                  <>
                    <Play size={15} color="#FFFFFF" />
                    <Text style={styles.timerPlayBtnText}>Devam Et</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.timerResetBtn}
                onPress={() => {
                  setTimerSeconds(null);
                  setIsTimerRunning(false);
                }}
              >
                <RotateCcw size={15} color="#4B5563" />
                <Text style={styles.timerResetBtnText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 1: MASTERCLASS COOKING TIMELINE */}
        {activeTab === 'cook' && (
          <View style={styles.timelineContainer}>
            {recipe.instructions.map((step, idx) => {
              const isCompleted = completedSteps.includes(step.stepNumber);
              return (
                <TouchableOpacity
                  key={step.stepNumber}
                  activeOpacity={0.92}
                  onPress={() => toggleStep(step.stepNumber)}
                  style={[styles.stepCard, isCompleted && styles.stepCardDone]}
                >
                  <View style={styles.stepCardHeader}>
                    <View style={[styles.stepNode, isCompleted && styles.stepNodeDone]}>
                      <Text style={[styles.stepNodeNumber, isCompleted && styles.stepNodeNumberDone]}>
                        {step.stepNumber}
                      </Text>
                    </View>
                    <Text style={[styles.stepTitle, isCompleted && styles.stepTitleDone]}>
                      {step.title}
                    </Text>
                    {isCompleted ? (
                      <CheckCircle2 size={22} color="#0F766E" />
                    ) : (
                      <Circle size={22} color="#C4D1CB" />
                    )}
                  </View>

                  <Text style={[styles.stepDesc, isCompleted && styles.stepDescDone]}>
                    {step.description}
                  </Text>

                  {step.tip && (
                    <View style={styles.tipCapsule}>
                      <Sparkles size={13} color="#D97706" />
                      <Text style={styles.tipCapsuleText}>Şef Püf Noktası: {step.tip}</Text>
                    </View>
                  )}

                  {step.durationMinutes && step.durationMinutes > 0 && (
                    <TouchableOpacity
                      style={styles.timerTriggerBtn}
                      onPress={() => startTimer(step.durationMinutes!, idx)}
                    >
                      <Clock size={13} color="#0F766E" />
                      <Text style={styles.timerTriggerText}>
                        ⏱️ {step.durationMinutes} dk Sayacı Başlat
                      </Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* CELEBRATION FINISH BUTTON */}
            <TouchableOpacity
              style={styles.completeMealBtn}
              activeOpacity={0.9}
              onPress={handleCompleteMeal}
            >
              <Award size={20} color="#5EEAD4" />
              <Text style={styles.completeMealBtnText}>🎉 Yemeği Pişirdim & İsrafı Önledim</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* TAB 2: INGREDIENTS CHECKLIST */}
        {activeTab === 'prep' && (
          <View style={styles.prepCard}>
            <View style={styles.prepHeaderRow}>
              <Leaf size={15} color="#0F766E" />
              <Text style={styles.prepHeaderTitle}>Dolaptan Kurtarılan Malzemeler</Text>
            </View>
            {recipe.ingredientsUsed.map((ing, idx) => {
              const isChecked = checkedIngredients.includes(ing);
              return (
                <TouchableOpacity
                  key={`used-${idx}`}
                  style={styles.checkItemRow}
                  onPress={() => toggleIngredient(ing)}
                >
                  {isChecked ? (
                    <CheckCircle2 size={18} color="#0F766E" />
                  ) : (
                    <Circle size={18} color="#A7B7AF" />
                  )}
                  <Text style={[styles.checkItemText, isChecked && styles.checkItemTextChecked]}>
                    {ing}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <View style={[styles.prepHeaderRow, { marginTop: 22 }]}>
              <ChefHat size={15} color="#EA580C" />
              <Text style={styles.prepHeaderTitle}>Mutfaktaki Temel Malzemeler</Text>
            </View>
            {recipe.pantryItemsNeeded.map((item, idx) => {
              const isChecked = checkedIngredients.includes(item);
              return (
                <TouchableOpacity
                  key={`pantry-${idx}`}
                  style={styles.checkItemRow}
                  onPress={() => toggleIngredient(item)}
                >
                  {isChecked ? (
                    <CheckCircle2 size={18} color="#0F766E" />
                  ) : (
                    <Circle size={18} color="#A7B7AF" />
                  )}
                  <Text style={[styles.checkItemText, isChecked && styles.checkItemTextChecked]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* Extra Chef Tips */}
            {recipe.chefTips && recipe.chefTips.length > 0 && (
              <View style={styles.chefTipsBox}>
                <Text style={styles.chefTipsTitle}>👨‍🍳 Şefin İlave Tavsiyeleri</Text>
                {recipe.chefTips.map((t, i) => (
                  <Text key={i} style={styles.chefTipBullet}>• {t}</Text>
                ))}
              </View>
            )}
          </View>
        )}
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
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E6EBE8',
  },
  navBtn: {
    padding: 6,
  },
  navActions: {
    flexDirection: 'row',
    gap: 12,
  },
  navIconBtn: {
    padding: 6,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 50,
  },
  wasteHeroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  wasteHeroText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  titleText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0D1714',
    letterSpacing: -0.6,
    lineHeight: 30,
    marginBottom: 6,
  },
  taglineText: {
    fontSize: 14,
    color: '#556860',
    lineHeight: 20,
    marginBottom: 18,
  },
  metricsStrip: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6EBE8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  metricTile: {
    alignItems: 'center',
  },
  metricTileValue: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0D1714',
    marginTop: 3,
  },
  metricTileLabel: {
    fontSize: 10.5,
    color: '#7D9087',
    fontWeight: '600',
  },
  metricDivider: {
    width: 1,
    height: 26,
    backgroundColor: '#E6EBE8',
  },
  tabBarWrapper: {
    flexDirection: 'row',
    backgroundColor: '#E6EBE8',
    borderRadius: 16,
    padding: 4,
    marginBottom: 18,
  },
  tabSegment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabSegmentActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  tabSegmentText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#687E74',
  },
  tabSegmentTextActive: {
    color: '#0D1714',
    fontWeight: '800',
  },
  floatingTimerCard: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1.5,
    borderColor: '#FDBA74',
    borderRadius: 22,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  timerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  timerTopTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#C2410C',
  },
  timerValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#9A3412',
    letterSpacing: 2,
    marginVertical: 4,
  },
  timerActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  timerPlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EA580C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
  },
  timerPlayBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  timerResetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  timerResetBtnText: {
    color: '#4B5563',
    fontWeight: '700',
    fontSize: 12,
  },
  timelineContainer: {
    gap: 12,
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E6EBE8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  stepCardDone: {
    backgroundColor: '#F5F7F6',
    borderColor: '#CCFBF1',
    opacity: 0.85,
  },
  stepCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNode: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stepNodeDone: {
    backgroundColor: '#0F766E',
  },
  stepNodeNumber: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F766E',
  },
  stepNodeNumberDone: {
    color: '#FFFFFF',
  },
  stepTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: '#0D1714',
  },
  stepTitleDone: {
    color: '#7D9087',
    textDecorationLine: 'line-through',
  },
  stepDesc: {
    fontSize: 13,
    color: '#3E5049',
    lineHeight: 20,
    marginBottom: 8,
  },
  stepDescDone: {
    color: '#8A9C93',
  },
  tipCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    marginTop: 4,
  },
  tipCapsuleText: {
    flex: 1,
    fontSize: 11.5,
    color: '#92400E',
    fontWeight: '700',
  },
  timerTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    marginTop: 10,
  },
  timerTriggerText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
  },
  completeMealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0F766E',
    paddingVertical: 17,
    borderRadius: 22,
    marginTop: 14,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  completeMealBtnText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '900',
  },
  prepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E6EBE8',
  },
  prepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  prepHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0D1714',
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F6F4',
  },
  checkItemText: {
    fontSize: 13.5,
    color: '#2C3E36',
    fontWeight: '600',
  },
  checkItemTextChecked: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  chefTipsBox: {
    marginTop: 20,
    backgroundColor: '#FFFBEB',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  chefTipsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
    marginBottom: 6,
  },
  chefTipBullet: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
    marginBottom: 3,
  },
});
