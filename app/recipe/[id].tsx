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
  const [activeTab, setActiveTab] = useState<'prep' | 'cook'>('cook');
  const [isCookedDone, setIsCookedDone] = useState(false);

  // Simple step timer state
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
    setCheckedIngredients((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const startTimer = (minutes: number, stepIndex: number) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
    setIsCookedDone(true);

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
      {/* Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>

        <View style={styles.navActions}>
          <TouchableOpacity onPress={handleShare} style={styles.navBtn}>
            <Share2 size={20} color="#4B5563" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToggleFavorite} style={styles.navBtn}>
            <Heart
              size={22}
              color={isSaved ? '#EF4444' : '#4B5563'}
              fill={isSaved ? '#EF4444' : 'transparent'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Waste Saved Hero Badge */}
        <View style={styles.wasteHeroBanner}>
          <Leaf size={16} color="#059669" />
          <Text style={styles.wasteHeroText}>
            Bu tarifle {recipe.wasteSavedGrams}g gıdanın çöpe gitmesi önlendi! 🌱
          </Text>
        </View>

        {/* Title & Tagline */}
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.tagline}>{recipe.tagline || recipe.description}</Text>

        {/* Key Metrics Bar */}
        <View style={styles.metricsBar}>
          <View style={styles.metricItem}>
            <Clock size={16} color="#10B981" />
            <Text style={styles.metricValue}>
              {recipe.prepTimeMinutes + recipe.cookTimeMinutes} dk
            </Text>
            <Text style={styles.metricLabel}>Toplam Süre</Text>
          </View>

          <View style={styles.metricSeparator} />

          <View style={styles.metricItem}>
            <ChefHat size={16} color="#F97316" />
            <Text style={styles.metricValue}>{recipe.difficulty}</Text>
            <Text style={styles.metricLabel}>Zorluk</Text>
          </View>

          <View style={styles.metricSeparator} />

          <View style={styles.metricItem}>
            <Flame size={16} color="#EF4444" />
            <Text style={styles.metricValue}>{recipe.caloriesPerServing}</Text>
            <Text style={styles.metricLabel}>kcal / Porsiyon</Text>
          </View>
        </View>

        {/* Tab Switcher: Cook vs Prep */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'cook' && styles.tabBtnActive]}
            onPress={() => setActiveTab('cook')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'cook' && styles.tabBtnTextActive]}>
              👨‍🍳 Pişirme Adımları
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'prep' && styles.tabBtnActive]}
            onPress={() => setActiveTab('prep')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'prep' && styles.tabBtnTextActive]}>
              🥗 Malzemeler
            </Text>
          </TouchableOpacity>
        </View>

        {/* Active Timer Box if running */}
        {timerSeconds !== null && (
          <View style={styles.activeTimerCard}>
            <View style={styles.timerHeader}>
              <Clock size={18} color="#EA580C" />
              <Text style={styles.timerTitle}>
                Adım {Number(timerStepIndex) + 1} Zamanlayıcısı
              </Text>
            </View>
            <Text style={styles.timerValue}>{formatTimer(timerSeconds)}</Text>
            <View style={styles.timerControlRow}>
              <TouchableOpacity
                style={styles.timerActionBtn}
                onPress={() => setIsTimerRunning(!isTimerRunning)}
              >
                {isTimerRunning ? (
                  <>
                    <Pause size={16} color="#FFFFFF" />
                    <Text style={styles.timerActionText}>Duraklat</Text>
                  </>
                ) : (
                  <>
                    <Play size={16} color="#FFFFFF" />
                    <Text style={styles.timerActionText}>Devam Et</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.timerActionBtn, styles.timerResetBtn]}
                onPress={() => {
                  setTimerSeconds(null);
                  setIsTimerRunning(false);
                }}
              >
                <RotateCcw size={16} color="#4B5563" />
                <Text style={[styles.timerActionText, { color: '#4B5563' }]}>Sıfırla</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 1: COOKING STEPS */}
        {activeTab === 'cook' && (
          <View style={styles.stepsContainer}>
            {recipe.instructions.map((step, idx) => {
              const isCompleted = completedSteps.includes(step.stepNumber);
              return (
                <TouchableOpacity
                  key={step.stepNumber}
                  activeOpacity={0.9}
                  onPress={() => toggleStep(step.stepNumber)}
                  style={[styles.stepCard, isCompleted && styles.stepCardCompleted]}
                >
                  <View style={styles.stepHeader}>
                    <View style={styles.stepNumBadge}>
                      <Text style={styles.stepNumText}>{step.stepNumber}</Text>
                    </View>
                    <Text style={[styles.stepTitle, isCompleted && styles.stepTitleCompleted]}>
                      {step.title}
                    </Text>
                    {isCompleted ? (
                      <CheckCircle2 size={22} color="#10B981" />
                    ) : (
                      <Circle size={22} color="#D1D5DB" />
                    )}
                  </View>

                  <Text
                    style={[
                      styles.stepDescription,
                      isCompleted && styles.stepDescriptionCompleted,
                    ]}
                  >
                    {step.description}
                  </Text>

                  {step.tip && (
                    <View style={styles.stepTipBox}>
                      <Sparkles size={14} color="#D97706" />
                      <Text style={styles.stepTipText}>Şef İpucu: {step.tip}</Text>
                    </View>
                  )}

                  {step.durationMinutes && step.durationMinutes > 0 && (
                    <TouchableOpacity
                      style={styles.stepTimerTrigger}
                      onPress={() => startTimer(step.durationMinutes!, idx)}
                    >
                      <Clock size={14} color="#059669" />
                      <Text style={styles.stepTimerTriggerText}>
                        ⏱️ {step.durationMinutes} dk Sayacı Başlat
                      </Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Complete Cook Action */}
            <TouchableOpacity style={styles.finishBtn} onPress={handleCompleteMeal}>
              <Award size={20} color="#FFFFFF" />
              <Text style={styles.finishBtnText}>🎉 Yemeği Pişirdim! (İsrafı Önledim)</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* TAB 2: INGREDIENTS CHECKLIST */}
        {activeTab === 'prep' && (
          <View style={styles.ingredientsContainer}>
            <View style={styles.ingSectionHeader}>
              <Leaf size={16} color="#059669" />
              <Text style={styles.ingSectionTitle}>Dolaptan Kurtarılan Malzemeler</Text>
            </View>
            {recipe.ingredientsUsed.map((ing, idx) => {
              const isChecked = checkedIngredients.includes(ing);
              return (
                <TouchableOpacity
                  key={`used-${idx}`}
                  style={styles.ingItem}
                  onPress={() => toggleIngredient(ing)}
                >
                  {isChecked ? (
                    <CheckCircle2 size={18} color="#10B981" />
                  ) : (
                    <Circle size={18} color="#9CA3AF" />
                  )}
                  <Text style={[styles.ingItemText, isChecked && styles.ingItemTextChecked]}>
                    {ing}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <View style={[styles.ingSectionHeader, { marginTop: 20 }]}>
              <ChefHat size={16} color="#F97316" />
              <Text style={styles.ingSectionTitle}>Mutfaktaki Temel Malzemeler</Text>
            </View>
            {recipe.pantryItemsNeeded.map((item, idx) => {
              const isChecked = checkedIngredients.includes(item);
              return (
                <TouchableOpacity
                  key={`pantry-${idx}`}
                  style={styles.ingItem}
                  onPress={() => toggleIngredient(item)}
                >
                  {isChecked ? (
                    <CheckCircle2 size={18} color="#10B981" />
                  ) : (
                    <Circle size={18} color="#9CA3AF" />
                  )}
                  <Text style={[styles.ingItemText, isChecked && styles.ingItemTextChecked]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* Chef Tips List */}
            {recipe.chefTips && recipe.chefTips.length > 0 && (
              <View style={styles.chefTipsContainer}>
                <Text style={styles.chefTipsHeader}>👨‍🍳 Şefin Ekstra Tavsiyeleri</Text>
                {recipe.chefTips.map((tip, idx) => (
                  <Text key={idx} style={styles.chefTipItem}>
                    • {tip}
                  </Text>
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
    backgroundColor: '#F9FAFB',
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  navBtn: {
    padding: 6,
  },
  navActions: {
    flexDirection: 'row',
    gap: 12,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 50,
  },
  wasteHeroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 12,
  },
  wasteHeroText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 6,
    lineHeight: 28,
  },
  tagline: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  metricsBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  metricLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  metricSeparator: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 14,
    padding: 4,
    marginBottom: 18,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  tabBtnTextActive: {
    color: '#111827',
  },
  activeTimerCard: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1.5,
    borderColor: '#FDBA74',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    marginBottom: 18,
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  timerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EA580C',
  },
  timerValue: {
    fontSize: 34,
    fontWeight: '900',
    color: '#9A3412',
    letterSpacing: 2,
    marginVertical: 4,
  },
  timerControlRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  timerActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EA580C',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  timerResetBtn: {
    backgroundColor: '#E5E7EB',
  },
  timerActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  stepsContainer: {
    gap: 12,
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  stepCardCompleted: {
    backgroundColor: '#F9FAFB',
    borderColor: '#A7F3D0',
    opacity: 0.85,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  stepNumText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  stepTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  stepTitleCompleted: {
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  stepDescription: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  stepDescriptionCompleted: {
    color: '#9CA3AF',
  },
  stepTipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 4,
  },
  stepTipText: {
    flex: 1,
    fontSize: 11,
    color: '#92400E',
    fontWeight: '600',
  },
  stepTimerTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  stepTimerTriggerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  finishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 18,
    marginTop: 14,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  finishBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  ingredientsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  ingSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  ingSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  ingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  ingItemText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  ingItemTextChecked: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  chefTipsContainer: {
    marginTop: 20,
    backgroundColor: '#FFFBEB',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  chefTipsHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
    marginBottom: 6,
  },
  chefTipItem: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
    marginBottom: 2,
  },
});
