import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Platform,
  Image,
  Modal,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Camera,
  Sparkles,
  Lightbulb,
  ArrowRight,
  ChefHat,
  ScanLine,
  Globe,
  Star,
  Clock,
  Leaf,
  Hourglass,
  AlertTriangle,
  ShoppingCart,
  CheckCircle2,
  Circle,
  Trash2,
  Share2,
  X,
  Flame,
  Plus,
  Calendar,
  Check,
  Zap,
} from 'lucide-react-native';
import { TextInput, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { GeminiService } from '../../services/geminiService';
import { LinearGradient } from 'expo-linear-gradient';
import { ZeroWasteStatCard } from '../../components/ZeroWasteStatCard';
import { RecipeCard } from '../../components/RecipeCard';
import { StorageService } from '../../services/storageService';
import { PantryRadarService, ExpiryItem } from '../../services/pantryRadarService';
import { GroceryService, GroceryItem } from '../../services/groceryService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getDemoPresets, ZERO_WASTE_TIPS, DemoPreset, getDailyRotatedData } from '../../constants/MockData';
import { Recipe, UserStats } from '../../types';
import * as Haptics from 'expo-haptics';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();

  const [stats, setStats] = useState<UserStats>({
    totalMealsCooked: 0,
    totalWasteSavedKg: 0,
    estimatedMoneySavedTL: 0,
  });
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [radarItems, setRadarItems] = useState<ExpiryItem[]>([]);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [groceryModalVisible, setGroceryModalVisible] = useState(false);
  const [tipModalVisible, setTipModalVisible] = useState(false);
  const [streakModalVisible, setStreakModalVisible] = useState(false);
  const [isAddRadarModalOpen, setIsAddRadarModalOpen] = useState(false);
  const [customRadarName, setCustomRadarName] = useState('');
  const [customRadarDays, setCustomRadarDays] = useState(4);
  const [customRadarIsOpened, setCustomRadarIsOpened] = useState(false);
  const [isScanningOCR, setIsScanningOCR] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [randomTipIndex, setRandomTipIndex] = useState(0);

  const dailyData = getDailyRotatedData(language);
  const presets = dailyData.rotatedPresets;
  const primaryPreset = dailyData.currentPreset;
  const spotlightRecipe = dailyData.spotlightRecipe;
  const currentTips = dailyData.allTips;
  const currentTip = currentTips[randomTipIndex % currentTips.length] || dailyData.currentTip;

  const loadData = async () => {
    try {
      const currentStats = await StorageService.getUserStats();
      const saved = await StorageService.getSavedRecipes();
      const radar = await PantryRadarService.getRadarItems(language);
      const groceries = await GroceryService.getItems();

      setStats(currentStats);
      setSavedRecipes(saved);
      setRadarItems(radar);
      setGroceryItems(groceries);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    setRandomTipIndex(dailyData.dayOfYear);
  }, [language]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRandomTipIndex((prev) => prev + 1);
    setRefreshing(false);
  };

  const handleToggleOpened = async (item: ExpiryItem) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    const updated = await PantryRadarService.toggleOpenedStatus(item.id, language);
    setRadarItems(updated);
  };

  const handleRemoveRadarItem = async (id: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    const updated = await PantryRadarService.removeRadarItem(id, language);
    setRadarItems(updated);
  };

  const handleAddManualRadarItem = async () => {
    if (!customRadarName.trim()) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    const updated = await PantryRadarService.addManualItem(
      {
        name: customRadarName.trim(),
        daysRemaining: customRadarDays,
        isOpened: customRadarIsOpened,
      },
      language
    );
    setRadarItems(updated);
    setCustomRadarName('');
    setCustomRadarDays(4);
    setCustomRadarIsOpened(false);
    setIsAddRadarModalOpen(false);
  };

  const handleScanSKTWithCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          language === 'en' ? 'Camera Permission' : 'Kamera İzni',
          language === 'en'
            ? 'Camera permission is required to scan expiration date.'
            : 'Son kullanma tarihini okumak için kamera izni gereklidir.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0].base64) {
        setIsScanningOCR(true);
        const res = await GeminiService.scanExpiryDateFromImage(result.assets[0].base64, language);
        setIsScanningOCR(false);

        if (res.daysRemaining) {
          setCustomRadarDays(res.daysRemaining);
          Alert.alert(
            language === 'en' ? 'SKT Detected! 🎯' : 'SKT Okundu! 🎯',
            language === 'en'
              ? `Expiry Date: ${res.dateStr || ''} (${res.daysRemaining} days remaining set)`
              : `Son Kullanma Tarihi: ${res.dateStr || ''} (${res.daysRemaining} gün kaldı olarak ayarlandı)`
          );
        }
      }
    } catch (e) {
      console.error(e);
      setIsScanningOCR(false);
    }
  };

  const handleToggleSave = async (recipe: Recipe) => {
    await StorageService.toggleSaveRecipe(recipe);
    await loadData();
  };

  const handleStartScan = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    router.push('/(tabs)/scan');
  };

  const handleSelectPreset = (preset: DemoPreset) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    router.push({
      pathname: '/recipe/review',
      params: {
        ingredientsJson: JSON.stringify(preset.ingredients),
        summaryText: language === 'en'
          ? `${preset.name} loaded for culinary review.`
          : `${preset.name} malzemeleri inceleniyor.`,
      },
    });
  };

  const handleToggleGrocery = async (id: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    const updated = await GroceryService.toggleItem(id);
    setGroceryItems(updated);
  };

  const handleClearCompletedGroceries = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    const updated = await GroceryService.clearCompleted();
    setGroceryItems(updated);
  };

  const handleExportGroceries = async () => {
    const text = GroceryService.formatForExport(groceryItems, language);
    if (!text) return;
    try {
      await Share.share({ message: text });
    } catch (e) {
      console.error(e);
    }
  };

  const dateLocale = language === 'en' ? 'en-US' : 'tr-TR';

  return (
    <View style={styles.safeArea}>
      {/* FULL CINEMATIC DARK GOURMET BACKGROUND */}
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=80',
        }}
        style={styles.ambientBackgroundImage}
      />
      <LinearGradient
        colors={['rgba(4, 31, 26, 0.70)', 'rgba(4, 47, 46, 0.88)', '#041F1A']}
        locations={[0, 0.45, 1]}
        style={styles.ambientGradientOverlay}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 20) + 8,
            paddingBottom: Math.max(insets.bottom, 20) + 80,
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0F766E" />
        }
      >
        {/* Editorial Top Bar with Streak 🔥 and Grocery Button */}
        <View style={styles.topBar}>
          <View style={styles.topLeftCol}>
            <Text style={styles.dateLabel}>
              {new Date().toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
            </Text>
            <Text style={styles.greetingText} numberOfLines={1}>
              {t('home.greeting')} {user?.name?.split(' ')[0] || t('home.defaultChef')} 👋
            </Text>
          </View>

          <View style={styles.topRightRow}>
            {/* Cooking Streak Badge */}
            <TouchableOpacity
              style={styles.streakBadge}
              activeOpacity={0.8}
              onPress={() => {
                try {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                } catch {}
                setStreakModalVisible(true);
              }}
            >
              <Flame size={13} color="#EA580C" fill="#EA580C" />
              <Text style={styles.streakBadgeText}>{stats.totalMealsCooked || 0} 🔥</Text>
            </TouchableOpacity>

            {/* Smart Grocery Cart Trigger */}
            <TouchableOpacity
              style={styles.groceryBtn}
              activeOpacity={0.8}
              onPress={() => setGroceryModalVisible(true)}
            >
              <ShoppingCart size={14} color="#5EEAD4" />
              {groceryItems.length > 0 && (
                <View style={styles.groceryBadgeCount}>
                  <Text style={styles.groceryBadgeCountText}>{groceryItems.length}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Quick Language Toggle Pill */}
            <TouchableOpacity
              style={styles.langPill}
              activeOpacity={0.8}
              onPress={toggleLanguage}
            >
              <Globe size={12} color="#5EEAD4" />
              <Text style={styles.langPillText}>{language.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PANTRY EXPIRY RADAR WIDGET (Step 5 - Always Visible) */}
        <View style={styles.radarWrapper}>
          <View style={styles.radarHeader}>
            <View style={styles.radarHeaderLeft}>
              <View style={styles.radarIconHalo}>
                <Hourglass size={16} color="#0F766E" />
              </View>
              <View>
                <Text style={styles.radarMainTitle}>
                  {language === 'en' ? 'Pantry Expiry Radar' : 'Dolap Tazelik Radarı'} ⏳
                </Text>
                <Text style={styles.radarSubtitle}>
                  {radarItems.length > 0
                    ? (language === 'en'
                        ? `${radarItems.length} items nearing shelf-life`
                        : `Tüketilmesi gereken ${radarItems.length} malzeme var`)
                    : (language === 'en'
                        ? 'Pantry is clear • Tap + to add items'
                        : 'Dolabınız taze • Ürün eklemek için dokunun')}
                </Text>
              </View>
            </View>

            {/* Add / OCR SKT Trigger Button */}
            <TouchableOpacity
              style={styles.addRadarHeaderBtn}
              activeOpacity={0.85}
              onPress={() => setIsAddRadarModalOpen(true)}
            >
              <Plus size={13} color="#5EEAD4" />
              <Text style={styles.addRadarHeaderBtnText}>
                {language === 'en' ? '+ Add / 📷 OCR' : '+ Ekle / 📷 SKT'}
              </Text>
            </TouchableOpacity>
          </View>

          {radarItems.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.radarScroll}
            >
              {radarItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.radarCard,
                    item.urgency === 'critical' ? styles.radarCardCritical : styles.radarCardWarning,
                  ]}
                  activeOpacity={0.88}
                  onPress={handleStartScan}
                >
                  {/* Card Top: Food Avatar, Urgency Pill & Quick Delete */}
                  <View style={styles.radarCardHeader}>
                    <View style={styles.foodAvatarCircle}>
                      <Text style={styles.foodAvatarEmoji}>{item.icon || '🍲'}</Text>
                    </View>
                    <View style={styles.radarCardHeaderRight}>
                      <View
                        style={[
                          styles.urgencyCapsule,
                          item.urgency === 'critical' ? styles.urgencyCapsuleCritical : styles.urgencyCapsuleWarning,
                        ]}
                      >
                        <Flame
                          size={9}
                          color={item.urgency === 'critical' ? '#E11D48' : '#D97706'}
                          fill={item.urgency === 'critical' ? '#E11D48' : '#D97706'}
                        />
                        <Text
                          style={[
                            styles.urgencyCapsuleText,
                            { color: item.urgency === 'critical' ? '#BE123C' : '#B45309' },
                          ]}
                        >
                          {item.daysRemaining === 1
                            ? (language === 'en' ? '1d' : '1 Gün')
                            : `${item.daysRemaining}${language === 'en' ? 'd' : 'g'}`}
                        </Text>
                      </View>

                      {/* Quick Delete Trash Button */}
                      <TouchableOpacity
                        style={styles.radarCardDeleteBtn}
                        activeOpacity={0.75}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleRemoveRadarItem(item.id);
                        }}
                      >
                        <Trash2 size={11} color="#FDA4AF" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={styles.radarItemName} numberOfLines={2}>
                    {item.name}
                  </Text>

                  {/* 1-Tap Opened Package Status Switcher */}
                  <TouchableOpacity
                    style={[styles.openStatusPill, item.isOpened && styles.openStatusPillActive]}
                    activeOpacity={0.8}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleToggleOpened(item);
                    }}
                  >
                    <Text style={[styles.openStatusPillText, item.isOpened && styles.openStatusPillTextActive]}>
                      {item.isOpened
                        ? (language === 'en' ? '🔓 Opened (4d)' : '🔓 Kapağı Açıldı')
                        : (language === 'en' ? '🔒 Sealed Pack' : '🔒 Kapağı Kapalı')}
                    </Text>
                  </TouchableOpacity>

                  {/* Tactile Mini Action Button */}
                  <View style={styles.cookActionPill}>
                    <Text style={styles.cookActionPillText}>
                      {language === 'en' ? 'Cook with this' : 'Tarif Üret'}
                    </Text>
                    <ArrowRight size={11} color="#0F766E" />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            /* EMPTY RADAR STATE - PERMANENT EASY ENTRY */
            <TouchableOpacity
              style={styles.radarEmptyCard}
              activeOpacity={0.88}
              onPress={() => setIsAddRadarModalOpen(true)}
            >
              <View style={styles.radarEmptyLeft}>
                <Text style={styles.radarEmptyTitle}>
                  {language === 'en' ? 'Pantry is Fresh & Clear! 🌿' : 'Dolabınız Tertemiz & Taze! 🌿'}
                </Text>
                <Text style={styles.radarEmptySub}>
                  {language === 'en'
                    ? 'Tap to add milk, cheese or scan packaging expiry date (OCR).'
                    : 'Süt, peynir eklemek veya kutusundaki SKT tarihini okutmak için dokunun.'}
                </Text>
              </View>
              <View style={styles.radarEmptyActionBtn}>
                <Camera size={14} color="#042F2E" />
                <Text style={styles.radarEmptyActionText}>
                  {language === 'en' ? 'Scan SKT' : '+ SKT Tara'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* SPOTLIGHT HERO: CINEMATIC FOOD PHOTOGRAPHY SPOTLIGHT */}
        {spotlightRecipe && (
          <TouchableOpacity
            style={styles.spotlightCard}
            activeOpacity={0.92}
            onPress={() => {
              router.push({
                pathname: '/recipe/[id]',
                params: { id: spotlightRecipe.id, recipeJson: JSON.stringify(spotlightRecipe) },
              });
            }}
          >
            <Image
              source={{ uri: spotlightRecipe.imageUrl || 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1000&q=80' }}
              style={styles.spotlightImage}
            />

            {/* Gradient Vignette */}
            <LinearGradient
              colors={['rgba(0,0,0,0.2)', 'transparent', 'rgba(13, 23, 20, 0.92)']}
              locations={[0, 0.35, 1]}
              style={styles.spotlightGradient}
            />

            {/* Floating Top Pill */}
            <View style={styles.spotlightTopRow}>
              <View style={styles.spotlightBadge}>
                <Sparkles size={12} color="#5EEAD4" />
                <Text style={styles.spotlightBadgeText}>
                  {language === 'en'
                    ? `Daily Spotlight • ${dailyData.formattedDate}`
                    : `Günün Seçkisi • ${dailyData.formattedDate}`}
                </Text>
              </View>

              <View style={styles.spotlightRating}>
                <Star size={11} color="#FBBF24" fill="#FBBF24" />
                <Text style={styles.spotlightRatingText}>4.9</Text>
              </View>
            </View>

            {/* Spotlight Info Bottom */}
            <View style={styles.spotlightInfoBottom}>
              <View style={styles.spotlightMetaRow}>
                <View style={styles.spotlightWasteRibbon}>
                  <Leaf size={11} color="#5EEAD4" />
                  <Text style={styles.spotlightWasteText}>
                    {spotlightRecipe.wasteSavedGrams}{t('common.gramsSaved')}
                  </Text>
                </View>
                <View style={styles.spotlightTimePill}>
                  <Clock size={11} color="#FFFFFF" />
                  <Text style={styles.spotlightTimeText}>
                    {spotlightRecipe.prepTimeMinutes + spotlightRecipe.cookTimeMinutes} {t('common.mins')}
                  </Text>
                </View>
              </View>

              <Text style={styles.spotlightTitle}>{spotlightRecipe.title}</Text>
              <Text style={styles.spotlightTagline} numberOfLines={2}>
                {spotlightRecipe.tagline}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* BENTO HERO: THE SCAN CHAMBER */}
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={handleStartScan}
          style={styles.scanChamberCard}
        >
          <LinearGradient
            colors={['#0F766E', '#115E59', '#042F2E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.scanChamberGradient}
          >
            <View style={styles.ambientSphere} />

            <View style={styles.scanChamberTop}>
              <View style={styles.aiTag}>
                <Sparkles size={12} color="#5EEAD4" />
                <Text style={styles.aiTagText}>{t('home.scanChamberBadge')}</Text>
              </View>
              <View style={styles.pulseRadar}>
                <ScanLine size={18} color="#5EEAD4" />
              </View>
            </View>

            <Text style={styles.scanChamberTitle}>{t('home.scanChamberTitle')}</Text>
            <Text style={styles.scanChamberSub}>{t('home.scanChamberSub')}</Text>

            <View style={styles.scanCtaRow}>
              <View style={styles.scanCtaButton}>
                <Camera size={18} color="#042F2E" />
                <Text style={styles.scanCtaText}>{t('home.launchCamera')}</Text>
              </View>
              <Text style={styles.scanHint}>{t('home.orUpload')}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* BENTO ECO IMPACT STATS WIDGET */}
        <ZeroWasteStatCard stats={stats} />

        {/* BENTO 2-COLUMN TILES: TIPS & QUICK ACTIONS */}
        <View style={styles.bentoGridRow}>
          {/* Tile 1: Tip of the day */}
          <TouchableOpacity
            style={styles.bentoTileLeft}
            activeOpacity={0.88}
            onPress={() => {
              try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              } catch {}
              setTipModalVisible(true);
            }}
          >
            <View style={styles.bentoTileHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Lightbulb size={16} color="#D97706" />
                <Text style={styles.bentoTileTag}>{t('home.tipOfTheDay')}</Text>
              </View>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  setRandomTipIndex((prev) => prev + 1);
                }}
                style={{ padding: 2 }}
              >
                <Text style={{ fontSize: 11, color: '#D97706', fontWeight: '800' }}>🎲</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.tipTitleText} numberOfLines={2}>{currentTip.title}</Text>
            <Text style={styles.tipDescText} numberOfLines={2}>{currentTip.description}</Text>
            <View style={styles.tipLinkRow}>
              <Text style={styles.tipLinkText}>{language === 'en' ? 'Explore Hacks' : 'Püf Noktaları'}</Text>
              <ArrowRight size={13} color="#B45309" />
            </View>
          </TouchableOpacity>

          {/* Tile 2: Instant Chef Preset */}
          <TouchableOpacity
            style={styles.bentoTileRight}
            activeOpacity={0.88}
            onPress={() => handleSelectPreset(primaryPreset)}
          >
            <View style={styles.bentoTileHeader}>
              <ChefHat size={16} color="#0F766E" />
              <Text style={[styles.bentoTileTag, { color: '#0F766E' }]}>{t('home.quickMenu')}</Text>
            </View>
            <Text style={styles.presetTitleText} numberOfLines={2}>
              {primaryPreset.name}
            </Text>
            <Text style={styles.presetDescText} numberOfLines={2}>
              {primaryPreset.subtitle}
            </Text>
            <View style={styles.presetLinkRow}>
              <Text style={styles.presetLinkText}>{t('home.inspectNow')}</Text>
              <ArrowRight size={13} color="#0F766E" />
            </View>
          </TouchableOpacity>
        </View>

        {/* SECTION: FEATURED ZERO WASTE RECIPES WITH HD PHOTOGRAPHY */}
        <View style={styles.recipesSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>{t('home.featuredTitle')}</Text>
              <Text style={styles.sectionSub}>{t('home.featuredSub')}</Text>
            </View>
            <TouchableOpacity onPress={handleStartScan}>
              <Text style={styles.sectionActionText}>{t('home.seeAll')}</Text>
            </TouchableOpacity>
          </View>

          {primaryPreset.recipes.map((recipe) => {
            const isSaved = savedRecipes.some((r) => r.id === recipe.id);
            return (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isSaved={isSaved}
                onToggleSave={() => handleToggleSave(recipe)}
                onPress={() => {
                  router.push({
                    pathname: '/recipe/[id]',
                    params: { id: recipe.id, recipeJson: JSON.stringify(recipe) },
                  });
                }}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* SMART GROCERY CHECKLIST MODAL (Step 2) */}
      <Modal
        visible={groceryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setGroceryModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.groceryModalCard}>
            <View style={styles.groceryModalHeader}>
              <View>
                <Text style={styles.groceryModalTitle}>{t('grocery.title')}</Text>
                <Text style={styles.groceryModalSub}>{t('grocery.subtitle')}</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setGroceryModalVisible(false)}
              >
                <X size={20} color="#0D1714" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.groceryListScroll} showsVerticalScrollIndicator={false}>
              {groceryItems.length === 0 ? (
                <View style={styles.emptyGroceryBox}>
                  <ShoppingCart size={32} color="#9CA3AF" />
                  <Text style={styles.emptyGroceryText}>{t('grocery.empty')}</Text>
                </View>
              ) : (
                groceryItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.groceryItemRow}
                    onPress={() => handleToggleGrocery(item.id)}
                  >
                    {item.isCompleted ? (
                      <CheckCircle2 size={20} color="#0F766E" />
                    ) : (
                      <Circle size={20} color="#9CA3AF" />
                    )}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.groceryItemName,
                          item.isCompleted && styles.groceryItemNameDone,
                        ]}
                      >
                        {item.name}
                      </Text>
                      {item.recipeTitle && (
                        <Text style={styles.groceryItemRecipe}>{item.recipeTitle}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>

            {groceryItems.length > 0 && (
              <View style={styles.groceryActionsRow}>
                <TouchableOpacity
                  style={styles.exportWhatsappBtn}
                  activeOpacity={0.88}
                  onPress={handleExportGroceries}
                >
                  <Share2 size={16} color="#FFFFFF" />
                  <Text style={styles.exportWhatsappBtnText}>
                    {t('grocery.exportWhatsappBtn')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.clearDoneBtn}
                  onPress={handleClearCompletedGroceries}
                >
                  <Trash2 size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* ZERO-WASTE MASTER TIPS MODAL */}
      <Modal
        visible={tipModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setTipModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.tipsModalCard}>
            <View style={styles.tipsModalHeader}>
              <View style={styles.tipsModalTitleRow}>
                <View style={styles.tipsHaloIcon}>
                  <Lightbulb size={18} color="#D97706" />
                </View>
                <View>
                  <Text style={styles.tipsModalTitle}>
                    {language === 'en' ? 'Chef Zero-Waste Hacks' : 'Şefin Sıfır İsraf Taktikleri'} 💡
                  </Text>
                  <Text style={styles.tipsModalSub}>
                    {language === 'en'
                      ? 'Pro culinary secrets to rescue leftovers'
                      : 'Kalanları gurme lezzetlere dönüştüren şef sırları'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setTipModalVisible(false)}
              >
                <X size={20} color="#0D1714" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.tipsListScroll} showsVerticalScrollIndicator={false}>
              {currentTips.map((tip, idx) => (
                <View key={idx} style={styles.tipItemCard}>
                  <Text style={styles.tipItemCardTitle}>{tip.title}</Text>
                  <Text style={styles.tipItemCardDesc}>{tip.description}</Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.tipsScanCtaBtn}
              activeOpacity={0.9}
              onPress={() => {
                setTipModalVisible(false);
                handleStartScan();
              }}
            >
              <Camera size={18} color="#042F2E" />
              <Text style={styles.tipsScanCtaBtnText}>
                {language === 'en' ? 'Scan My Fridge Now' : 'Dolabımı Tara & Uygula'} 📸
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ADD PANTRY RADAR & OCR SKT MODAL */}
      <Modal
        visible={isAddRadarModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddRadarModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.radarModalCard}>
            <View style={styles.groceryModalHeader}>
              <View>
                <Text style={styles.radarModalTitle}>
                  {language === 'en' ? 'Add Item to Radar' : 'Dolap Radarına Ekle'} ⏳
                </Text>
                <Text style={styles.radarModalSub}>
                  {language === 'en'
                    ? 'Enter item or scan expiration date from packaging'
                    : 'Ürün girin veya ambalajındaki SKT tarihini okutun'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setIsAddRadarModalOpen(false)}
              >
                <X size={20} color="#0D1714" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 380 }}>
              {/* Product Name Input */}
              <Text style={styles.modalInputLabel}>
                {language === 'en' ? 'Product Name' : 'Ürün Adı'}
              </Text>
              <TextInput
                style={styles.modalTextInput}
                placeholder={language === 'en' ? 'e.g. Whole Milk, Aged Cheese, Tomato Paste...' : 'örn: Tam Yağlı Süt, Kaşar Peyniri, Salça...'}
                placeholderTextColor="#8A9C93"
                value={customRadarName}
                onChangeText={setCustomRadarName}
              />

              {/* Opened Package Switch */}
              <TouchableOpacity
                style={[styles.modalToggleCard, customRadarIsOpened && styles.modalToggleCardActive]}
                activeOpacity={0.85}
                onPress={() => {
                  const nextState = !customRadarIsOpened;
                  setCustomRadarIsOpened(nextState);
                  if (nextState && customRadarDays > 4) {
                    setCustomRadarDays(4);
                  }
                }}
              >
                <View style={styles.modalToggleLeft}>
                  <Text style={styles.modalToggleTitle}>
                    {language === 'en' ? '🥛 Package is Opened' : '🥛 Kapağı Açıldı / Tüketiliyor'}
                  </Text>
                  <Text style={styles.modalToggleSub}>
                    {language === 'en'
                      ? 'Automatically reduces shelf-life (3-5 days)'
                      : 'Kapağı açılmış ürünler için raf ömrünü otomatik 3-5 güne çeker'}
                  </Text>
                </View>
                <View style={[styles.toggleCheckbox, customRadarIsOpened && styles.toggleCheckboxActive]}>
                  {customRadarIsOpened && <Check size={14} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>

              {/* Days Remaining Fast Selector */}
              <Text style={styles.modalInputLabel}>
                {language === 'en' ? 'Days Remaining Before Decay' : 'Bozulmadan Önce Kalan Gün'}
              </Text>
              <View style={styles.daysSelectorRow}>
                {[1, 2, 3, 5, 7].map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.daySelectChip, customRadarDays === d && styles.daySelectChipActive]}
                    onPress={() => setCustomRadarDays(d)}
                  >
                    <Text style={[styles.daySelectChipText, customRadarDays === d && styles.daySelectChipTextActive]}>
                      {d === 1 ? (language === 'en' ? '🔥 1d (Urgent)' : '🔥 1 Gün (Acil)') : `${d} ${language === 'en' ? 'Days' : 'Gün'}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* OCR Camera Scan Expiry Date Button */}
              <TouchableOpacity
                style={styles.ocrScanBtn}
                activeOpacity={0.88}
                onPress={handleScanSKTWithCamera}
                disabled={isScanningOCR}
              >
                {isScanningOCR ? (
                  <ActivityIndicator size="small" color="#0F766E" />
                ) : (
                  <>
                    <Camera size={16} color="#0F766E" />
                    <Text style={styles.ocrScanBtnText}>
                      {language === 'en' ? '📸 Scan Expiration Date (OCR Camera)' : '📸 Ambalajdaki SKT Tarihini Oku (OCR)'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>

            {/* Save to Radar CTA */}
            <TouchableOpacity
              style={[styles.saveRadarCtaBtn, !customRadarName.trim() && { opacity: 0.5 }]}
              activeOpacity={0.88}
              onPress={handleAddManualRadarItem}
              disabled={!customRadarName.trim()}
            >
              <Text style={styles.saveRadarCtaBtnText}>
                {language === 'en' ? 'Save to Freshness Radar ⏳' : 'Tazelik Radarına Ekle ⏳'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* STREAK CELEBRATION MODAL */}
      <Modal
        visible={streakModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setStreakModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.streakModalCard}>
            <View style={styles.streakModalIconHalo}>
              <Flame size={36} color="#EA580C" fill="#EA580C" />
            </View>

            <Text style={styles.streakModalTitle}>
              {language === 'en'
                ? `${stats.totalMealsCooked || 0}-Day Cooking Streak! 🔥`
                : `${stats.totalMealsCooked || 0} Günlük Şef Serisi! 🔥`}
            </Text>
            <Text style={styles.streakModalSub}>
              {language === 'en'
                ? `You have cooked ${stats.totalMealsCooked || 0} zero-waste meals so far. Keep the momentum going to unlock the MasterChef badge!`
                : `Harika gidiyorsunuz! Şimdiye kadar ${stats.totalMealsCooked || 0} sıfır israf yemeği pişirdiniz. Devam ederek yeni şef rozetlerini açın!`}
            </Text>

            {/* Streak Metrics Highlights */}
            <View style={styles.streakMetricsGrid}>
              <View style={styles.streakMetricItem}>
                <Text style={styles.streakMetricValue}>{stats.totalMealsCooked || 0}</Text>
                <Text style={styles.streakMetricLabel}>
                  {language === 'en' ? 'Meals Cooked' : 'Yemek Pişti'}
                </Text>
              </View>
              <View style={styles.streakMetricDivider} />
              <View style={styles.streakMetricItem}>
                <Text style={styles.streakMetricValue}>{stats.totalWasteSavedKg} kg</Text>
                <Text style={styles.streakMetricLabel}>
                  {language === 'en' ? 'Food Rescued' : 'Önlenen İsraf'}
                </Text>
              </View>
              <View style={styles.streakMetricDivider} />
              <View style={styles.streakMetricItem}>
                <Text style={styles.streakMetricValue}>₺{stats.estimatedMoneySavedTL}</Text>
                <Text style={styles.streakMetricLabel}>
                  {language === 'en' ? 'Money Kept' : 'Tasarruf'}
                </Text>
              </View>
            </View>

            {/* Next Milestone Target */}
            <View style={styles.streakNextBadgeBox}>
              <Text style={styles.streakNextBadgeText}>
                {language === 'en'
                  ? '🎯 Next Target: 7-Day Gold MasterChef Badge'
                  : '🎯 Gelecek Rozet: 7 Günlük Altın Şef Rozeti'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.streakCtaBtn}
              activeOpacity={0.88}
              onPress={() => {
                setStreakModalVisible(false);
                handleStartScan();
              }}
            >
              <Text style={styles.streakCtaBtnText}>
                {language === 'en' ? 'Continue Streak & Cook Now 🔥' : 'Seriyi Devam Ettir & Pişir 🔥'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.streakCloseLink}
              onPress={() => setStreakModalVisible(false)}
            >
              <Text style={styles.streakCloseLinkText}>
                {language === 'en' ? 'Close' : 'Kapat'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#041F1A',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  ambientBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.60,
    resizeMode: 'cover',
  },
  ambientGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
  },
  topLeftCol: {
    flex: 1,
    paddingRight: 10,
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#5EEAD4',
    letterSpacing: 1.1,
    marginBottom: 2,
  },
  greetingText: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  topRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(234, 88, 12, 0.25)',
    paddingHorizontal: 7,
    paddingVertical: 4.5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(251, 146, 60, 0.5)',
  },
  streakBadgeText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#FDBA74',
  },
  groceryBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  groceryBadgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#0F766E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groceryBadgeCountText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4.5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  langPillText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  radarWrapper: {
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  radarHeader: {
    marginBottom: 12,
  },
  radarHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radarIconHalo: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(204, 251, 241, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.4)',
  },
  radarMainTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  radarSubtitle: {
    fontSize: 12,
    color: '#A7F3D0',
    marginTop: 1,
  },
  radarScroll: {
    gap: 12,
    paddingVertical: 4,
  },
  radarCard: {
    width: 168,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 14,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  radarCardCritical: {
    borderColor: '#FECDD3',
    backgroundColor: '#FFFFFF',
  },
  radarCardWarning: {
    borderColor: '#FEF3C7',
    backgroundColor: '#FFFFFF',
  },
  radarCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  foodAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F6F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodAvatarEmoji: {
    fontSize: 18,
  },
  urgencyCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
    paddingHorizontal: 7.5,
    paddingVertical: 3.5,
    borderRadius: 10,
    borderWidth: 1,
  },
  urgencyCapsuleCritical: {
    backgroundColor: '#FFE4E6',
    borderColor: '#FECDD3',
  },
  urgencyCapsuleWarning: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  urgencyCapsuleText: {
    fontSize: 10,
    fontWeight: '800',
  },
  radarItemName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0D1714',
    lineHeight: 18,
    marginBottom: 10,
    minHeight: 36,
  },
  cookActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#CCFBF1',
    borderWidth: 1,
    borderColor: '#99F6E4',
    paddingVertical: 7,
    borderRadius: 12,
  },
  cookActionPillText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F766E',
  },
  spotlightCard: {
    marginHorizontal: 18,
    height: 240,
    borderRadius: 28,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  spotlightImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  spotlightGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  spotlightTopRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spotlightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15, 118, 110, 0.9)',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.4)',
  },
  spotlightBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  spotlightRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 12,
  },
  spotlightRatingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  spotlightInfoBottom: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  spotlightMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  spotlightWasteRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 10,
  },
  spotlightWasteText: {
    color: '#CCFBF1',
    fontSize: 10.5,
    fontWeight: '800',
  },
  spotlightTimePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 10,
  },
  spotlightTimeText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
  },
  spotlightTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginBottom: 3,
  },
  spotlightTagline: {
    fontSize: 12,
    color: '#D1D5DB',
    lineHeight: 16,
  },
  scanChamberCard: {
    marginHorizontal: 18,
    borderRadius: 28,
    marginBottom: 20,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 8,
  },
  scanChamberGradient: {
    borderRadius: 28,
    padding: 22,
    position: 'relative',
    overflow: 'hidden',
  },
  ambientSphere: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(94, 234, 212, 0.22)',
  },
  scanChamberTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  aiTagText: {
    color: '#CCFBF1',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  pulseRadar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanChamberTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight: 28,
    marginBottom: 8,
  },
  scanChamberSub: {
    fontSize: 13,
    color: '#CCFBF1',
    lineHeight: 18,
    marginBottom: 20,
    opacity: 0.9,
  },
  scanCtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  scanCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#5EEAD4',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#5EEAD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  scanCtaText: {
    color: '#042F2E',
    fontSize: 13.5,
    fontWeight: '800',
  },
  scanHint: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
    fontWeight: '600',
  },
  bentoGridRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 18,
    marginBottom: 24,
  },
  bentoTileLeft: {
    flex: 1,
    backgroundColor: 'rgba(120, 53, 15, 0.35)',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.40)',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  bentoTileRight: {
    flex: 1,
    backgroundColor: 'rgba(6, 44, 38, 0.85)',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  bentoTileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  bentoTileTag: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FBBF24',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipTitleText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FEF3C7',
    marginBottom: 4,
    lineHeight: 18,
  },
  tipDescText: {
    fontSize: 11.5,
    color: '#FDE68A',
    lineHeight: 16,
  },
  presetTitleText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    lineHeight: 18,
  },
  presetDescText: {
    fontSize: 11.5,
    color: '#CCFBF1',
    lineHeight: 16,
    marginBottom: 10,
  },
  presetLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 'auto',
  },
  presetLinkText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#5EEAD4',
  },
  recipesSection: {
    paddingHorizontal: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  sectionSub: {
    fontSize: 12,
    color: '#A7F3D0',
    marginTop: 2,
  },
  sectionActionText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#5EEAD4',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  groceryModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '75%',
  },
  groceryModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F6F4',
  },
  groceryModalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0D1714',
  },
  groceryModalSub: {
    fontSize: 12,
    color: '#687E74',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groceryListScroll: {
    maxHeight: 280,
    marginBottom: 16,
  },
  emptyGroceryBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    gap: 8,
  },
  emptyGroceryText: {
    fontSize: 13,
    color: '#687E74',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  groceryItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAF8',
  },
  groceryItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D1714',
  },
  groceryItemNameDone: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  groceryItemRecipe: {
    fontSize: 11,
    color: '#0F766E',
    fontWeight: '500',
    marginTop: 1,
  },
  groceryActionsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 8,
  },
  exportWhatsappBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0F766E',
    paddingVertical: 14,
    borderRadius: 18,
  },
  exportWhatsappBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  clearDoneBtn: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 'auto',
    paddingTop: 8,
  },
  tipLinkText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#B45309',
  },
  tipsModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '80%',
  },
  tipsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F6F4',
  },
  tipsModalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 10,
  },
  tipsHaloIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipsModalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0D1714',
  },
  tipsModalSub: {
    fontSize: 12,
    color: '#687E74',
    marginTop: 2,
  },
  tipsListScroll: {
    maxHeight: 320,
    marginBottom: 16,
  },
  tipItemCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginBottom: 10,
  },
  tipItemCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#78350F',
    marginBottom: 4,
  },
  tipItemCardDesc: {
    fontSize: 12.5,
    color: '#92400E',
    lineHeight: 18,
  },
  tipsScanCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#5EEAD4',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  tipsScanCtaBtnText: {
    color: '#042F2E',
    fontSize: 14,
    fontWeight: '800',
  },
  addRadarHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 118, 110, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.45)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  addRadarHeaderBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#5EEAD4',
  },
  sktHeaderShortcutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 118, 110, 0.35)',
    borderWidth: 1.5,
    borderColor: 'rgba(94, 234, 212, 0.45)',
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 16,
  },
  sktHeaderShortcutText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#5EEAD4',
  },
  radarEmptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(6, 44, 38, 0.75)',
    borderWidth: 1.5,
    borderColor: 'rgba(94, 234, 212, 0.25)',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 2,
    marginTop: 4,
  },
  radarEmptyLeft: {
    flex: 1,
    paddingRight: 10,
  },
  radarEmptyTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  radarEmptySub: {
    fontSize: 11.5,
    color: '#CCFBF1',
    lineHeight: 15,
  },
  radarEmptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#5EEAD4',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 14,
    shadowColor: '#5EEAD4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  radarEmptyActionText: {
    color: '#042F2E',
    fontWeight: '900',
    fontSize: 12,
  },
  radarCardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  radarCardDeleteBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(239, 68, 68, 0.20)',
    borderWidth: 1,
    borderColor: 'rgba(253, 164, 175, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  openStatusPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    marginBottom: 8,
  },
  openStatusPillActive: {
    backgroundColor: 'rgba(234, 88, 12, 0.20)',
    borderColor: 'rgba(251, 146, 60, 0.45)',
  },
  openStatusPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  openStatusPillTextActive: {
    color: '#FDBA74',
    fontWeight: '800',
  },
  radarModalCard: {
    backgroundColor: '#062C26',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: 'rgba(94, 234, 212, 0.3)',
  },
  radarModalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  radarModalSub: {
    fontSize: 12,
    color: '#A7F3D0',
    marginTop: 2,
  },
  modalInputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#5EEAD4',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 10,
  },
  modalTextInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.20)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  modalToggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 18,
    padding: 14,
    marginVertical: 8,
  },
  modalToggleCardActive: {
    backgroundColor: 'rgba(15, 118, 110, 0.40)',
    borderColor: '#5EEAD4',
  },
  modalToggleLeft: {
    flex: 1,
    paddingRight: 10,
  },
  modalToggleTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalToggleSub: {
    fontSize: 11,
    color: '#CCFBF1',
    marginTop: 2,
    lineHeight: 15,
  },
  toggleCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleCheckboxActive: {
    backgroundColor: '#0F766E',
    borderColor: '#5EEAD4',
  },
  daysSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  daySelectChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  daySelectChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#5EEAD4',
  },
  daySelectChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#CCFBF1',
  },
  daySelectChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  ocrScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(204, 251, 241, 0.20)',
    borderWidth: 1.5,
    borderColor: 'rgba(94, 234, 212, 0.45)',
    paddingVertical: 13,
    borderRadius: 16,
    marginVertical: 8,
  },
  ocrScanBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#5EEAD4',
  },
  saveRadarCtaBtn: {
    backgroundColor: '#0F766E',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  saveRadarCtaBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  streakModalCard: {
    backgroundColor: '#062C26',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(251, 146, 60, 0.4)',
    width: '90%',
    maxWidth: 380,
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  streakModalIconHalo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(234, 88, 12, 0.25)',
    borderWidth: 2,
    borderColor: 'rgba(251, 146, 60, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  streakModalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  streakModalSub: {
    fontSize: 12.5,
    color: '#CCFBF1',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
    paddingHorizontal: 6,
  },
  streakMetricsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 8,
    width: '100%',
    marginBottom: 14,
  },
  streakMetricItem: {
    alignItems: 'center',
    flex: 1,
  },
  streakMetricValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#5EEAD4',
    marginBottom: 2,
  },
  streakMetricLabel: {
    fontSize: 9.5,
    color: '#A7F3D0',
    fontWeight: '600',
    textAlign: 'center',
  },
  streakMetricDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  streakNextBadgeBox: {
    backgroundColor: 'rgba(234, 88, 12, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(251, 146, 60, 0.35)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 18,
  },
  streakNextBadgeText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FDBA74',
  },
  streakCtaBtn: {
    backgroundColor: '#EA580C',
    borderRadius: 18,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 8,
  },
  streakCtaBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  streakCloseLink: {
    paddingVertical: 6,
  },
  streakCloseLinkText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '700',
  },
});
