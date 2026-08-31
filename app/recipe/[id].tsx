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
  Image,
  Modal,
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
  Users,
  Plus,
  Minus,
  Star,
  Volume2,
  VolumeX,
  ShoppingCart,
  Check,
  X,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Recipe } from '../../types';
import { StorageService } from '../../services/storageService';
import { AudioChefService } from '../../services/audioChefService';
import { GroceryService } from '../../services/groceryService';
import { useLanguage } from '../../context/LanguageContext';
import * as Haptics from 'expo-haptics';

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const params = useLocalSearchParams<{ id: string; recipeJson?: string }>();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [servings, setServings] = useState(2);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'cook' | 'prep'>('cook');

  // Audio Chef State
  const [speakingStepIndex, setSpeakingStepIndex] = useState<number | null>(null);

  // Grocery Added Toast state
  const [groceryAdded, setGroceryAdded] = useState(false);

  // Story Card Modal State
  const [storyModalVisible, setStoryModalVisible] = useState(false);

  // Interactive step timer state
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerStepIndex, setTimerStepIndex] = useState<number | null>(null);

  useEffect(() => {
    if (params.recipeJson) {
      try {
        const parsed = JSON.parse(params.recipeJson);
        setRecipe(parsed);
        setServings(parsed.servings || 2);
        checkIfSaved(parsed.id);
      } catch (e) {
        console.error(e);
      }
    }

    return () => {
      AudioChefService.stop();
    };
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
      Alert.alert(t('recipe.timeUpTitle'), t('recipe.timeUpMsg'));
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
        message: `🍳 ${recipe.title}\n${recipe.tagline}\n\n${t('recipe.shareMsg')}`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const adjustServings = (delta: number) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setServings((prev) => Math.max(1, Math.min(12, prev + delta)));
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

  const handleToggleSpeakStep = async (step: any, idx: number) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    if (speakingStepIndex === idx) {
      await AudioChefService.stop();
      setSpeakingStepIndex(null);
    } else {
      setSpeakingStepIndex(idx);
      await AudioChefService.speakStep(
        step.title,
        step.description,
        step.tip || '',
        language,
        () => setSpeakingStepIndex(null)
      );
    }
  };

  const handleAddMissingToGrocery = async () => {
    if (!recipe) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    await GroceryService.addItems(recipe.pantryItemsNeeded, recipe.title);
    setGroceryAdded(true);
    setTimeout(() => setGroceryAdded(false), 3000);
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
    setStoryModalVisible(true);
  };

  const handleShareStory = async () => {
    if (!recipe) return;
    try {
      await Share.share({
        message: `🌱 ${recipe.wasteSavedGrams}g ${t('storyCard.foodSavedBadge')}!\n🍳 "${recipe.title}"\n${recipe.tagline}\n\n#FridgeChefAI #ZeroWaste`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (!recipe) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingBox}>
          <Text>{language === 'en' ? 'Loading recipe...' : 'Tarif yükleniyor...'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80';
  const displayImage = recipe.imageUrl || fallbackImage;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* FULL-BLEED CINEMATIC PHOTOGRAPHY HERO */}
        <View style={styles.heroImageWrapper}>
          <Image source={{ uri: displayImage }} style={styles.heroFoodImage} />
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent', '#F7F8F6']}
            locations={[0, 0.45, 1]}
            style={styles.heroGradientOverlay}
          />

          {/* Floating Glass Navbar Buttons */}
          <SafeAreaView style={styles.floatingNavSafeArea}>
            <View style={styles.floatingNavRow}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.navGlassBtn}
                activeOpacity={0.8}
              >
                <ArrowLeft size={20} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.navActionsRow}>
                <TouchableOpacity
                  onPress={handleShare}
                  style={styles.navGlassBtn}
                  activeOpacity={0.8}
                >
                  <Share2 size={18} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleToggleFavorite}
                  style={styles.navGlassBtn}
                  activeOpacity={0.8}
                >
                  <Heart
                    size={20}
                    color={isSaved ? '#F43F5E' : '#FFFFFF'}
                    fill={isSaved ? '#F43F5E' : 'transparent'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>

        {/* RECIPE CONTENT BODY */}
        <View style={styles.contentBody}>
          {/* Waste Saved Badge & Rating */}
          <View style={styles.badgeRow}>
            <View style={styles.wasteHeroBanner}>
              <Leaf size={14} color="#5EEAD4" />
              <Text style={styles.wasteHeroText}>
                🌱 {recipe.wasteSavedGrams}{t('common.gramsSaved')}
              </Text>
            </View>

            <View style={styles.ratingBadge}>
              <Star size={13} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingText}>4.9 (Masterclass)</Text>
            </View>
          </View>

          {/* Master Title & Tagline */}
          <Text style={styles.titleText}>{recipe.title}</Text>
          <Text style={styles.taglineText}>{recipe.tagline || recipe.description}</Text>

          {/* Bento Metrics Strip */}
          <View style={styles.metricsStrip}>
            <View style={styles.metricTile}>
              <Clock size={16} color="#0F766E" />
              <Text style={styles.metricTileValue}>
                {recipe.prepTimeMinutes + recipe.cookTimeMinutes} {t('common.mins')}
              </Text>
              <Text style={styles.metricTileLabel}>{t('recipe.totalTime')}</Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricTile}>
              <ChefHat size={16} color="#D97706" />
              <Text style={styles.metricTileValue}>
                {recipe.difficulty === 'Kolay' || recipe.difficulty === 'Easy' ? t('common.kolay') : recipe.difficulty === 'Orta' || recipe.difficulty === 'Medium' ? t('common.orta') : t('common.usta')}
              </Text>
              <Text style={styles.metricTileLabel}>{t('recipe.difficulty')}</Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricTile}>
              <Flame size={16} color="#EA580C" />
              <Text style={styles.metricTileValue}>{recipe.caloriesPerServing}</Text>
              <Text style={styles.metricTileLabel}>{t('recipe.calories')}</Text>
            </View>
          </View>

          {/* Servings Adjuster Bar */}
          <View style={styles.servingsBar}>
            <View style={styles.servingsLeft}>
              <Users size={16} color="#0F766E" />
              <Text style={styles.servingsLabel}>{t('recipe.servingsLabel')}:</Text>
              <Text style={styles.servingsCount}>{servings}</Text>
            </View>
            <View style={styles.servingsControls}>
              <TouchableOpacity
                style={styles.servingsBtn}
                onPress={() => adjustServings(-1)}
                disabled={servings <= 1}
              >
                <Minus size={14} color={servings <= 1 ? '#9CA3AF' : '#0F766E'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.servingsBtn}
                onPress={() => adjustServings(1)}
                disabled={servings >= 12}
              >
                <Plus size={14} color={servings >= 12 ? '#9CA3AF' : '#0F766E'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tab Switcher: Cook Timeline vs Ingredients */}
          <View style={styles.tabBarWrapper}>
            <TouchableOpacity
              style={[styles.tabSegment, activeTab === 'cook' && styles.tabSegmentActive]}
              onPress={() => setActiveTab('cook')}
            >
              <Text style={[styles.tabSegmentText, activeTab === 'cook' && styles.tabSegmentTextActive]}>
                {t('recipe.cookTab')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabSegment, activeTab === 'prep' && styles.tabSegmentActive]}
              onPress={() => setActiveTab('prep')}
            >
              <Text style={[styles.tabSegmentText, activeTab === 'prep' && styles.tabSegmentTextActive]}>
                {t('recipe.prepTab')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* FLOATING TIMER CAPSULE (When Active) */}
          {timerSeconds !== null && (
            <View style={styles.floatingTimerCard}>
              <View style={styles.timerTop}>
                <TimerIcon size={18} color="#EA580C" />
                <Text style={styles.timerTopTitle}>
                  {t('recipe.timerTitle')} {Number(timerStepIndex) + 1}
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
                      <Text style={styles.timerPlayBtnText}>{t('recipe.pause')}</Text>
                    </>
                  ) : (
                    <>
                      <Play size={15} color="#FFFFFF" />
                      <Text style={styles.timerPlayBtnText}>{t('recipe.resume')}</Text>
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
                  <Text style={styles.timerResetBtnText}>{t('recipe.closeTimer')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* TAB 1: MASTERCLASS COOKING TIMELINE WITH HANDS-FREE AUDIO CHEF */}
          {activeTab === 'cook' && (
            <View style={styles.timelineContainer}>
              {recipe.instructions.map((step, idx) => {
                const isCompleted = completedSteps.includes(step.stepNumber);
                const isSpeaking = speakingStepIndex === idx;

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
                        <Text style={styles.tipCapsuleText}>{t('recipe.chefTipLabel')} {step.tip}</Text>
                      </View>
                    )}

                    {/* Step Action Buttons: Voice Guide & Timer */}
                    <View style={styles.stepActionsRow}>
                      {/* Audio Chef Button */}
                      <TouchableOpacity
                        style={[styles.audioChefBtn, isSpeaking && styles.audioChefBtnActive]}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleToggleSpeakStep(step, idx);
                        }}
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX size={14} color="#FFFFFF" />
                            <Text style={[styles.audioChefBtnText, { color: '#FFFFFF' }]}>
                              {t('audioChef.stopBtn')}
                            </Text>
                          </>
                        ) : (
                          <>
                            <Volume2 size={14} color="#0F766E" />
                            <Text style={styles.audioChefBtnText}>
                              {t('audioChef.startBtn')}
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>

                      {/* Timer Trigger */}
                      {step.durationMinutes && step.durationMinutes > 0 && (
                        <TouchableOpacity
                          style={styles.timerTriggerBtn}
                          onPress={(e) => {
                            e.stopPropagation();
                            startTimer(step.durationMinutes!, idx);
                          }}
                        >
                          <Clock size={13} color="#0F766E" />
                          <Text style={styles.timerTriggerText}>
                            ⏱️ {step.durationMinutes} {t('common.mins')}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
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
                <Text style={styles.completeMealBtnText}>{t('recipe.finishBtn')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* TAB 2: INGREDIENTS CHECKLIST & SMART GROCERY EXPORT */}
          {activeTab === 'prep' && (
            <View style={styles.prepCard}>
              <View style={styles.prepHeaderRow}>
                <Leaf size={15} color="#0F766E" />
                <Text style={styles.prepHeaderTitle}>{t('recipe.pantryRecoveredTitle')}</Text>
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
                <Text style={styles.prepHeaderTitle}>{t('recipe.pantryBasicsTitle')}</Text>
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

              {/* 1-TAP ADD MISSING TO SMART GROCERY LIST BUTTON */}
              <TouchableOpacity
                style={[styles.addGroceryBtn, groceryAdded && styles.addGroceryBtnSuccess]}
                activeOpacity={0.88}
                onPress={handleAddMissingToGrocery}
              >
                {groceryAdded ? (
                  <>
                    <Check size={16} color="#FFFFFF" />
                    <Text style={styles.addGroceryBtnText}>{t('grocery.addedToast')}</Text>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} color="#FFFFFF" />
                    <Text style={styles.addGroceryBtnText}>{t('grocery.addMissingBtn')}</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Extra Chef Tips */}
              {recipe.chefTips && recipe.chefTips.length > 0 && (
                <View style={styles.chefTipsBox}>
                  <Text style={styles.chefTipsTitle}>{t('recipe.extraTipsTitle')}</Text>
                  {recipe.chefTips.map((t, i) => (
                    <Text key={i} style={styles.chefTipBullet}>• {t}</Text>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* VIRAL 9:16 INSTAGRAM / WHATSAPP STORY CERTIFICATE MODAL */}
      <Modal
        visible={storyModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setStoryModalVisible(false)}
      >
        <View style={styles.storyModalBackdrop}>
          <View style={styles.storyCardContainer}>
            {/* Top Close */}
            <TouchableOpacity
              style={styles.storyCloseBtn}
              onPress={() => {
                setStoryModalVisible(false);
                router.push('/(tabs)');
              }}
            >
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>

            {/* 9:16 Luxury Story Card Background */}
            <View style={styles.storyPhotoWrapper}>
              <Image source={{ uri: displayImage }} style={styles.storyImage} />
              <LinearGradient
                colors={['rgba(0,0,0,0.25)', 'rgba(4, 47, 46, 0.75)', 'rgba(4, 47, 46, 0.98)']}
                locations={[0, 0.4, 1]}
                style={styles.storyGradient}
              />

              <View style={styles.storyContent}>
                <View style={styles.storyCrown}>
                  <Award size={36} color="#5EEAD4" />
                </View>
                <Text style={styles.storyBadgeText}>🌱 FRIDGECHEF AI MASTERCLASS</Text>
                <Text style={styles.storyTitle}>{recipe.title}</Text>
                <Text style={styles.storySavedAmount}>
                  +{recipe.wasteSavedGrams}g {t('storyCard.foodSavedBadge')}
                </Text>

                <View style={styles.storyEcoBox}>
                  <Text style={styles.storyEcoText}>
                    🌍 0.85kg {t('storyCard.carbonOffset')}
                  </Text>
                </View>
              </View>
            </View>

            {/* Share Trigger */}
            <TouchableOpacity
              style={styles.storyShareBtn}
              activeOpacity={0.9}
              onPress={handleShareStory}
            >
              <Share2 size={18} color="#042F2E" />
              <Text style={styles.storyShareBtnText}>{t('storyCard.shareNow')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F6',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8F6',
  },
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 60,
  },
  heroImageWrapper: {
    height: 310,
    width: '100%',
    position: 'relative',
  },
  heroFoodImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroGradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  floatingNavSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  floatingNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? 30 : 6,
  },
  navGlassBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  navActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  contentBody: {
    paddingHorizontal: 18,
    marginTop: -20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  wasteHeroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0F766E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  wasteHeroText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  ratingText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#B45309',
  },
  titleText: {
    fontSize: 25,
    fontWeight: '900',
    color: '#0D1714',
    letterSpacing: -0.6,
    lineHeight: 32,
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
    marginBottom: 14,
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
  servingsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E6EBE8',
    marginBottom: 16,
  },
  servingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  servingsLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3E5049',
  },
  servingsCount: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0F766E',
  },
  servingsControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  servingsBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6F3',
    justifyContent: 'center',
    alignItems: 'center',
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
  stepActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  audioChefBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E6F4F1',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  audioChefBtnActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0B514B',
  },
  audioChefBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  timerTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6F3',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  timerTriggerText: {
    fontSize: 11.5,
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
  addGroceryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0F766E',
    paddingVertical: 13,
    borderRadius: 16,
    marginTop: 18,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  addGroceryBtnSuccess: {
    backgroundColor: '#059669',
  },
  addGroceryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
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
  storyModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  storyCardContainer: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  storyCloseBtn: {
    alignSelf: 'flex-end',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  storyPhotoWrapper: {
    width: '100%',
    height: 440,
    borderRadius: 28,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'rgba(94, 234, 212, 0.4)',
    shadowColor: '#5EEAD4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  storyImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },
  storyGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  storyContent: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  storyCrown: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(94, 234, 212, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#5EEAD4',
  },
  storyBadgeText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#5EEAD4',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  storyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.4,
    lineHeight: 26,
    marginBottom: 8,
  },
  storySavedAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#CCFBF1',
    marginBottom: 12,
  },
  storyEcoBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  storyEcoText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  storyShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#5EEAD4',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 16,
    shadowColor: '#5EEAD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  storyShareBtnText: {
    color: '#042F2E',
    fontSize: 14.5,
    fontWeight: '900',
  },
});
