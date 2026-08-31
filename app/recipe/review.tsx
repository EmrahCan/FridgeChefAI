import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Plus, Sparkles, ChefHat } from 'lucide-react-native';
import { IngredientTag } from '../../components/IngredientTag';
import { RecipeCard } from '../../components/RecipeCard';
import { CookingStyle, DetectedIngredient, Recipe } from '../../types';
import { GeminiService } from '../../services/geminiService';
import { StorageService } from '../../services/storageService';
import { useLanguage } from '../../context/LanguageContext';
import * as Haptics from 'expo-haptics';

const STYLE_KEYS: CookingStyle[] = ['hepsi', 'hizli', 'firinda', 'corba', 'fit', 'cocuk'];

export default function ReviewScreen() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const params = useLocalSearchParams<{
    ingredientsJson?: string;
    summaryText?: string;
  }>();

  const initialIngredients: DetectedIngredient[] = params.ingredientsJson
    ? JSON.parse(params.ingredientsJson)
    : [];

  const [ingredients, setIngredients] = useState<DetectedIngredient[]>(initialIngredients);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<CookingStyle>('hepsi');
  const [customNote, setCustomNote] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

  const handleAddIngredient = () => {
    if (!newIngredientName.trim()) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    const newItem: DetectedIngredient = {
      id: `custom-${Date.now()}`,
      name: newIngredientName.trim(),
      category: language === 'en' ? 'Leftover Dish' : 'Kalan Yemek',
      confidence: 1.0,
      suggestedAction: 'Hemen Tüket',
    };

    setIngredients((prev) => [...prev, newItem]);
    setNewIngredientName('');
  };

  const handleRemoveIngredient = (id: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  const handleGenerateRecipes = async () => {
    if (ingredients.length === 0) {
      Alert.alert(t('review.noIngredientsAlertTitle'), t('review.noIngredientsAlertMsg'));
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    setIsGenerating(true);

    try {
      const ingredientNames = ingredients.map((i) => i.name);
      const recipes = await GeminiService.generateRecipes(
        ingredientNames,
        selectedStyle,
        customNote,
        language
      );

      const saved = await StorageService.getSavedRecipes();
      setSavedRecipes(saved);
      setGeneratedRecipes(recipes);
    } catch (err) {
      Alert.alert(language === 'en' ? 'Error' : 'Hata', language === 'en' ? 'Failed to craft recipes.' : 'Tarifler oluşturulamadı.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleSave = async (recipe: Recipe) => {
    await StorageService.toggleSaveRecipe(recipe);
    const updated = await StorageService.getSavedRecipes();
    setSavedRecipes(updated);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Editorial Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#0D1714" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>{t('review.navTitle')}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* AI Detection Summary Card */}
        {params.summaryText && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconBox}>
              <Sparkles size={16} color="#0F766E" />
            </View>
            <Text style={styles.summaryText}>{params.summaryText}</Text>
          </View>
        )}

        {/* Section 1: Detected Ingredients */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('review.sectionTitle')}</Text>
            <Text style={styles.sectionSub}>{t('review.sectionSub')}</Text>
          </View>

          <View style={styles.tagsWrap}>
            {ingredients.map((item) => (
              <IngredientTag
                key={item.id}
                ingredient={item}
                onRemove={() => handleRemoveIngredient(item.id)}
              />
            ))}
          </View>

          {/* Add Ingredient Input Row */}
          <View style={styles.addInputRow}>
            <TextInput
              style={styles.textInput}
              placeholder={t('review.addPlaceholder')}
              placeholderTextColor="#8A9C93"
              value={newIngredientName}
              onChangeText={setNewIngredientName}
              onSubmitEditing={handleAddIngredient}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.addBtn}
              onPress={handleAddIngredient}
              disabled={!newIngredientName.trim()}
            >
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.addBtnText}>{t('review.addBtn')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 2: Cooking Style Cards (Horizontal Bento) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('review.styleTitle')}</Text>
            <Text style={styles.sectionSub}>{t('review.styleSub')}</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stylesScroll}
          >
            {STYLE_KEYS.map((key) => {
              const isSelected = selectedStyle === key;
              const title = t(`review.styles.${key}.title`);
              const subtitle = t(`review.styles.${key}.sub`);
              const icon = t(`review.styles.${key}.icon`);

              return (
                <TouchableOpacity
                  key={key}
                  style={[styles.styleCard, isSelected && styles.styleCardSelected]}
                  activeOpacity={0.85}
                  onPress={() => {
                    try {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    } catch {}
                    setSelectedStyle(key);
                  }}
                >
                  <Text style={styles.styleCardIcon}>{icon}</Text>
                  <Text style={[styles.styleCardTitle, isSelected && styles.styleCardTitleSelected]}>
                    {title}
                  </Text>
                  <Text style={[styles.styleCardSub, isSelected && styles.styleCardSubSelected]}>
                    {subtitle}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Section 3: Custom Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('review.noteTitle')}</Text>
          <TextInput
            style={styles.noteInput}
            placeholder={t('review.notePlaceholder')}
            placeholderTextColor="#8A9C93"
            value={customNote}
            onChangeText={setCustomNote}
          />
        </View>

        {/* GENERATE RECIPES BUTTON */}
        <TouchableOpacity
          style={[styles.generateBtn, isGenerating && styles.generateBtnDisabled]}
          activeOpacity={0.88}
          onPress={handleGenerateRecipes}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#FFFFFF" size="small" />
              <Text style={styles.generateBtnText}>{t('review.generatingBtn')}</Text>
            </View>
          ) : (
            <View style={styles.btnRow}>
              <Sparkles size={18} color="#5EEAD4" />
              <Text style={styles.generateBtnText}>{t('review.generateBtn')}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Generated Recipes List */}
        {generatedRecipes.length > 0 && (
          <View style={styles.resultsWrapper}>
            <View style={styles.resultsHeader}>
              <ChefHat size={22} color="#0F766E" />
              <Text style={styles.resultsTitle}>
                {t('review.resultsTitle')}
              </Text>
            </View>

            {generatedRecipes.map((recipe) => {
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
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E6EBE8',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    padding: 6,
  },
  navTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0D1714',
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 40,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#CCFBF1',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#99F6E4',
    marginBottom: 20,
  },
  summaryIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryText: {
    flex: 1,
    fontSize: 13,
    color: '#0F766E',
    fontWeight: '700',
    lineHeight: 18,
  },
  section: {
    marginBottom: 22,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0D1714',
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  sectionSub: {
    fontSize: 12,
    color: '#687E74',
    lineHeight: 16,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  addInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E1E6DF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13.5,
    color: '#0D1714',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0F766E',
    paddingHorizontal: 16,
    borderRadius: 16,
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  stylesScroll: {
    paddingVertical: 6,
    gap: 10,
  },
  styleCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E1E6DF',
    borderRadius: 20,
    padding: 14,
    marginRight: 6,
  },
  styleCardSelected: {
    backgroundColor: '#0F766E',
    borderColor: '#0B514B',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  styleCardIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  styleCardTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0D1714',
    marginBottom: 2,
  },
  styleCardTitleSelected: {
    color: '#FFFFFF',
  },
  styleCardSub: {
    fontSize: 10.5,
    color: '#687E74',
  },
  styleCardSubSelected: {
    color: '#CCFBF1',
  },
  noteInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E1E6DF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13,
    color: '#0D1714',
  },
  generateBtn: {
    backgroundColor: '#0F766E',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 24,
  },
  generateBtnDisabled: {
    backgroundColor: '#5EEAD4',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  resultsWrapper: {
    paddingTop: 10,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0D1714',
    letterSpacing: -0.3,
    flex: 1,
  },
});
